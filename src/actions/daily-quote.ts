"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ok, err, type Result, getTodayUTC } from "@/lib/utils";
import type { DailyContentWithQuote } from "@/types";

export async function getTodayContent(): Promise<Result<DailyContentWithQuote, string>> {
  const supabase = await createServerSupabaseClient();
  const today = getTodayUTC();

  const { data, error } = await supabase
    .from("daily_content")
    .select("*, quote:quotes(*)")
    .eq("date", today)
    .maybeSingle();

  if (error) {
    return err("Failed to load today's content");
  }

  if (!data || !data.quote) {
    return err("No content available for today");
  }

  return ok({
    id: data.id,
    date: data.date,
    quote_id: data.quote_id,
    game_type: data.game_type as DailyContentWithQuote["game_type"],
    game_data: data.game_data as DailyContentWithQuote["game_data"],
    created_at: data.created_at,
    quote: data.quote,
  } as DailyContentWithQuote);
}
