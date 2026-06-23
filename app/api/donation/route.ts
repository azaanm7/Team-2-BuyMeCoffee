import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/donation — өөрт ирсэн donation-уудыг авах
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const donations = await prisma.donation.findMany({
    where: { recipientId: Number(session.user.id) },
    include: {
      donor: {
        select: {
          id: true,
          username: true,
          profile: { select: { avatarImage: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(donations);
}

// POST /api/donation — donation илгээх
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount, specialMessage, socialURLOrBuyMeACoffee, recipientId } =
    await req.json();

  if (!amount || !recipientId) {
    return NextResponse.json(
      { error: "amount болон recipientId шаардлагатай" },
      { status: 400 }
    );
  }

  if (Number(session.user.id) === Number(recipientId)) {
    return NextResponse.json(
      { error: "Өөртөө donation илгээх боломжгүй" },
      { status: 400 }
    );
  }

  const donation = await prisma.donation.create({
    data: {
      amount: Number(amount),
      specialMessage: specialMessage ?? null,
      socialURLOrBuyMeACoffee: socialURLOrBuyMeACoffee ?? null,
      donorId: Number(session.user.id),
      recipientId: Number(recipientId),
    },
    include: {
      donor: {
        select: {
          id: true,
          username: true,
          profile: { select: { avatarImage: true } },
        },
      },
    },
  });

  return NextResponse.json(donation, { status: 201 });
}
