import type { Metadata } from "next";
import { getTodayContent } from "@/actions/daily-quote";
import { getTodayGameResult } from "@/actions/daily-game";
import { getUserStreak } from "@/actions/streak";
import { QuoteDisplay } from "@/components/daily-quote/quote-display";
import { ShelbyLesson } from "@/components/daily-quote/shelby-lesson";
import { CountdownTimer } from "@/components/daily-quote/countdown-timer";
import { GameContainer } from "@/components/daily-game/game-container";
import { ErrorDisplay } from "@/components/common/error-display";
import type { GameResult } from "@/types";

export const metadata: Metadata = {
  title: "Today's Challenge — By Order",
};

export default async function TodayPage() {
  const [contentResult, gameResult, streakResult] = await Promise.all([
    getTodayContent(),
    getTodayGameResult(),
    getUserStreak(),
  ]);

  if (!contentResult.ok) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-3xl font-bold text-gold">Today</h1>
        <ErrorDisplay message={contentResult.error} />
      </div>
    );
  }

  const content = contentResult.value;
  const existingResult = gameResult.ok ? gameResult.value : null;
  const currentStreak = streakResult.ok ? (streakResult.value?.current_streak ?? 0) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold text-gold">Today</h1>
        <CountdownTimer />
      </div>

      <div className="rounded-lg border border-gold/20 shadow-[inset_0_1px_0_rgba(201,168,76,0.1),0_0_20px_rgba(201,168,76,0.06)]">
        <QuoteDisplay quote={content.quote} />
      </div>

      {content.quote.shelby_lesson && (
        <ShelbyLesson lesson={content.quote.shelby_lesson} />
      )}

      <div className="border-t border-border-subtle pt-6">
        <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
          Daily Challenge
        </h2>
        <GameContainer
          content={content}
          existingResult={existingResult as GameResult | null}
          currentStreak={currentStreak}
        />
      </div>
    </div>
  );
}
