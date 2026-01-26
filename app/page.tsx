import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { CheckCircle } from "lucide-react";
import { CTAButton } from "@/components/landing-cta";

const timelineBlocks = [
  {
    start: "09:00",
    end: "10:13",
    label: "appsSdk - Daily Coding",
    category: "Coding",
    color: "mango-red",
    note: '"Cracked the data flow logic for the new dashboard. Feeling unstoppable."',
  },
  {
    start: "10:15",
    end: "11:30",
    label: "API for ChatGPT Integration",
    category: "Product",
    color: "mango-orange",
    note: "Reviewing documentation and mapping end-points.",
  },
  {
    start: "11:30",
    end: "12:45",
    label: "UI Polish & Motion",
    category: "Design",
    color: "mango-yellow",
    note: "Fine-tuning the hover states and transitions.",
  },
];

const timelineGaps = [
  { start: "12:45", end: "13:30", label: "Untracked time" },
];

const _weeklyData = [
  { day: "M", segments: [
    { height: 70, color: "bg-mango-red" },
    { height: 55, color: "bg-mango-orange" },
    { height: 50, color: "bg-mango-yellow" },
  ]},
  { day: "T", segments: [
    { height: 80, color: "bg-mango-yellow" },
    { height: 65, color: "bg-mango-red" },
    { height: 60, color: "bg-mango-green" },
  ]},
  { day: "W", segments: [
    { height: 45, color: "bg-mango-orange" },
    { height: 55, color: "bg-mango-yellow" },
    { height: 35, color: "bg-mango-red" },
  ]},
  { day: "T", segments: [
    { height: 55, color: "bg-mango-red" },
    { height: 45, color: "bg-mango-green" },
    { height: 65, color: "bg-mango-orange" },
  ]},
  { day: "F", segments: [
    { height: 90, color: "bg-mango-yellow" },
    { height: 65, color: "bg-mango-red" },
    { height: 45, color: "bg-mango-orange" },
  ]},
  { day: "S", segments: [
    { height: 35, color: "bg-mango-green" },
    { height: 35, color: "bg-mango-yellow" },
    { height: 25, color: "bg-mango-red" },
  ]},
  { day: "S", segments: [
    { height: 25, color: "bg-mango-orange" },
    { height: 20, color: "bg-slate-300" },
  ]},
];

const insightStats = [
  { label: "This Week", value: "26h 35m", sublabel: "total focus", change: "+12%", positive: true },
  { label: "Average / Day", value: "3h 48m", sublabel: "logged", change: "+18%", positive: true },
  { label: "Most Time", value: "Noon", sublabel: "focus/break", ratio: "7.2 / 1" },
  { label: "Unassigned", value: "3h 40m", sublabel: "gap to log", change: "-24%", positive: false },
];

const categoryBreakdown = [
  { name: "Coding", hours: "10h", percent: 40, color: "bg-mango-red" },
  { name: "Design", hours: "8h", percent: 32, color: "bg-mango-orange" },
  { name: "Spirituality", hours: "4h", percent: 16, color: "bg-mango-yellow" },
  { name: "Social", hours: "3h", percent: 12, color: "bg-[#2EB7E5]" },
];

