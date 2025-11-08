"use client";

import { CalendarDays, Search, Sparkles } from "lucide-react";
import QuickAdd from "./quick-add";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-40 flex flex-col gap-4 rounded-card border border-border-subtle bg-surface/90 p-4 backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold">What’s your focus?</h1>
          <p className="text-sm text-text-secondary">
            Truth over vibes. Track every hour with intent.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-pill border border-border-subtle bg-elevated px-4 py-2 text-sm text-text-secondary transition hover:text-text-primary">
            <CalendarDays className="h-4 w-4" aria-hidden />
            Oct 13 – Oct 19
          </button>
          <button className="hidden items-center gap-2 rounded-pill bg-cta-pink px-4 py-2 text-sm font-medium text-base shadow-sm transition hover:opacity-90 md:inline-flex">
            <Sparkles className="h-4 w-4" aria-hidden />
            start logging
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex-1 rounded-pill border border-border-subtle bg-elevated/70 px-4 py-2 text-sm text-text-secondary">
          <label className="flex items-center gap-3">
            <Search className="h-4 w-4" aria-hidden />
            <input
              className="flex-1 bg-transparent outline-none placeholder:text-text-muted"
              placeholder="search logs, notes, categories"
            />
          </label>
        </div>
        <QuickAdd />
      </div>
    </header>
  );
}
