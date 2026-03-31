"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LeaderboardTable } from "./leaderboard-table";
import type { LeaderboardEntry } from "@/actions/leaderboard";

type LeaderboardTabsProps = {
  streaks: LeaderboardEntry[];
  longest: LeaderboardEntry[];
  totalDays: LeaderboardEntry[];
  currentUserId: string | null;
};

export function LeaderboardTabs({ streaks, longest, totalDays, currentUserId }: LeaderboardTabsProps) {
  return (
    <Tabs defaultValue="streaks">
      <TabsList className="w-full">
        <TabsTrigger value="streaks" className="flex-1">Current Streak</TabsTrigger>
        <TabsTrigger value="longest" className="flex-1">Longest Streak</TabsTrigger>
        <TabsTrigger value="total" className="flex-1">Total Days</TabsTrigger>
      </TabsList>
      <TabsContent value="streaks">
        <LeaderboardTable entries={streaks} currentUserId={currentUserId} label="Streak" />
      </TabsContent>
      <TabsContent value="longest">
        <LeaderboardTable entries={longest} currentUserId={currentUserId} label="Longest" />
      </TabsContent>
      <TabsContent value="total">
        <LeaderboardTable entries={totalDays} currentUserId={currentUserId} label="Days" />
      </TabsContent>
    </Tabs>
  );
}
