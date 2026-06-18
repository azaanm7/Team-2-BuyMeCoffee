"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, ChevronDown, Heart } from "lucide-react";

type Transaction = {
  id: number;
  name: string;
  source: string;
  amount: number;
  message?: string;
  time: string;
  avatarUrl?: string;
};

const ALL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    name: "Guest",
    source: "instagram.com/welesley",
    amount: 1,
    message:
      "Thank you for being so awesome everyday! You always manage to brighten up my day when I'm feeling down. Although $1 isn't that much money it's all I can contribute at the moment",
    time: "10 hours ago",
  },
  {
    id: 2,
    name: "John Doe",
    source: "buymeacoffee.com/bdsadas",
    amount: 10,
    message: "Thank you for being so awesome everyday!",
    time: "10 hours ago",
    avatarUrl: "/avatar-john.png",
  },
  {
    id: 3,
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
    avatarUrl: "/avatar-guest2.png",
  },
  {
    id: 5,
    name: "Fan1",
    source: "buymeacoffee.com/supporterone",
    amount: 10,
    message:
      "Thank you for being so awesome everyday! You always manage to brighten up my day when I'm feeling down. Although $1 isn't that much money it's all I can contribute at the moment. When I become successful I will be sure to buy you more gifts and donations. Thank you again.",
    time: "10 hours ago",
    avatarUrl: "/avatar-fan1.png",
  },
  {
    id: 6,
    name: "Guest",
    source: "instagram.com/welesley",
    amount: 1,
    time: "10 hours ago",
  },
];

const AMOUNT_OPTIONS = [1, 2, 5, 10];

function TransactionRow({ tx }: { tx: Transaction }) {
  const [expanded, setExpanded] = useState(false);
  const TRUNCATE_LENGTH = 120;

  const isLong = tx.message && tx.message.length > TRUNCATE_LENGTH;
  const displayMessage =
    isLong && !expanded
      ? tx.message!.slice(0, TRUNCATE_LENGTH) + "..."
      : tx.message;

  return (
    <div className="py-4 border-b last:border-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {tx.avatarUrl ? (
              <AvatarImage src={tx.avatarUrl} alt={tx.name} />
            ) : null}
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
              CN
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{tx.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{tx.source}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-semibold">+ ${tx.amount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{tx.time}</p>
        </div>
      </div>

      {tx.message && (
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {displayMessage}{" "}
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="font-semibold text-foreground underline underline-offset-2 hover:no-underline"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  const [period, setPeriod] = useState("30");
  const [selectedAmounts, setSelectedAmounts] = useState<number[]>([]);

  const toggleAmount = (amt: number) => {
    setSelectedAmounts((prev) =>
      prev.includes(amt) ? prev.filter((a) => a !== amt) : [...prev, amt],
    );
  };

  const filtered =
    selectedAmounts.length === 0
      ? ALL_TRANSACTIONS
      : ALL_TRANSACTIONS.filter((tx) => selectedAmounts.includes(tx.amount));

  const earnings = filtered.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/avatar-jake.png" alt="Jake" />
            <AvatarFallback>JK</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">Jake</p>
            <p className="text-xs text-muted-foreground">
              buymeacoffee.com/baconpancakes1
            </p>
          </div>
        </div>
        <Button variant="default" size="sm" className="gap-2">
          <Copy className="h-3.5 w-3.5" />
          Share page link
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-2">
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium">Earnings</p>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-4xl font-bold tracking-tight">${earnings}</p>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <p className="text-sm font-semibold">Recent transactions</p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8">
                <ChevronDown className="h-3.5 w-3.5" />
                Amount
                {selectedAmounts.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                    {selectedAmounts.map((a) => `$${a}`).join(", ")}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {AMOUNT_OPTIONS.map((amt) => (
                <DropdownMenuCheckboxItem
                  key={amt}
                  checked={selectedAmounts.includes(amt)}
                  onCheckedChange={() => toggleAmount(amt)}
                >
                  ${amt}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="px-5">
          {filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-center">
              <div className="h-12 w-12 rounded-full border-2 flex items-center justify-center">
                <Heart className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  You don&apos;t have any supporters yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Share your page with your audience to get started.
                </p>
              </div>
            </div>
          ) : (
            filtered.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
          )}
        </div>
      </div>
    </div>
  );
}
