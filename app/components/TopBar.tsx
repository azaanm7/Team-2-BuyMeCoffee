/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";

interface TopBarProps {
  userName: string;
  userImage?: string;
}

export default function TopBar({ userName, userImage }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-6 h-14 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <img src="/coffee.svg" alt="coffee" />
        <span className="font-bold text-xl text-gray-900">Buy Me Coffee</span>
      </div>

      <div className="flex items-center gap-2 cursor-pointer">
        {userImage ? (
          <Image
            src={userImage}
            alt={userName}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-400" />
        )}
        <span className="text-sm font-medium text-gray-900">{userName}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 6l4 4 4-4"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </header>
  );
}
