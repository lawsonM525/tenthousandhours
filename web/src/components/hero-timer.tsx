import { Pause, Play, Square } from "lucide-react";

export function HeroTimer() {
  return (
    <div className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-[var(--surface-elevated)] p-8 text-white">
      <div className="absolute -top-16 right-6 hidden h-32 w-32 rounded-full bg-[#F11D75]/20 blur-2xl md:block" />
      <div className="flex items-center justify-between text-sm text-white/70">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F11D75]" />
          <span className="font-medium">CS Girlies</span>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/60">
          Active session
        </span>
      </div>
      <div className="mt-8 flex items-center justify-center">
        <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-white/10 gradient-ring">
          <div className="absolute inset-[22px] rounded-full border border-white/5 bg-[rgba(241,29,117,0.08)]" />
          <div className="absolute inset-[68px] flex items-center justify-center rounded-full bg-[rgba(11,13,16,0.9)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F11D75] text-white shadow-[0_0_25px_rgba(241,29,117,0.45)]">
              <div className="h-6 w-6 rounded-full bg-white/20" />
            </div>
          </div>
          <svg className="h-64 w-64 text-[#F11D75]" viewBox="0 0 100 100">
            <circle
              className="text-white/10"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="282.743"
            />
            <circle
              className="origin-center -rotate-90 transform"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#F11D75"
              strokeLinecap="round"
              strokeWidth="3"
              strokeDasharray="200 282.743"
            />
          </svg>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">Website fix</p>
          <p className="mt-1 text-4xl font-semibold">24:53</p>
          <p className="text-sm text-white/60">09:40 — 10:05</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10">
            <Pause className="h-5 w-5" />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F11D75] text-white hover:bg-[#ff2a86]">
            <Square className="h-5 w-5" />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10">
            <Play className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-white/60">
        <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
          <p className="uppercase tracking-wide text-white/40">Focused</p>
          <p className="mt-1 text-lg font-semibold text-white">5</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
          <p className="uppercase tracking-wide text-white/40">Neutral</p>
          <p className="mt-1 text-lg font-semibold text-white">14</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
          <p className="uppercase tracking-wide text-white/40">Distracted</p>
          <p className="mt-1 text-lg font-semibold text-white">4</p>
        </div>
      </div>
    </div>
  );
}
