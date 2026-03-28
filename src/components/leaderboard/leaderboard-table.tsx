import { Card, CardContent } from "@/components/ui/card";
import { getEmpireLevel } from "@/lib/constants/empire-levels";

type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  value: number;
  empireLevel: number;
};

type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
  currentUserId: string | null;
  label: string;
};

export function LeaderboardTable({ entries, currentUserId, label }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <Card className="text-center">
        <CardContent className="py-8">
          <p className="text-text-secondary">No entries yet. Be the first!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-xs text-text-secondary">
              <th className="py-3 pl-4 text-left">#</th>
              <th className="py-3 text-left">Player</th>
              <th className="py-3 text-left">Empire</th>
              <th className="py-3 pr-4 text-right">{label}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const empire = getEmpireLevel(entry.empireLevel);
              const isCurrentUser = entry.userId === currentUserId;
              return (
                <tr
                  key={entry.userId}
                  className={`border-b border-border last:border-0 ${
                    isCurrentUser ? "bg-gold/5" : ""
                  }`}
                >
                  <td className="py-3 pl-4 text-sm">
                    {entry.rank <= 3 ? (
                      <span className="text-base">
                        {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                      </span>
                    ) : (
                      <span className="text-text-secondary">{entry.rank}</span>
                    )}
                  </td>
                  <td className="py-3">
                    <span className={`text-sm font-medium ${isCurrentUser ? "text-gold" : "text-text-primary"}`}>
                      {entry.username}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-text-secondary">
                    {empire.icon} {empire.name}
                  </td>
                  <td className="py-3 pr-4 text-right text-sm font-mono text-text-primary">
                    {entry.value}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
