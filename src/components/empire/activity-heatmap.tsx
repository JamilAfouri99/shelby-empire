"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getTodayUTC } from "@/lib/utils/date";

type ActivityHeatmapProps = {
  activeDates: string[];
};

export function ActivityHeatmap({ activeDates }: ActivityHeatmapProps) {
  const today = new Date(getTodayUTC() + "T00:00:00Z");
  const activeSet = new Set(activeDates);

  // Generate last 12 weeks of dates
  const weeks: Date[][] = [];
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 83); // ~12 weeks
  startDate.setUTCDate(startDate.getUTCDate() - startDate.getUTCDay()); // Align to Sunday (UTC)

  const currentDate = new Date(startDate);
  while (currentDate <= today) {
    const week: Date[] = [];
    for (let d = 0; d < 7 && currentDate <= today; d++) {
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex gap-1 overflow-x-auto pb-2"
          role="img"
          aria-label="Activity heatmap showing your daily engagement over the past 12 weeks"
        >
          <div className="flex flex-col gap-1 pr-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((label, i) => (
              <span key={i} className="flex h-3 items-center text-[9px] leading-none text-text-muted">
                {label}
              </span>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((date, di) => {
                const dateStr = date.toISOString().split("T")[0];
                const isActive = activeSet.has(dateStr);
                return (
                  <div
                    key={di}
                    aria-hidden="true"
                    className={cn(
                      "h-3 w-3 rounded-sm",
                      isActive ? "bg-gold" : "bg-border-subtle"
                    )}
                    title={dateStr}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
