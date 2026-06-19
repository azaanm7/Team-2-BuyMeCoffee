"use client";

import { useState } from "react";
import TopBar from "@/app/components/TopBar";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

type Supporter = {
  id: number;
  name: string;
  avatarUrl?: string;
  initials?: string;
  amount: number;
  message?: string;
};

const MOCK_SUPPORTERS: Supporter[] = [
  {
    id: 1,
    initials: "CN",
    name: "Guest",
    amount: 1,
    message:
      "Thank you for being so awesome everyday! You always manage to brighten up my day when I'm feeling down. Although $1 isn't that much money it's all I can contribute at the moment.",
  },
  {
    id: 2,
    name: "John Doe",
    avatarUrl: "/avatars/john.png",
    amount: 5,
    message: "Thank you for being so awesome everyday!",
  },
  {
    id: 3,
    name: "Jake",
    avatarUrl: "/avatars/jake.png",
    amount: 10,
  },
  {
    id: 4,
    name: "Guest",
    avatarUrl: "/avatars/guest2.png",
    amount: 2,
    message:
      "Thank you for being so awesome everyday! You always manage to brighten up my day when I'm feeling down. Although $1 isn't that much money it's all I can contribute at the moment. When I become successful I will be sure to buy you more gifts and donations. Thank you again.",
  },
];

const AMOUNTS = [1, 2, 5, 10];
const INITIAL_SHOW = 3;

function AvatarCircle({
  name,
  avatarUrl,
  initials,
  size = 36,
}: {
  name: string;
  avatarUrl?: string;
  initials?: string;
  size?: number;
}) {
  return (
    <div
      className="rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="text-xs font-medium text-gray-500">
          {initials ?? name.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function ViewProfilePage() {
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [socialUrl, setSocialUrl] = useState("buymeacoffee.com/baconpancakes1");
  const [message, setMessage] = useState(
    "Thank you for being so awesome everyday!",
  );
  const [showAll, setShowAll] = useState(false);

  const supporters = MOCK_SUPPORTERS; // replace with real fetch
  const visibleSupporters = showAll
    ? supporters
    : supporters.slice(0, INITIAL_SHOW);
  const hasMore = supporters.length > INITIAL_SHOW;

  const handleSupport = () => {
    console.log("Support submitted", { selectedAmount, socialUrl, message });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar userName="Jake" />

      {/* Banner */}
      <div className="relative w-full h-52 bg-gray-900 overflow-hidden">
        <Image
          src="/banner-space.jpg"
          alt="Profile banner"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Two-column layout overlapping the banner */}
      <div className="max-w-5xl mx-auto w-full px-6 pb-16">
        <div className="grid grid-cols-[1fr_440px] gap-5 -mt-14 relative z-10">
          {/* ── Left column ── */}
          <div className="flex flex-col gap-4">
            {/* Creator identity card */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Name row with bottom divider */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <AvatarCircle
                  name="Space ranger"
                  avatarUrl="/avatars/space-ranger.png"
                  size={44}
                />
                <span className="font-bold text-lg text-gray-900">
                  Space ranger
                </span>
              </div>

              {/* About section */}
              <div className="px-5 py-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  About Space ranger
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  All day, every day, we&apos;re watching, listening to, reading
                  and absorbing politics. It&apos;s exhausting. We then report
                  on what we&apos;ve seen in a way that&apos;s as chill as
                  possible. None of the sensationalism and division you&apos;ll
                  find elsewhere. It&apos;s about clarity, focus,
                  approachability, and having a little wry smile almost all the
                  time.
                </p>
              </div>
            </div>

            {/* Social media URL card */}
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
              <p className="text-sm font-semibold text-gray-900 mb-1.5">
                Social media URL
              </p>
              <p className="text-sm text-gray-500">
                https://buymeacoffee.com/spacerulz44
              </p>
            </div>

            {/* Recent Supporters card */}
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
              <p className="text-sm font-semibold text-gray-900 mb-4">
                Recent Supporters
              </p>

              {supporters.length === 0 ? (
                /* Empty state */
                <div className="border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 py-10">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-gray-900"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-900">
                    Be the first one to support Jake
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4">
                    {visibleSupporters.map((s) => (
                      <div key={s.id} className="flex gap-3">
                        <AvatarCircle
                          name={s.name}
                          avatarUrl={s.avatarUrl}
                          initials={s.initials}
                          size={36}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">{s.name}</span>
                            {" bought "}
                            <span className="font-semibold">
                              ${s.amount} coffee
                            </span>
                          </p>
                          {s.message && (
                            <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                              {s.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {hasMore && (
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="mt-5 w-full flex items-center justify-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors"
                    >
                      {showAll ? (
                        <>
                          Show less <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          See more <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Right column — Buy coffee form ── */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Buy Space ranger a Coffee
            </h2>

            {/* Amount buttons */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">Select amount:</p>
              <div className="flex gap-2">
                {AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm border transition-colors ${
                      selectedAmount === amt
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-400 bg-white"
                    }`}
                  >
                    ☕ ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Social URL */}
            <div className="mb-4">
              <label className="text-sm text-gray-700 block mb-1.5">
                Enter BuyMeCoffee or social account URL:
              </label>
              <input
                type="text"
                value={socialUrl}
                onChange={(e) => setSocialUrl(e.target.value)}
                placeholder="buymeacoffee.com/baconpancakes1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors placeholder-gray-400"
              />
            </div>

            {/* Special message */}
            <div className="mb-5">
              <label className="text-sm text-gray-700 block mb-1.5">
                Special message:
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleSupport}
              className="w-full py-3 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
