import { ChevronLeft, ChevronRight, Filter, List } from "lucide-react";

export default function InsightsPage() {
  const statCards = [
    { title: "Total focus", value: "9h 36m", foot: "" },
    { title: "Avg focus/day", value: "3h 48m", foot: "+12%" },
    { title: "Most focused", value: "Noon", foot: "" },
    { title: "Focus/break", value: "15.5 / 1", foot: "" },
  ];

  const categories = [
    { name: "Coding", pct: 34, time: "3h 28m", tone: "#3A8DFF" },
    { name: "Sleep", pct: 26, time: "2h 30m", tone: "#16C7A8" },
    { name: "CS Girlies", pct: 13, time: "1h 18m", tone: "#F11D75" },
    { name: "God", pct: 10, time: "1h", tone: "#8B5CF6" },
    { name: "Social Media Posts", pct: 8, time: "57m", tone: "#45E06F" },
    { name: "Food", pct: 4, time: "26m", tone: "#FFB020" },
    { name: "Break", pct: 4, time: "27m", tone: "#B2BCC9" },
  ];

  const intentions = [
    { name: "Sleep: Nap", pct: 26, time: "2h 30m", tone: "#16C7A8" },
    { name: "Coding: App for GhatGPT appsSdk - Daily", pct: 24, time: "2h 16m", tone: "#3A8DFF" },
    { name: "Coding: Pagez", pct: 13, time: "1h 12m", tone: "#F11D75" },
    { name: "God: praying over the week", pct: 11, time: "1h", tone: "#8B5CF6" },
    { name: "Social Media Posts: updates", pct: 8, time: "57m", tone: "#45E06F" },
    { name: "CS Girlies: id cards", pct: 7, time: "51m", tone: "#F11D75" },
    { name: "CS Girlies: Workshop details", pct: 6, time: "36m", tone: "#F11D75" },
  ];

  const timelineBlocks = [
    { start: "09:00", end: "10:13", label: "appsSdk - Daily Coding", tone: "#F11D75", span: "row-span-3" },
    { start: "10:15", end: "11:30", label: "API for GhatGPT", tone: "#3A8DFF", span: "row-span-3" },
    { start: "11:35", end: "12:10", label: "id cards format", tone: "#16C7A8", span: "row-span-2" },
    { start: "12:30", end: "13:10", label: "prayer + reset", tone: "#FFB020", span: "row-span-2" },
    { start: "13:30", end: "14:00", label: "Lunch break", tone: "#45E06F", span: "row-span-2" },
  ];

  return (
    <div className="h-full flex flex-col">
      <header className="border-b border-border-subtle bg-bg-surface px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-h2 font-semibold text-text-primary">insights</h1>
            <p className="text-body text-text-secondary mt-1">truth over vibes. here&apos;s where your week actually went.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button className="inline-flex items-center justify-center rounded-full border border-border-subtle bg-bg-surface p-2 text-text-secondary hover:text-text-primary">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="rounded-full border border-border-subtle bg-bg-surface px-4 py-1 text-xs text-text-secondary">Mon, Oct 13</div>
            <button className="inline-flex items-center justify-center rounded-full border border-border-subtle bg-bg-surface p-2 text-text-secondary hover:text-text-primary">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="card-elevated p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full border border-border-subtle bg-bg-surface px-3 py-1 text-xs font-medium text-text-secondary">Week overview</span>
                <div className="hidden md:flex items-center gap-2 text-xs text-text-secondary">
                  <button className="rounded-full border border-border-subtle px-3 py-1">Show notes only</button>
                  <button className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-3 py-1"><Filter className="h-3.5 w-3.5" /> Filter</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {statCards.map((s) => (
                  <div key={s.title} className="rounded-component border border-border-subtle bg-bg-surface p-4">
                    <p className="text-small uppercase tracking-wide text-text-muted">{s.title}</p>
                    <p className="mt-2 text-2xl font-semibold text-text-primary">{s.value}</p>
                    {s.foot ? <p className="text-small text-success">{s.foot}</p> : <p className="text-small text-text-muted">&nbsp;</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="card-elevated p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-small font-medium uppercase tracking-[0.35em] text-text-muted">Category Distribution</h3>
                <div className="text-small text-text-secondary">This week</div>
              </div>
              <div className="space-y-4">
                {categories.map((c) => (
                  <div key={c.name} className="space-y-2">
                    <div className="flex items-center justify-between text-body">
                      <span className="flex items-center gap-2 text-text-primary">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.tone }} />
                        {c.name}
                      </span>
                      <span className="text-text-secondary">{c.pct}% · {c.time}</span>
                    </div>
                    <div className="h-2 rounded-pill bg-bg-surface border border-border-subtle/60">
                      <div className="h-full rounded-pill" style={{ width: `${c.pct}%`, backgroundColor: `${c.tone}cc` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-elevated p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-small font-medium uppercase tracking-[0.35em] text-text-muted">By Intention</h3>
                <div className="flex items-center gap-2 text-small text-text-secondary">
                  <button className="inline-flex items-center gap-1 rounded-full border border-border-subtle px-3 py-1"><List className="h-3.5 w-3.5" /> Grouped</button>
                </div>
              </div>
              <div className="space-y-4">
                {intentions.map((i) => (
                  <div key={i.name} className="space-y-2">
                    <div className="flex items-center justify-between text-body">
                      <span className="flex items-center gap-2 text-text-primary">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: i.tone }} />
                        {i.name}
                      </span>
                      <span className="text-text-secondary">{i.pct}% · {i.time}</span>
                    </div>
                    <div className="h-2 rounded-pill bg-bg-surface border border-border-subtle/60">
                      <div className="h-full rounded-pill" style={{ width: `${i.pct}%`, backgroundColor: `${i.tone}cc` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-small uppercase tracking-[0.35em] text-text-muted">Mon, Oct 13</p>
                  <h3 className="mt-2 text-h3 font-semibold text-text-primary">9h 36m focus logged</h3>
                </div>
                <button className="rounded-full border border-border-subtle px-3 py-1 text-small text-text-secondary hover:text-text-primary">Today</button>
              </div>
              <div className="mt-6 grid grid-cols-[88px_1fr] gap-6">
                <div className="space-y-6 text-small text-text-secondary">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div key={index} className="flex flex-col">
                      <span>{String(index + 9).padStart(2, "0")}:00</span>
                    </div>
                  ))}
                </div>
                <div className="relative grid grid-cols-1 gap-3">
                  <div className="absolute inset-0 grid grid-rows-12 gap-y-2">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div key={index} className="border-b border-border-subtle/60" />
                    ))}
                  </div>
                  <div className="relative grid auto-rows-[40px] gap-2">
                    {timelineBlocks.map((block) => (
                      <div
                        key={block.label}
                        className={`relative overflow-hidden rounded-component border border-border-subtle bg-bg-surface p-4 text-body text-text-primary ${block.span}`}
                        style={{ backgroundColor: `${block.tone}1a` }}
                      >
                        <div className="flex items-center justify-between text-small text-text-secondary">
                          <span>{block.start} — {block.end}</span>
                          <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: block.tone }} />
                        </div>
                        <p className="mt-2 font-medium">{block.label}</p>
                        <p className="text-small text-text-secondary">Notes ready · tap to review</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
