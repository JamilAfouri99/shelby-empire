"use client";

import { motion, AnimatePresence } from "framer-motion";
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

        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="buttons"
              className="flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="ghost"
                  className="h-auto w-full py-3 bg-surface-elevated border border-border hover:border-gold/30 hover:bg-surface-overlay"
                  onClick={() => onGuess("true")}
                  disabled={submitting}
                >
                  Blinder (True)
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="ghost"
                  className="h-auto w-full py-3 bg-surface-elevated border border-border hover:border-gold/30 hover:bg-surface-overlay"
                  onClick={() => onGuess("false")}
                  disabled={submitting}
                >
                  Bluff (False)
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              className="space-y-3"
              initial={{ opacity: 0, scale: 0.95, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              {gameState.status === "won" ? (
                <div className="rounded-lg bg-success/10 px-4 py-2 text-center">
                  <p className="text-success font-medium">Correct!</p>
                </div>
              ) : (
                <div className="rounded-lg bg-error/10 px-4 py-2 text-center">
                  <p className="text-error font-medium">
                    Wrong! The answer was {data.correct_answer ? "Blinder (True)" : "Bluff (False)"}
                  </p>
                </div>
              )}
              <p className="text-sm text-text-secondary">{data.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
