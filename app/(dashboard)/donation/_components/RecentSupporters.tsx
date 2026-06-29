"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import type { Donation } from "./types";

function SupporterAvatar({ donation }: { donation: Donation }) {
  const [loaded, setLoaded] = useState(false);

  if (!donation.avatar) {
    return (
      <div className="h-9 w-9 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-sm font-bold text-gray-600 uppercase">
        {donation.name[0]}
      </div>
    );
  }

  return (
    <div className="relative h-9 w-9 rounded-full bg-gray-200 shrink-0 overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse rounded-full bg-gray-200" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={donation.avatar}
        alt={donation.name}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

type Props = {
  donations: Donation[];
  profileName: string;
  isLoading: boolean;
  showAll: boolean;
  onToggleShowAll: () => void;
};

export function RecentSupporters({
  donations,
  profileName,
  isLoading,
  showAll,
  onToggleShowAll,
}: Props) {
  const displayed = showAll ? donations : donations.slice(0, 3);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-4 w-36 rounded bg-gray-200 animate-pulse mb-4" />
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-gray-900">
        Recent Supporters
      </h3>
      {donations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 py-12">
          <Heart className="h-7 w-7 fill-gray-900 text-gray-900" />
          <p className="text-base font-bold text-gray-900">
            Be the first one to support {profileName}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {displayed.map((d) => (
              <div key={d.id} className="flex gap-3">
                <SupporterAvatar donation={d} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {d.name} bought ${d.amount} coffee
                  </p>
                  {d.message && (
                    <p className="text-sm text-gray-500 mt-0.5 wrap-break-word">
                      {d.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {donations.length > 3 && (
            <button
              onClick={onToggleShowAll}
              className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 transition"
            >
              {showAll ? "See less" : "See more"}
              <svg
                className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
        </>
      )}
    </section>
  );
}
