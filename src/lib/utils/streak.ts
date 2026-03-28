import { getTodayUTC, getYesterdayUTC } from "./date";
import { getEmpireLevel } from "@/lib/constants/empire-levels";
import type { UserStreak } from "@/types";

export type StreakUpdate = {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  empire_level: number;
  total_days_active: number;
};

export function calculateStreakUpdate(current: UserStreak): StreakUpdate {
  const today = getTodayUTC();
  const yesterday = getYesterdayUTC();

  if (current.last_activity_date === today) {
    return {
      current_streak: current.current_streak,
      longest_streak: current.longest_streak,
      last_activity_date: today,
      empire_level: current.empire_level,
      total_days_active: current.total_days_active,
    };
  }

  let newStreak: number;
  if (current.last_activity_date === yesterday) {
    newStreak = current.current_streak + 1;
  } else {
    newStreak = 1;
  }

  const newLongest = Math.max(newStreak, current.longest_streak);
  const newTotal = current.total_days_active + 1;
  const newEmpireLevel = getEmpireLevel(newStreak).level;

  return {
    current_streak: newStreak,
    longest_streak: newLongest,
    last_activity_date: today,
    empire_level: newEmpireLevel,
    total_days_active: newTotal,
  };
}
