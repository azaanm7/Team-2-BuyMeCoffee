"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";

export type AppUser = {
  id: string;
  email: string | null;
  name: string | null;
  avatarImage: string | null;
  socialMediaURL: string | null;
  successMessage: string | null;
};

type UserContextValue = {
  user: AppUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile data (name/avatar/etc.) lives in the DB, NOT the auth cookie. The
  // cookie only carries the session token; we hydrate the rest from the API.
  const refresh = useCallback(async () => {
    if (status !== "authenticated" || !session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile");
      const profile = res.ok ? await res.json().catch(() => null) : null;
      setUser({
        id: session.user.id,
        email: session.user.email ?? null,
        name: profile?.name ?? null,
        avatarImage: profile?.avatarImage ?? null,
        socialMediaURL: profile?.socialMediaURL ?? null,
        successMessage: profile?.successMessage ?? null,
      });
    } finally {
      setLoading(false);
    }
  }, [status, session]);

  useEffect(() => {
    if (status === "loading") return;

    refresh();
    window.addEventListener("profile:updated", refresh);
    return () => window.removeEventListener("profile:updated", refresh);
  }, [status, refresh]);

  return (
    <UserContext.Provider value={{ user, loading, refresh }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
