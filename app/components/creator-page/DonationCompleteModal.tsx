import { CheckCircle } from "lucide-react";
import CreatorAvatar from "./CreatorAvatar";

type DonationCompleteModalProps = {
  creatorName: string;
  creatorAvatarUrl?: string | null;
  successMessage: string;
  onClose: () => void;
};

export default function DonationCompleteModal({
  creatorName,
  creatorAvatarUrl,
  successMessage,
  onClose,
}: DonationCompleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl leading-none text-gray-400 hover:text-gray-600"
        >
          ×
        </button>

        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          Donation Complete!
        </h2>

        <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 text-left">
          <CreatorAvatar
            name={creatorName}
            avatarUrl={creatorAvatarUrl}
            size={36}
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {creatorName}:
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              {successMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
