import type { Quote } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteActions } from "./quote-actions";

type QuoteDisplayProps = {
  quote: Quote;
};

export function QuoteDisplay({ quote }: QuoteDisplayProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
      <div className="relative space-y-4">
        <blockquote className="font-heading text-xl leading-relaxed text-text-primary md:text-2xl">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gold font-medium">{quote.character}</p>
            <p className="text-sm text-text-secondary">
              Season {quote.season}, Episode {quote.episode}
              {quote.episode_title && ` — ${quote.episode_title}`}
            </p>
          </div>
          <QuoteActions text={quote.text} character={quote.character} />
        </div>
        {quote.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {quote.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
