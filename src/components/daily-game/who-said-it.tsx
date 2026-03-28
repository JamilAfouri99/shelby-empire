"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GameGuess, GameState } from "@/types";
import type { WhoSaidItData } from "@/types";

type WhoSaidItProps = {
  data: WhoSaidItData;
  gameState: GameState;
  onGuess: (guess: string) => void;
  submitting: boolean;
};

function GuessRow({ guess }: { guess: GameGuess }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
        guess.result === "correct" ? "bg-success/20 text-success" : "bg-error/20 text-error"
      )}
    >
      <span>{guess.result === "correct" ? "🟩" : "⬛"}</span>
      <span>{guess.value}</span>
    </div>
  );
}

export function WhoSaidIt({ data, gameState, onGuess, submitting }: WhoSaidItProps) {
  const guesses = gameState.guesses;
  const guessedOptions = new Set(guesses.map((g) => g.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Who Said It?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <blockquote className="font-heading text-lg leading-relaxed text-text-primary">
          &ldquo;{data.quote}&rdquo;
        </blockquote>

        {guesses.length > 0 && (
          <div className="space-y-2">
            {guesses.map((guess, i) => (
              <GuessRow key={i} guess={guess} />
            ))}
          </div>
        )}

        {gameState.status === "playing" && (
          <div className="grid grid-cols-2 gap-2">
            {data.options.map((option) => (
              <Button
                key={option}
                variant={guessedOptions.has(option) ? "ghost" : "secondary"}
                disabled={guessedOptions.has(option) || submitting}
                onClick={() => onGuess(option)}
                className="h-auto py-3 text-sm"
              >
                {option}
              </Button>
            ))}
          </div>
        )}

        <GameStatusMessage gameState={gameState} />
      </CardContent>
    </Card>
  );
}

function GameStatusMessage({ gameState }: { gameState: GameState }) {
  if (gameState.status === "won") {
    return (
      <p className="text-center text-success font-medium">
        Correct! Score: {gameState.score}/6
      </p>
    );
  }
  if (gameState.status === "lost") {
    return (
      <p className="text-center text-error">
        The answer was <span className="font-medium text-gold">{gameState.correctAnswer}</span>
      </p>
    );
  }
  return (
    <p className="text-center text-sm text-text-secondary">
      Guess {gameState.guesses.length + 1} of {gameState.maxGuesses}
    </p>
  );
}
