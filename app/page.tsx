"use client";

import CreatorCard from "@/app/components/CreatorCard";
import EarningsCard from "@/app/components/EarningsCard";
import TransactionList from "@/app/components/TransactionList";
import { Transaction } from "@/app/components/TransactionList";
import Header from "./components/Header";
import { PageButtons } from "./components/PageButtons";
import { useUser } from "@/app/components/UserProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EarningsCardSkeleton from "@/app/components/EarningsCardSkeleton";
import TransactionListSkeleton from "@/app/components/TransactionListSkeleton";

type Earnings = {
  "30d": number;
  "90d": number;
  all: number;
};

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [earnings, setEarnings] = useState<Earnings>({
    "30d": 0,
    "90d": 0,
    all: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const pageUrl = user?.username
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/${user.username}`
    : "";

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
        if (dashboardRes.ok) {
          const data = await dashboardRes.json();
          setEarnings(data.earnings);
          setTransactions(data.transactions);
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (userLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <PageButtons />
        <main className="flex-1 p-6 max-w-3xl w-full mx-auto flex flex-col gap-5">
          <CreatorCard
            name={user?.name || "Creator"}
            username={user?.username || "yourpage"}
            avatarUrl={user?.avatarImage || undefined}
          />
          {loading ? (
            <>
              <EarningsCardSkeleton />
              <TransactionListSkeleton />
            </>
          ) : (
            <>
              <EarningsCard earnings={earnings} />
              <TransactionList transactions={transactions} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
