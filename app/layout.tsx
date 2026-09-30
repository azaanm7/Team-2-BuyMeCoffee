import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "./components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Team 2 - BuyMeCoffee",
  description: "Cloning BuyMeCoffee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
            const savedTheme = localStorage.getItem("theme");
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.classList.toggle("dark", savedTheme ? savedTheme === "dark" : prefersDark);
          } catch {
            document.documentElement.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
          }`}
        </Script>
      </head>
      <body className="font-sans antialiased bg-white text-[#1A1A1A]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
