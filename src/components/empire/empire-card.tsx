import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getEmpireProgress } from "@/lib/utils/empire";

type EmpireCardProps = {
  currentStreak: number;
};

export function EmpireCard({ currentStreak }: EmpireCardProps) {
  const { current, next, progress, daysToNext } = getEmpireProgress(currentStreak);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
      <CardHeader className="relative">
        <div className="text-4xl mb-2">{current.icon}</div>
        <CardTitle className="text-2xl text-gold">{current.name}</CardTitle>
        <p className="text-sm text-text-secondary">{current.description}</p>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Level {current.level}</span>
          {next && (
            <span className="text-text-secondary">
              {daysToNext} days to {next.name}
            </span>
          )}
        </div>
        <Progress value={progress} />
        {!next && (
          <p className="text-center text-sm text-gold">Maximum level reached!</p>
        )}
      </CardContent>
    </Card>
  );
}
