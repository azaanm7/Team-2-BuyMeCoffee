"use client";

import { Camera } from "lucide-react";

type Props = {
  editName: string;
  editAbout: string;
  editSocialUrl: string;
  editPhoto: string | null;
  photoUploadError: string | null;
  isSavingProfile: boolean;
  photoInputRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onPhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (name: string) => void;
  onAboutChange: (about: string) => void;
  onSocialUrlChange: (url: string) => void;
  onSave: () => void;
};

export function EditProfileModal({
  editName,
  editAbout,
  editSocialUrl,
  editPhoto,
  photoUploadError,
  isSavingProfile,
  photoInputRef,
  onClose,
  onPhotoSelect,
  onNameChange,
  onAboutChange,
  onSocialUrlChange,
  onSave,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-gray-900">Edit profile</h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Make changes to your profile here. Click save when you&apos;re done.
        </p>

        <p className="text-sm font-semibold text-gray-800 mb-2">Add photo</p>
        <button
          type="button"
          onClick={() => photoInputRef.current?.click()}
          className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center mb-4 hover:border-gray-400 transition group"
        >
          {editPhoto ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={editPhoto}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="h-6 w-6 text-gray-400" />
          )}
          <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <Camera className="h-5 w-5 text-white" />
          </div>
        </button>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPhotoSelect}
        />
        {photoUploadError && (
          <p className="text-xs text-red-600 mb-3">{photoUploadError}</p>
        )}

        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Name
        </label>
        <input
          type="text"
          value={editName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 mb-4"
        />

        <label className="block text-sm font-semibold text-gray-800 mb-1">
          About
        </label>
        <textarea
          value={editAbout}
          onChange={(e) => onAboutChange(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 resize-y mb-4"
        />

        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Social media URL
        </label>
        <input
          type="url"
          value={editSocialUrl}
          onChange={(e) => onSocialUrlChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 mb-6"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSavingProfile}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
          >
            {isSavingProfile ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
