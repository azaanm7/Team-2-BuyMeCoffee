"use client";

import { useEffect, useState } from "react";
import TopBar from "@/app/components/TopBar";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

type Supporter = {
  id: number;
  name: string;
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
    amount: 5,
    message: "Thank you for being so awesome everyday!",
  },
  {
    id: 3,
    name: "Jake",
    amount: 10,
  },
  {
    id: 4,
    name: "Guest",
    amount: 2,
    message:
      "Thank you for being so awesome everyday! You always manage to brighten up my day when I'm feeling down. Although $1 isn't that much money it's all I can contribute at the moment. When I become successful I will be sure to buy you more gifts and donations. Thank you again.",
  },
];

const AMOUNTS = [1, 2, 5, 10];
const INITIAL_SHOW = 3;

function AvatarCircle({
  name,
  initials,
  size = 36,
}: {
  name: string;
  initials?: string;
  size?: number;
}) {
  const letters =
    initials ??
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div
      className="rounded-full bg-gray-200 flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <span
        className="font-medium text-gray-600"
        style={{ fontSize: size * 0.35 }}
      >
        {letters}
      </span>
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
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"PENDING" | "COMPLETED">(
    "PENDING",
  );
  const [showModal, setShowModal] = useState(false);
  const [paymentTab, setPaymentTab] = useState<"CARD" | "QPAY">("CARD");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const supporters = MOCK_SUPPORTERS;
  const visibleSupporters = showAll
    ? supporters
    : supporters.slice(0, INITIAL_SHOW);
  const hasMore = supporters.length > INITIAL_SHOW;

  const handleSupport = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/payment/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedAmount }),
      });
      if (!res.ok) throw new Error("Failed to generate payment");
      const data = await res.json();
      setQrCodeUrl(data.qrCodeUrl);
      setTransactionId(data.transactionId);
      setPaymentStatus("PENDING");
      setPaymentTab("CARD");
      setShowModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCardPayment = async () => {
    if (!transactionId) return;
    try {
      await fetch("/api/payment/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, paymentType: "CARD" }),
      });
      setPaymentStatus("COMPLETED");
    } catch {
      console.error("Failed to complete card payment");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setQrCodeUrl(null);
    setTransactionId(null);
    setPaymentStatus("PENDING");
    setPaymentTab("CARD");
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
  };

  useEffect(() => {
    if (!showModal || !transactionId || paymentStatus === "COMPLETED") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/payment/status?transactionId=${transactionId}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === "COMPLETED") {
          setPaymentStatus("COMPLETED");
        }
      } catch {
        console.error("Failed to check payment status");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [showModal, transactionId, paymentStatus]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar userName="Jake" />

      {/* Banner — no image file needed */}
      <div className="w-full h-52 bg-linear-to-r from-blue-900 via-indigo-900 to-purple-900" />

      {/* Two-column layout */}
      <div className="max-w-5xl mx-auto w-full px-6 pb-16">
        <div className="grid grid-cols-[1fr_440px] gap-5 -mt-14 relative z-10">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            {/* Creator identity */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <AvatarCircle name="Space ranger" size={44} />
                <span className="font-bold text-lg text-gray-900">
                  Space ranger
                </span>
              </div>
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

            {/* Social media */}
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
              <p className="text-sm font-semibold text-gray-900 mb-1.5">
                Social media URL
              </p>
              <p className="text-sm text-gray-500">
                https://buymeacoffee.com/spacerulz44
              </p>
            </div>

            {/* Recent Supporters */}
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
              <p className="text-sm font-semibold text-gray-900 mb-4">
                Recent Supporters
              </p>

              {supporters.length === 0 ? (
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

          {/* Right column — Buy coffee form */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Buy Space ranger a Coffee
            </h2>

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
              disabled={isGenerating}
              className="w-full py-3 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {isGenerating ? "Generating..." : "Support"}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              ✕
            </button>

            {paymentStatus === "PENDING" ? (
              <>
                <h2 className="text-lg font-bold text-gray-900">
                  Pay ${selectedAmount}
                </h2>

                {/* Tabs */}
                <div className="mt-5 flex rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setPaymentTab("CARD")}
                    className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                      paymentTab === "CARD"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Card
                  </button>
                  <button
                    onClick={() => setPaymentTab("QPAY")}
                    className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                      paymentTab === "QPAY"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Q Pay
                  </button>
                </div>

                {paymentTab === "CARD" ? (
                  <div className="mt-6 flex flex-col gap-3 text-left">
                    <div>
                      <label className="mb-1.5 block text-sm text-gray-700">
                        Name on card
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors placeholder-gray-400 focus:border-gray-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm text-gray-700">
                        Card number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors placeholder-gray-400 focus:border-gray-400"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="mb-1.5 block text-sm text-gray-700">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors placeholder-gray-400 focus:border-gray-400"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="mb-1.5 block text-sm text-gray-700">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="123"
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors placeholder-gray-400 focus:border-gray-400"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleCardPayment}
                      className="mt-2 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
                    >
                      Pay ${selectedAmount}
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="mt-4 text-sm text-gray-500">
                      Scan this QR code with your phone to complete the payment.
                    </p>
                    {qrCodeUrl && (
                      <Image
                        src={qrCodeUrl}
                        width={260}
                        height={260}
                        alt="Payment QR code"
                        unoptimized
                        className="mx-auto mt-6"
                      />
                    )}
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
                      Waiting for payment…
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Payment successful
                </h2>
                <p className="mt-2 text-gray-600">
                  Thank you for your support of ${selectedAmount}!
                </p>
                <button
                  onClick={closeModal}
                  className="mt-6 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-700"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
