"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { submitGuessSchema } from "@/lib/validators/schemas";
import { ok, err, type Result, getTodayUTC } from "@/lib/utils";
import type { GameResult, DailyContentWithQuote } from "@/types";

type SubmitGuessResult = {
  result: "correct" | "wrong";
  gameResult: GameResult | null;
};

export async function submitGuess(
  formData: FormData
): Promise<Result<SubmitGuessResult, string>> {
  const parsed = submitGuessSchema.safeParse({
    dailyContentId: formData.get("dailyContentId"),
    guess: formData.get("guess"),
    date: formData.get("date"),
  });

  if (!parsed.success) {
    return err(parsed.error.errors[0].message);
  }

  const { dailyContentId, guess, date } = parsed.data;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Not authenticated");

  // Check if already completed today
  const { data: existing } = await supabase
    .from("game_results")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", date)
    .maybeSingle();

  if (existing?.completed) {
    return err("Already completed today's challenge");
  }

  // Get the daily content to validate
  const { data: content } = await supabase
    .from("daily_content")
    .select("*, quote:quotes(*)")
    .eq("id", dailyContentId)
    .maybeSingle();

  if (!content) return err("Daily content not found");

  const typedContent = content as unknown as DailyContentWithQuote;
  const gameData = typedContent.game_data;

  let isCorrect = false;
  if (typedContent.game_type === "who_said_it") {
    const data = gameData as { correct_answer: string };
    isCorrect = guess === data.correct_answer;
  } else if (typedContent.game_type === "blinder_or_bluff") {
    const data = gameData as { correct_answer: boolean };
    isCorrect = (guess === "true") === data.correct_answer;
  }

  const currentGuesses = existing?.guesses as Array<{ value: string; result: string }> ?? [];
  const newGuesses = [...currentGuesses, { value: guess, result: isCorrect ? "correct" : "wrong" }];
  const maxGuesses = typedContent.game_type === "blinder_or_bluff" ? 1 : 6;
  const isComplete = isCorrect || newGuesses.length >= maxGuesses;

  const scoreMap = [6, 5, 4, 3, 2, 1];
  const score = isCorrect ? (scoreMap[newGuesses.length - 1] ?? 1) : 0;

  if (existing) {
    const { error } = await supabase
      .from("game_results")
      .update({
        guesses: newGuesses,
        score: isComplete ? score : 0,
        completed: isComplete,
        completed_at: isComplete ? new Date().toISOString() : null,
      })
      .eq("id", existing.id);

    if (error) return err("Failed to save guess");

    return ok({
      result: isCorrect ? "correct" as const : "wrong" as const,
      gameResult: isComplete
        ? { ...(existing as GameResult), guesses: newGuesses, score, completed: true, completed_at: new Date().toISOString() }
        : null,
    });
  }

  const { data: newResult, error } = await supabase
    .from("game_results")
    .insert({
      user_id: user.id,
      daily_content_id: dailyContentId,
      date,
      guesses: newGuesses,
      score: isComplete ? score : 0,
      completed: isComplete,
      completed_at: isComplete ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return err("Failed to save guess");

  return ok({
    result: isCorrect ? "correct" as const : "wrong" as const,
    gameResult: isComplete ? (newResult as GameResult) : null,
  });
}

export async function getTodayGameResult(): Promise<Result<GameResult | null, string>> {
  const supabase = await createServerSupabaseClient();
  const today = getTodayUTC();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Not authenticated");

  const { data, error } = await supabase
    .from("game_results")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  if (error) return err("Failed to fetch game result");
  return ok(data as GameResult | null);
}
