import { Navigation } from "@/components/navigation";
import Link from "next/link";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Pause, Square, FastForward, CheckCircle } from "lucide-react";

const heroHighlights = [
  {
    title: "24-hour coverage",
    description: "Track focus, sleep, errands, and everything between.",
    color: "text-[#1FDEFF]",
  },
  {
    title: "Notes-first logging",
    description: "Attach reflections to every block. Summaries auto-generate.",
    color: "text-[#F11D75]",
  },
  {
    title: "10k-hour pacing",
    description: "Flag skills that count and watch progress in real time.",
    color: "text-[#A3FF1F]",
  },
];

const timelineBlocks = [
  {
    start: "09:00",
    end: "10:13",
    label: "appsSdk - Daily Coding",
    category: "Coding",
    color: "#F11D75",
    note: '"Cracked the data flow logic for the new dashboard. Feeling unstoppable."',
  },
  {
    start: "10:15",
    end: "11:30",
    label: "API for ChatGPT Integration",
    category: "Product",
    color: "#1FDEFF",
    note: "Reviewing documentation and mapping end-points.",
  },
  {
    start: "11:30",
    end: "12:45",
    label: "UI Polish & Motion",
    category: "Design",
    color: "#A3FF1F",
    note: "Fine-tuning the hover states and transitions.",
  },
];

