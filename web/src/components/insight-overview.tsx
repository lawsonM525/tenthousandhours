import { ArrowUpRight, Target, Zap } from "lucide-react";

const statCards = [
  {
    title: "This week",
    value: "26h 35m",
    delta: "+12%",
    description: "total focus",
  },
  {
    title: "Average / day",
    value: "3h 48m",
    delta: "+18%",
    description: "logged",
  },
  {
    title: "Most time",
    value: "Noon",
    delta: "7.2 / 1",
    description: "focus/break",
  },
  {
    title: "Unassigned",
    value: "3h 40m",
    delta: "-24%",
    description: "gap to log",
  },
];

const categories = [
  { name: "Coding", hours: 10, tone: "#F11D75" },
  { name: "Sleep", hours: 8, tone: "#16C7A8" },
  { name: "Friends", hours: 4, tone: "#FFB020" },
  { name: "Admin", hours: 3, tone: "#3A8DFF" },
];

export function InsightOverview() {
  return (
    <section className="section-grid" id="insights">
      <div className="space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium text-white/60">
          <Zap className="h-4 w-4 text-[#F11D75]" />
          Insights that keep you honest
        </span>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          A weekly review that connects notes, focus, and the pace to 10,000 hours.
        </h2>
        <p className="max-w-xl text-base text-white/70">
          Every session rolls into rich analytics. Spot trends by category, surface unlogged time, and get AI nudges on how to
          close the gap between where you are and where mastery lives.
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-white/60" id="principles">
          <span className="rounded-full border border-white/10 px-3 py-1">Time truth</span>
          <span className="rounded-full border border-white/10 px-3 py-1">Notes-first</span>
          <span className="rounded-full border border-white/10 px-3 py-1">10,000-hour path</span>
          <span className="rounded-full border border-white/10 px-3 py-1">24h coverage</span>
        </div>
      </div>
      <div className="card-elevated space-y-6 p-6 text-white">
        <div className="grid gap-3 sm:grid-cols-2">
          {statCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/40">{card.title}</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-semibold">{card.value}</span>
                <span className="text-xs text-[#16C7A8]">{card.delta}</span>
              </div>
              <p className="mt-1 text-xs text-white/50">{card.description}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-white/5 bg-[rgba(17,20,24,0.9)] p-6">
          <div className="flex items-center justify-between text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-[#8B5CF6]" />
              <span>Mastery pace</span>
            </div>
            <button className="flex items-center gap-1 text-xs text-[#F11D75]">
              View plan
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <p className="mt-2 text-2xl font-semibold">ML Engineering — 4,212 / 10,000 hrs</p>
          <p className="text-sm text-white/50">Reach 10k hrs by Feb 2028. Pace needed: 18.5h/week · You’re at 14.2.</p>
          <div className="mt-5 space-y-4">
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: category.tone }}
                    />
                    {category.name}
                  </span>
                  <span className="text-white/60">{category.hours}h</span>
                </div>
                <div className="h-2 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${category.hours}%`, backgroundColor: category.tone }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
