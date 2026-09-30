import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const now = new Date();
  const chartStart = new Date(now);
  chartStart.setUTCHours(0, 0, 0, 0);
  chartStart.setUTCDate(chartStart.getUTCDate() - 89);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  try {
    const [earnings30, earnings90, earningsAll, donations, supporters, chartDonations] = await Promise.all([
      prisma.donation.aggregate({
        where: { recipientId: userId, createdAt: { gte: thirtyDaysAgo } },
        _sum: { amount: true },
      }),
      prisma.donation.aggregate({
        where: { recipientId: userId, createdAt: { gte: ninetyDaysAgo } },
        _sum: { amount: true },
      }),
      prisma.donation.aggregate({
        where: { recipientId: userId },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.donation.findMany({
        where: { recipientId: userId },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          donor: {
            include: { profile: true },
          },
        },
      }),
      prisma.donation.findMany({
        where: { recipientId: userId },
        distinct: ["donorId"],
        select: { donorId: true },
      }),
      prisma.donation.findMany({
        where: { recipientId: userId, createdAt: { gte: chartStart } },
        select: { amount: true, createdAt: true },
      }),
    ]);

    const amountByDay = new Map<string, number>();
    for (const donation of chartDonations) {
      const day = donation.createdAt.toISOString().slice(0, 10);
      amountByDay.set(day, (amountByDay.get(day) || 0) + donation.amount);
    }

    const dailyEarnings = Array.from({ length: 90 }, (_, index) => {
      const date = new Date(chartStart);
      date.setUTCDate(date.getUTCDate() + index);
      const day = date.toISOString().slice(0, 10);
      return { date: day, amount: amountByDay.get(day) || 0 };
    });

    const transactions = donations.map((d) => {
      const donorName = d.donor.profile?.name || d.donor.username;
      const initials = donorName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return {
        id: d.id,
        initials,
        avatarUrl: d.donor.profile?.avatarImage || undefined,
        name: donorName,
        source: d.socialURLOrBuyMeACoffee || "buymeacoffee.com",
        amount: d.amount,
        time: formatRelativeTime(d.createdAt),
        message: d.specialMessage || undefined,
      };
    });

    return NextResponse.json({
      earnings: {
        "30d": earnings30._sum.amount || 0,
        "90d": earnings90._sum.amount || 0,
        all: earningsAll._sum.amount || 0,
      },
      stats: {
        supporters: supporters.length,
        donations: earningsAll._count._all,
      },
      dailyEarnings,
      transactions,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 },
    );
  }
}
