import { getAccentHex } from "../../lib/accent";

const summary = [
  {
    label: "total focus",
    value: "26h35m",
    delta: "+3h",
    description: "This week"
  },
  {
    label: "avg focus/day",
    value: "6h33m",
    delta: "+48m",
    description: "vs last week"
  },
  {
    label: "most time",
    value: "Noon",
    delta: "7.2 / 1",
    description: "CS Girlies"
  },
  {
    label: "most distracted",
    value: "Noon",
    delta: "3h40m",
    description: "Social media"
  }
];

const distribution = [
  {
    day: "Mon",
    segments: [
      { category: "CS Girlies", hours: 3.6 },
      { category: "Coding", hours: 2.4 },
      { category: "Friends", hours: 1.2 }
    ]
  },
  {
    day: "Tue",
    segments: [
      { category: "Coding", hours: 4 },
      { category: "Sleep", hours: 2 },
      { category: "Friends", hours: 1.5 }
    ]
  },
  {
    day: "Wed",
    segments: [
      { category: "Coding", hours: 5.2 },
      { category: "CS Girlies", hours: 1.5 },
      { category: "Social Media Posts", hours: 0.8 }
    ]
  },
  {
    day: "Thu",
    segments: [
      { category: "CS Girlies", hours: 4.5 },
      { category: "Coding", hours: 2 },
      { category: "Friends", hours: 1 }
    ]
  },
  {
    day: "Fri",
    segments: [
      { category: "Coding", hours: 4 },
      { category: "Sleep", hours: 2.5 },
      { category: "Friends", hours: 1 }
    ]
  },
  {
    day: "Sat",
    segments: [
      { category: "Friends", hours: 3 },
      { category: "Social Media Posts", hours: 1.8 },
      { category: "Sleep", hours: 2 }
    ]
  },
  {
    day: "Sun",
    segments: [
      { category: "God", hours: 2.4 },
      { category: "Friends", hours: 2.2 },
      { category: "Sleep", hours: 2.6 }
    ]
  }
];

const mastery = [
  { category: "CS Girlies", progress: 0.46, hours: 2292 },
  { category: "Coding", progress: 0.31, hours: 1560 },
  { category: "Social Media Posts", progress: 0.18, hours: 920 }
];

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-card border border-border-subtle bg-surface/80 p-4">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              truth over vibes. here’s where your time went.
            </h2>
            <p className="text-sm text-text-secondary">Oct 13 – Oct 19</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-pill border border-border-subtle px-4 py-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
              filter
            </button>
            <button className="rounded-pill border border-border-subtle px-4 py-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
              export
            </button>
          </div>
        </header>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summary.map((item) => (
            <div
              key={item.label}
              className="rounded-card border border-border-subtle/60 bg-elevated/70 p-4"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-text-primary">{item.value}</p>
              <p className="mt-1 text-xs text-state-success">{item.delta}</p>
              <p className="mt-3 text-sm text-text-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-card border border-border-subtle bg-surface/80 p-4">
          <header className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Daily distribution</h3>
            <button className="text-xs uppercase tracking-[0.18em] text-text-muted hover:text-text-secondary">
              show notes only
            </button>
          </header>
          <div className="mt-6 grid grid-cols-7 gap-3">
            {distribution.map((day) => (
              <div key={day.day} className="flex flex-col gap-2">
                <div className="flex h-48 flex-col justify-end gap-1 rounded-card border border-border-subtle/60 bg-elevated/60 p-2">
                  {day.segments.map((segment) => (
                    <div
                      key={segment.category}
                      className="rounded-card text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80"
                      style={{
                        height: `${(segment.hours / 8) * 100}%`,
                        backgroundColor: getAccentHex(segment.category)
                      }}
                    >
                      <span className="block px-2 py-1">{segment.category}</span>
                    </div>
                  ))}
                </div>
                <span className="text-center text-xs text-text-secondary">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-card border border-border-subtle bg-surface/80 p-4">
            <h3 className="text-sm font-semibold text-text-primary">Mastery rings</h3>
            <div className="mt-6 space-y-5">
              {mastery.map((item) => {
                const accent = getAccentHex(item.category);
                return (
                  <div key={item.category} className="flex items-center gap-4">
                    <div
                      className="relative h-24 w-24 rounded-full"
                      style={{
                        background: `conic-gradient(${accent} 0 ${item.progress * 360}deg, #1D232B ${item.progress * 360}deg 360deg)`,
                        boxShadow: "inset 0 0 0 12px #111418"
                      }}
                    >
                      <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full border border-border-subtle bg-elevated">
                        <span className="text-xs uppercase tracking-[0.18em] text-text-muted">{Math.round(item.progress * 100)}%</span>
                        <span className="text-xs text-text-secondary">to 10k</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{item.category}</p>
                      <p className="text-xs text-text-secondary">{item.hours.toLocaleString()} hours logged</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface/80 p-4">
            <h3 className="text-sm font-semibold text-text-primary">AI insight</h3>
            <p className="mt-3 text-sm text-text-secondary">
              You spent 12h (+30%) on coding vs last week. At this pace you’ll hit 10,000 hours in ML engineering by 2028.
            </p>
            <button className="mt-4 rounded-pill border border-border-subtle px-4 py-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
              generate more
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
