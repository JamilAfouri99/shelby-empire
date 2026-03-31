"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Flame, Trophy, Calendar } from "lucide-react";
import { AnimatedCounter } from "@/components/common/animated-counter";
import type { UserStreak } from "@/types";

type StreakStatsProps = {
  streak: UserStreak;
};

type StatConfig = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  suffix?: string;
  color: string;
};

export function StreakStats({ streak }: StreakStatsProps) {
  const stats: StatConfig[] = [
    { icon: Flame, label: "Current Streak", count: streak.current_streak, suffix: " days", color: "text-warning" },
    { icon: Trophy, label: "Longest Streak", count: streak.longest_streak, suffix: " days", color: "text-gold" },
    { icon: Calendar, label: "Total Active Days", count: streak.total_days_active, color: "text-success" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ icon: Icon, label, count, suffix, color }) => (
        <Card key={label} className="text-center bg-surface-elevated">
          <CardContent className="py-4 space-y-1">
            <Icon className={`h-5 w-5 mx-auto ${color}`} />
            <p className="text-lg font-bold text-text-primary">
              <AnimatedCounter value={count} />
              {suffix}
            </p>
            <p className="text-xs text-text-secondary">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
