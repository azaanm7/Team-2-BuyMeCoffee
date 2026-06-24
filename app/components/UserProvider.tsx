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

async function fetchProfile(session: ReturnType<typeof useSession>["data"]) {
  if (!session?.user) return null;

  const res = await fetch("/api/profile");
  const profile = res.ok ? await res.json().catch(() => null) : null;
  return {
    id: session.user.id,
    email: session.user.email ?? null,
    name: profile?.name ?? null,
    avatarImage: profile?.avatarImage ?? null,
    socialMediaURL: profile?.socialMediaURL ?? null,
    successMessage: profile?.successMessage ?? null,
  } satisfies AppUser;
}

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
      const nextUser = await fetchProfile(session);
      setUser(nextUser);
    } finally {
      setLoading(false);
    }
  }, [status, session]);

  // Runs whenever auth status/session changes — this IS the synchronization
  // with the external "auth state" system, so calling setState here is fine.
  useEffect(() => {
    if (status === "loading") return;

    let cancelled = false;

    (async () => {
      if (status !== "authenticated" || !session?.user) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const nextUser = await fetchProfile(session);
        if (!cancelled) setUser(nextUser);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, session]);

  // Separate effect: only for subscribing to the custom "profile:updated"
  // event, which calls the stable `refresh` callback in response to an
  // external signal (not synchronously on every render).
  useEffect(() => {
    window.addEventListener("profile:updated", refresh);
    return () => window.removeEventListener("profile:updated", refresh);
  }, [refresh]);

  return (
    <UserContext.Provider value={{ user, loading, refresh }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
