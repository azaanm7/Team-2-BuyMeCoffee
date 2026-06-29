"use client";

import { useState } from "react";
import { useTransactionPayment } from "./UserTransactionPayment";
import QPayDisplay from "./QPayDisplay";
import CardPaymentForm from "./CardPaymentForm";

type Tab = "CARD" | "QPAY";

type PaymentModalProps = {
  amount: number;
  onClose: () => void;
  onCompleted: (transactionId: string) => void;
};

export default function PaymentModal({
  amount,
  onClose,
  onCompleted,
}: PaymentModalProps) {
  const [tab, setTab] = useState<Tab>("CARD");
  const { status, qrCodeUrl, payByCard } = useTransactionPayment(
    amount,
    onCompleted,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold text-gray-900">Pay ${amount}</h2>

        <div className="mt-5 flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setTab("CARD")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              tab === "CARD"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Card
          </button>
          <button
            onClick={() => setTab("QPAY")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              tab === "QPAY"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Q Pay
          </button>
        </div>

        {tab === "CARD" ? (
          <CardPaymentForm
            amount={amount}
            disabled={status !== "pending"}
            onPay={payByCard}
          />
        ) : (
          <QPayDisplay qrCodeUrl={qrCodeUrl} />
        )}
      </div>
    </div>
  );
}
