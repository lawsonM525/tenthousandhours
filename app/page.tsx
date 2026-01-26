import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { CheckCircle } from "lucide-react";
import { CTAButton } from "@/components/landing-cta";
import { TimelineGapSlot } from "@/components/timeline-gap-slot";

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
        <div className="mb-16 sm:mb-24 lg:mb-32">
          {/* Top: Badge - shows different content on mobile vs desktop */}
          <Link href="/know-thyself" className="sm:hidden inline-block bg-mango-yellow px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-4 hover:scale-105 hover:-rotate-2 transition-all">
            <span className="font-bold text-xs uppercase">Know Thyself →</span>
          </Link>
          <div className="hidden sm:inline-block bg-mango-yellow px-4 py-1 border-2 border-mango-dark transform -rotate-1 mb-6">
            <span className="font-bold text-sm uppercase">Time truth &gt; focus hacks</span>
          </div>
          
          {/* Hero Headlines - Full Width */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] uppercase text-white drop-shadow-[2px_2px_0px_#1a1a1a] sm:drop-shadow-[4px_4px_0px_#1a1a1a] mb-2 sm:mb-4">
            Log your <span className="text-mango-yellow italic underline decoration-mango-red decoration-2 sm:decoration-4">Whole</span> day,
          </h1>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] uppercase text-white drop-shadow-[2px_2px_0px_#1a1a1a] sm:drop-shadow-[4px_4px_0px_#1a1a1a] mb-8 sm:mb-12">
            see the <span className="text-mango-orange">Truth.</span>
          </h2>
          
          {/* Chart + CTA */}
          <div className="space-y-4 sm:space-y-6">
            {/* Daily Distribution Chart */}
            <div className="distressed-card p-4 sm:p-6 lg:p-8 rounded-sm sm:rotate-1 max-w-6xl">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <div className="bg-mango-dark text-white px-2 py-1 sm:px-3 text-[10px] sm:text-xs font-bold uppercase">
                  Daily Distribution
                </div>
                <div className="text-[10px] sm:text-xs font-bold uppercase text-slate-500">This week</div>
              </div>
              
              {/* Bar Chart */}
              <div className="relative">
                {/* Average line - hidden on mobile for cleaner look */}
                <div className="hidden sm:block absolute left-0 right-0 top-[100px] border-t-2 border-dashed border-slate-300 z-10">
                  <span className="absolute right-0 -top-5 text-[10px] font-bold text-slate-500 uppercase">7h 34m avg</span>
                </div>
                
                {/* Bars Container */}
                <div className="flex items-end gap-1 sm:gap-2 lg:gap-3 pb-2">
                  {[
                    { day: "M", dayFull: "MON", total: "10h", totalFull: "10h 13m", heightMobile: 120, height: 240, segments: [
                      { heightMobile: 32, height: 65, color: "bg-mango-red", category: "Coding", time: "2h 30m" },
                      { heightMobile: 28, height: 55, color: "bg-[#16C7A8]", category: "Design", time: "2h" },
                      { heightMobile: 20, height: 40, color: "bg-[#9373FF]", category: "Learning", time: "1h 30m" },
                      { heightMobile: 28, height: 55, color: "bg-[#06B6D4]", category: "Planning", time: "2h" },
                      { heightMobile: 12, height: 25, color: "bg-[#3A8DFF]", category: "Meetings", time: "1h" },
                    ]},
                    { day: "T", dayFull: "TUE", total: "9h", totalFull: "9h 31m", heightMobile: 108, height: 215, segments: [
                      { heightMobile: 48, height: 95, color: "bg-mango-red", category: "Coding", time: "4h" },
                      { heightMobile: 20, height: 40, color: "bg-[#16C7A8]", category: "Design", time: "1h 45m" },
                      { heightMobile: 28, height: 55, color: "bg-[#9373FF]", category: "Learning", time: "2h 20m" },
                      { heightMobile: 12, height: 25, color: "bg-[#06B6D4]", category: "Planning", time: "1h 10m" },
                    ]},
                    { day: "W", dayFull: "WED", total: "5h", totalFull: "5h 34m", heightMobile: 68, height: 135, segments: [
                      { heightMobile: 30, height: 60, color: "bg-[#16C7A8]", category: "Design", time: "2h 30m" },
                      { heightMobile: 25, height: 50, color: "bg-mango-orange", category: "Writing", time: "2h" },
                      { heightMobile: 13, height: 25, color: "bg-[#3A8DFF]", category: "Meetings", time: "1h" },
                    ]},
                    { day: "T", dayFull: "THU", total: "5h", totalFull: "4h 57m", heightMobile: 58, height: 115, segments: [
                      { heightMobile: 25, height: 50, color: "bg-[#16C7A8]", category: "Design", time: "2h" },
                      { heightMobile: 20, height: 40, color: "bg-mango-orange", category: "Writing", time: "1h 45m" },
                      { heightMobile: 13, height: 25, color: "bg-[#3A8DFF]", category: "Meetings", time: "1h 10m" },
                    ]},
                    { day: "F", dayFull: "FRI", total: "6h", totalFull: "6h 20m", heightMobile: 78, height: 155, segments: [
                      { heightMobile: 38, height: 75, color: "bg-[#16C7A8]", category: "Design", time: "3h" },
                      { heightMobile: 25, height: 50, color: "bg-mango-red", category: "Coding", time: "2h" },
                      { heightMobile: 15, height: 30, color: "bg-[#9373FF]", category: "Learning", time: "1h 20m" },
                    ]},
                    { day: "S", dayFull: "SAT", total: "4h", totalFull: "3h 45m", heightMobile: 45, height: 90, segments: [
                      { heightMobile: 18, height: 35, color: "bg-[#9373FF]", category: "Learning", time: "1h 30m" },
                      { heightMobile: 15, height: 30, color: "bg-[#06B6D4]", category: "Planning", time: "1h 15m" },
                      { heightMobile: 12, height: 25, color: "bg-mango-yellow", category: "Personal", time: "1h" },
                    ]},
                    { day: "S", dayFull: "SUN", total: "2h", totalFull: "2h 10m", heightMobile: 28, height: 55, segments: [
                      { heightMobile: 15, height: 30, color: "bg-[#06B6D4]", category: "Planning", time: "1h 15m" },
                      { heightMobile: 13, height: 25, color: "bg-mango-yellow", category: "Personal", time: "55m" },
                    ]},
                  ].map((day, dayIndex) => (
                    <div key={day.dayFull} className="flex-1 flex flex-col items-center group/bar">
                      {/* Stacked Bar */}
                      <div 
                        className="w-full border sm:border-2 border-mango-dark flex flex-col-reverse animate-grow-up animate-bar-dance hover:scale-105 hover:shadow-[2px_2px_0px_#1a1a1a] sm:hover:shadow-[4px_4px_0px_#1a1a1a] transition-all cursor-pointer relative"
                        style={{ 
                          animationDelay: `${dayIndex * 0.4}s`
                        }}
                      >
                        {day.segments.map((segment, segIndex) => (
                          <div 
                            key={segIndex}
                            className={`${segment.color} w-full animate-fade-in group/segment hover:brightness-110`}
                            style={{ 
                              animationDelay: `${dayIndex * 0.1 + segIndex * 0.08 + 0.2}s`
                            }}
                          >
                            <div className="h-[var(--h-mobile)] sm:h-[var(--h-desktop)]" style={{ '--h-mobile': `${segment.heightMobile}px`, '--h-desktop': `${segment.height}px` } as React.CSSProperties} />
                          </div>
                        ))}
                        {/* Tooltip - hidden on mobile, shown on desktop hover */}
                        <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-50">
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
                        className="mt-1 sm:mt-2 text-center animate-fade-in"
                        style={{ animationDelay: `${dayIndex * 0.1 + 0.3}s` }}
                      >
                        <div className="text-[8px] sm:text-[10px] font-bold text-mango-dark">
                          <span className="sm:hidden">{day.total}</span>
                          <span className="hidden sm:inline">{day.totalFull}</span>
                        </div>
                        <div className="text-[10px] sm:text-xs font-black uppercase text-slate-500">
                          <span className="sm:hidden">{day.day}</span>
                          <span className="hidden sm:inline">{day.dayFull}</span>
                        </div>
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
        <div className="mt-20 sm:mt-32 lg:mt-40 grid lg:grid-cols-2 gap-12 lg:gap-24 items-start" id="timeline">
          {/* Timeline Card */}
          <div className="order-2 lg:order-1 distressed-card p-4 sm:p-6 lg:p-8 space-y-4">
            <div className="flex justify-between items-end mb-4 sm:mb-8">
              <div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Timeline</div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-mango-dark">Mon, Oct 13</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Total focus</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-black text-mango-orange">9h 36m</div>
              </div>
            </div>
            
            {/* Vertical Timeline */}
            <div className="relative space-y-4 sm:space-y-6">
              <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-mango-dark/20"></div>
              
              {timelineBlocks.map((block, index) => (
                <div 
                  key={block.label} 
                  className="relative pl-10 sm:pl-14 animate-bounce-soft"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div 
                    className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 sm:border-4 border-white bg-${block.color} z-10`}
                  ></div>
                  <div className={`bg-white p-4 sm:p-6 border-2 border-mango-dark shadow-[2px_2px_0px_#000] sm:shadow-[4px_4px_0px_#000] hover:shadow-[4px_4px_0px_#000] sm:hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer group`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400">{block.start} — {block.end}</span>
                      <span className={`px-1.5 sm:px-2 py-0.5 bg-${block.color}/20 text-${block.color} text-[8px] sm:text-[10px] font-bold uppercase`}>
                        {block.category}
                      </span>
                    </div>
                    <h4 className={`font-black text-sm sm:text-lg text-mango-dark group-hover:text-${block.color} transition-colors`}>{block.label}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 italic line-clamp-2">{block.note}</p>
                  </div>
                </div>
              ))}
              
              {/* Gap slots - clickable to add sessions */}
              {timelineGaps.map((gap, index) => (
                <TimelineGapSlot
                  key={`gap-${gap.start}`}
                  start={gap.start}
                  end={gap.end}
                  animationDelay={`${(timelineBlocks.length + index) * 0.2}s`}
                />
              ))}
            </div>
          </div>
          
          {/* Timeline Text */}
          <div className="order-1 lg:order-2 py-6 sm:py-12 space-y-4 sm:space-y-8">
            {/* Badge - shows different content on mobile vs desktop */}
            <Link href="/memento-mori" className="sm:hidden inline-block bg-mango-yellow px-3 py-1 border-2 border-mango-dark transform -rotate-1 hover:scale-105 hover:-rotate-2 transition-all">
              <span className="font-bold text-xs uppercase">Memento Mori →</span>
            </Link>
            <div className="hidden sm:inline-block bg-mango-yellow px-4 py-1 border-2 border-mango-dark transform -rotate-1">
              <span className="font-bold text-sm uppercase">Timeline built for truth</span>
            </div>
            <h2 className="font-black text-3xl sm:text-4xl lg:text-6xl xl:text-7xl uppercase leading-tight text-white drop-shadow-[2px_2px_0px_#000] sm:drop-shadow-[4px_4px_0px_#000]">
              Drag blocks, fill gaps, and see the <span className="text-mango-orange">full story.</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl font-medium text-mango-dark max-w-xl">
              The timeline makes every hour accountable. Drag to resize, drag to move, or tap an empty slot to log what really happened.
            </p>
            <ul className="space-y-3 sm:space-y-4 text-mango-dark font-medium text-sm sm:text-base">
              <li className="flex items-center gap-2 sm:gap-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-mango-yellow shrink-0" />
                Day and week views with lightning-fast editing
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-mango-orange shrink-0" />
                Conflict resolution to merge or split overlaps
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-mango-red shrink-0" />
                Notes and tags surfaced alongside every block
              </li>
            </ul>
          </div>
        </div>
        
        {/* Insights Section */}
        <div className="mt-20 sm:mt-32 lg:mt-40 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start" id="insights">
          {/* Text */}
          <div className="space-y-4 sm:space-y-8 order-2 lg:order-1 py-6 sm:py-12">
            <div className="inline-block bg-mango-yellow px-3 sm:px-4 py-1 border-2 border-mango-dark transform -rotate-1">
              <span className="font-bold text-xs sm:text-sm uppercase">Analytics that matter</span>
            </div>
            <h2 className="font-black text-3xl sm:text-4xl lg:text-6xl xl:text-7xl uppercase leading-tight text-white drop-shadow-[2px_2px_0px_#000] sm:drop-shadow-[4px_4px_0px_#000]">
              Deep <span className="text-mango-yellow italic">Insights</span> Without <span className="text-mango-red">The Noise.</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl font-medium text-mango-dark max-w-xl">
              Every session rolls into rich analytics. Spot trends by category, surface unlogged time, and see pacing tips.
            </p>
            <ul className="space-y-3 sm:space-y-4 text-mango-dark font-medium text-sm sm:text-base">
              <li className="flex items-center gap-2 sm:gap-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-mango-yellow shrink-0" />
                Weekly totals and daily averages at a glance
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-mango-orange shrink-0" />
                Category breakdown with progress tracking
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-mango-red shrink-0" />
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
          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {insightStats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="distressed-card p-3 sm:p-5 animate-bounce-soft"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-[8px] sm:text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">{stat.label}</div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xl sm:text-2xl lg:text-3xl font-black">{stat.value}</div>
                      <div className="text-[10px] sm:text-xs text-slate-400">{stat.sublabel}</div>
                    </div>
                    {stat.change && (
                      <span className={`text-xs sm:text-sm font-bold ${stat.positive ? 'text-mango-green' : 'text-mango-red'}`}>
                        {stat.change}
                      </span>
                    )}
                    {stat.ratio && (
                      <span className="text-xs sm:text-sm font-bold text-mango-orange">{stat.ratio}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Category Breakdown */}
            <div className="distressed-card p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="font-black text-base sm:text-xl uppercase">Category Breakdown</h3>
                <span className="font-bold text-[10px] sm:text-xs uppercase bg-mango-dark text-white px-2 sm:px-3 py-1">This Week</span>
              </div>
              
              <div className="space-y-4 sm:space-y-5">
                {categoryBreakdown.map((cat, index) => (
                  <div 
                    key={cat.name}
                    className="animate-bounce-soft"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${cat.color}`}></div>
                        <span className="font-bold text-sm sm:text-base">{cat.name}</span>
                      </div>
                      <span className="font-black text-base sm:text-lg">{cat.hours}</span>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-slate-100 border border-mango-dark overflow-hidden">
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
            <div className="distressed-card p-4 sm:p-6 bg-mango-dark text-white animate-bounce-soft" style={{ animationDelay: '0.4s' }}>
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-mango-green flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-slate-300">Mastery Pace</span>
                </div>
                <span className="text-mango-yellow text-[10px] sm:text-xs font-bold uppercase cursor-pointer hover:underline">View Plan →</span>
              </div>
              <h4 className="font-black text-lg sm:text-xl lg:text-2xl mb-2">ML Engineering — 4,212 / 10,000 hrs</h4>
              <p className="text-xs sm:text-sm text-slate-300 mb-3 sm:mb-4">Reach 10k hrs by Feb 2028. Pace needed: 18.5h/week</p>
              <div className="h-2 sm:h-3 bg-slate-700 border border-slate-500 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-mango-red via-mango-orange to-mango-yellow" style={{ width: '42%' }} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Final CTA Section */}
        <div className="mt-20 sm:mt-32 lg:mt-40 text-center py-12 sm:py-16 lg:py-24 px-4 sm:px-8 bg-mango-dark border-2 sm:border-4 border-white shadow-[6px_6px_0px_#FFB31A] sm:shadow-[12px_12px_0px_#FFB31A]">
          <h2 className="font-black text-3xl sm:text-5xl lg:text-7xl xl:text-8xl text-white mb-6 sm:mb-8 lg:mb-12 tracking-tighter">
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
      <footer className="mt-20 sm:mt-32 lg:mt-40 border-t-2 sm:border-t-4 border-mango-dark bg-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image src="/logo.svg" alt="10,000 Hours" width={24} height={24} className="sm:w-8 sm:h-8" />
              <span className="font-bold text-base sm:text-xl uppercase italic">10,000HOURS</span>
            </div>
            <p className="font-bold text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 text-center md:text-left">© 2025. Built for those who chase mastery.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 lg:gap-12 text-xs sm:text-sm font-black uppercase tracking-widest text-mango-dark">
            <a className="hover:text-mango-red underline decoration-2 sm:decoration-4 decoration-mango-yellow" href="https://lwsnlabs.featurebase.app" target="_blank" rel="noopener noreferrer">Feedback</a>
            <a className="hover:text-mango-red underline decoration-2 sm:decoration-4 decoration-mango-red" href="#">Privacy</a>
            <a className="hover:text-mango-red underline decoration-2 sm:decoration-4 decoration-mango-orange" href="#">Terms</a>
            <a className="hover:text-mango-red underline decoration-2 sm:decoration-4 decoration-mango-dark" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}