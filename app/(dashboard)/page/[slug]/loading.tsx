import { Skeleton } from "@/components/ui/skeleton";

function SupporterRowSkeleton({ withMessage }: { withMessage?: boolean }) {
  return (
    <div className="flex gap-3">
      <Skeleton className="w-9 h-9 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-40" />
        {withMessage && (
          <>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </>
        )}
      </div>
    </div>
  );
}

export default function ViewProfileLoading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* TopBar skeleton */}
      <div className="h-16 flex items-center justify-between px-10 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>

      {/* Banner skeleton */}
      <Skeleton className="w-full h-52 rounded-none" />

      <div className="max-w-5xl mx-auto w-full px-6 pb-16">
        <div className="grid grid-cols-[1fr_440px] gap-5 -mt-14 relative z-10">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            {/* Creator identity */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <Skeleton className="w-11 h-11 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="px-5 py-4 flex flex-col gap-2">
                <Skeleton className="h-4 w-36 mb-1" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>

            {/* Social media */}
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-56" />
            </div>

            {/* Recent Supporters */}
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
              <Skeleton className="h-4 w-36 mb-4" />
              <div className="flex flex-col gap-4">
                <SupporterRowSkeleton withMessage />
                <SupporterRowSkeleton withMessage />
                <SupporterRowSkeleton />
              </div>
              <Skeleton className="mt-5 w-full h-11 rounded-xl" />
            </div>
          </div>

          {/* Right column — Buy coffee form */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 h-fit">
            <Skeleton className="h-6 w-48 mb-5" />

            <div className="mb-4">
              <Skeleton className="h-4 w-28 mb-2" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-16 rounded-lg" />
                ))}
              </div>
            </div>

            <div className="mb-4 flex flex-col gap-1.5">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>

            <div className="mb-5 flex flex-col gap-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>

            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
