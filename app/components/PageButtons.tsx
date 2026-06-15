"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Eye, Settings } from "lucide-react";

export const PageButtons = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "View page", href: "/view-page", icon: Eye, isExternal: true },
    { label: "Account settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-zinc-100 p-4 flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            target={item.isExternal ? "_blank" : undefined}
            className="w-full"
          >
            <button
              className={`w-full flex items-center justify-start gap-3 text-sm font-normal h-10 px-4 rounded-lg transition-colors duration-200 outline-none ${
                isActive
                  ? "bg-zinc-100 text-zinc-900 font-medium" // Идэвхтэй үеийн саарал background
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50" // Энгийн үеийн hover эффект
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-zinc-900" : "text-zinc-500"}`}
              />
              <span>{item.label}</span>

              {item.isExternal && (
                <span className="text-[10px] text-zinc-400 ml-auto">↗</span>
              )}
            </button>
          </Link>
        );
      })}
    </aside>
  );
};
