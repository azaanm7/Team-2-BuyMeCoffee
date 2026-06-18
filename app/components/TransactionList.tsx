/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Amount from "./Amount";

export interface Transaction {
  id: number;
  name: string;
  source: string;
  amount: number;
  time: string;
  message?: string;
  avatarUrl?: string;
  initials?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

function Avatar({ txn }: { txn: Transaction }) {
  if (txn.avatarUrl) {
    return (
      <img
        src={txn.avatarUrl}
        alt={txn.name}
        className="w-8 h-8 rounded-full object-cover shrink-0"
      />
    );
  }
  if (txn.initials) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-xs font-medium flex items-center justify-center shrink-0">
        {txn.initials}
      </div>
    );
  }
  const gradients = [
    "from-pink-400 to-violet-400",
    "from-violet-400 to-blue-400",
    "from-emerald-400 to-cyan-400",
    "from-orange-400 to-pink-400",
  ];
  return (
    <div
      className={`w-8 h-8 rounded-full bg-linear-to-br ${gradients[txn.id % gradients.length]} shrink-0`}
    />
  );
}

function TransactionItem({ txn }: { txn: Transaction }) {
  const [expanded, setExpanded] = useState(false);
  const SHORT_LIMIT = 120;
  const isLong = txn.message && txn.message.length > SHORT_LIMIT;

  return (
    <div className="py-3.5 border-t border-gray-100 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-3">
        <Avatar txn={txn} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{txn.name}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{txn.source}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-medium">+ ${txn.amount}</p>
          <p className="text-xs text-gray-400 mt-0.5">{txn.time}</p>
        </div>
      </div>
      {txn.message && (
        <p className="text-sm text-gray-500 mt-2 pl-11 leading-relaxed">
          {!expanded && isLong
            ? `${txn.message.slice(0, SHORT_LIMIT)}… `
            : `${txn.message} `}
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="font-medium text-gray-800 underline"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </p>
      )}
    </div>
  );
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  const [activeFilters, setActiveFilters] = useState<number[]>([]);

  const filtered =
    activeFilters.length === 0
      ? transactions
      : transactions.filter((t) => activeFilters.includes(t.amount));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium">Recent transactions</h2>
        <Amount onChange={setActiveFilters} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl px-6 py-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xl">♡</span>
            </div>
            <p className="text-sm font-medium text-gray-800">
              You don&apos;t have any supporters yet
            </p>
            <p className="text-sm text-gray-400">
              Share your page with your audience to get started.
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((txn) => (
              <TransactionItem key={txn.id} txn={txn} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
