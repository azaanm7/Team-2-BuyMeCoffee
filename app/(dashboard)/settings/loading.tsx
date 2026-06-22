import { Skeleton } from "@/components/ui/skeleton";

function FormSectionSkeleton({
  fields,
  withPhoto,
}: {
  fields: number;
  withPhoto?: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 w-3xl">
      <Skeleton className="h-5 w-32" />

      {withPhoto && (
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="w-20 h-20 rounded-full" />
        </div>
      )}

      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      ))}

      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

export default function AccountSettingsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header skeleton */}
      <div className="bg-white h-16 flex items-center justify-between px-10">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-9 w-20 rounded-xl" />
      </div>

      <div className="flex">
        {/* Sidebar skeleton */}
        <aside className="w-56 h-[calc(100vh-64px)] p-3 flex flex-col gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </aside>

        <main className="flex flex-col px-8 py-8 min-h-screen w-screen items-center justify-center">
          <Skeleton className="h-7 w-32 mb-6" />

          <div className="flex flex-col gap-4 max-w-3xl w-full">
            {/* Personal Info */}
            <FormSectionSkeleton fields={3} withPhoto />

            {/* Password */}
            <FormSectionSkeleton fields={2} />

            {/* Payment */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
              <Skeleton className="h-5 w-36" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex flex-col gap-1.5 flex-1">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
                <div className="flex flex-col gap-1.5 w-28">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Success Page */}
            <FormSectionSkeleton fields={1} />
          </div>
        </main>
      </div>
    </div>
  );
}
