"use client";

import { useEffect, useState } from "react";
import { PageButtons } from "@/app/components/PageButtons";
import { Search, User, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import CreatorAvatar from "@/app/components/creator-page/CreatorAvatar";
import Header from "@/app/components/Header";

type Creator = {
  id: number;
  username: string;
  name: string;
  about: string;
  avatarImage: string | null;
  socialMediaURL: string;
};

function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CreatorAvatar
            name={creator.name}
            avatarUrl={creator.avatarImage}
            size={40}
          />
          <span className="font-semibold text-base text-gray-900">
            {creator.name}
          </span>
        </div>
        <Link href={`/page/${creator.username}`}>
          <button className="flex items-center gap-1.5 text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
            View profile
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

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
            {creator.socialMediaURL}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/creators")
      .then((r) => r.json())
      .then((data) => setCreators(data))
      .catch(() => setCreators([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = creators.filter((c) =>
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

          {loading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-white border border-gray-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
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
