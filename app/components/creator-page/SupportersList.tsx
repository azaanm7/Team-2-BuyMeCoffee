"use client";

import { useState } from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import CreatorAvatar from "./CreatorAvatar";

export type Supporter = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  amount: number;
  message?: string | null;
};

type SupportersListProps = {
  creatorName: string;
  supporters: Supporter[];
  initialVisible?: number;
};

export default function SupportersList({
  creatorName,
  supporters,
  initialVisible = 3,
}: SupportersListProps) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? supporters : supporters.slice(0, initialVisible);
  const hasMore = supporters.length > initialVisible;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-gray-900">
        Recent Supporters
      </h3>

      {supporters.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 py-12">
          <Heart className="h-7 w-7 fill-gray-900 text-gray-900" />
          <p className="text-base font-bold text-gray-900">
            Be the first one to support {creatorName}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {visible.map((s) => (
              <div key={s.id} className="flex gap-3">
                <CreatorAvatar
                  name={s.name}
                  avatarUrl={s.avatarUrl}
                  size={36}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {s.name} bought ${s.amount} coffee
                  </p>
                  {s.message && (
                    <p className="text-sm text-gray-500 mt-0.5 wrap-break-word">
                      {s.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 transition"
            >
              {showAll ? "See less" : "See more"}
              {showAll ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </>
      )}
    </section>
  );
}
