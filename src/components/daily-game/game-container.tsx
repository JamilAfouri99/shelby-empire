"use client";

import { useDailyGame } from "@/hooks/use-daily-game";
import { WhoSaidIt } from "./who-said-it";
import { BlinderOrBluff } from "./blinder-or-bluff";
import { GameShareCard } from "./game-share-card";
import type { DailyContentWithQuote, GameResult, WhoSaidItData, BlinderOrBluffData, GameGuess } from "@/types";

type GameContainerProps = {
  content: DailyContentWithQuote;
  existingResult: GameResult | null;
  currentStreak: number;
};

function getCorrectAnswer(content: DailyContentWithQuote): string {
  if (content.game_type === "who_said_it") {
    return (content.game_data as WhoSaidItData).correct_answer;
  }
  if (content.game_type === "blinder_or_bluff") {
    return (content.game_data as BlinderOrBluffData).correct_answer ? "true" : "false";
  }
  return "";
}

export function GameContainer({ content, existingResult, currentStreak }: GameContainerProps) {
  const { gameState, makeGuess, submitting } = useDailyGame({
    dailyContentId: content.id,
    date: content.date,
    gameType: content.game_type,
    existingGuesses: existingResult?.guesses as GameGuess[] | undefined,
    isCompleted: existingResult?.completed ?? false,
    existingScore: existingResult?.score,
    correctAnswer: getCorrectAnswer(content),
  });

  return (
    <div className="space-y-4">
      {content.game_type === "who_said_it" && (
        <WhoSaidIt
          data={content.game_data as WhoSaidItData}
          gameState={gameState}
          onGuess={makeGuess}
          submitting={submitting}
        />
      )}
      {content.game_type === "blinder_or_bluff" && (
        <BlinderOrBluff
          data={content.game_data as BlinderOrBluffData}
          gameState={gameState}
          onGuess={makeGuess}
          submitting={submitting}
        />
      )}
      {gameState.status !== "playing" && (
        <GameShareCard
          gameState={gameState}
          gameType={content.game_type}
          currentStreak={currentStreak}
        />
      )}
    </div>
  );
}
