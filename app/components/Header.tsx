"use client";

/* eslint-disable @next/next/no-img-element */
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

import { useUser } from "./UserProvider";
import Link from "next/link";

function AvatarImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse rounded-full bg-gray-200" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-8 h-8 rounded-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

const Header = () => {
  const { status } = useSession();
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="text-black w-screen flex justify-between items-center px-10 p-5 font-sans border-b border-gray-100">
      <Link href="/" className="flex items-center gap-2">
        <img src="/coffee.svg" alt="coffee" />
        <p className="font-bold text-xl">Buy Me Coffee</p>
      </Link>

      {status === "loading" ? (
        <div className="w-24 h-9 bg-gray-100 rounded-xl animate-pulse" />
      ) : status === "authenticated" ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <AvatarImage
              src={user?.avatarImage || "/avatar-placeholder.png"}
              alt={user?.name || "User"}
            />
            <span className="text-sm font-medium">{user?.name || "User"}</span>
            <ChevronIcon open={menuOpen} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                Account settings
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login">
          <button className="bg-zinc-100 rounded-xl p-3">Log in</button>
        </Link>
      )}
    </div>
  );
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#888"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default Header;
