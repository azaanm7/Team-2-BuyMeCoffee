import React from "react";
import { PageButtons } from "@/app/components/PageButtons";
import Header from "../components/Header";

type HomeLayoutProps = {
  children: React.ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#1A1A1A]">
      <div className="flex pt-16">
        <main className="flex-1 pl-56 min-h-[calc(100vh-64px)]">
          <div className="p-8 max-w-4xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
