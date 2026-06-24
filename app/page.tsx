"use client";

import CreatorCard from "@/app/components/CreatorCard";
import EarningsCard from "@/app/components/EarningsCard";
import TransactionList from "@/app/components/TransactionList";
import { Transaction } from "@/app/components/TransactionList";
import Header from "./components/Header";
import { PageButtons } from "./components/PageButtons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import EarningsCardSkeleton from "@/app/components/EarningsCardSkeleton";
import TransactionListSkeleton from "@/app/components/TransactionListSkeleton";

type Earnings = {
  "30d": number;
  "90d": number;
  all: number;
};

export default function DashboardPage() {
  useSession();
  const [pageUrl, setPageUrl] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [earnings, setEarnings] = useState<Earnings>({
    "30d": 0,
    "90d": 0,
    all: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, dashboardRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/dashboard"),
        ]);

        if (profileRes.ok) {
          const profile = await profileRes.json();
          if (profile) {
            if (profile.socialMediaURL) {
              setPageUrl(profile.socialMediaURL.replace(/^https?:\/\//, ""));
            }
            setCreatorName(profile.name || "");
            setAvatarUrl(profile.avatarImage || undefined);
          }
        }

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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <PageButtons />
        <main className="flex-1 p-6 max-w-3xl w-full mx-auto flex flex-col gap-5">
          <CreatorCard
            name={creatorName || "Creator"}
            pageUrl={pageUrl || "buymeacoffee.com/yourpage"}
            avatarUrl={avatarUrl}
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
