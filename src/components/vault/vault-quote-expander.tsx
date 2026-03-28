"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import type { Quote } from "@/types";
import { copyQuoteToClipboard } from "@/lib/utils/share";

type VaultQuoteExpanderProps = {
  quote: Quote;
};

export function VaultQuoteExpander({ quote }: VaultQuoteExpanderProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasExpandableContent = quote.context || quote.shelby_lesson;
  if (!hasExpandableContent) return null;

  async function handleCopy() {
    const success = await copyQuoteToClipboard(quote.text, quote.character);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="text-xs"
      >
        {expanded ? (
          <>
            <ChevronUp className="mr-1 h-3 w-3" /> Less
          </>
        ) : (
          <>
            <ChevronDown className="mr-1 h-3 w-3" /> More
          </>
        )}
      </Button>
      {expanded && (
        <div className="mt-3 space-y-3 border-t border-border pt-3">
          {quote.context && (
            <div>
              <p className="text-xs font-medium text-text-secondary mb-1">Context</p>
              <p className="text-sm text-text-secondary">{quote.context}</p>
            </div>
          )}
          {quote.shelby_lesson && (
            <div>
              <p className="text-xs font-medium text-gold mb-1">The Shelby Lesson</p>
              <p className="text-sm text-text-secondary">{quote.shelby_lesson}</p>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
            {copied ? "Copied!" : "Copy Quote"}
          </Button>
        </div>
      )}
    </div>
  );
}
