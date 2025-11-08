"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenText,
  Clock3,
  ListChecks,
  Settings,
  TimerReset
} from "lucide-react";
import TopBar from "./top-bar";

const navItems = [
  {
    href: "/",
    label: "Timer",
    icon: TimerReset
  },
  {
    href: "/timeline",
    label: "Timeline",
    icon: Clock3
  },
  {
    href: "/insights",
    label: "Insights",
    icon: BarChart3
  },
  {
    href: "/notes",
    label: "Notes",
    icon: BookOpenText
  },
  {
    href: "/categories",
    label: "Categories",
    icon: ListChecks
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings
  }
] as const;

export default function AppShell({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-base">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-24 pt-6 md:flex-row md:gap-10 md:pb-10">
        <aside className="hidden w-56 shrink-0 md:flex md:flex-col">
          <div className="rounded-card border border-border-subtle bg-surface/80 px-4 py-6">
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-text-muted">
              10,000hours
            </p>
            <p className="mt-4 text-sm text-text-secondary">
              Truth-first time tracking for mastery.
            </p>
          </div>
          <nav className="mt-6 space-y-1 rounded-card border border-border-subtle bg-surface/80 p-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-card px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-elevated text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 space-y-6">
          <TopBar />
          {children}
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border-subtle bg-surface/95 px-4 py-2 backdrop-blur md:hidden">
        <ul className="flex items-center justify-between">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs ${
                    isActive
                      ? "text-text-primary"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
