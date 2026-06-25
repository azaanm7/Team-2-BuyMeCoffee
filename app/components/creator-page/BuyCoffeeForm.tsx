"use client";

import { useState } from "react";

const AMOUNTS = [1, 2, 5, 10] as const;

type BuyCoffeeFormProps = {
  creatorName: string;
  onSubmit: (input: {
    amount: number;
    url: string;
    message: string;
  }) => Promise<void> | void;
};

export default function BuyCoffeeForm({
  creatorName,
  onSubmit,
}: BuyCoffeeFormProps) {
  const [amount, setAmount] = useState<number>(5);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSupport = url.trim().length > 0;

  async function handleSupport() {
    if (!canSupport || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ amount, url, message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Buy {creatorName} a Coffee
      </h2>

      <p className="mb-3 text-sm font-medium text-gray-900">Select amount:</p>
      <div className="mb-6 flex flex-wrap gap-3">
        {AMOUNTS.map((value) => {
          const selected = amount === value;
          return (
            <button
              key={value}
              onClick={() => setAmount(value)}
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
        onChange={(e) => setUrl(e.target.value)}
        placeholder="buymeacoffee.com/"
        className="mb-5 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900"
      />

      <label className="mb-2 block text-sm font-medium text-gray-900">
        Special message:
      </label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Please write your message here"
        rows={4}
        className="mb-6 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900"
      />

      <button
        disabled={!canSupport || isSubmitting}
        onClick={handleSupport}
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
