"use client";

import { useState, useCallback } from "react";
import { copyQuoteToClipboard } from "@/lib/utils/share";

export function useDailyQuote() {
  const [copied, setCopied] = useState(false);

  const copyQuote = useCallback(async (text: string, character: string) => {
    const success = await copyQuoteToClipboard(text, character);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    return success;
  }, []);

  return { copied, copyQuote };
}
