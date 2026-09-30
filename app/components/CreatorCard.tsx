/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";

interface CreatorCardProps {
  name: string;
  username: string;
  avatarUrl?: string;
}

export default function CreatorCard({
  name,
  username,
  avatarUrl,
}: CreatorCardProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const pagePath = `/page/${encodeURIComponent(username)}`;
  const displayUrl = `buymeacoffee.com${pagePath}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        new URL(pagePath, window.location.origin).toString(),
      );
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
    setTimeout(() => setCopyStatus("idle"), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-linear-to-br from-pink-400 to-violet-400" />
          )}
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{name}</p>
            <Link
              href={pagePath}
              target="_blank"
              className="mt-0.5 block truncate text-xs text-gray-500 hover:underline"
            >
              {displayUrl}
            </Link>
          </div>
        </div>
        <button
          onClick={handleShare}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:w-auto ${
            copyStatus === "copied"
              ? "bg-green-600 text-white"
              : copyStatus === "failed"
                ? "bg-red-600 text-white"
                : "bg-gray-900 text-white hover:bg-gray-700"
          }`}
        >
          {copyStatus === "copied" ? (
            <>
              <Check size={15} aria-hidden="true" /> Copied!
            </>
          ) : copyStatus === "failed" ? (
            "Copy failed"
          ) : (
            <>
              <Copy size={15} aria-hidden="true" /> Share page link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
