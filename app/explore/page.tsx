"use client";

import { useState } from "react";
import { PageButtons } from "@/app/components/PageButtons";
import { Search, User, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";

type Creator = {
  id: number;
  name: string;
  avatarUrl?: string;
  about: string;
  socialMediaUrl: string;
  slug: string;
};

const MOCK_CREATORS: Creator[] = [
  {
    id: 1,
    name: "Space ranger",

    about:
      "All day, every day, we're watching, listening to, reading and absorbing politics. It's exhausting. We then report on what we've seen in a way that's as chill as possible. None of the sensationalism and division you'll find elsewhere. It's about cl...",
    socialMediaUrl: "https://buymeacoffee.com/baconpancakes1",
    slug: "baconpancakes1",
  },
  {
    id: 2,
    name: "Purple monster",

    about:
      "Purple monster is for everyone. It handles all the painful experiences and helps people.",
    socialMediaUrl: "https://buymeacoffee.com/ifmonster23",
    slug: "ifmonster23",
  },
  {
    id: 3,
    name: "Alien Conspiracy",
    about: "Show your support ❤ and buy me a coffee! & keep project a live!",
    socialMediaUrl: "https://buymeacoffee.com/roooaaaamm",
    slug: "roooaaaamm",
  },
  {
    id: 4,
    name: "Teams",
    about:
      'Joel 1:14 "Sanctify a fast, call a solemn assembly, gather the elders and all the inhabitants of the land. Cry out to the LORD."My purpose is clear: To seek God\'s face, every Thursday for all my Subscribers to align with His will, and to step into th...',
    socialMediaUrl: "https://buymeacoffee.com/kaka0",
    slug: "kaka0",
  },
  {
    id: 5,
    name: "Dragons1",
    about: "Hello",
    socialMediaUrl: "https://buymeacoffee.com/dragons1",
    slug: "dragons1",
  },
];

function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
            {creator.avatarUrl ? (
              <Image
                src={creator.avatarUrl}
                alt={creator.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <span className="font-semibold text-base text-gray-900">
            {creator.name}
          </span>
        </div>
        <Link href={`/page/${creator.slug}`}>
          <button className="flex items-center gap-1.5 text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
            View profile
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      {/* Body: two columns */}
      <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-4">
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">
            About {creator.name}
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            {creator.about}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Social media URL
          </p>
          <p className="text-sm text-gray-500 break-all">
            {creator.socialMediaUrl}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_CREATORS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1">
        <PageButtons />

        <main className="flex-1 p-6 max-w-3xl w-full mx-auto flex flex-col gap-5">
          <h1 className="text-xl font-semibold text-gray-900">
            Explore creators
          </h1>

          {/* Search */}
          <div className="relative w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-gray-400 transition-colors placeholder-gray-400"
            />
          </div>

          {/* List or empty state */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                No creators have signed up yet
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
