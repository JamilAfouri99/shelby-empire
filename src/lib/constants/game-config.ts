export const GAME_CONFIG = {
  maxGuesses: 6,
  scorePerGuess: [6, 5, 4, 3, 2, 1] as const,
} as const;

export const GAME_TYPE_LABELS: Record<string, string> = {
  who_said_it: "Who Said It?",
  name_episode: "Name That Episode",
  timeline: "Timeline",
  blinder_or_bluff: "Blinder or Bluff?",
};
