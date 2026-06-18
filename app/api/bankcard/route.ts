import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const card = await prisma.bankCard.findUnique({
    where: { userId: Number(session.user.id) },
  });

  return NextResponse.json(card ?? null);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { country, firstName, lastName, cardNumber, month, year } =
    await req.json();
  const userId = Number(session.user.id);

  const card = await prisma.bankCard.upsert({
    where: { userId },
    update: {
      country,
      firstName,
      lastName,
      cardNumber,
      expiryDate: new Date(Number(year), Number(month) - 1, 1),
    },
    create: {
      country,
      firstName,
      lastName,
      cardNumber,
      expiryDate: new Date(Number(year), Number(month) - 1, 1),
      userId,
    },
  });

  return NextResponse.json(card);
}
