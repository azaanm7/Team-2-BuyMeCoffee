"use client";

import { useRouter } from "next/navigation";
import { Coffee, CheckCircle } from "lucide-react";
import Header from "@/app/components/Header";

export default function DonationCompletePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Thank you for your support!
        </h1>
        <p className="text-gray-500 text-base mb-8 max-w-sm">
          Your coffee has been delivered. The creator appreciates your kindness.
        </p>
        <div className="flex items-center gap-2 text-gray-400 mb-10">
          <Coffee className="h-5 w-5" />
          <span className="text-sm">Buy Me Coffee</span>
        </div>
        <button
          onClick={() => router.push("/donation")}
          className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Back to profile
        </button>
      </div>
    </div>
  );
}
