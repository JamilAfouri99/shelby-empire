import { getEmpireLevel, getNextEmpireLevel } from "@/lib/constants/empire-levels";

export function getEmpireProgress(currentStreak: number) {
  const current = getEmpireLevel(currentStreak);
  const next = getNextEmpireLevel(currentStreak);

  if (!next) {
    return { current, next: null, progress: 100, daysToNext: 0 };
  }

  const daysIntoLevel = currentStreak - current.requiredDays;
  const daysNeeded = next.requiredDays - current.requiredDays;
  const progress = Math.min(100, Math.round((daysIntoLevel / daysNeeded) * 100));

  return {
    current,
    next,
    progress,
    daysToNext: next.requiredDays - currentStreak,
  };
}
