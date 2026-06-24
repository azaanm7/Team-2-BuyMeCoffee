import { Skeleton } from "@/components/ui/skeleton";

function CreatorCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>

      <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28 mb-1" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header skeleton */}
      <div className="bg-white h-16 flex items-center justify-between px-10 font-sans">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-9 w-20 rounded-xl" />
      </div>

      <div className="flex flex-1">
        {/* Sidebar skeleton */}
        <aside className="w-56 h-[calc(100vh-64px)] p-3 flex flex-col gap-1 font-sans">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </aside>

        <main className="flex-1 p-6 max-w-3xl w-full mx-auto flex flex-col gap-5">
          <Skeleton className="h-6 w-44" />

          {/* Search bar skeleton */}
          <Skeleton className="h-9 w-52 rounded-lg" />

          {/* Creator cards */}
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CreatorCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
