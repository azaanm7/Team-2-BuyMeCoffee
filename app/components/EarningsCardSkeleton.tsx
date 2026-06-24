"use client";

export default function EarningsCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-8 w-32 bg-gray-200 rounded-md" />
      </div>
      <div className="h-9 w-28 bg-gray-200 rounded" />
    </div>
  );
}
