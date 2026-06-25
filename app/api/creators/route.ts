import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    where: { profile: { isNot: null } },
    select: {
      id: true,
      username: true,
      profile: {
        select: {
          name: true,
          about: true,
          avatarImage: true,
          socialMediaURL: true,
        },
      },
    },
    orderBy: { id: "desc" },
  });

  const creators = users
    .filter((u) => u.profile?.name)
    .map((u) => ({
      id: u.id,
      username: u.username,
      name: u.profile!.name,
      about: u.profile!.about ?? "",
      avatarImage: u.profile!.avatarImage ?? null,
      socialMediaURL: u.profile!.socialMediaURL ?? "",
    }));

  return NextResponse.json(creators);
}
