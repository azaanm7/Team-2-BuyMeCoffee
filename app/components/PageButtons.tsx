"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { SidebarItem } from "./SidebarItem";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "View page", href: "/donation" },
  { label: "Account settings", href: "/settings" },
];

export const PageButtons = () => {
  const { status } = useSession();

  return (
    <aside className="w-56 left-0 top-16 h-[calc(100vh-64px)] p-3 flex flex-col gap-1 font-sans">
      {status === "loading"
        ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-full rounded-lg bg-gray-100 animate-pulse"
            />
          ))
        : menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              label={item.label}
              href={item.href}
              isExternal={false}
            />
          ))}
    </aside>
  );
};
