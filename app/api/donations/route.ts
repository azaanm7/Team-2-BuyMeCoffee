import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(donations);
}

export async function POST(request: NextRequest) {
  const { name, avatar, amount, message } = await request.json();

  if (!amount || amount <= 0) {
    return Response.json({ error: "Invalid amount" }, { status: 400 });
  }

  const donation = await prisma.donation.create({
    data: {
      name: name || "Guest",
      avatar: avatar ?? null,
      amount,
      message: message ?? "",
    },
  });

  return Response.json(donation, { status: 201 });
}
