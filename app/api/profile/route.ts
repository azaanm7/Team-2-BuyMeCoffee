import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    include: { profile: true },
  });

  return NextResponse.json(user?.profile ?? null);
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, about, avatarImage, socialMediaURL, successMessage } =
      await req.json();
    const userId = Number(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (user?.profile) {
      const updated = await prisma.profile.update({
        where: { id: user.profile.id },
        data: { name, about, avatarImage, socialMediaURL, successMessage },
      });
      return NextResponse.json(updated);
    }

    const profile = await prisma.profile.create({
      data: { name, about, avatarImage, socialMediaURL, successMessage },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { profileId: profile.id },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (err) {
    console.error("Profile PUT error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
