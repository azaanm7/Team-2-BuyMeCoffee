"use client";

import { useRouter } from "next/navigation";

const name = "Jake";
const photo = "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=200&q=80";

export default function DonationCompletePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Checkmark circle */}
      <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
        <svg
          className="h-8 w-8 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Donation Complete !
      </h1>

      {/* Creator thank-you card */}
      <div className="w-full max-w-md rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          {photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photo}
              alt={name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
              {name[0]}
            </div>
          )}
          <span className="text-sm font-medium text-gray-900">{name}:</span>
        </div>
        <p className="text-sm text-gray-700">
          Thank you for supporting me! It means a lot to have your support.
          It&apos;s a step toward creating a more inclusive and accepting
          community of artists.
        </p>
      </div>

      <button
        onClick={() => router.push("/donation")}
        className="mt-8 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
      >
        Return to explore
      </button>
    </div>
  );
}
