"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "generating" | "pending" | "completed";

export function useTransactionPayment(
  amount: number,
  onCompleted: (transactionId: string) => void,
) {
  const [status, setStatus] = useState<Status>("idle");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // Generate the transaction once when the modal opens — both tabs share
  // the same transactionId, so switching tabs doesn't create duplicates.
  useEffect(() => {
    let cancelled = false;

    async function generate() {
      setStatus("generating");
      try {
        const res = await fetch("/api/payment/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });
        if (!res.ok) throw new Error("Failed to generate payment");
        const data = await res.json();
        if (cancelled) return;
        setTransactionId(data.transactionId);
        setQrCodeUrl(data.qrCodeUrl);
        setStatus("pending");
      } catch {
        if (!cancelled) setStatus("idle");
      }
    }

    generate();
    return () => {
      cancelled = true;
    };
  }, [amount]);

  // Poll for QPay completion (the /pay/[id] page calls the webhook when
  // someone "scans" the QR code in this mock flow).
  useEffect(() => {
    if (status !== "pending" || !transactionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/payment/status?transactionId=${transactionId}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === "COMPLETED") {
          setStatus("completed");
          onCompleted(transactionId);
        }
      } catch {
        // Network hiccup — keep polling, don't surface an error mid-wait.
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [status, transactionId, onCompleted]);

  async function payByCard() {
    if (!transactionId) return;
    try {
      await fetch("/api/payment/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, paymentType: "CARD" }),
      });
      setStatus("completed");
      onCompleted(transactionId);
    } catch {
      // Leave status as pending — the Pay button stays clickable to retry.
    }
  }

  return { status, qrCodeUrl, payByCard };
}
