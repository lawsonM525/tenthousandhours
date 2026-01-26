import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { CTAButton } from "@/components/landing-cta";
import { CheckCircle, Clock, Target, TrendingUp, Eye } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Know Thyself | 10,000 Hours - Master Your Time, Master Yourself",
  description: "Track your time like you track your finances. Time is money. See how you really spend your days, build mastery through deliberate practice, and become the person you say you want to be.",
  keywords: ["time tracking", "10000 hour rule", "mastery", "productivity", "self improvement", "deliberate practice", "goal tracking"],
  openGraph: {
    title: "Know Thyself | 10,000 Hours",
    description: "Are you really working on your goals? Track your time and find out.",
  },
};

export default function KnowThyself() {
  return (
    <div className="min-h-screen mango-pattern text-mango-dark font-sans selection:bg-mango-orange selection:text-white">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        {/* Hero */}
        <div className="mb-16 sm:mb-24">
          <div className="inline-block bg-mango-yellow px-3 py-1 sm:px-4 border-2 border-mango-dark transform -rotate-1 mb-4 sm:mb-6">
            <span className="font-bold text-xs sm:text-sm uppercase">The Philosophy</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[0.95] uppercase text-white drop-shadow-[2px_2px_0px_#1a1a1a] sm:drop-shadow-[4px_4px_0px_#1a1a1a] mb-6 sm:mb-8">
            Know <span className="text-mango-yellow italic">Thyself.</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl font-medium text-mango-dark max-w-2xl leading-relaxed">
            The ancient wisdom that changes everything when you actually apply it.
          </p>
        </div>

        {/* The Hard Question */}
        <section className="mb-16 sm:mb-24">
          <div className="distressed-card p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase mb-6 text-mango-dark">
              The Hard Question
            </h2>
            
            <div className="space-y-6 text-base sm:text-lg text-mango-dark leading-relaxed">
              <p>
                You say you&apos;re working on your goals.
              </p>
              
              <p className="text-xl sm:text-2xl font-bold text-mango-red">
                But if someone watched how you actually spend your days—would they believe you?
              </p>
              
              <p>
                Most of us would have to admit: probably not.
              </p>
              
              <p>
                We tell ourselves we&apos;re serious about learning that skill, building that business, getting in shape. But our time tells a different story. Hours disappear into scrolling. Days blur together. Weeks pass without real progress.
              </p>
              
              <p className="font-bold">
                The gap between who we say we are and how we spend our time—that&apos;s where dreams go to die.
              </p>
            </div>
          </div>
        </section>

        {/* Time is Money */}
        <section className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-mango-orange rounded-full flex items-center justify-center border-2 border-mango-dark">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white drop-shadow-[2px_2px_0px_#1a1a1a]">
              Time is Money
            </h2>
          </div>
          
          <div className="space-y-6 text-base sm:text-lg text-mango-dark leading-relaxed">
            <p>
              You track your finances. You know where your money goes. You budget, you save, you invest.
            </p>
            
            <p className="text-xl sm:text-2xl font-bold">
              Why don&apos;t you do the same with your time?
            </p>
            
            <p>
              Time is the only resource you can never get back. Every hour you spend is gone forever. Yet most people have no idea where their time actually goes.
            </p>
            
            <p>
              <span className="font-bold">10,000 Hours</span> is your time ledger. Track every hour like you track every dollar. See exactly where your life is going—and decide if that&apos;s where you want it to go.
            </p>
          </div>
          
          {/* CTA: Memento Mori */}
          <div className="mt-8 p-6 bg-mango-dark border-2 border-white rounded-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase mb-1">How much time do you have left?</h3>
                <p className="text-sm text-slate-300">Calculate your remaining days. It&apos;s sobering—and motivating.</p>
              </div>
              <Link 
                href="/memento-mori" 
                className="inline-block bg-mango-yellow px-5 py-3 border-2 border-white font-bold text-sm sm:text-base uppercase text-mango-dark hover:scale-105 hover:-rotate-1 transition-all shadow-[3px_3px_0px_#fff] whitespace-nowrap"
              >
                Calculate Now →
              </Link>
            </div>
          </div>
        </section>

        {/* The Path to Mastery */}
        <section className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-mango-red rounded-full flex items-center justify-center border-2 border-mango-dark">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white drop-shadow-[2px_2px_0px_#1a1a1a]">
              The Path to Mastery
            </h2>
          </div>
          
          <div className="space-y-6 text-base sm:text-lg text-mango-dark leading-relaxed">
            <p>
              You&apos;ve heard of the 10,000 hour rule. Put in 10,000 hours of deliberate practice, and you become an expert.
            </p>
            
            <p>
              But here&apos;s what most people miss: it&apos;s not just about logging hours. It&apos;s about <span className="font-bold">quality focus time</span>. Deliberate practice. Pushing your limits, not just going through the motions.
            </p>
            
            <p className="text-xl sm:text-2xl font-bold text-mango-orange">
              Imagine being able to say: &quot;I put 10,000 hours of focused practice into this skill. I&apos;m an expert.&quot;
            </p>
            
            <p>
              That&apos;s not arrogance. That&apos;s earned confidence. That&apos;s mastery you can prove—to yourself and anyone else.
            </p>
          </div>
          
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="distressed-card p-5 text-center">
              <div className="text-3xl sm:text-4xl font-black text-mango-red mb-2">10,000</div>
              <div className="text-xs sm:text-sm font-bold uppercase text-slate-500">Hours to Mastery</div>
            </div>
            <div className="distressed-card p-5 text-center">
              <div className="text-3xl sm:text-4xl font-black text-mango-orange mb-2">~5</div>
              <div className="text-xs sm:text-sm font-bold uppercase text-slate-500">Years at 40h/week</div>
            </div>
            <div className="distressed-card p-5 text-center">
              <div className="text-3xl sm:text-4xl font-black text-mango-yellow mb-2">∞</div>
              <div className="text-xs sm:text-sm font-bold uppercase text-slate-500">Confidence Earned</div>
            </div>
          </div>
        </section>

        {/* See Your Truth */}
        <section className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-mango-yellow rounded-full flex items-center justify-center border-2 border-mango-dark">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-mango-dark" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white drop-shadow-[2px_2px_0px_#1a1a1a]">
              See Your Truth
            </h2>
          </div>
          
          <div className="space-y-6 text-base sm:text-lg text-mango-dark leading-relaxed">
            <p>
              There&apos;s something powerful about seeing how your days are actually distributed throughout the week.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-mango-green shrink-0 mt-0.5" />
                <span>What are you spending the most time on?</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-mango-green shrink-0 mt-0.5" />
                <span>Are you really living—or are you scrolling too much?</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-mango-green shrink-0 mt-0.5" />
                <span>Does your time reflect your priorities?</span>
              </li>
            </ul>
            
            <p>
              When you track everything, you keep yourself accountable. No more lying to yourself about &quot;working on it.&quot;
            </p>
          </div>
        </section>

        {/* The Accountability Loop */}
        <section className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-mango-green rounded-full flex items-center justify-center border-2 border-mango-dark">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white drop-shadow-[2px_2px_0px_#1a1a1a]">
              The Accountability Loop
            </h2>
          </div>
          
          <div className="space-y-6 text-base sm:text-lg text-mango-dark leading-relaxed">
            <p>
              Here&apos;s the beautiful thing about tracking your time:
            </p>
            
            <p className="text-xl sm:text-2xl font-bold">
              When you know you&apos;re going to track it, you&apos;re more incentivized to focus.
            </p>
            
            <p>
              You want to be able to log that you were focused. You want to see those hours add up. The act of tracking itself makes you better.
            </p>
            
            <p>
              It&apos;s a positive feedback loop: track → focus → progress → motivation → track more.
            </p>
          </div>
          
          <div className="mt-8 distressed-card p-6 sm:p-8 bg-mango-dark text-white">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="text-4xl sm:text-5xl">🔄</div>
              <div>
                <div className="font-black text-lg sm:text-xl uppercase mb-1">The Virtuous Cycle</div>
                <div className="text-sm sm:text-base text-slate-300">
                  Track → Focus → Progress → Motivation → Track More
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-12 sm:py-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white drop-shadow-[2px_2px_0px_#1a1a1a] sm:drop-shadow-[4px_4px_0px_#1a1a1a] mb-4 sm:mb-6">
            Ready to Know Yourself?
          </h2>
          
          <p className="text-base sm:text-lg text-mango-dark mb-8 max-w-xl mx-auto">
            Stop guessing. Start tracking. See who you really are—and become who you want to be.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignedOut>
              <CTAButton
                variant="primary"
                ctaName="Start Tracking"
                ctaLocation="know-thyself"
                isSignUp={true}
              >
                Start Tracking Free
              </CTAButton>
            </SignedOut>
            <SignedIn>
              <CTAButton
                href="/app/now"
                variant="primary"
                ctaName="Start Tracking"
                ctaLocation="know-thyself"
              >
                Start Tracking
              </CTAButton>
            </SignedIn>
            
            <Link 
              href="/memento-mori" 
              className="px-5 py-3 sm:px-8 sm:py-4 bg-white text-mango-dark border-2 border-mango-dark font-bold text-base sm:text-xl uppercase shadow-[3px_3px_0px_#000] sm:shadow-[6px_6px_0px_#000] hover:scale-105 hover:-rotate-2 transition-all"
            >
              Calculate Your Days
            </Link>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="mt-20 sm:mt-32 border-t-2 sm:border-t-4 border-mango-dark bg-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image src="/logo.svg" alt="10,000 Hours" width={24} height={24} className="sm:w-8 sm:h-8" />
              <span className="font-bold text-base sm:text-xl uppercase italic">10,000HOURS</span>
            </div>
            <p className="font-bold text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 text-center md:text-left">© 2025. Built for those who chase mastery.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-black uppercase tracking-widest text-mango-dark">
            <Link className="hover:text-mango-red underline decoration-2 sm:decoration-4 decoration-mango-yellow" href="/">Home</Link>
            <Link className="hover:text-mango-red underline decoration-2 sm:decoration-4 decoration-mango-red" href="/memento-mori">Memento Mori</Link>
            <a className="hover:text-mango-red underline decoration-2 sm:decoration-4 decoration-mango-orange" href="https://lwsnlabs.featurebase.app" target="_blank" rel="noopener noreferrer">Feedback</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
