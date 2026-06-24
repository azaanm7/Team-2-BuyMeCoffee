import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function POST(request: Request) {
  const { amount } = await request.json();

  const transaction = await prisma.transaction.create({
    data: { amount, status: "PENDING" },
  });

  const mockPaymentUrl = `https://n5jxxsvg-3000.jpe1.devtunnels.ms/pay/${transaction.id}`;

  const qrCodeUrl = await QRCode.toDataURL(mockPaymentUrl);

  return NextResponse.json({
    transactionId: transaction.id,
    qrCodeUrl,
    mockPaymentUrl,
  });
}
