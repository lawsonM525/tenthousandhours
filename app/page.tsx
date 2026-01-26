import { Navigation } from "@/components/navigation";
import Link from "next/link";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { CheckCircle } from "lucide-react";

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

const weeklyData = [
  { day: "M", height: "80%", color: "bg-mango-red" },
  { day: "T", height: "95%", color: "bg-mango-orange" },
  { day: "W", height: "60%", color: "bg-mango-yellow" },
  { day: "T", height: "75%", color: "bg-mango-red" },
  { day: "F", height: "90%", color: "bg-mango-orange" },
  { day: "S", height: "40%", color: "bg-mango-yellow" },
  { day: "S", height: "20%", color: "bg-slate-200" },
];

export default function Home() {
  return (
    <div className="min-h-screen mango-pattern text-mango-dark font-sans selection:bg-mango-orange selection:text-white">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
          {/* Left: Hero Text */}
          <div className="space-y-8">
            <div className="inline-block bg-mango-yellow px-4 py-1 border-2 border-mango-dark transform -rotate-1">
              <span className="font-bold text-sm uppercase">Time truth &gt; focus hacks</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black leading-none uppercase text-white drop-shadow-[4px_4px_0px_#1a1a1a]">
              Log your <br/>
              <span className="text-mango-yellow italic underline decoration-mango-red">Whole</span> day, <br/>
              see the <span className="text-mango-orange">Truth.</span>
            </h1>
            
            <p className="text-xl font-medium text-mango-dark bg-white/40 p-6 border-l-4 border-mango-dark backdrop-blur-sm max-w-xl">
              10,000hours is the mastery ledger for people who want awareness over distractions. Track every minute, capture the story, and master what matters.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="px-8 py-4 bg-mango-red text-white border-2 border-mango-dark font-bold text-2xl uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all">
                    Get Started
                  </button>
                </SignUpButton>
                <button className="px-8 py-4 bg-white text-mango-dark border-2 border-mango-dark font-bold text-2xl uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all">
                  View Demo
                </button>
              </SignedOut>
              <SignedIn>
                <Link 
                  href="/app/now" 
                  className="px-8 py-4 bg-mango-red text-white border-2 border-mango-dark font-bold text-2xl uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all"
                >
                  Get Started
                </Link>
                <Link 
                  href="/app/now"
                  className="px-8 py-4 bg-white text-mango-dark border-2 border-mango-dark font-bold text-2xl uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all"
                >
                  View Demo
                </Link>
              </SignedIn>
            </div>
          </div>
          
          {/* Right: Mastery Insights Card */}
          <div className="distressed-card p-8 rounded-sm rotate-1">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-3xl uppercase">Mastery Insights</h3>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-mango-red"></div>
                <div className="w-3 h-3 rounded-full bg-mango-orange"></div>
                <div className="w-3 h-3 rounded-full bg-mango-yellow"></div>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Circular Progress */}
              <div className="flex items-center justify-center py-10">
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#f0f0f0" strokeWidth="12" />
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#E62E2D" strokeDasharray="251.2" strokeDashoffset="60" strokeWidth="12" />
                    <circle cx="50" cy="50" fill="none" r="30" stroke="#FFB31A" strokeDasharray="188.4" strokeDashoffset="100" strokeWidth="12" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-black text-5xl">84%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Focus Rate</span>
                  </div>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-mango-red/10 border-2 border-mango-red rounded-sm">
                  <div className="text-[10px] uppercase font-black text-mango-red">Deep Work</div>
                  <div className="text-2xl font-black uppercase">06:42</div>
                </div>
                <div className="p-4 bg-mango-orange/10 border-2 border-mango-orange rounded-sm">
                  <div className="text-[10px] uppercase font-black text-mango-orange">Planning</div>
                  <div className="text-2xl font-black uppercase">02:15</div>
                </div>
              </div>
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
        <div className="mt-40 grid lg:grid-cols-2 gap-16 items-center" id="insights">
          {/* Text */}
          <div className="space-y-8 order-2 lg:order-1">
            <h2 className="font-black text-5xl lg:text-6xl xl:text-7xl uppercase leading-tight text-white drop-shadow-[4px_4px_0px_#000]">
              Deep <span className="text-mango-yellow italic">Insights</span> Without <span className="text-mango-red">The Noise.</span>
            </h2>
            <p className="text-xl font-medium text-mango-dark max-w-xl">
              Every session rolls into rich analytics. Spot trends by category, surface unlogged time, and see pacing tips on how to close the gap toward mastery.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-6 py-2 bg-white border-2 border-mango-dark font-bold uppercase text-lg">Daily Heatmap</span>
              <span className="px-6 py-2 bg-white border-2 border-mango-dark font-bold uppercase text-lg">Goal Pacing</span>
              <span className="px-6 py-2 bg-white border-2 border-mango-dark font-bold uppercase text-lg">Flow State</span>
            </div>
          </div>
          
          {/* Chart Card */}
          <div className="distressed-card p-10 order-1 lg:order-2">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-black text-3xl uppercase">Weekly Distribution</h3>
              <span className="font-bold text-xs uppercase bg-mango-dark text-white px-3 py-1">Last 7 Days</span>
            </div>
            
            <div className="flex items-end justify-between h-64 gap-3">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full">
                  <div 
                    className={`w-full ${day.color} border-2 border-mango-dark`}
                    style={{ height: day.height }}
                  />
                  <span className="font-black text-xs">{day.day}</span>
                </div>
              ))}
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
            <SignUpButton mode="modal">
              <button className="px-16 py-8 bg-mango-yellow text-mango-dark border-4 border-white font-black text-3xl lg:text-4xl uppercase hover:scale-105 hover:-rotate-2 transition-all shadow-[8px_8px_0px_#E62E2D]">
                Start Your Journey
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link 
              href="/app/now"
              className="inline-block px-16 py-8 bg-mango-yellow text-mango-dark border-4 border-white font-black text-3xl lg:text-4xl uppercase hover:scale-105 hover:-rotate-2 transition-all shadow-[8px_8px_0px_#E62E2D]"
            >
              Start Your Journey
            </Link>
          </SignedIn>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-40 border-t-4 border-mango-dark bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-mango-dark text-mango-yellow rounded flex items-center justify-center font-bold">10K</div>
              <span className="font-bold text-xl uppercase italic">10,000HOURS</span>
            </div>
            <p className="font-bold text-xs uppercase tracking-widest text-slate-400">© 2025. Built for those who chase mastery.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12 text-sm font-black uppercase tracking-widest text-mango-dark">
            <a className="hover:text-mango-red underline decoration-4 decoration-mango-yellow" href="#">Product</a>
            <a className="hover:text-mango-red underline decoration-4 decoration-mango-red" href="#">Privacy</a>
            <a className="hover:text-mango-red underline decoration-4 decoration-mango-orange" href="#">Terms</a>
            <a className="hover:text-mango-red underline decoration-4 decoration-mango-dark" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}