import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BADGES } from "@/lib/constants/badges";

type BadgesGridProps = {
  earnedBadgeKeys: string[];
};

export function BadgesGrid({ earnedBadgeKeys }: BadgesGridProps) {
  const earned = new Set(earnedBadgeKeys);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BADGES.map((badge) => {
            const isEarned = earned.has(badge.key);
            return (
              <div
                key={badge.key}
                className={`rounded-lg border p-3 text-center transition-all ${
                  isEarned
                    ? "border-gold/30 bg-gold/5"
                    : "border-border bg-background opacity-40"
                }`}
              >
                <div className="text-2xl">{badge.icon}</div>
                <p className="mt-1 text-xs font-medium text-text-primary">{badge.name}</p>
                <p className="text-xs text-text-secondary">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
