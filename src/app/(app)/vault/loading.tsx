export default function VaultLoading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-36 skeleton-shimmer rounded" />

      {/* Search bar — static, not shimmering */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="h-10 w-full rounded-md border border-border bg-background" />
      </div>

      {/* Results grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-5">
            <div className="mb-3 space-y-2">
              <div className="h-4 w-full skeleton-shimmer rounded" />
              <div className="h-4 w-5/6 skeleton-shimmer rounded" />
              <div className="h-4 w-3/4 skeleton-shimmer rounded" />
            </div>
            <div className="h-3 w-28 skeleton-shimmer rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
