"use client";

import { useEffect, useState } from "react";

export type SavedCard = {
  country: string;
  firstName: string;
  lastName: string;
  cardNumber: string;
  expiryDate: string;
};

export function useSavedCard() {
  const [card, setCard] = useState<SavedCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/bankcard")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setCard(data);
      })
      .catch(() => {
        if (!cancelled) setCard(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { card, loading };
}
