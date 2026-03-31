export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-24 skeleton-shimmer rounded" />

      {/* Avatar + username card skeleton */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 skeleton-shimmer rounded-full" />
          <div className="space-y-2">
            <div className="h-5 w-36 skeleton-shimmer rounded" />
            <div className="h-4 w-24 skeleton-shimmer rounded" />
            <div className="h-3 w-32 skeleton-shimmer rounded" />
          </div>
        </div>
        <div className="mt-4 h-10 w-full skeleton-shimmer rounded" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-4 text-center">
            <div className="mx-auto mb-2 h-7 w-12 skeleton-shimmer rounded" />
            <div className="mx-auto h-3 w-20 skeleton-shimmer rounded" />
          </div>
        ))}
      </div>

      {/* Empire level skeleton */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="mb-1 h-3 w-20 skeleton-shimmer rounded" />
        <div className="h-6 w-40 skeleton-shimmer rounded" />
      </div>

      {/* Badges skeleton */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="mb-4 h-5 w-28 skeleton-shimmer rounded" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 w-24 skeleton-shimmer rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
