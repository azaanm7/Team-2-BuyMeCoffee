import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/profile/[username] — public profile lookup for a creator's page.
// No auth required: anyone (including logged-out visitors) can view a
// creator's public page and donate to them.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: { profile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  }

  const donations = await prisma.donation.findMany({
    where: { recipientId: user.id },
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
    take: 20,
  });

  return NextResponse.json({
    id: user.id,
    username: user.username,
    name: user.profile?.name || user.username,
    about: user.profile?.about ?? null,
    avatarImage: user.profile?.avatarImage ?? null,
    backgroundImage: user.profile?.backgroundImage ?? null,
    socialMediaURL: user.profile?.socialMediaURL ?? null,
    successMessage: user.profile?.successMessage ?? null,
    donations,
  });
}
