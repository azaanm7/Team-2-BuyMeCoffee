"use client";

import { useState, useRef, useEffect } from "react";

const PERIODS = [
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "All time", value: "all" },
];

interface EarningsCardProps {
  earnings: Record<string, number>;
}

export default function EarningsCard({ earnings }: EarningsCardProps) {
  const [selected, setSelected] = useState(PERIODS[0]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-medium text-sm">Earnings</span>
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 border border-gray-200 rounded-md px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
          >
            {selected.label}
            <span className="text-gray-400 text-xs">▾</span>
          </button>
          {open && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-md z-10 min-w-35 py-1">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    setSelected(p);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-gray-50 text-left"
                >
                  {p.label}
                  {selected.value === p.value && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="text-3xl font-medium">
        ${(earnings[selected.value] ?? 0).toLocaleString()}
      </p>
    </div>
  );
}
