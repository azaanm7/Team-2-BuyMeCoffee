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
    <aside className="grid w-full shrink-0 grid-cols-2 gap-1 p-3 font-sans md:flex md:h-[calc(100vh-64px)] md:w-56 md:flex-col">
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
