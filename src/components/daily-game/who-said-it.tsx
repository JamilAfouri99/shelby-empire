"use client";

import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
        guess.result === "correct"
          ? "bg-success/10 text-success border border-success/20"
          : "bg-error/10 text-error border border-error/20"
      )}
    >
      <span>{guess.result === "correct" ? "🟩" : "⬛"}</span>
      <span>{guess.value}</span>
    </motion.div>
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
            <AnimatePresence initial={false}>
              {guesses.map((guess) => (
                <GuessRow key={guess.value} guess={guess} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {gameState.status === "playing" && (
          <motion.div
            className="grid grid-cols-2 gap-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {data.options.map((option) => (
              <motion.div
                key={option}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
                }}
              >
                <Button
                  variant="ghost"
                  disabled={guessedOptions.has(option) || submitting}
                  onClick={() => onGuess(option)}
                  className="h-auto w-full py-3 text-sm bg-surface-elevated border border-border hover:border-gold/30 hover:bg-surface-overlay"
                >
                  {option}
                </Button>
              </motion.div>
            ))}
          </motion.div>
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
