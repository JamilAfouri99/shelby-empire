"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ok, err, type Result } from "@/lib/utils";
import { redis } from "@/lib/redis/client";

type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  value: number;
  empireLevel: number;
};

type LeaderboardType = "streaks" | "longest" | "total_days";

export async function getLeaderboard(
  type: LeaderboardType
): Promise<Result<LeaderboardEntry[], string>> {
  // Try Redis first
  if (redis) {
    try {
      const key = `leaderboard:${type}`;
      const entries = await redis.zrange(key, 0, 99, { rev: true, withScores: true }) as Array<string | number>;

      if (entries.length > 0) {
        const supabase = await createServerSupabaseClient();
        const userIds: string[] = [];
        const scores: number[] = [];

        for (let i = 0; i < entries.length; i += 2) {
          userIds.push(entries[i] as string);
          scores.push(entries[i + 1] as number);
        }

        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, username")
          .in("id", userIds);

        const { data: streaks } = await supabase
          .from("user_streaks")
          .select("user_id, empire_level")
          .in("user_id", userIds);

        const profileMap = new Map((profiles ?? []).map((p) => [(p as Record<string, unknown>).id as string, p as Record<string, unknown>]));
        const streakMap = new Map((streaks ?? []).map((s) => [(s as Record<string, unknown>).user_id as string, s as Record<string, unknown>]));

        return ok(
          userIds.map((uid, idx) => ({
            rank: idx + 1,
            userId: uid,
            username: (profileMap.get(uid)?.username as string) ?? "Unknown",
            value: scores[idx],
            empireLevel: (streakMap.get(uid)?.empire_level as number) ?? 0,
          }))
        );
      }
    } catch {
      // Fall through to Supabase
    }
  }

  // Fallback: read from Supabase
  const supabase = await createServerSupabaseClient();
  const orderCol = type === "streaks" ? "current_streak" : type === "longest" ? "longest_streak" : "total_days_active";

  const { data, error } = await supabase
    .from("user_streaks")
    .select("user_id, current_streak, longest_streak, total_days_active, empire_level, profiles(username)")
    .order(orderCol, { ascending: false })
    .limit(100);

  if (error) return err("Failed to load leaderboard");

  return ok(
    (data ?? []).map((row: Record<string, unknown>, idx: number) => {
      const profiles = row.profiles as { username: string }[] | null;
      return {
        rank: idx + 1,
        userId: row.user_id as string,
        username: profiles?.[0]?.username ?? "Unknown",
        value: type === "streaks"
          ? (row.current_streak as number)
          : type === "longest"
            ? (row.longest_streak as number)
            : (row.total_days_active as number),
        empireLevel: (row.empire_level as number) ?? 0,
      };
    })
  );
}

export async function getUserRank(
  type: LeaderboardType
): Promise<Result<number | null, string>> {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("Not authenticated");

  if (redis) {
    try {
      const key = `leaderboard:${type}`;
      const rank = await redis.zrevrank(key, user.id);
      if (rank !== null && rank !== undefined) return ok(rank + 1);
    } catch {
      // Fall through
    }
  }

  return ok(null);
}
