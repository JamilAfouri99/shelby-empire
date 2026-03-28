"use client";

import { useState, useCallback } from "react";
import { submitGuess } from "@/actions/daily-game";
import { recordDailyActivity } from "@/actions/streak";
import type { GameGuess, GameState } from "@/types";
import { GAME_CONFIG } from "@/lib/constants/game-config";

type UseDailyGameProps = {
  dailyContentId: string;
  date: string;
  gameType: string;
  existingGuesses?: GameGuess[];
  isCompleted?: boolean;
  existingScore?: number;
  correctAnswer?: string;
};

export function useDailyGame({
  dailyContentId,
  date,
  gameType,
  existingGuesses,
  isCompleted,
  existingScore,
  correctAnswer,
}: UseDailyGameProps) {
  const maxGuesses = gameType === "blinder_or_bluff" ? 1 : GAME_CONFIG.maxGuesses;

  const initialState: GameState = isCompleted
    ? existingScore && existingScore > 0
      ? { status: "won", guesses: existingGuesses ?? [], score: existingScore }
      : { status: "lost", guesses: existingGuesses ?? [], correctAnswer: correctAnswer ?? "" }
    : { status: "playing", guesses: existingGuesses ?? [], maxGuesses };

  const [gameState, setGameState] = useState<GameState>(initialState);
  const [submitting, setSubmitting] = useState(false);

  const makeGuess = useCallback(
    async (guess: string) => {
      if (gameState.status !== "playing" || submitting) return;

      setSubmitting(true);
      const formData = new FormData();
      formData.set("dailyContentId", dailyContentId);
      formData.set("guess", guess);
      formData.set("date", date);

      const result = await submitGuess(formData);

      if (!result.ok) {
        setSubmitting(false);
        return;
      }

      const newGuess: GameGuess = { value: guess, result: result.value.result };
      const newGuesses = [...(gameState.status === "playing" ? gameState.guesses : []), newGuess];

      if (result.value.result === "correct") {
        const scoreMap = [6, 5, 4, 3, 2, 1];
        setGameState({
          status: "won",
          guesses: newGuesses,
          score: scoreMap[newGuesses.length - 1] ?? 1,
        });
        await recordDailyActivity();
      } else if (newGuesses.length >= maxGuesses) {
        setGameState({
          status: "lost",
          guesses: newGuesses,
          correctAnswer: correctAnswer ?? "",
        });
        await recordDailyActivity();
      } else {
        setGameState({
          status: "playing",
          guesses: newGuesses,
          maxGuesses,
        });
      }

      setSubmitting(false);
    },
    [gameState, submitting, dailyContentId, date, maxGuesses, correctAnswer]
  );

  return { gameState, makeGuess, submitting };
}
