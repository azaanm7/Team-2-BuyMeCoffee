"use client";

import CreatorCard from "@/app/components/CreatorCard";
import EarningsCard from "@/app/components/EarningsCard";
import type { DailyEarning } from "@/app/components/EarningsCard";
import TransactionList, {
  type Transaction,
} from "@/app/components/TransactionList";
import StatCard from "@/app/components/dashboard/StatCard";
import DashboardSkeleton from "@/app/components/dashboard/DashboardSkeleton";
import Header from "./components/Header";
import { PageButtons } from "./components/PageButtons";
import { useUser } from "@/app/components/UserProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, ReceiptText, UsersRound } from "lucide-react";

type DashboardData = {
  earnings: { "30d": number; "90d": number; all: number };
  stats: { supporters: number; donations: number };
  dailyEarnings: DailyEarning[];
  transactions: Transaction[];
};

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/signup");
    }
  }, [userLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const dashboardRes = await fetch("/api/dashboard");
        if (!dashboardRes.ok) throw new Error("Dashboard request failed");
        const data = (await dashboardRes.json()) as DashboardData;
        setDashboardData(data);
        setLoadError(false);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, retryCount]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <PageButtons />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 md:p-6">
          {userLoading || !user || loading ? (
            <DashboardSkeleton />
          ) : loadError || !dashboardData ? (
            <div
              role="alert"
              className="rounded-xl border border-gray-200 bg-white p-6 text-center"
            >
              <p className="text-sm font-medium">Dashboard data is unavailable.</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setRetryCount((count) => count + 1);
                }}
                className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <CreatorCard
                name={user.name || "Creator"}
                username={user.username || "yourpage"}
                avatarUrl={user.avatarImage || undefined}
              />
              <section
                aria-label="Dashboard statistics"
                className="grid grid-cols-2 gap-3 lg:grid-cols-4"
              >
                <StatCard
                  label="Total earnings"
                  value={`$${dashboardData.earnings.all.toLocaleString()}`}
                  Icon={DollarSign}
                />
                <StatCard
                  label="Last 30 days"
                  value={`$${dashboardData.earnings["30d"].toLocaleString()}`}
                  Icon={DollarSign}
                />
                <StatCard
                  label="Supporters"
                  value={dashboardData.stats.supporters.toLocaleString()}
                  Icon={UsersRound}
                />
                <StatCard
                  label="Donations"
                  value={dashboardData.stats.donations.toLocaleString()}
                  Icon={ReceiptText}
                />
              </section>
              <EarningsCard dailyEarnings={dashboardData.dailyEarnings} />
              <TransactionList transactions={dashboardData.transactions} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
