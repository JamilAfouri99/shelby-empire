import type { GameGuess, GameState, ShareGrid } from "@/types";
import type { WhoSaidItData, BlinderOrBluffData } from "@/types";
import { GAME_CONFIG } from "@/lib/constants/game-config";
import { getDayNumber } from "./date";
import { getEmpireLevel } from "@/lib/constants/empire-levels";

export interface GameStrategy {
  validateGuess(guess: string): "correct" | "wrong";
  getScore(guesses: GameGuess[]): number;
  getShareGrid(guesses: GameGuess[], streak: number): ShareGrid;
}

export class WhoSaidItStrategy implements GameStrategy {
  constructor(private data: WhoSaidItData) {}

  validateGuess(guess: string): "correct" | "wrong" {
    return guess === this.data.correct_answer ? "correct" : "wrong";
  }

  getScore(guesses: GameGuess[]): number {
    const correctIndex = guesses.findIndex((g) => g.result === "correct");
    if (correctIndex === -1) return 0;
    return GAME_CONFIG.scorePerGuess[correctIndex] ?? 1;
  }

  getShareGrid(guesses: GameGuess[], streak: number): ShareGrid {
    const dayNum = getDayNumber();
    const empire = getEmpireLevel(streak);
    const squares = guesses
      .map((g) => (g.result === "correct" ? "🟩" : "⬛"))
      .join("");

    return {
      title: `🎩 Shelby Empire — Day ${dayNum}`,
      grid: `Who Said It? ${squares}`,
      streak,
      empireLevel: empire.name,
      url: "shelbyempire.com",
    };
  }
}

export class BlinderOrBluffStrategy implements GameStrategy {
  constructor(private data: BlinderOrBluffData) {}

  validateGuess(guess: string): "correct" | "wrong" {
    const guessedTrue = guess === "true";
    return guessedTrue === this.data.correct_answer ? "correct" : "wrong";
  }

  getScore(guesses: GameGuess[]): number {
    const correctIndex = guesses.findIndex((g) => g.result === "correct");
    return correctIndex === 0 ? 6 : 0;
  }

  getShareGrid(guesses: GameGuess[], streak: number): ShareGrid {
    const dayNum = getDayNumber();
    const empire = getEmpireLevel(streak);
    const result = guesses[0]?.result === "correct" ? "🟩" : "🟥";

    return {
      title: `🎩 Shelby Empire — Day ${dayNum}`,
      grid: `Blinder or Bluff? ${result}`,
      streak,
      empireLevel: empire.name,
      url: "shelbyempire.com",
    };
  }
}

export function createGameStrategy(
  gameType: string,
  gameData: WhoSaidItData | BlinderOrBluffData
): GameStrategy {
  switch (gameType) {
    case "who_said_it":
      return new WhoSaidItStrategy(gameData as WhoSaidItData);
    case "blinder_or_bluff":
      return new BlinderOrBluffStrategy(gameData as BlinderOrBluffData);
    default:
      return new WhoSaidItStrategy(gameData as WhoSaidItData);
  }
}

export function buildShareText(grid: ShareGrid): string {
  return `${grid.title}\n${grid.grid}\nStreak: ${grid.streak} days 🔥\nEmpire: ${grid.empireLevel}\n${grid.url}`;
}

export function getInitialGameState(): GameState {
  return { status: "playing", guesses: [], maxGuesses: GAME_CONFIG.maxGuesses };
}
