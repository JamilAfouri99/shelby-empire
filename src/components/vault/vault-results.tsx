import Link from "next/link";
import type { Quote } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VaultQuoteExpander } from "./vault-quote-expander";

type VaultResultsProps = {
  quotes: Quote[];
  total: number;
  page: number;
  totalPages: number;
};

export function VaultResults({ quotes, total, page, totalPages }: VaultResultsProps) {
  if (quotes.length === 0) {
    return (
      <Card className="text-center">
        <CardContent className="py-8">
          <p className="text-text-secondary">No quotes found. Try a different search.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        {total} quote{total !== 1 ? "s" : ""} found
      </p>
      {quotes.map((quote) => (
        <VaultQuoteCard key={quote.id} quote={quote} />
      ))}
      {totalPages > 1 && (
        <VaultPagination page={page} totalPages={totalPages} />
      )}
    </div>
  );
}

function VaultQuoteCard({ quote }: { quote: Quote }) {
  return (
    <Card className="group bg-surface-elevated border-border-subtle">
      <CardContent className="space-y-3">
        <blockquote className="font-heading text-base leading-relaxed text-text-primary">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gold">{quote.character}</p>
            <p className="text-xs text-text-muted">
              S{quote.season}E{quote.episode}
              {quote.episode_title && ` — ${quote.episode_title}`}
            </p>
          </div>
          {quote.mood && <Badge variant="secondary">{quote.mood}</Badge>}
        </div>
        {quote.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {quote.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
        <VaultQuoteExpander quote={quote} />
      </CardContent>
    </Card>
  );
}

function VaultPagination({ page, totalPages }: { page: number; totalPages: number }) {
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      {page > 1 && (
        <Link
          href={`?page=${page - 1}`}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:text-gold transition-colors"
        >
          Previous
        </Link>
      )}
      <span className="text-sm text-text-secondary">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={`?page=${page + 1}`}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:text-gold transition-colors"
        >
          Next
        </Link>
      )}
    </div>
  );
}
