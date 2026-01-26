"use client";

import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

interface TimelineGapSlotProps {
  start: string;
  end: string;
  animationDelay: string;
}

export function TimelineGapSlot({ start, end, animationDelay }: TimelineGapSlotProps) {
  const slotContent = (
    <div className="bg-white/50 p-4 sm:p-6 border-2 border-dashed border-mango-dark/40 hover:border-mango-dark hover:bg-white hover:shadow-[2px_2px_0px_#000] sm:hover:shadow-[4px_4px_0px_#000] transition-all cursor-pointer group">
      <div className="flex justify-between items-center">
        <span className="text-[10px] sm:text-xs font-bold text-slate-400">{start} — {end}</span>
        <span className="px-1.5 sm:px-2 py-0.5 bg-slate-100 text-slate-500 text-[8px] sm:text-[10px] font-bold uppercase group-hover:bg-mango-yellow group-hover:text-mango-dark transition-colors">
          + Add Session
        </span>
      </div>
      <p className="text-xs sm:text-sm text-slate-400 mt-2 group-hover:text-mango-dark transition-colors">Click to log what happened during this time</p>
    </div>
  );

  return (
    <div 
      className="relative pl-10 sm:pl-14 animate-bounce-soft"
      style={{ animationDelay }}
    >
      <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 sm:border-4 border-white bg-slate-300 z-10 flex items-center justify-center">
        <span className="text-[6px] sm:text-[8px] font-bold text-slate-500">+</span>
      </div>
      
      <SignedOut>
        <SignUpButton mode="modal">
          {slotContent}
        </SignUpButton>
      </SignedOut>
      
      <SignedIn>
        <Link href="/app/now">
          {slotContent}
        </Link>
      </SignedIn>
    </div>
  );
}
