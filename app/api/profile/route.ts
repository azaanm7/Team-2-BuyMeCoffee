import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_PROFILE = {
  name: "Jake",
  about:
    "I'm a typical person who enjoys exploring different things. I also make music art as a hobby. Follow me along.",
  socialUrl: "https://buymeacoffee.com/spacerulz44",
  photo: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=200&q=80",
  coverImage: null as string | null,
};

async function getOrCreateProfile() {
  const existing = await prisma.profile.findFirst();
  if (existing) return existing;
  return prisma.profile.create({ data: DEFAULT_PROFILE });
}

export async function GET() {
  const profile = await getOrCreateProfile();
  return Response.json(profile);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const profile = await getOrCreateProfile();

  const updated = await prisma.profile.update({
    where: { id: profile.id },
    data: body,
  });

  return Response.json(updated);
}
