"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ok, err, type Result } from "@/lib/utils";
import { calculateStreakUpdate } from "@/lib/utils/streak";
import { redis } from "@/lib/redis/client";
import type { UserStreak } from "@/types";

export async function recordDailyActivity(): Promise<Result<UserStreak, string>> {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Not authenticated");

  const { data: current, error: fetchError } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) return err("Failed to fetch streak");

  if (!current) {
    const newStreak: UserStreak = {
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: new Date().toISOString().split("T")[0],
      empire_level: 1,
      total_days_active: 1,
      updated_at: new Date().toISOString(),
    };

    await supabase.from("user_streaks").upsert({
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: newStreak.last_activity_date,
      empire_level: 1,
      total_days_active: 1,
    });

    await updateLeaderboardRedis(user.id, newStreak);
    return ok(newStreak);
  }

  const update = calculateStreakUpdate(current);

  const { error: updateError } = await supabase
    .from("user_streaks")
    .update({
      current_streak: update.current_streak,
      longest_streak: update.longest_streak,
      last_activity_date: update.last_activity_date,
      empire_level: update.empire_level,
      total_days_active: update.total_days_active,
    })
    .eq("user_id", user.id);

  if (updateError) return err("Failed to update streak");

  const updatedStreak: UserStreak = {
    ...current,
    ...update,
    updated_at: new Date().toISOString(),
  };

  await updateLeaderboardRedis(user.id, updatedStreak);
  return ok(updatedStreak);
}

export async function getUserStreak(): Promise<Result<UserStreak | null, string>> {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Not authenticated");

  const { data, error } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return err("Failed to fetch streak");
  return ok(data as UserStreak | null);
}

async function updateLeaderboardRedis(userId: string, streak: UserStreak) {
  if (!redis) return;
  try {
    await Promise.all([
      redis.zadd("leaderboard:streaks", { score: streak.current_streak, member: userId }),
      redis.zadd("leaderboard:longest", { score: streak.longest_streak, member: userId }),
      redis.zadd("leaderboard:total_days", { score: streak.total_days_active, member: userId }),
    ]);
  } catch {
    // Redis is optional — don't fail the operation
  }
}
