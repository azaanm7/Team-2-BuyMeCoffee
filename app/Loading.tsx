// app/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="top-0 left-0 right-0 z-20 bg-white h-16 flex items-center justify-between px-10 font-sans">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-9 w-20 rounded-xl" />
      </div>

      <div className="flex flex-1">
        <aside className="w-56 h-[calc(100vh-64px)] p-3 flex flex-col gap-1 font-sans">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </aside>

        <main className="flex-1 p-6 max-w-3xl w-full mx-auto flex flex-col gap-5">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
              <Skeleton className="h-9 w-40 rounded-lg" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-32 rounded-md" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl px-6 py-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="py-3.5 border-t border-gray-100 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                      <Skeleton className="h-3.5 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  {i % 2 === 0 && (
                    <div className="pl-11 mt-2 flex flex-col gap-1.5">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-4/5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
