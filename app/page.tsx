import Sidebar from "@/app/components/Sidebar";
import CreatorCard from "@/app/components/CreatorCard";
import EarningsCard from "@/app/components/EarningsCard";
import TransactionList from "@/app/components/TransactionList";
import { Transaction } from "@/app/components/TransactionList";
import TopBar from "./components/TopBar";

const MOCK_EARNINGS = {
  "30d": 450,
  "90d": 1240,
  all: 3870,
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    initials: "CN",
    name: "Guest",
    source: "instagram.com/welesley",
    amount: 1,
    time: "10 hours ago",
    message:
      "Thank you for being so awesome everyday! You always manage to brighten up my day when I'm feeling down. Although $1 isn't that much money it's all I can contribute at the moment",
  },
  {
    id: 2,
    name: "John Doe",
    source: "buymeacoffee.com/bdsadas",
    amount: 10,
    time: "10 hours ago",
    message: "Thank you for being so awesome everyday!",
  },
  {
    id: 3,
    initials: "CN",
    name: "Radicals",
    source: "buymeacoffee.com/gkfgrew",
    amount: 2,
    time: "10 hours ago",
  },
  {
    id: 4,
    name: "Guest",
    source: "facebook.com/penelopeb",
    amount: 5,
    time: "10 hours ago",
  },
  {
    id: 5,
    name: "Fan1",
    source: "buymeacoffee.com/supporterone",
    amount: 10,
    time: "10 hours ago",
    message:
      "Thank you for being so awesome everyday! You always manage to brighten up my day when I'm feeling down. Although $1 isn't that much money it's all I can contribute at the moment. When I become successful I will be sure to buy you more gifts and donations. Thank you again.",
  },
  {
    id: 6,
    initials: "CN",
    name: "Guest",
    source: "instagram.com/welesley",
    amount: 1,
    time: "10 hours ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar userName="Jake" />
        <main className="flex-1 p-6 max-w-3xl w-full mx-auto flex flex-col gap-5">
          <CreatorCard name="Jake" pageUrl="buymeacoffee.com/baconpancakes1" />
          <EarningsCard earnings={MOCK_EARNINGS} />
          <TransactionList transactions={MOCK_TRANSACTIONS} />
        </main>
      </div>
    </div>
  );
}
