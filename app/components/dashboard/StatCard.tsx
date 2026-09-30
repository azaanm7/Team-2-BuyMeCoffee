import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  Icon: LucideIcon;
};

export default function StatCard({ label, value, Icon }: StatCardProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
        <Icon size={19} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-gray-500">{label}</p>
        <p className="mt-0.5 truncate text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}