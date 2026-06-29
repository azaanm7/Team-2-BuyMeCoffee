"use client";

import { AMOUNTS } from "./types";

type Props = {
  profileName: string;
  amount: number;
  url: string;
  message: string;
  isSubmitting: boolean;
  isLoading: boolean;
  canSupport: boolean;
  onAmountChange: (amount: number) => void;
  onUrlChange: (url: string) => void;
  onMessageChange: (message: string) => void;
  onSupport: () => void;
};

export function DonationForm({
  profileName,
  amount,
  url,
  message,
  isSubmitting,
  isLoading,
  canSupport,
  onAmountChange,
  onUrlChange,
  onMessageChange,
  onSupport,
}: Props) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="h-7 w-52 rounded bg-gray-200 animate-pulse mb-6" />
        <div className="h-3 w-24 rounded bg-gray-200 animate-pulse mb-3" />
        <div className="mb-6 flex flex-wrap gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-9 w-20 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
        <div className="h-3 w-56 rounded bg-gray-200 animate-pulse mb-2" />
        <div className="h-11 w-full rounded-lg bg-gray-200 animate-pulse mb-5" />
        <div className="h-3 w-32 rounded bg-gray-200 animate-pulse mb-2" />
        <div className="h-28 w-full rounded-lg bg-gray-200 animate-pulse mb-6" />
        <div className="h-11 w-full rounded-lg bg-gray-200 animate-pulse" />
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Buy {profileName} a Coffee
      </h2>

      <p className="mb-3 text-sm font-medium text-gray-900">Select amount:</p>
      <div className="mb-6 flex flex-wrap gap-3">
        {AMOUNTS.map((value) => {
          const selected = amount === value;
          return (
            <button
              key={value}
              onClick={() => onAmountChange(value)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                selected
                  ? "border-gray-900 bg-gray-100 text-gray-900"
                  : "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ☕ ${value}
            </button>
          );
        })}
      </div>

      <label className="mb-2 block text-sm font-medium text-gray-900">
        Enter BuyMeCoffee or social account URL:
      </label>
      <input
        type="text"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="buymeacoffee.com/"
        className="mb-5 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900"
      />

      <label className="mb-2 block text-sm font-medium text-gray-900">
        Special message:
      </label>
      <textarea
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Please write your message here"
        rows={4}
        className="mb-6 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900"
      />

      <button
        disabled={!canSupport || isSubmitting}
        onClick={onSupport}
        className={`w-full rounded-lg py-3 text-sm font-medium transition ${
          canSupport && !isSubmitting
            ? "bg-gray-900 text-white hover:bg-gray-800"
            : "cursor-not-allowed bg-gray-300 text-white"
        }`}
      >
        {isSubmitting ? "Processing..." : "Support"}
      </button>
    </section>
  );
}
