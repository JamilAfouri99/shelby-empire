export default function LeaderboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-40 skeleton-shimmer rounded" />

      {/* Your streak card skeleton */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 skeleton-shimmer rounded" />
            <div className="space-y-1">
              <div className="h-4 w-24 skeleton-shimmer rounded" />
              <div className="h-3 w-20 skeleton-shimmer rounded" />
            </div>
          </div>
          <div className="h-7 w-10 skeleton-shimmer rounded" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2 border-b border-border pb-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 w-28 skeleton-shimmer rounded" />
        ))}
      </div>

      {/* Table rows skeleton */}
      <div className="rounded-lg border border-border bg-surface">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="h-5 w-6 skeleton-shimmer rounded" />
              <div className="h-4 w-28 skeleton-shimmer rounded" />
            </div>
            <div className="h-5 w-12 skeleton-shimmer rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
