import { Card, CardContent } from "@/components/ui/card";
import { Flame, Trophy, Calendar } from "lucide-react";
import type { UserStreak } from "@/types";

type StreakStatsProps = {
  streak: UserStreak;
};

export function StreakStats({ streak }: StreakStatsProps) {
  const stats = [
    { icon: Flame, label: "Current Streak", value: `${streak.current_streak} days`, color: "text-warning" },
    { icon: Trophy, label: "Longest Streak", value: `${streak.longest_streak} days`, color: "text-gold" },
    { icon: Calendar, label: "Total Active Days", value: `${streak.total_days_active}`, color: "text-success" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <Card key={label} className="text-center">
          <CardContent className="py-4 space-y-1">
            <Icon className={`h-5 w-5 mx-auto ${color}`} />
            <p className="text-lg font-bold text-text-primary">{value}</p>
            <p className="text-xs text-text-secondary">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
