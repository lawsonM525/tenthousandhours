"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

type Block = {
  start: string;
  end: string;
  label: string;
  tone: string;
  span: string;
  isGap?: boolean;
};

const initialBlocks: Block[] = [
  { start: "09:00", end: "10:13", label: "appsSdk - Daily Coding", tone: "#F11D75", span: "row-span-3" },
  { start: "10:15", end: "11:30", label: "API for GhatGPT", tone: "#3A8DFF", span: "row-span-3" },
  { start: "11:35", end: "12:10", label: "id cards format", tone: "#16C7A8", span: "row-span-2" },
  { start: "12:30", end: "13:10", label: "prayer + reset", tone: "#FFB020", span: "row-span-2" },
  { start: "13:30", end: "14:00", label: "Lunch break", tone: "#45E06F", span: "row-span-2" },
];

const gapSlots: Block[] = [
  { start: "10:13", end: "10:15", label: "Add session", tone: "", span: "row-span-1", isGap: true },
  { start: "12:10", end: "12:30", label: "Add session", tone: "", span: "row-span-1", isGap: true },
  { start: "14:00", end: "15:00", label: "Add session", tone: "", span: "row-span-2", isGap: true },
];

export function TimelineShowcase() {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [gaps, setGaps] = useState<Block[]>(gapSlots);

  const handleAddSession = (gap: Block) => {
    const colors = ["#F11D75", "#3A8DFF", "#16C7A8", "#FFB020", "#45E06F", "#9B59B6"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newBlock: Block = {
      start: gap.start,
      end: gap.end,
      label: "New session",
      tone: randomColor,
      span: gap.span,
    };
    
    setBlocks([...blocks, newBlock]);
    setGaps(gaps.filter(g => g.start !== gap.start));
  };

  return (
    <section className="section-grid" id="timeline">
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Mon, Oct 13</p>
            <h3 className="mt-2 text-xl font-semibold text-white">9h 36m focus logged</h3>
          </div>
          <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 hover:text-white">
            Today
          </button>
        </div>
        <div className="mt-6 grid grid-cols-[88px_1fr] gap-6">
          <div className="space-y-6 text-xs text-white/50">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex flex-col">
                <span>{String(index + 9).padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>
          <div className="relative grid grid-cols-1 gap-3">
            <div className="absolute inset-0 grid grid-rows-12 gap-y-2">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="border-b border-white/5" />
              ))}
            </div>
            <div className="relative grid auto-rows-[40px] gap-2">
              {blocks.map((block) => (
                <div
                  key={block.label + block.start}
                  className={`relative overflow-hidden rounded-xl border border-white/5 bg-white/10 p-4 text-sm text-white ${block.span} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                  style={{ backgroundColor: `${block.tone}1a` }}
                >
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>{block.start} — {block.end}</span>
                    <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: block.tone }} />
                  </div>
                  <p className="mt-2 font-medium">{block.label}</p>
                  <p className="text-xs text-white/60">Notes ready · tap to review</p>
                </div>
              ))}
              
              {/* Gap slots - clickable to add sessions */}
              {gaps.map((gap) => (
                <button
                  key={`gap-${gap.start}`}
                  onClick={() => handleAddSession(gap)}
                  className={`relative overflow-hidden rounded-xl border-2 border-dashed border-white/20 p-4 text-sm text-white/50 ${gap.span} transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:text-white/80 group cursor-pointer`}
                >
                  <div className="flex items-center justify-center h-full gap-2">
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">{gap.start} — {gap.end}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6 text-white">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium text-white/60">
          Timeline built for truth
        </span>
        <h2 className="text-3xl font-semibold sm:text-4xl">
          Drag blocks, fill gaps, and see the full story of your day at a glance.
        </h2>
        <p className="text-white/70">
          The timeline makes every hour accountable. Drag to resize, drag to move, or tap an empty slot to log what really
          happened. Zebra stripes remind you where time is untracked.
        </p>
        <ul className="space-y-3 text-sm text-white/70">
          <li>• Day and week views with lightning-fast editing</li>
          <li>• Conflict resolution to merge or split overlaps</li>
          <li>• Notes and tags surfaced alongside every block</li>
        </ul>
      </div>
    </section>
  );
}
