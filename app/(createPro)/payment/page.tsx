"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";

const COUNTRIES = [
  "United States",
  "Australia",
  "Mongolia",
  "New Zealand",
  "United Kingdom",
];
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

export default function PaymentPage() {
  const router = useRouter();

  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{
    country?: string;
    firstName?: string;
    lastName?: string;
    cardNumber?: string;
    expiry?: string;
    cvc?: string;
  }>({});

  const formatCard = (val: string) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const validate = () => {
    const e: typeof errors = {};
    if (!country) e.country = "Please select country";
    if (!firstName.trim()) e.firstName = "Please enter first name";
    if (!lastName.trim()) e.lastName = "Please enter last name";
    if (cardNumber.replace(/\s/g, "").length < 16)
      e.cardNumber = "Invalid card number";
    if (!month || !year) e.expiry = "Invalid expiry date";
    if (cvc.length < 3) e.cvc = "Invalid CVC";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const res = await fetch("/api/bankcard", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country,
        firstName,
        lastName,
        cardNumber: cardNumber.replace(/\s/g, ""),
        month,
        year,
      }),
    });

    if (res.ok) {
      router.push("/home");
    } else {
      const data = await res.json();
      console.error("Failed to save payment:", data.error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500">Loading</p>
      </main>
    );
  }

  return (
    <div>
      <Header />
      <main className="min-h-screen bg-white flex justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-md flex flex-col gap-5"
        >
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              How would you like to be paid?
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Enter your location and payment details
            </p>
          </div>

          {/* Country */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="country"
              className="text-sm font-semibold text-gray-800"
            >
              Select country
            </label>
            <div className="relative">
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`w-full appearance-none border rounded-md px-3 py-2 text-sm bg-white outline-none pr-8 transition-colors text-black
                ${errors.country ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
              >
                <option value="">Select</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronIcon />
            </div>
            {errors.country && (
              <p className="text-xs text-red-500">{errors.country}</p>
            )}
          </div>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="firstName"
                className="text-sm font-semibold text-gray-800"
              >
                First name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Enter your name here"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 text-sm placeholder-gray-400 outline-none transition-colors
                ${errors.firstName ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="lastName"
                className="text-sm font-semibold text-gray-800"
              >
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Enter your name here"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 text-sm placeholder-gray-400 outline-none transition-colors
                ${errors.lastName ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Card number */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="cardNumber"
              className="text-sm font-semibold text-gray-800"
            >
              Enter card number
            </label>
            <input
              id="cardNumber"
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCard(e.target.value))}
              className={`w-full border rounded-md px-3 py-2 text-sm placeholder-gray-400 outline-none transition-colors text-black
              ${errors.cardNumber ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
            />
            {errors.cardNumber && (
              <p className="text-xs text-red-500">{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiry + CVC */}
          <div className="flex gap-3 items-start">
            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-sm font-semibold text-gray-800">
                Expires
              </span>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className={`w-full appearance-none border rounded-md px-2 py-2 text-sm bg-white outline-none pr-6 transition-colors text-black
                    ${errors.expiry && !month ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
                <div className="relative flex-1">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={`w-full appearance-none border rounded-md px-2 py-2 text-sm bg-white outline-none pr-6 transition-colors text-black
                    ${errors.expiry && !year ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
                  >
                    <option value="">Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
              </div>
              {errors.expiry && (
                <p className="text-xs text-red-500">{errors.expiry}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 w-24">
              <label
                htmlFor="cvc"
                className="text-sm font-semibold text-gray-800"
              >
                CVC
              </label>
              <input
                id="cvc"
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                className={`w-full border rounded-md px-3 py-2 text-sm placeholder-gray-400 outline-none transition-colors text-black
                ${errors.cvc ? "border-red-400" : "border-gray-300 focus:border-gray-500"}`}
              />
              {errors.cvc && (
                <p className="text-xs text-red-500">{errors.cvc}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gray-300 hover:bg-gray-400 text-white text-sm font-semibold rounded-md transition-colors"
          >
            Continue
          </button>
        </form>
      </main>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#888"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
