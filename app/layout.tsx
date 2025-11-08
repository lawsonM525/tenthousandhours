import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "../components/app-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "10,000hours — Truth-first time tracking",
  description:
    "Track every hour with clarity. Plan, log, and reflect with 10,000hours."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-base text-text-primary`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
