/* eslint-disable react-hooks/refs */
"use client";

import { useEffect, useRef, useState } from "react";

type QrCodeModalProps = {
  qrCodeImage: string; // data URI from /api/payment/generate
  transactionId: string;
  onClose: () => void;
  onComplete: () => void;
};

export default function QrCodeModal({
  qrCodeImage,
  transactionId,
  onClose,
  onComplete,
}: QrCodeModalProps) {
  const [status, setStatus] = useState<"PENDING" | "COMPLETED" | "FAILED">(
    "PENDING",
  );
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch(
          `/api/payment/status?transactionId=${transactionId}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;

        if (data.status === "COMPLETED") {
          setStatus("COMPLETED");
          onCompleteRef.current();
        } else if (data.status === "FAILED") {
          setStatus("FAILED");
        }
      } catch {
        // network hiccup, just try again on next interval
      }
    };

    const interval = setInterval(poll, 3000);
    poll();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [transactionId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl leading-none text-gray-400 hover:text-gray-600"
        >
          ×
        </button>

        {status === "PENDING" && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Scan QR code
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Scan the QR code to complete your donation
            </p>
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCodeImage} alt="QR Code" width={150} height={150} />
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Waiting for payment confirmation…
            </p>
          </>
        )}

        {status === "COMPLETED" && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-2xl text-green-600">
              ✓
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Payment received
            </h2>
            <p className="text-sm text-gray-500 mt-1">Thank you!</p>
          </>
        )}

        {status === "FAILED" && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-2xl text-red-600">
              ✕
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payment failed</h2>
            <p className="text-sm text-gray-500 mt-1">Please try again.</p>
          </>
        )}
      </div>
    </div>
  );
}
