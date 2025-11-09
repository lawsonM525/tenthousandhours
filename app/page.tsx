import { FocusPalette } from "@/components/focus-palette";
import { CategoriesPanel } from "@/components/categories-panel";
import { FinalCta } from "@/components/final-cta";
import { HeroTimer } from "@/components/hero-timer";
import { InsightOverview } from "@/components/insight-overview";
import { Navigation } from "@/components/navigation";
import { TimelineShowcase } from "@/components/timeline-showcase";
import { InsightChartCard } from "@/components/insight-chart-card";

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
          <InsightChartCard />
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