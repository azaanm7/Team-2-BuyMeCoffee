"use client";

import { useState } from "react";
import { Camera, Coffee, Heart } from "lucide-react";

const AMOUNTS = [1, 2, 5, 10] as const;

export default function CoffeeProfilePage() {
  const [amount, setAmount] = useState<number>(5);
  const [url, setUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const canSupport = url.trim().length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Cover */}
      <div className=" h-[380px] w-full bg-[#40b495] z-0">
        <button className="absolute right-6 top-6 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50">
          <Camera className="h-4 w-4" />
          Change cover
        </button>
      </div>

      {/* Content — overlaps the cover */}
      <div className="relative mx-auto -mt-[110px] grid max-w-6xl grid-cols-1 gap-6 px-6 pb-16 lg:grid-cols-2 z-index-10">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Profile card */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=200&q=80"
                  alt="Jake"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <h2 className="text-xl font-bold text-gray-900">Jake</h2>
              </div>
              <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-200">
                Edit page
              </button>
            </div>

            <hr className="my-5 border-gray-200" />

            <h3 className="mb-3 text-base font-bold text-gray-900">
              About Jake{" "}
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              I&apos;m a typical person who enjoys exploring different things. I
              also make music art as a hobby. Follow me along.
            </p>
          </section>

          {/* Social media URL card */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-base font-bold text-gray-900">
              Social media URL
            </h3>
            <a
              href="https://buymeacoffee.com/spacerulz44"
              className="text-sm text-gray-700 hover:underline"
            >
              https://buymeacoffee.com/spacerulz44
            </a>
          </section>

          {/* Recent supporters card */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-gray-900">
              Recent Supporters
            </h3>
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 py-12">
              <Heart className="h-7 w-7 fill-gray-900 text-gray-900" />
              <p className="text-base font-bold text-gray-900">
                Be the first one to support Jake
              </p>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Buy Jake a Coffee
          </h2>

          {/* Amount selector */}
          <p className="mb-3 text-sm font-medium text-gray-900">
            Select amount:
          </p>
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
                  <Coffee className="h-4 w-4" />${value}
                </button>
              );
            })}
          </div>

          {/* URL input */}
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Enter BuyMeCoffee or social acount URL:
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="buymeacoffee.com/"
            className="mb-5 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900"
          />

          {/* Message */}
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

          {/* Support button */}
          <button
            disabled={!canSupport}
            className={`w-full rounded-lg py-3 text-sm font-medium transition ${
              canSupport
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "cursor-not-allowed bg-gray-300 text-white"
            }`}
          >
            Support
          </button>
        </section>
      </div>
    </div>
  );
}
