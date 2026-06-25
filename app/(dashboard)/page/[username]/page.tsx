"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import CoverBanner from "@/app/components/creator-page/CoverBanner";
import AboutCard from "@/app/components/creator-page/AboutCard";
import SocialUrlCard from "@/app/components/creator-page/SocialUrlCard";
import SupportersList, {
  type Supporter,
} from "@/app/components/creator-page/SupportersList";
import BuyCoffeeForm from "@/app/components/creator-page/BuyCoffeeForm";
import QrCodeModal from "@/app/components/creator-page/QrCodeModal";

type CreatorProfile = {
  id: number;
  username: string;
  name: string;
  about: string | null;
  avatarImage: string | null;
  backgroundImage: string | null;
  socialMediaURL: string | null;
};

type DonationApiResult = {
  id: string;
  amount: number;
  specialMessage: string | null;
  donor: {
    username: string;
    profile: { avatarImage: string | null } | null;
  };
};

export default function CreatorPublicPage() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const username = params.username;

  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/profile/${username}`);
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
        const data = await res.json();
        if (cancelled) return;

        setCreator({
          id: data.id,
          username: data.username,
          name: data.name,
          about: data.about,
          avatarImage: data.avatarImage,
          backgroundImage: data.backgroundImage,
          socialMediaURL: data.socialMediaURL,
        });

        setSupporters(
          (data.donations as DonationApiResult[]).map((d) => ({
            id: d.id,
            name: d.donor.username,
            avatarUrl: d.donor.profile?.avatarImage ?? null,
            amount: d.amount,
            message: d.specialMessage,
          })),
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  async function handleDonate({
    amount,
    url,
    message,
  }: {
    amount: number;
    url: string;
    message: string;
  }) {
    if (!creator) return;

    try {
      const res = await fetch("/api/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          specialMessage: message || null,
          socialURLOrBuyMeACoffee: url,
          recipientId: creator.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSupporters((prev) => [
          {
            id: data.id,
            name: data.donor?.username ?? "Guest",
            avatarUrl: data.donor?.profile?.avatarImage ?? null,
            amount: data.amount,
            message: data.specialMessage,
          },
          ...prev,
        ]);
      }
    } catch {
    } finally {
      setQrUrl(url);
    }
  }

  function handleQrClose() {
    setQrUrl(null);
    router.push("/donation/complete");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  if (notFound || !creator) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
          This creator page doesn&apos;t exist.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <CoverBanner backgroundImage={creator.backgroundImage} />

      <div className="relative mx-auto -mt-27.5 grid max-w-6xl grid-cols-1 gap-6 px-6 pb-16 lg:grid-cols-2 z-10">
        <div className="flex flex-col gap-6">
          <AboutCard
            name={creator.name}
            about={creator.about ?? ""}
            avatarUrl={creator.avatarImage}
          />
          {creator.socialMediaURL && (
            <SocialUrlCard url={creator.socialMediaURL} />
          )}
          <SupportersList creatorName={creator.name} supporters={supporters} />
        </div>

        <BuyCoffeeForm creatorName={creator.name} onSubmit={handleDonate} />
      </div>

      {qrUrl && <QrCodeModal targetUrl={qrUrl} onClose={handleQrClose} />}
    </div>
  );
}
