"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  label: string;
  href: string;
  isExternal?: boolean;
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  isExternal,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="w-full"
    >
      <button
        className={cn(
          "w-full flex items-center justify-start text-[14px] font-sans font-normal h-9 px-4 rounded-lg transition-all duration-150 outline-none select-none",
          isActive
            ? "bg-[#F1F1F2] text-[#1A1A1A] font-medium"
            : "text-[#666666] hover:text-[#1A1A1A] hover:bg-[#F8F8F9] bg-transparent",
        )}
      >
        <span className="flex-1 text-left">{label}</span>

        {isExternal && (
          <ArrowUpRight className="w-3.5 h-3.5 text-[#999999] ml-1 shrink-0" />
        )}
      </button>
    </Link>
  );
};
