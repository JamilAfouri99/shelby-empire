export default function TodayLoading() {
  return (
    <div className="space-y-6">
      {/* Quote skeleton */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="mb-4 h-4 w-24 skeleton-shimmer rounded" />
        <div className="space-y-2">
          <div className="h-6 w-full skeleton-shimmer rounded" />
          <div className="h-6 w-3/4 skeleton-shimmer rounded" />
        </div>
        <div className="mt-4 h-4 w-32 skeleton-shimmer rounded" />
      </div>
      {/* Game skeleton */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="mb-4 h-5 w-40 skeleton-shimmer rounded" />
        <div className="space-y-3">
          <div className="h-12 w-full skeleton-shimmer rounded" />
          <div className="h-12 w-full skeleton-shimmer rounded" />
          <div className="h-12 w-full skeleton-shimmer rounded" />
          <div className="h-12 w-full skeleton-shimmer rounded" />
        </div>
      </div>
    </div>
  );
}