export default function Home() {
  return (
    <div className="min-h-screen mango-pattern text-mango-dark font-sans selection:bg-mango-orange selection:text-white">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Hero Section - Full Width */}
        <div className="mb-32">
          {/* Top: Badge */}
          <div className="inline-block bg-mango-yellow px-4 py-1 border-2 border-mango-dark transform -rotate-1 mb-6">
            <span className="font-bold text-sm uppercase">Time truth &gt; focus hacks</span>
          </div>
          
          {/* Hero Headlines - Full Width */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] uppercase text-white drop-shadow-[4px_4px_0px_#1a1a1a] mb-4">
            Log your <span className="text-mango-yellow italic underline decoration-mango-red decoration-4">Whole</span> day,
          </h1>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] uppercase text-white drop-shadow-[4px_4px_0px_#1a1a1a] mb-12">
            see the <span className="text-mango-orange">Truth.</span>
          </h2>
          
          {/* Chart + CTA */}
          <div className="space-y-6">
            {/* Daily Distribution Chart */}
            <div className="distressed-card p-6 lg:p-8 rounded-sm rotate-1 max-w-6xl">
              <div className="flex justify-between items-center mb-6">
                <div className="bg-mango-dark text-white px-3 py-1 text-xs font-bold uppercase">
                  Daily Distribution
                </div>
                <div className="text-xs font-bold uppercase text-slate-500">This week</div>
              </div>
              
              {/* Bar Chart */}
              <div className="relative">
                {/* Average line */}
                <div className="absolute left-0 right-0 top-[100px] border-t-2 border-dashed border-slate-300 z-10">
                  <span className="absolute right-0 -top-5 text-[10px] font-bold text-slate-500 uppercase">7h 34m avg</span>
                </div>
                
                {/* Bars Container */}
                <div className="flex items-end gap-2 lg:gap-3 pb-2">
                  {[
                    { day: "MON", total: "10h 13m", height: 240, segments: [
                      { height: 65, color: "bg-mango-red", category: "Coding", time: "2h 30m" },
                      { height: 55, color: "bg-[#16C7A8]", category: "Design", time: "2h" },
                      { height: 40, color: "bg-[#9373FF]", category: "Learning", time: "1h 30m" },
                      { height: 55, color: "bg-[#06B6D4]", category: "Planning", time: "2h" },
                      { height: 25, color: "bg-[#3A8DFF]", category: "Meetings", time: "1h" },
                    ]},
                    { day: "TUE", total: "9h 31m", height: 215, segments: [
                      { height: 95, color: "bg-mango-red", category: "Coding", time: "4h" },
                      { height: 40, color: "bg-[#16C7A8]", category: "Design", time: "1h 45m" },
                      { height: 55, color: "bg-[#9373FF]", category: "Learning", time: "2h 20m" },
                      { height: 25, color: "bg-[#06B6D4]", category: "Planning", time: "1h 10m" },
                    ]},
                    { day: "WED", total: "5h 34m", height: 135, segments: [
                      { height: 60, color: "bg-[#16C7A8]", category: "Design", time: "2h 30m" },
                      { height: 50, color: "bg-mango-orange", category: "Writing", time: "2h" },
                      { height: 25, color: "bg-[#3A8DFF]", category: "Meetings", time: "1h" },
                    ]},
                    { day: "THU", total: "4h 57m", height: 115, segments: [
                      { height: 50, color: "bg-[#16C7A8]", category: "Design", time: "2h" },
                      { height: 40, color: "bg-mango-orange", category: "Writing", time: "1h 45m" },
                      { height: 25, color: "bg-[#3A8DFF]", category: "Meetings", time: "1h 10m" },
                    ]},
                    { day: "FRI", total: "6h 20m", height: 155, segments: [
                      { height: 75, color: "bg-[#16C7A8]", category: "Design", time: "3h" },
                      { height: 50, color: "bg-mango-red", category: "Coding", time: "2h" },
                      { height: 30, color: "bg-[#9373FF]", category: "Learning", time: "1h 20m" },
                    ]},
                    { day: "SAT", total: "3h 45m", height: 90, segments: [
                      { height: 35, color: "bg-[#9373FF]", category: "Learning", time: "1h 30m" },
                      { height: 30, color: "bg-[#06B6D4]", category: "Planning", time: "1h 15m" },
                      { height: 25, color: "bg-mango-yellow", category: "Personal", time: "1h" },
                    ]},
                    { day: "SUN", total: "2h 10m", height: 55, segments: [
                      { height: 30, color: "bg-[#06B6D4]", category: "Planning", time: "1h 15m" },
                      { height: 25, color: "bg-mango-yellow", category: "Personal", time: "55m" },
                    ]},
                  ].map((day, dayIndex) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center group/bar">
                      {/* Stacked Bar */}
                      <div 
                        className="w-full border-2 border-mango-dark flex flex-col-reverse animate-grow-up animate-bar-dance hover:scale-105 hover:shadow-[4px_4px_0px_#1a1a1a] transition-all cursor-pointer relative"
                        style={{ 
                          height: `${day.height}px`,
                          animationDelay: `${dayIndex * 0.4}s`
                        }}
                      >
                        {day.segments.map((segment, segIndex) => (
                          <div 
                            key={segIndex}
                            className={`${segment.color} w-full animate-fade-in group/segment hover:brightness-110`}
                            style={{ 
                              height: `${segment.height}px`,
                              animationDelay: `${dayIndex * 0.1 + segIndex * 0.08 + 0.2}s`
                            }}
                          />
                        ))}
                        {/* Tooltip - positioned outside the bar */}
                        <div className="absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-50">
                          <div className="bg-mango-dark text-white px-3 py-2 text-[10px] font-bold uppercase whitespace-nowrap border-2 border-white/20 shadow-[2px_2px_0px_#000]">
                            <div className="space-y-1">
                              {day.segments.slice().reverse().map((seg, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className={`w-2 h-2 ${seg.color}`} />
                                  <span>{seg.category}: {seg.time}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Labels */}
                      <div 
                        className="mt-2 text-center animate-fade-in"
                        style={{ animationDelay: `${dayIndex * 0.1 + 0.3}s` }}
                      >
                        <div className="text-[10px] font-bold text-mango-dark">{day.total}</div>
                        <div className="text-xs font-black uppercase text-slate-500">{day.day}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="flex justify-start">
              <SignedOut>
                <CTAButton
                  variant="primary"
                  ctaName="Get Started"
                  ctaLocation="hero"
                  isSignUp={true}
                >
                  Get Started
                </CTAButton>
              </SignedOut>
              <SignedIn>
                <CTAButton
                  href="/app/now"
                  variant="primary"
                  ctaName="Get Started"
                  ctaLocation="hero"
                >
                  Get Started
                </CTAButton>
              </SignedIn>
            </div>
          </div>
        </div>
        
        {/* Timeline Section */}
        <div className="mt-40 grid lg:grid-cols-2 gap-24 items-start" id="timeline">
          {/* Timeline Card */}
          <div className="order-2 lg:order-1 distressed-card p-8 space-y-4">
            <div className="flex justify-between items-end mb-8">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Timeline</div>
                <div className="text-3xl font-black text-mango-dark">Mon, Oct 13</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Total focus</div>
                <div className="text-2xl font-black text-mango-orange">9h 36m</div>
              </div>
            </div>
            
            {/* Vertical Timeline */}
            <div className="relative space-y-6">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-mango-dark/20"></div>
              
              {timelineBlocks.map((block, index) => (
                <div 
                  key={block.label} 
                  className="relative pl-14 animate-bounce-soft"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div 
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white bg-${block.color} z-10`}
                  ></div>
                  <div className={`bg-white p-6 border-2 border-mango-dark shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer group`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-400">{block.start} — {block.end}</span>
                      <span className={`px-2 py-0.5 bg-${block.color}/20 text-${block.color} text-[10px] font-bold uppercase`}>
                        {block.category}
                      </span>
                    </div>
                    <h4 className={`font-black text-lg text-mango-dark group-hover:text-${block.color} transition-colors`}>{block.label}</h4>
                    <p className="text-sm text-slate-500 mt-1 italic">{block.note}</p>
                  </div>
                </div>
              ))}
              
              {/* Gap slots - clickable to add sessions */}
              {timelineGaps.map((gap, index) => (
                <div 
                  key={`gap-${gap.start}`} 
                  className="relative pl-14 animate-bounce-soft"
                  style={{ animationDelay: `${(timelineBlocks.length + index) * 0.2}s` }}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white bg-slate-300 z-10 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-slate-500">+</span>
                  </div>
                  <div className="bg-white/50 p-6 border-2 border-dashed border-mango-dark/40 hover:border-mango-dark hover:bg-white hover:shadow-[4px_4px_0px_#000] transition-all cursor-pointer group">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400">{gap.start} — {gap.end}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase group-hover:bg-mango-yellow group-hover:text-mango-dark transition-colors">
                        + Add Session
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2 group-hover:text-mango-dark transition-colors">Click to log what happened during this time</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Timeline Text */}
          <div className="order-1 lg:order-2 py-12 space-y-8">
            <div className="inline-block bg-mango-yellow px-4 py-1 border-2 border-mango-dark transform -rotate-1">
              <span className="font-bold text-sm uppercase">Timeline built for truth</span>
            </div>
            <h2 className="font-black text-5xl lg:text-6xl xl:text-7xl uppercase leading-tight text-white drop-shadow-[4px_4px_0px_#000]">
              Drag blocks, fill gaps, and see the <span className="text-mango-orange">full story.</span>
            </h2>
            <p className="text-xl font-medium text-mango-dark max-w-xl">
              The timeline makes every hour accountable. Drag to resize, drag to move, or tap an empty slot to log what really happened. Zebra stripes remind you where time is untracked.
            </p>
            <ul className="space-y-4 text-mango-dark font-medium">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-mango-yellow" />
                Day and week views with lightning-fast editing
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-mango-orange" />
                Conflict resolution to merge or split overlaps
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-mango-red" />
                Notes and tags surfaced alongside every block
              </li>
            </ul>
          </div>
        </div>
        
        {/* Insights Section */}
        <div className="mt-40 grid lg:grid-cols-2 gap-16 items-start" id="insights">
          {/* Text */}
          <div className="space-y-8 order-2 lg:order-1 py-12">
            <div className="inline-block bg-mango-yellow px-4 py-1 border-2 border-mango-dark transform -rotate-1">
              <span className="font-bold text-sm uppercase">Analytics that matter</span>
            </div>
            <h2 className="font-black text-5xl lg:text-6xl xl:text-7xl uppercase leading-tight text-white drop-shadow-[4px_4px_0px_#000]">
              Deep <span className="text-mango-yellow italic">Insights</span> Without <span className="text-mango-red">The Noise.</span>
            </h2>
            <p className="text-xl font-medium text-mango-dark max-w-xl">
              Every session rolls into rich analytics. Spot trends by category, surface unlogged time, and see pacing tips on how to close the gap toward mastery.
            </p>
            <ul className="space-y-4 text-mango-dark font-medium">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-mango-yellow" />
                Weekly totals and daily averages at a glance
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-mango-orange" />
                Category breakdown with progress tracking
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-mango-red" />
                Mastery pacing to hit your 10,000 hour goal
              </li>
            </ul>
            <div className="flex flex-wrap gap-4 pt-4">
              <SignedOut>
                <CTAButton
                  variant="primary"
                  ctaName="Start Tracking"
                  ctaLocation="insights"
                  isSignUp={true}
                >
                  Start Tracking
                </CTAButton>
              </SignedOut>
              <SignedIn>
                <CTAButton
                  href="/app/now"
                  variant="primary"
                  ctaName="Start Tracking"
                  ctaLocation="insights"
                >
                  Start Tracking
                </CTAButton>
              </SignedIn>
            </div>
          </div>
          
          {/* Insights Cards */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {insightStats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="distressed-card p-5 animate-bounce-soft"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">{stat.label}</div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-black">{stat.value}</div>
                      <div className="text-xs text-slate-400">{stat.sublabel}</div>
                    </div>
                    {stat.change && (
                      <span className={`text-sm font-bold ${stat.positive ? 'text-mango-green' : 'text-mango-red'}`}>
                        {stat.change}
                      </span>
                    )}
                    {stat.ratio && (
                      <span className="text-sm font-bold text-mango-orange">{stat.ratio}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Category Breakdown */}
            <div className="distressed-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl uppercase">Category Breakdown</h3>
                <span className="font-bold text-xs uppercase bg-mango-dark text-white px-3 py-1">This Week</span>
              </div>
              
              <div className="space-y-5">
                {categoryBreakdown.map((cat, index) => (
                  <div 
                    key={cat.name}
                    className="animate-bounce-soft"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                        <span className="font-bold">{cat.name}</span>
                      </div>
                      <span className="font-black text-lg">{cat.hours}</span>
                    </div>
                    <div className="h-2 bg-slate-100 border border-mango-dark overflow-hidden">
                      <div 
                        className={`h-full ${cat.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mastery Pace Card */}
            <div className="distressed-card p-6 bg-mango-dark text-white animate-bounce-soft" style={{ animationDelay: '0.4s' }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-mango-green flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs uppercase font-bold tracking-widest text-slate-300">Mastery Pace</span>
                </div>
                <span className="text-mango-yellow text-xs font-bold uppercase cursor-pointer hover:underline">View Plan →</span>
              </div>
              <h4 className="font-black text-2xl mb-2">ML Engineering — 4,212 / 10,000 hrs</h4>
              <p className="text-sm text-slate-300 mb-4">Reach 10k hrs by Feb 2028. Pace needed: 18.5h/week · You&apos;re at 14.2.</p>
              <div className="h-3 bg-slate-700 border border-slate-500 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-mango-red via-mango-orange to-mango-yellow" style={{ width: '42%' }} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Final CTA Section */}
        <div className="mt-40 text-center py-24 bg-mango-dark border-4 border-white shadow-[12px_12px_0px_#FFB31A]">
          <h2 className="font-black text-6xl lg:text-7xl xl:text-8xl text-white mb-12 tracking-tighter">
            Your time is <span className="text-mango-yellow italic">scarce.</span>
            <br />
            Make it <span className="text-mango-green">count.</span>
          </h2>
          <SignedOut>
            <CTAButton
              variant="final"
              ctaName="Start Your Journey"
              ctaLocation="footer"
              isSignUp={true}
            >
              Start Your Journey
            </CTAButton>
          </SignedOut>
          <SignedIn>
            <CTAButton
              href="/app/now"
              variant="final"
              ctaName="Start Your Journey"
              ctaLocation="footer"
            >
              Start Your Journey
            </CTAButton>
          </SignedIn>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-40 border-t-4 border-mango-dark bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="10,000 Hours" width={32} height={32} />
              <span className="font-bold text-xl uppercase italic">10,000HOURS</span>
            </div>
            <p className="font-bold text-xs uppercase tracking-widest text-slate-400">© 2025. Built for those who chase mastery.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12 text-sm font-black uppercase tracking-widest text-mango-dark">
            <a className="hover:text-mango-red underline decoration-4 decoration-mango-yellow" href="https://lwsnlabs.featurebase.app" target="_blank" rel="noopener noreferrer">Feedback</a>
            <a className="hover:text-mango-red underline decoration-4 decoration-mango-red" href="#">Privacy</a>
            <a className="hover:text-mango-red underline decoration-4 decoration-mango-orange" href="#">Terms</a>
            <a className="hover:text-mango-red underline decoration-4 decoration-mango-dark" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}