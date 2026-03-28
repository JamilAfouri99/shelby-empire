import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUserStreak } from "@/actions/streak";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBadgeByKey } from "@/lib/constants/badges";
import { getEmpireLevel } from "@/lib/constants/empire-levels";
import { ProfileEditor } from "@/components/profile/profile-editor";
import type { Profile, UserBadge, GameResult } from "@/types";

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [profileResult, streakResult, badgesResult, gamesResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    getUserStreak(),
    supabase.from("user_badges").select("*").eq("user_id", user!.id),
    supabase.from("game_results").select("*").eq("user_id", user!.id),
  ]);

  const profile = profileResult.data as Profile | null;
  const streak = streakResult.ok ? streakResult.value : null;
  const badges = (badgesResult.data ?? []) as UserBadge[];
  const games = (gamesResult.data ?? []) as GameResult[];

  const gamesPlayed = games.filter((g) => g.completed).length;
  const gamesWon = games.filter((g) => g.completed && g.score > 0).length;
  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-gold">Profile</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-2xl">
              {profile?.username?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div>
              <CardTitle>{profile?.display_name ?? profile?.username ?? "Unknown"}</CardTitle>
              <p className="text-sm text-text-secondary">@{profile?.username}</p>
              <p className="text-xs text-text-secondary">
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProfileEditor currentUsername={profile?.username ?? ""} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Current Streak" value={`${streak?.current_streak ?? 0}`} />
        <StatCard label="Longest Streak" value={`${streak?.longest_streak ?? 0}`} />
        <StatCard label="Games Played" value={`${gamesPlayed}`} />
        <StatCard label="Win Rate" value={`${winRate}%`} />
      </div>

      {streak && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-text-secondary">Empire Level</p>
            <p className="text-lg font-medium text-gold">
              {getEmpireLevel(streak.current_streak).icon}{" "}
              {getEmpireLevel(streak.current_streak).name}
            </p>
          </CardContent>
        </Card>
      )}

      {badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Badges Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => {
                const def = getBadgeByKey(b.badge_key);
                return def ? (
                  <Badge key={b.id} variant="default">
                    {def.icon} {def.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="text-center">
      <CardContent className="py-4">
        <p className="text-xl font-bold text-text-primary">{value}</p>
        <p className="text-xs text-text-secondary">{label}</p>
      </CardContent>
    </Card>
  );
}
