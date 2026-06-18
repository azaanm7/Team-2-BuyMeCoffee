"use client";

import { useState, useRef, useEffect } from "react";

const AMOUNTS = [1, 2, 5, 10];

interface PageButtonsProps {
  onChange: (selected: number[]) => void;
}

export default function Amount({ onChange }: PageButtonsProps) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<number[]>([]);
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

  const toggle = (amount: number) => {
    const next = checked.includes(amount)
      ? checked.filter((a) => a !== amount)
      : [...checked, amount];
    setChecked(next);
    onChange(next);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <span className="text-xs">▾</span>
        Amount
        {checked.length > 0 && (
          <span className="ml-1 text-xs font-medium text-gray-800 bg-gray-100 rounded px-1.5 py-0.5">
            {checked.map((a) => `$${a}`).join(", ")}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-md z-10 min-w-27.5 py-1">
          {AMOUNTS.map((amount) => (
            <label
              key={amount}
              className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={checked.includes(amount)}
                onChange={() => toggle(amount)}
                className="w-3.5 h-3.5 accent-gray-900 cursor-pointer"
              />
              ${amount}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
