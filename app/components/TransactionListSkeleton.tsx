"use client";

export default function TransactionListSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl px-6 py-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="py-3.5 border-t border-gray-100 first:border-t-0 first:pt-0 flex items-center gap-3 animate-pulse"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <div className="h-3.5 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <div className="h-3.5 w-12 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
