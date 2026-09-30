import TransactionListSkeleton from "@/app/components/TransactionListSkeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-label="Loading dashboard">
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 animate-pulse rounded-full bg-gray-200" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-36 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
        <div className="h-9 w-32 animate-pulse rounded-lg bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-xl border border-gray-200 bg-white"
          />
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-28 animate-pulse rounded-md bg-gray-100" />
        </div>
        <div className="h-44 animate-pulse rounded-lg bg-gray-100" />
      </div>

      <TransactionListSkeleton />
    </div>
  );
}