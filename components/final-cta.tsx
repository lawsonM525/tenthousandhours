"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

export function FinalCta() {
  return (
    <section className="mx-auto mt-24 w-full max-w-4xl rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(241,29,117,0.18),rgba(11,13,16,0.95))] p-10 text-center text-white" id="get-started">
      <h2 className="text-3xl font-semibold sm:text-4xl">Know where your time goes. Master what matters.</h2>
      <p className="mt-4 text-base text-white/70">
        Join thousands of builders who track all 24 hours, learn from their notes, and pace toward 10,000 hours of deliberate practice.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <SignedOut>
          <SignUpButton mode="modal">
            <button className="inline-flex items-center gap-2 rounded-full bg-[#F11D75] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(241,29,117,0.4)] transition hover:bg-[#ff2a86]">
              Start free
              <ArrowRight className="h-4 w-4" />
            </button>
          </SignUpButton>
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-white/80 transition hover:text-white"
          >
            Explore the product
          </Link>
        </SignedOut>
        <SignedIn>
          <Link
            href="/app/now"
            className="inline-flex items-center gap-2 rounded-full bg-[#F11D75] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(241,29,117,0.4)] transition hover:bg-[#ff2a86]"
          >
            Start now
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/app/now"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-white/80 transition hover:text-white"
          >
            Explore the product
          </Link>
        </SignedIn>
      </div>
      <p className="mt-6 text-xs uppercase tracking-[0.35em] text-white/40">No tiers. No ads. Just the truth.</p>
    </section>
  );
}

