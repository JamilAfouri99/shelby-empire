"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { GameState } from "@/types";
import type { BlinderOrBluffData } from "@/types";

type BlinderOrBluffProps = {
  data: BlinderOrBluffData;
  gameState: GameState;
  onGuess: (guess: string) => void;
  submitting: boolean;
};

export function BlinderOrBluff({ data, gameState, onGuess, submitting }: BlinderOrBluffProps) {
  const isComplete = gameState.status !== "playing";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Blinder or Bluff?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg leading-relaxed text-text-primary">{data.statement}</p>

        {!isComplete && (
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 h-auto py-3"
              onClick={() => onGuess("true")}
              disabled={submitting}
            >
              Blinder (True)
            </Button>
            <Button
              variant="secondary"
              className="flex-1 h-auto py-3"
              onClick={() => onGuess("false")}
              disabled={submitting}
            >
              Bluff (False)
            </Button>
          </div>
        )}

        {isComplete && (
          <div className="space-y-3">
            {gameState.status === "won" ? (
              <p className="text-center text-success font-medium">Correct!</p>
            ) : (
              <p className="text-center text-error font-medium">
                Wrong! The answer was {data.correct_answer ? "Blinder (True)" : "Bluff (False)"}
              </p>
            )}
            <p className="text-sm text-text-secondary">{data.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
