"use client";

import { Copy, Check, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDailyQuote } from "@/hooks/use-daily-quote";

type QuoteActionsProps = {
  text: string;
  character: string;
};

export function QuoteActions({ text, character }: QuoteActionsProps) {
  const { copied, copyQuote } = useDailyQuote();

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `"${text}" — ${character}\n\nshelbyempire.com`
  )}`;

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => copyQuote(text, character)}
        title="Copy quote"
        className="text-text-secondary hover:text-text-primary"
      >
        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
      </Button>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="icon" title="Share on X" className="text-text-secondary hover:text-text-primary">
          <Twitter className="h-4 w-4" />
        </Button>
      </a>
    </div>
  );
}
