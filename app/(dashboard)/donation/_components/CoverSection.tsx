"use client";

import { useState, useEffect } from "react";
import { Camera } from "lucide-react";

type Props = {
  activeCover: string | null;
  savedCoverImage: string | null;
  pendingCover: string | null;
  isSavingCover: boolean;
  isLoading: boolean;
  coverUploadError: string | null;
  coverInputRef: React.RefObject<HTMLInputElement | null>;
  onCoverSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverSave: () => void;
  onCoverCancel: () => void;
};

export function CoverSection({
  activeCover,
  savedCoverImage,
  pendingCover,
  isSavingCover,
  isLoading,
  coverUploadError,
  coverInputRef,
  onCoverSelect,
  onCoverSave,
  onCoverCancel,
}: Props) {
  const [coverLoaded, setCoverLoaded] = useState(false);

  useEffect(() => {
    if (!activeCover) {
      setCoverLoaded(false);
      return;
    }
    setCoverLoaded(false);
    const img = new Image();
    img.onload = () => setCoverLoaded(true);
    img.src = activeCover;
  }, [activeCover]);

  return (
    <div
      className="relative h-95 w-full bg-[#40b495] overflow-hidden"
      style={
        activeCover && coverLoaded
          ? {
              backgroundImage: `url(${activeCover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Profile loading үед cover area skeleton */}
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-200/60" />
      )}

      {/* Cover image ачааллагдаагүй үед skeleton */}
      {!isLoading && activeCover && !coverLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}

      {coverUploadError && (
        <p className="absolute left-1/2 top-4 -translate-x-1/2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white shadow">
          {coverUploadError}
        </p>
      )}
      {!isLoading && (
        pendingCover ? (
          <div className="absolute right-6 top-6 flex gap-2">
            <button
              onClick={onCoverSave}
              disabled={isSavingCover}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60"
            >
              {isSavingCover ? "Saving..." : "Save changes"}
            </button>
            <button
              onClick={onCoverCancel}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : savedCoverImage ? (
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute right-6 top-6 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50"
          >
            <Camera className="h-4 w-4" />
            Change cover
          </button>
        ) : (
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
          >
            <Camera className="h-4 w-4" />
            Add a cover image
          </button>
        )
      )}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onCoverSelect}
      />
    </div>
  );
}
