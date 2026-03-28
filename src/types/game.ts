export type GuessResult = "correct" | "wrong" | "pending";

export type GameGuess = {
  value: string;
  result: GuessResult;
};

export type GameState =
  | { status: "playing"; guesses: GameGuess[]; maxGuesses: number }
  | { status: "won"; guesses: GameGuess[]; score: number }
  | { status: "lost"; guesses: GameGuess[]; correctAnswer: string };

export type ShareGrid = {
  title: string;
  grid: string;
  streak: number;
  empireLevel: string;
  url: string;
};
