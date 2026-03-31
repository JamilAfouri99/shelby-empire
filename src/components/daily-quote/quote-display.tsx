"use client";

import { motion } from "framer-motion";
import type { Quote } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteActions } from "./quote-actions";

type QuoteDisplayProps = {
  quote: Quote;
};

export function QuoteDisplay({ quote }: QuoteDisplayProps) {
  return (
    <Card className="relative overflow-hidden border-gold/20">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/3 to-transparent pointer-events-none" />
      <div className="relative space-y-4">
        <motion.blockquote
          className="font-heading text-xl leading-relaxed text-text-primary md:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          &ldquo;{quote.text}&rdquo;
        </motion.blockquote>
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div>
            <p className="text-gold font-medium">{quote.character}</p>
            <p className="text-sm text-text-secondary">
              Season {quote.season}, Episode {quote.episode}
              {quote.episode_title && ` — ${quote.episode_title}`}
            </p>
          </div>
          <QuoteActions text={quote.text} character={quote.character} />
        </motion.div>
        {quote.tags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            {quote.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </motion.div>
        )}
      </div>
    </Card>
  );
}
