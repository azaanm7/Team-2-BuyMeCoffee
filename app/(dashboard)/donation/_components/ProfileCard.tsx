"use client";

import { useState } from "react";
import type { Profile } from "./types";

type Props = {
  profile: Profile;
  isLoading: boolean;
  onEditClick: () => void;
};

export function ProfileCard({ profile, isLoading, onEditClick }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse shrink-0" />
            <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="h-9 w-24 rounded-lg bg-gray-200 animate-pulse" />
        </div>
        <hr className="my-5 border-gray-200" />
        <div className="h-4 w-24 rounded bg-gray-200 animate-pulse mb-3" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {profile.photo ? (
            <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden bg-gray-200">
              {!imgLoaded && (
                <div className="absolute inset-0 animate-pulse rounded-full bg-gray-200" />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.photo}
                alt={profile.name}
                className={`h-12 w-12 rounded-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImgLoaded(true)}
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-lg font-bold shrink-0">
              {profile.name[0]}
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
        </div>
        <button
          onClick={onEditClick}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-200"
        >
          Edit page
        </button>
      </div>

      <hr className="my-5 border-gray-200" />

      <h3 className="mb-3 text-base font-bold text-gray-900">
        About {profile.name}
      </h3>
      <p className="text-sm leading-relaxed text-gray-700">{profile.about}</p>
    </section>
  );
}
