import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getLeaderboard } from "@/actions/leaderboard";
import { getUserStreak } from "@/actions/streak";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { Card, CardContent } from "@/components/ui/card";
import { getEmpireLevel } from "@/lib/constants/empire-levels";
import { Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "Leaderboard — By Order",
};

export default async function LeaderboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [streaksResult, longestResult, totalResult, streakResult] = await Promise.all([
    getLeaderboard("streaks"),
    getLeaderboard("longest"),
    getLeaderboard("total_days"),
    getUserStreak(),
  ]);

  const streaks = streaksResult.ok ? streaksResult.value : [];
  const longest = longestResult.ok ? longestResult.value : [];
  const totalDays = totalResult.ok ? totalResult.value : [];
  const streak = streakResult.ok ? streakResult.value : null;
  const currentUserId = user?.id ?? null;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-gold">Leaderboard</h1>

      {streak && (
        <Card className="border-gold/20 bg-surface-elevated">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium text-text-primary">Your Streak</p>
                <p className="text-xs text-text-secondary">
                  {getEmpireLevel(streak.current_streak).name}
                </p>
              </div>
            </div>
            <p className="text-xl font-bold text-gold">{streak.current_streak}</p>
          </CardContent>
        </Card>
      )}

      <LeaderboardTabs
        streaks={streaks}
        longest={longest}
        totalDays={totalDays}
        currentUserId={currentUserId}
      />
    </div>
  );
}
