"use client";

import Image from "next/image";

interface CreatorCardProps {
  name: string;
  pageUrl: string;
  avatarUrl?: string;
}

export default function CreatorCard({
  name,
  pageUrl,
  avatarUrl,
}: CreatorCardProps) {
  const handleShare = () => {
    navigator.clipboard.writeText(`https://${pageUrl}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={44}
              height={44}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-linear-to-br from-pink-400 to-violet-400" />
          )}
          <div>
            <p className="font-medium text-sm">{name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{pageUrl}</p>
          </div>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <span>⧉</span> Share page link
        </button>
      </div>
    </div>
  );
}
