"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ok, err, type Result } from "@/lib/utils";
import { redis } from "@/lib/redis/client";

export type LeaderboardEntry = {
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

        const { data: userData } = await supabase
          .from("profiles")
          .select("id, username, user_streaks(empire_level)")
          .in("id", userIds);

        const userMap = new Map(
          (userData ?? []).map((u) => {
            const row = u as Record<string, unknown>;
            const streakRows = row.user_streaks as Array<Record<string, unknown>> | null;
            return [
              row.id as string,
              {
                username: row.username as string,
                empireLevel: (streakRows?.[0]?.empire_level as number) ?? 0,
              },
            ];
          })
        );

        return ok(
          userIds.map((uid, idx) => ({
            rank: idx + 1,
            userId: uid,
            username: userMap.get(uid)?.username ?? "Unknown",
            value: scores[idx],
            empireLevel: userMap.get(uid)?.empireLevel ?? 0,
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
