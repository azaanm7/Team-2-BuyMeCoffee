"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./UserProvider";

export default function SessionProviderWrapper({
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
