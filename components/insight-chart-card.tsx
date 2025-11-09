type Segment = { hours: number; tone: string };

type DayData = {
  day: string;
  label?: string;
  segments: Segment[];
};

const weekly: DayData[] = [
  { day: "MON", label: "10h 13m", segments: [{ hours: 3, tone: "#F11D75" }, { hours: 2, tone: "#22D3EE" }, { hours: 5, tone: "#3A8DFF" }] },
  { day: "TUE", label: "9h 31m", segments: [{ hours: 2, tone: "#16C7A8" }, { hours: 1, tone: "#8B5CF6" }, { hours: 6.5, tone: "#F11D75" }] },
  { day: "WED", label: "5h 34m", segments: [{ hours: 2.5, tone: "#45E06F" }, { hours: 3, tone: "#3A8DFF" }] },
  { day: "THU", label: "4h 57m", segments: [{ hours: 1.5, tone: "#FFB020" }, { hours: 3.5, tone: "#16C7A8" }] },
  { day: "FRI", segments: [{ hours: 5, tone: "#45E06F" }] },
  { day: "SAT", segments: [{ hours: 3.5, tone: "#8B5CF6" }] },
  { day: "SUN", segments: [{ hours: 2.5, tone: "#22D3EE" }] },
];

const maxHours = 11; // chart max height

export function InsightChartCard() {
  return (
    <div className="card-elevated w-full max-w-xl p-6 text-white">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
          Daily Distribution
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">This week</span>
      </div>

      <div className="relative">
        {/* average line */}
        <div className="pointer-events-none absolute left-0 right-0 top-[38%] z-0 border-t border-dashed border-white/20" />
        <div className="pointer-events-none absolute right-0 top-[34%] z-0 -translate-y-1/2 text-[10px] text-white/40">7h 34m avg</div>

        <div className="relative z-10 grid grid-cols-7 gap-3">
          {weekly.map((d) => {
            const total = d.segments.reduce((s, seg) => s + seg.hours, 0);
            return (
              <div key={d.day} className="flex flex-col items-center">
                {/* bar */}
                <div className="flex h-48 w-8 flex-col justify-end overflow-hidden rounded-md border border-white/10 bg-white/5">
                  {d.segments.map((s, i) => (
                    <div
                      key={i}
                      className="w-full"
                      style={{ height: `${(s.hours / maxHours) * 100}%`, backgroundColor: `${s.tone}cc` }}
                    />
                  ))}
                </div>
                {/* label above bar if present */}
                {d.label ? (
                  <span className="mt-2 text-[10px] text-white/60">{d.label}</span>
                ) : (
                  <span className="mt-2 text-[10px] text-white/40">&nbsp;</span>
                )}
                <span className="mt-1 text-[11px] text-white/70">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
