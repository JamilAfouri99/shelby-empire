"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ok, err, type Result } from "@/lib/utils";
import { BADGES } from "@/lib/constants/badges";

type BadgeContext = {
  gameScore?: number;
  streak?: {
    current_streak: number;
    longest_streak: number;
    total_days_active: number;
  };
  gameCompleted?: boolean;
};

function isBadgeEarned(key: string, context: BadgeContext): boolean {
  switch (key) {
    case "first_game":
      return context.gameCompleted === true;
    case "perfect_game":
      return context.gameScore === 6;
    case "streak_7":
      return (context.streak?.current_streak ?? 0) >= 7;
    case "streak_30":
      return (context.streak?.current_streak ?? 0) >= 30;
    case "streak_100":
      return (context.streak?.current_streak ?? 0) >= 100;
    case "streak_365":
      return (context.streak?.current_streak ?? 0) >= 365;
    case "games_10":
      return (context.streak?.total_days_active ?? 0) >= 10;
    case "games_50":
      return (context.streak?.total_days_active ?? 0) >= 50;
    case "games_100":
      return (context.streak?.total_days_active ?? 0) >= 100;
    default:
      return false;
  }
}

export async function checkAndAwardBadges(
  userId: string,
  context: BadgeContext
): Promise<Result<string[], string>> {
  const supabase = await createServerSupabaseClient();

  const { data: existing, error: fetchError } = await supabase
    .from("user_badges")
    .select("badge_key")
    .eq("user_id", userId);

  if (fetchError) return err("Failed to fetch existing badges");

  const existingKeys = new Set((existing ?? []).map((b) => (b as Record<string, unknown>).badge_key as string));

  const earned = BADGES
    .filter((badge) => !existingKeys.has(badge.key) && isBadgeEarned(badge.key, context))
    .map((badge) => badge.key);

  if (earned.length === 0) return ok([]);

  const { error: insertError } = await supabase
    .from("user_badges")
    .insert(earned.map((key) => ({ user_id: userId, badge_key: key })));

  if (insertError) return err("Failed to award badges");

  return ok(earned);
}
