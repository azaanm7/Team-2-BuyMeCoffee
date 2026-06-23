"use client";

import React from "react";
import { SidebarItem } from "./SidebarItem";

export const PageButtons = () => {
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "View page", href: "/donation" },
    { label: "Account settings", href: "/settings" },
  ];

  return (
    <aside className="w-56  left-0 top-16 h-[calc(100vh-64px)] p-3 flex flex-col gap-1 font-sans">
      {menuItems.map((item) => (
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
