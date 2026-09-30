"use client";

import { useState, useRef, useEffect } from "react";

const PERIODS = [
  { label: "Last 7 days", value: "7d", days: 7 },
  { label: "Last 30 days", value: "30d", days: 30 },
  { label: "Last 90 days", value: "90d", days: 90 },
];

export type DailyEarning = {
  date: string;
  amount: number;
};

interface EarningsCardProps {
  dailyEarnings: DailyEarning[];
}

export default function EarningsCard({ dailyEarnings }: EarningsCardProps) {
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

  const points = dailyEarnings.slice(-selected.days);
  const total = points.reduce((sum, point) => sum + point.amount, 0);
  const maxAmount = Math.max(...points.map((point) => point.amount), 1);
  const coordinates = points.map((point, index) => ({
    ...point,
    x: points.length === 1 ? 310 : 34 + (index / (points.length - 1)) * 552,
    y: 142 - (point.amount / maxAmount) * 104,
  }));
  const linePath = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = coordinates.length
    ? `${linePath} L ${coordinates.at(-1)?.x} 146 L ${coordinates[0].x} 146 Z`
    : "";
  const markerInterval = Math.max(1, Math.ceil(coordinates.length / 8));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">Earnings</h2>
          <p className="mt-1 text-xs text-gray-500">${total.toLocaleString()} in this period</p>
        </div>
        <div className="relative" ref={ref}>
          <button
            type="button"
            aria-expanded={open}
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
                  type="button"
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
      {total > 0 ? (
        <div className="w-full overflow-hidden">
          <svg
            className="h-44 w-full overflow-visible text-gray-300 dark:text-zinc-600"
            viewBox="0 0 620 180"
            preserveAspectRatio="none"
            role="img"
            aria-label={`Daily earnings over the ${selected.label.toLowerCase()}`}
          >
            {[38, 74, 110, 146].map((y) => (
              <line
                key={y}
                x1="34"
                x2="586"
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.45"
                strokeDasharray="3 5"
              />
            ))}
            <path d={areaPath} fill="rgb(217 119 6 / 0.12)" />
            <path
              d={linePath}
              fill="none"
              stroke="#d97706"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {coordinates.map((point, index) =>
              index % markerInterval === 0 || index === coordinates.length - 1 ? (
                <circle
                  key={point.date}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="#d97706"
                >
                  <title>{`${point.date}: $${point.amount.toLocaleString()}`}</title>
                </circle>
              ) : null,
            )}
            {[coordinates[0], coordinates[Math.floor(coordinates.length / 2)], coordinates.at(-1)].map(
              (point, index) =>
                point ? (
                  <text
                    key={`${point.date}-${index}`}
                    x={point.x}
                    y="172"
                    textAnchor={index === 0 ? "start" : index === 2 ? "end" : "middle"}
                    fill="currentColor"
                    fontSize="10"
                    opacity="0.75"
                  >
                    {point.date.slice(5)}
                  </text>
                ) : null,
            )}
          </svg>
        </div>
      ) : (
        <div className="flex h-44 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-500">
          No earnings in this period
        </div>
      )}
    </div>
  );
}
