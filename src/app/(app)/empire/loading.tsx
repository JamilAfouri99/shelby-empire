export default function EmpireLoading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-40 skeleton-shimmer rounded" />

      {/* Empire card skeleton */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 skeleton-shimmer rounded-full" />
          <div className="space-y-2">
            <div className="h-5 w-32 skeleton-shimmer rounded" />
            <div className="h-4 w-24 skeleton-shimmer rounded" />
          </div>
        </div>
      </div>

      {/* Streak stats skeleton — 3 cards */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-4">
            <div className="mb-2 h-4 w-20 skeleton-shimmer rounded" />
            <div className="h-8 w-12 skeleton-shimmer rounded" />
          </div>
        ))}
      </div>

      {/* Activity heatmap skeleton */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="mb-4 h-4 w-32 skeleton-shimmer rounded" />
        <div className="grid grid-cols-[repeat(53,1fr)] gap-1">
          {Array.from({ length: 53 * 7 }).map((_, i) => (
            <div key={i} className="h-3 w-3 skeleton-shimmer rounded-sm" />
          ))}
        </div>
      </div>

      {/* Badges grid skeleton */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="mb-4 h-5 w-28 skeleton-shimmer rounded" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-4">
              <div className="mx-auto mb-2 h-8 w-8 skeleton-shimmer rounded" />
              <div className="mx-auto h-3 w-16 skeleton-shimmer rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
