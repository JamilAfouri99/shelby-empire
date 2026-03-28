import type { EmpireLevel } from "@/types";

export const EMPIRE_LEVELS: EmpireLevel[] = [
  { level: 0, name: "The Streets", description: "Every empire starts somewhere.", requiredDays: 0, icon: "🏚️" },
  { level: 1, name: "Small Heath Betting Shop", description: "You've set up shop. The locals know your name.", requiredDays: 1, icon: "🎲" },
  { level: 2, name: "The Garrison Pub", description: "A proper base of operations. By order.", requiredDays: 7, icon: "🍺" },
  { level: 3, name: "Shelby Company Limited", description: "Legitimate business. On paper, at least.", requiredDays: 30, icon: "🏭" },
  { level: 4, name: "Camden Town", description: "London is yours. Alfie would be impressed.", requiredDays: 60, icon: "🌆" },
  { level: 5, name: "Arrow House", description: "A country estate. You've arrived.", requiredDays: 100, icon: "🏛️" },
  { level: 6, name: "Member of Parliament", description: "Political power. The final frontier.", requiredDays: 200, icon: "⚖️" },
  { level: 7, name: "The Crown", description: "You answer to no one.", requiredDays: 365, icon: "👑" },
];

export function getEmpireLevel(currentStreak: number): EmpireLevel {
  let level = EMPIRE_LEVELS[0];
  for (const el of EMPIRE_LEVELS) {
    if (currentStreak >= el.requiredDays) {
      level = el;
    }
  }
  return level;
}

export function getNextEmpireLevel(currentStreak: number): EmpireLevel | null {
  const current = getEmpireLevel(currentStreak);
  const nextIndex = EMPIRE_LEVELS.findIndex((l) => l.level === current.level) + 1;
  return nextIndex < EMPIRE_LEVELS.length ? EMPIRE_LEVELS[nextIndex] : null;
}
