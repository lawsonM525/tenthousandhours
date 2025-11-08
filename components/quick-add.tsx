"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

const quickTemplates = [
  { title: "deep work", category: "Coding", duration: "90m" },
  { title: "team sync", category: "Friends", duration: "45m" },
  { title: "stretch + reset", category: "Sleep", duration: "15m" }
];

export default function QuickAdd() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-pill border border-border-subtle bg-elevated px-4 py-2 text-sm text-text-secondary transition hover:text-text-primary"
        aria-expanded={open}
      >
        <Plus className="h-4 w-4" aria-hidden />
        quick add
      </button>
      {open ? (
        <div className="absolute right-0 top-12 w-72 rounded-card border border-border-subtle bg-surface p-3 shadow-overlay">
          <p className="text-xs uppercase tracking-[0.14em] text-text-muted">
            recent templates
          </p>
          <ul className="mt-3 space-y-2">
            {quickTemplates.map((template) => (
              <li
                key={template.title}
                className="flex items-center justify-between rounded-card border border-border-subtle/60 bg-elevated/80 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium text-text-primary">{template.title}</p>
                  <p className="text-xs text-text-secondary">
                    {template.category} · {template.duration}
                  </p>
                </div>
                <button className="rounded-pill bg-cta-pink/10 px-3 py-1 text-xs font-medium text-text-primary">
                  use
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
