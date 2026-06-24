"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./UserProvider";

// Client-side providers for the whole app. `SessionProvider` exposes the auth
// session token (via useSession), and `UserProvider` hydrates profile data
// from the DB (via useUser) — profile data never lives in the cookie.
export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <UserProvider>{children}</UserProvider>
    </SessionProvider>
  );
}
