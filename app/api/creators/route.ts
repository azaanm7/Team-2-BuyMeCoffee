import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/creators — public list of creators for the Explore page.
// Only returns users who have completed a profile (name set), since a
// bare signup with no profile isn't a "creator" yet.
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
