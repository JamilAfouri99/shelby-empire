"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ActivityHeatmapProps = {
  activeDates: string[];
};

export function ActivityHeatmap({ activeDates }: ActivityHeatmapProps) {
  const today = new Date();
  const activeSet = new Set(activeDates);

  // Generate last 12 weeks of dates
  const weeks: Date[][] = [];
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 83); // ~12 weeks
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Align to Sunday

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
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((date, di) => {
                const dateStr = date.toISOString().split("T")[0];
                const isActive = activeSet.has(dateStr);
                return (
                  <div
                    key={di}
                    className={cn(
                      "h-3 w-3 rounded-sm",
                      isActive ? "bg-gold" : "bg-border"
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
