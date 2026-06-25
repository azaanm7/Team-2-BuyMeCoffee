/* eslint-disable @next/next/no-img-element */
"use client";

type CreatorAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  size?: number;
};

export default function CreatorAvatar({
  name,
  avatarUrl,
  size = 40,
}: CreatorAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-600 font-bold uppercase"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name[0] ?? "?"}
    </div>
  );
}
