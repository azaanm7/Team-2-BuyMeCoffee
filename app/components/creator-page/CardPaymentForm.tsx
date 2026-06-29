"use client";

import { useState } from "react";
import { SavedCard, useSavedCard } from "./UseSavedCard";

const MONTHS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
const YEARS = Array.from({ length: 20 }, (_, i) =>
  String(new Date().getFullYear() + i),
);

type CardPaymentFormProps = {
  amount: number;
  disabled: boolean;
  onPay: () => void;
};

function formatCardNumber(val: string) {
  return val
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1/")
    .replace(/\/$/, "");
}

function parseExpiry(expiryDate: string) {
  const d = new Date(expiryDate);
  return {
    month: String(d.getMonth() + 1).padStart(2, "0"),
    year: String(d.getFullYear()),
  };
}

// Outer component just waits for the saved card to load. Once it's ready,
// the inner form mounts fresh with that data as its actual initial state —
// no effect needed to "catch up" state after the fact.
export default function CardPaymentForm(props: CardPaymentFormProps) {
  const { card, loading } = useSavedCard();

  if (loading) {
    return <p className="mt-10 text-sm text-gray-400">Loading your card...</p>;
  }

  return <CardForm {...props} initialCard={card} />;
}

function CardForm({
  amount,
  disabled,
  onPay,
  initialCard,
}: CardPaymentFormProps & { initialCard: SavedCard | null }) {
  const initialExpiry = initialCard
    ? parseExpiry(initialCard.expiryDate)
    : null;

  const [name, setName] = useState(
    initialCard ? `${initialCard.firstName} ${initialCard.lastName}` : "",
  );
  const [cardNumber, setCardNumber] = useState(
    initialCard ? formatCardNumber(initialCard.cardNumber) : "",
  );
  const [month, setMonth] = useState(initialExpiry?.month ?? "");
  const [year, setYear] = useState(initialExpiry?.year ?? "");
  const [cvc, setCvc] = useState("");

  return (
    <div className="mt-10 flex flex-col gap-6 text-left">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-800">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First Last"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-400"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-800">Card number</label>
        <input
          inputMode="numeric"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="XXXX/XXXX/XXXX/XXXX"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-400"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-800">
            Expires
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400"
          >
            <option value="">Month</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-800">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400"
          >
            <option value="">Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-800">
            CVC
          </label>
          <input
            inputMode="numeric"
            maxLength={4}
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
            placeholder="CVC"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-400"
          />
        </div>
      </div>

      <button
        onClick={onPay}
        disabled={disabled}
        className="self-end rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}
