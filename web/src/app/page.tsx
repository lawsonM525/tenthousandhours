import { FocusPalette } from "@/components/focus-palette";
import { CategoriesPanel } from "@/components/categories-panel";
import { FinalCta } from "@/components/final-cta";
import { HeroTimer } from "@/components/hero-timer";
import { InsightOverview } from "@/components/insight-overview";
import { Navigation } from "@/components/navigation";
import { TimelineShowcase } from "@/components/timeline-showcase";
import { CheckCircle2, NotebookPen, Sparkles } from "lucide-react";

const heroHighlights = [
  {
    title: "24-hour coverage",
    description: "Track focus, sleep, errands, and everything between. Awareness beats hustle hacks.",
  },
  {
    title: "Notes-first logging",
    description: "Attach reflections to every block. Summaries roll up automatically for weekly reviews.",
  },
  {
    title: "10,000-hour pacing",
    description: "Flag skills that count and watch progress against the mastery milestone in real time.",
  },
];

function ReviewCard() {
  return (
    <div className="card-elevated flex w-full max-w-xl flex-col gap-5 p-6 text-white">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
          <NotebookPen className="h-4 w-4 text-[#3A8DFF]" />
          Session review
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">Quality 4 / 5</span>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-white">Website fix — coding</p>
        <p className="text-sm text-white/70">
          “Wrapped the API bugfix, wrote post-mortem notes. Next: ship patch to prod and schedule QA retro.”
        </p>
      </div>
      <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
          <Sparkles className="h-3.5 w-3.5 text-[#F11D75]" />
          AI Summary
        </div>
        <p className="mt-2 text-sm text-white/80">
          Focus jumped 30% vs last week. To hit 10k hours in ML engineering by 2028, add one 90m deep-work block on Thursdays.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-white/60">
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#45E06F]" />
          Logged 3h 40m
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
          Tags: release, bugs
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />
      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-6 py-16">
        <section className="section-grid pt-8">
          <div className="space-y-8 text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium text-white/60">
              Time truth &gt; focus hacks
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Log your whole day, see the truth, and pace your path to 10,000 hours.
              </h1>
              <p className="max-w-xl text-base text-white/70">
                10,000hours is the mastery ledger for people who want awareness over distractions. Track every minute, capture the
                story behind it, and get the insights that help you master what matters.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#get-started"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F11D75] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(241,29,117,0.35)] transition hover:bg-[#ff2a86]"
              >
                Start free
              </a>
              <a
                href="#product"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-white/80 transition hover:text-white"
              >
                See the product
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroHighlights.map((highlight) => (
                <div key={highlight.title} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <h3 className="text-sm font-semibold text-white">{highlight.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
          <HeroTimer />
        </section>

        <section className="section-grid">
          <FocusPalette />
          <ReviewCard />
        </section>

        <InsightOverview />

        <TimelineShowcase />

        <CategoriesPanel />

        <FinalCta />
      </main>
      <footer className="border-t border-white/5 bg-[rgba(11,13,16,0.8)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 10,000hours. Built for people chasing mastery.</p>
          <div className="flex gap-4">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