const weeklyData = [
  { day: "Mon", height: "85%", segments: [{ flex: 0.3, color: "#F11D75" }, { flex: 0.2, color: "#1FDEFF" }, { flex: 0.5, color: "#8B5CF6" }] },
  { day: "Tue", height: "95%", segments: [{ flex: 0.5, color: "#F11D75" }, { flex: 0.1, color: "#A3FF1F" }, { flex: 0.4, color: "#1FDEFF" }] },
  { day: "Wed", height: "60%", segments: [{ flex: 0.4, color: "#1FDEFF" }, { flex: 0.6, color: "#F11D75" }] },
  { day: "Thu", height: "70%", segments: [{ flex: 0.1, color: "#A3FF1F" }, { flex: 0.2, color: "#F97316" }, { flex: 0.7, color: "#1FDEFF" }] },
  { day: "Fri", height: "75%", segments: [{ flex: 1, color: "#A3FF1F" }] },
  { day: "Sat", height: "40%", segments: [{ flex: 1, color: "#8B5CF6" }] },
  { day: "Sun", height: "30%", segments: [{ flex: 1, color: "#1FDEFF" }] },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] radial-grid overflow-x-hidden">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 lg:py-24">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left: Hero Text */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1FDEFF]/10 border border-[#1FDEFF]/20 text-[#1FDEFF] text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1FDEFF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1FDEFF]"></span>
              </span>
              Know thyself
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight text-white">
              Log your <span className="text-[#F11D75] italic">whole</span> day, see the <span className="text-[#A3FF1F]">truth.</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed max-w-xl">
              10,000hours is the mastery ledger for people who want awareness over distractions. Track every minute, capture the story behind it, and get the insights that help you master what matters.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="px-8 py-4 bg-[#F11D75] text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all flex items-center gap-2 group neon-glow-magenta">
                    See the product
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignUpButton>
                <button className="px-8 py-4 glass-card rounded-2xl font-bold text-lg text-white hover:bg-white/10 transition-all">
                  View Demo
                </button>
              </SignedOut>
              <SignedIn>
                <Link 
                  href="/app/now" 
                  className="px-8 py-4 bg-[#F11D75] text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all flex items-center gap-2 group neon-glow-magenta"
                >
                  Start now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/app/now"
                  className="px-8 py-4 glass-card rounded-2xl font-bold text-lg text-white hover:bg-white/10 transition-all"
                >
                  View Demo
                </Link>
              </SignedIn>
            </div>
            
            {/* Hero Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 lg:pt-12 border-t border-white/10">
              {heroHighlights.map((highlight) => (
                <div key={highlight.title} className="space-y-2">
                  <div className={`${highlight.color} font-bold`}>{highlight.title}</div>
                  <p className="text-sm text-slate-500">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Hero Timer Card */}
          <div className="relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 sm:w-96 sm:h-96 bg-[#F11D75]/20 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 sm:w-96 sm:h-96 bg-[#1FDEFF]/10 rounded-full blur-[120px] animate-pulse-slow"></div>

            <div className="glass-card rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-12 relative overflow-hidden flex flex-col items-center">
              {/* Timer Header */}
              <div className="w-full flex justify-between items-center mb-6 sm:mb-8 lg:mb-12">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#F11D75] animate-pulse"></span>
                  <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-400">CS Girlies</span>
                </div>
                <div className="px-2 py-1 sm:px-4 rounded-full border border-white/10 text-[8px] sm:text-[10px] font-bold tracking-widest uppercase text-slate-500">
                  Active Session
                </div>
              </div>

              {/* Timer Ring */}
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-white/5 animate-spin-slow"></div>
                <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    className="text-[#F11D75]"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="45"
                    stroke="currentColor"
                    strokeDasharray="282.6"
                    strokeDashoffset="60"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                </svg>

                <div className="concentric-ring w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-full border-2 border-[#1FDEFF]/20 flex items-center justify-center">
                  <div className="concentric-ring w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 rounded-full border-2 border-[#A3FF1F]/20 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#F11D75] rounded-full shadow-[0_0_40px_rgba(255,31,142,0.5)]"></div>
                  </div>
                </div>

                {/* Timer Display */}
                <div className="absolute bottom-[-15%] text-center">
                  <div className="text-[8px] sm:text-[10px] tracking-[0.3em] uppercase font-bold text-slate-500 mb-1">Website Fix</div>
                  <div className="text-4xl sm:text-5xl lg:text-7xl font-bold tabular-nums text-white">24:53</div>
                  <div className="text-[10px] sm:text-xs font-medium text-slate-400 mt-1">09:40 — 10:05</div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 mt-16 sm:mt-24 lg:mt-32">
                <button className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl glass-card flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110 text-white">
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </button>
                <button className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl sm:rounded-3xl bg-[#F11D75] text-white flex items-center justify-center shadow-lg shadow-[#F11D75]/30 transform hover:rotate-12 hover:scale-110 transition-all active:scale-95">
                  <Square className="h-5 w-5 sm:h-6 sm:h-6 lg:h-8 lg:w-8" />
                </button>
                <button className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl glass-card flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110 text-white">
                  <FastForward className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </button>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 w-full mt-8 sm:mt-12 lg:mt-16">
                <div className="p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 text-center">
                  <div className="text-[8px] sm:text-[10px] uppercase font-bold text-slate-500 mb-1">Focused</div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1FDEFF]">5</div>
                </div>
                <div className="p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 text-center">
                  <div className="text-[8px] sm:text-[10px] uppercase font-bold text-slate-500 mb-1">Neutral</div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">14</div>
                </div>
                <div className="p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 text-center">
                  <div className="text-[8px] sm:text-[10px] uppercase font-bold text-slate-500 mb-1">Distracted</div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#F11D75]">4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeline Section */}
        <div className="mt-16 sm:mt-24 lg:mt-40 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-start">
          {/* Timeline Card */}
          <div className="order-2 lg:order-1 glass-card rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 lg:p-8 space-y-4">
            <div className="flex justify-between items-end mb-4 sm:mb-6 lg:mb-8">
              <div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Timeline</div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Mon, Oct 13</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Total focus</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1FDEFF]">9h 36m</div>
              </div>
            </div>
            
            <div className="relative space-y-6">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10"></div>
              
              {timelineBlocks.map((block, index) => (
                <div 
                  key={block.label} 
                  className="relative pl-14 animate-bounce-soft"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div 
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-[#0B0D10] z-10"
                    style={{ backgroundColor: block.color }}
                  ></div>
                  <div 
                    className="glass-card p-6 rounded-2xl hover:border-opacity-50 transition-colors cursor-pointer group"
                    style={{ borderColor: `${block.color}20` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-400">{block.start} — {block.end}</span>
                      <span 
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase"
                        style={{ backgroundColor: `${block.color}20`, color: block.color }}
                      >
                        {block.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-lg text-white group-hover:text-[#F11D75] transition-colors">{block.label}</h4>
                    <p className="text-sm text-slate-500 mt-1 italic">{block.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Timeline Text */}
          <div className="order-1 lg:order-2 py-4 sm:py-8 lg:py-12 space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="inline-flex px-4 py-1.5 rounded-full bg-[#A3FF1F]/10 border border-[#A3FF1F]/20 text-[#A3FF1F] text-xs font-bold uppercase tracking-wider">
              Timeline built for truth
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold leading-tight text-white">
              Drag blocks, fill gaps, and see the <span className="text-[#1FDEFF]">full story.</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed">
              The timeline makes every hour accountable. Drag to resize, drag to move, or tap an empty slot to log what really happened. Zebra stripes remind you where time is untracked.
            </p>
            <ul className="space-y-4 text-slate-300">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[#A3FF1F]" />
                Day and week views with lightning-fast editing
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[#1FDEFF]" />
                Conflict resolution to merge or split overlaps
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[#F11D75]" />
                Notes and tags surfaced alongside every block
              </li>
            </ul>
          </div>
        </div>
        
        {/* Insights Section */}
        <div className="mt-16 sm:mt-24 lg:mt-40">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Chart Card */}
            <div className="glass-card rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 lg:p-8">
              <div className="flex justify-between items-center mb-6 sm:mb-8 lg:mb-10">
                <h3 className="font-bold text-lg sm:text-xl lg:text-2xl text-white">Daily Distribution</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    This week
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-end h-48 sm:h-64 lg:h-80 gap-2 sm:gap-3">
                {weeklyData.map((day) => (
                  <div key={day.day} className="flex-1 flex flex-col justify-end items-center gap-3 h-full">
                    <div 
                      className="w-full flex flex-col rounded-xl overflow-hidden"
                      style={{ height: day.height }}
                    >
                      {day.segments.map((segment, idx) => (
                        <div 
                          key={idx}
                          style={{ flex: segment.flex, backgroundColor: segment.color }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Insights Text */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                Deep <span className="text-[#8B5CF6]">insights</span> without the noise.
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed">
                Every session rolls into rich analytics. Spot trends by category, surface unlogged time, and see pacing tips on how to close the gap between where you are and where mastery lives.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:border-[#F11D75]/50 transition-colors cursor-default">
                  Time truth
                </span>
                <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:border-[#1FDEFF]/50 transition-colors cursor-default">
                  Notes-first
                </span>
                <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:border-[#A3FF1F]/50 transition-colors cursor-default">
                  10,000-hour path
                </span>
                <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:border-[#8B5CF6]/50 transition-colors cursor-default">
                  24h coverage
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Final CTA Section */}
        <div className="mt-16 sm:mt-24 lg:mt-40 text-center space-y-6 sm:space-y-8 lg:space-y-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#F11D75]/20 blur-[80px] -z-10"></div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white">
              Master what <span className="italic text-[#F11D75]">matters.</span>
            </h2>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto">
            Join thousands of builders who track all 24 hours, learn from their notes, and pace toward 10,000 hours of deliberate practice.
          </p>
          <div className="flex flex-col items-center gap-6">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="px-6 py-4 sm:px-8 sm:py-5 lg:px-12 lg:py-6 bg-[#F11D75] text-white rounded-xl sm:rounded-2xl lg:rounded-[2rem] font-bold text-lg sm:text-xl lg:text-2xl hover:scale-110 hover:rotate-3 transition-all neon-glow-magenta group">
                  Explore the product
                  <span className="block text-[10px] sm:text-xs font-normal opacity-70 mt-1 uppercase tracking-widest">
                    No tiers. No ads. Just the truth.
                  </span>
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/app/now"
                className="px-6 py-4 sm:px-8 sm:py-5 lg:px-12 lg:py-6 bg-[#F11D75] text-white rounded-xl sm:rounded-2xl lg:rounded-[2rem] font-bold text-lg sm:text-xl lg:text-2xl hover:scale-110 hover:rotate-3 transition-all neon-glow-magenta group"
              >
                Explore the product
                <span className="block text-[10px] sm:text-xs font-normal opacity-70 mt-1 uppercase tracking-widest">
                  No tiers. No ads. Just the truth.
                </span>
              </Link>
            </SignedIn>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-16 sm:mt-24 lg:mt-40 border-t border-white/5 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span className="font-bold text-slate-400">© {new Date().getFullYear()} 10,000hours.</span>
            <span>Built for people chasing mastery.</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <a className="hover:text-[#F11D75] transition-colors" href="#">Privacy</a>
            <a className="hover:text-[#F11D75] transition-colors" href="#">Terms</a>
            <a className="hover:text-[#F11D75] transition-colors" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}