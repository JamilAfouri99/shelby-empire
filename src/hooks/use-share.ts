"use client";

import { useState, useCallback } from "react";
import type { ShareGrid } from "@/types";
import { copyShareToClipboard, getTwitterShareUrl } from "@/lib/utils/share";

export function useShare() {
  const [copied, setCopied] = useState(false);

  const copyResult = useCallback(async (grid: ShareGrid) => {
    const success = await copyShareToClipboard(grid);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    return success;
  }, []);

  const shareToTwitter = useCallback((grid: ShareGrid) => {
    const url = getTwitterShareUrl(grid);
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return { copied, copyResult, shareToTwitter };
}
