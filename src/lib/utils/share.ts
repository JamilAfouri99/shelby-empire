import type { ShareGrid } from "@/types";
import { buildShareText } from "./game";

export async function copyShareToClipboard(grid: ShareGrid): Promise<boolean> {
  const text = buildShareText(grid);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function getTwitterShareUrl(grid: ShareGrid): string {
  const text = encodeURIComponent(buildShareText(grid));
  return `https://twitter.com/intent/tweet?text=${text}`;
}

export function copyQuoteToClipboard(quote: string, character: string): Promise<boolean> {
  const text = `"${quote}" — ${character}\n\nbyorder.com`;
  return navigator.clipboard.writeText(text).then(
    () => true,
    () => false
  );
}
