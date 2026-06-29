"use client";

import { useEffect, useState } from "react";
import type { Supporter } from "./SupportersList";

export type CreatorProfile = {
  id: number;
  username: string;
  name: string;
  about: string | null;
  avatarImage: string | null;
  backgroundImage: string | null;
  socialMediaURL: string | null;
  successMessage: string | null;
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

export function useCreatorProfile(username: string) {
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
          successMessage: data.successMessage ?? "Thank you for your support!",
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

  // Creates the actual Donation/supporter record once a Transaction has
  // completed — the payment and the donation record are deliberately
  // separate steps (see PaymentModal), so this only runs after payment
  // succeeds.
  async function recordDonation(input: {
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
          amount: input.amount,
          specialMessage: input.message || null,
          socialURLOrBuyMeACoffee: input.url,
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
      // The payment itself succeeded even if our donation record failed to
      // save — caller still proceeds to the thank-you step regardless.
    }
  }

  return { creator, supporters, loading, notFound, recordDonation };
}
