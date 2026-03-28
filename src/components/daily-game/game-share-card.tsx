"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Twitter } from "lucide-react";
import { useShare } from "@/hooks/use-share";
import { createGameStrategy, buildShareText } from "@/lib/utils/game";
import type { GameState, WhoSaidItData, BlinderOrBluffData } from "@/types";

type GameShareCardProps = {
  gameState: GameState;
  gameType: string;
  currentStreak: number;
};

export function GameShareCard({ gameState, gameType, currentStreak }: GameShareCardProps) {
  const { copied, copyResult, shareToTwitter } = useShare();

  // Build a minimal strategy just for grid generation
  const dummyData: WhoSaidItData | BlinderOrBluffData =
    gameType === "blinder_or_bluff"
      ? { statement: "", correct_answer: true, explanation: "" }
      : { quote: "", correct_answer: "", options: [] };

  const strategy = createGameStrategy(gameType, dummyData);
  const grid = strategy.getShareGrid(gameState.guesses, currentStreak);
  const shareText = buildShareText(grid);

  return (
    <Card className="text-center">
      <CardContent className="space-y-4">
        <pre className="whitespace-pre-wrap text-sm text-text-secondary font-body">{shareText}</pre>
        <div className="flex justify-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => copyResult(grid)}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied!" : "Copy Result"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => shareToTwitter(grid)}>
            <Twitter className="mr-2 h-4 w-4" />
            Share on X
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
