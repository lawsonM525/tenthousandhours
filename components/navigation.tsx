"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const navigation = [
  { name: "Product", href: "#product" },
  { name: "Insights", href: "#insights" },
  { name: "Timeline", href: "#timeline" },
  { name: "Categories", href: "#categories" },
  { name: "Principles", href: "#principles" },
];

export function Navigation() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[rgba(11,13,16,0.85)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F11D75]/20 text-[#F11D75]">10k</span>
          <span className="text-base font-semibold text-white">10,000hours</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--muted)] md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:text-white sm:px-4 sm:py-2 sm:text-sm">
                Log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-full bg-[#F11D75] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(241,29,117,0.35)] transition hover:bg-[#ff2a86] sm:px-4 sm:py-2 sm:text-sm">
                Start free
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

