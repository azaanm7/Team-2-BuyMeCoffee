/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";

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
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const displayUrl = `${origin.replace(/^https?:\/\//, "")}/page/${username}`;
  const fullUrl = `${origin}/${username}`;

  const handleShare = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
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
          <div>
            <p className="font-medium text-sm">{name}</p>
            <Link
              href={`/${username}`}
              target="_blank"
              className="text-xs text-gray-500 mt-0.5 hover:underline block"
            >
              {displayUrl}
            </Link>
          </div>
        </div>
        <button
          onClick={handleShare}
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
            copied
              ? "bg-green-600 text-white"
              : "bg-gray-900 text-white hover:bg-gray-700"
          }`}
        >
          {copied ? (
            <>
              <CheckIcon /> Copied!
            </>
          ) : (
            <>
              <span>⧉</span> Share page link
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
