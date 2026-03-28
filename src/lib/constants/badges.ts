export type BadgeDefinition = {
  key: string;
  name: string;
  description: string;
  icon: string;
};

export const BADGES: BadgeDefinition[] = [
  { key: "first_game", name: "First Blood", description: "Complete your first daily challenge", icon: "🎯" },
  { key: "perfect_game", name: "Sharp", description: "Get a perfect score (first guess correct)", icon: "⚡" },
  { key: "streak_7", name: "Weekly Regular", description: "Reach a 7-day streak", icon: "🔥" },
  { key: "streak_30", name: "Made Man", description: "Reach a 30-day streak", icon: "💎" },
  { key: "streak_100", name: "Untouchable", description: "Reach a 100-day streak", icon: "🛡️" },
  { key: "streak_365", name: "By Order", description: "Reach a 365-day streak", icon: "👑" },
  { key: "games_10", name: "Getting Started", description: "Complete 10 daily challenges", icon: "📝" },
  { key: "games_50", name: "Dedicated", description: "Complete 50 daily challenges", icon: "📚" },
  { key: "games_100", name: "Veteran", description: "Complete 100 daily challenges", icon: "🎖️" },
  { key: "vault_explorer", name: "Vault Explorer", description: "Browse 50 quotes in the vault", icon: "🔍" },
];

export function getBadgeByKey(key: string): BadgeDefinition | undefined {
  return BADGES.find((b) => b.key === key);
}
