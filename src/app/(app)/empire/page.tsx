import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUserStreak } from "@/actions/streak";
import { EmpireCard } from "@/components/empire/empire-card";
import { StreakStats } from "@/components/empire/streak-stats";
import { BadgesGrid } from "@/components/empire/badges-grid";
import { ActivityHeatmap } from "@/components/empire/activity-heatmap";
import { ErrorDisplay } from "@/components/common/error-display";
import type { UserBadge } from "@/types";

export default async function EmpirePage() {
  const streakResult = await getUserStreak();

  if (!streakResult.ok) {
    return <ErrorDisplay message={streakResult.error} />;
  }

  const streak = streakResult.value;
  if (!streak) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-3xl font-bold text-gold">Your Empire</h1>
        <p className="text-text-secondary">
          Complete your first daily challenge to start building your empire.
        </p>
      </div>
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: badges } = await supabase
    .from("user_badges")
    .select("badge_key")
    .eq("user_id", user!.id);

  // Get active dates from game results for heatmap
  const { data: gameResults } = await supabase
    .from("game_results")
    .select("date")
    .eq("user_id", user!.id)
    .order("date", { ascending: false })
    .limit(365);

  const earnedBadgeKeys = (badges as Pick<UserBadge, "badge_key">[] ?? []).map((b) => b.badge_key);
  const activeDates = (gameResults ?? []).map((r: { date: string }) => r.date);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-gold">Your Empire</h1>
      <EmpireCard currentStreak={streak.current_streak} />
      <StreakStats streak={streak} />
      <ActivityHeatmap activeDates={activeDates} />
      <BadgesGrid earnedBadgeKeys={earnedBadgeKeys} />
    </div>
  );
}
