"use client";

import { useState } from "react";

type Props = {
  qrUrl: string;
  onClose: () => void;
};

export function QRModal({ qrUrl, onClose }: Props) {
  const [loaded, setLoaded] = useState(false);
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    qrUrl.startsWith("http") ? qrUrl : `https://${qrUrl}`,
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl leading-none text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Scan QR code</h2>
        <p className="text-sm text-gray-500 mb-6">
          Scan the QR code to complete your donation
        </p>
        <div className="flex justify-center">
          <div className="relative w-37.5 h-37.5">
            {!loaded && (
              <div className="absolute inset-0 animate-pulse rounded-lg bg-gray-200" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="QR Code"
              width={150}
              height={150}
              className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setLoaded(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
