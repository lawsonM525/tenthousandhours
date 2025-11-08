import { getAccentHex } from "../../lib/accent";

const rawBlocks = [
  {
    start: "09:40",
    end: "10:53",
    title: "website fix",
    category: "CS Girlies"
  },
  {
    start: "11:20",
    end: "12:10",
    title: "appsSdk – Daily Coding",
    category: "Coding"
  },
  {
    start: "13:24",
    end: "14:37",
    title: "APD for GhatGPT",
    category: "Coding"
  },
  {
    start: "14:43",
    end: "15:25",
    title: "id cards format polish",
    category: "CS Girlies"
  },
  {
    start: "15:30",
    end: "16:12",
    title: "call with Adonai",
    category: "Friends"
  },
  {
    start: "16:30",
    end: "18:05",
    title: "batch creating videos",
    category: "Social Media Posts"
  }
];

const hours = Array.from({ length: 13 }, (_, index) => 7 + index);
const minuteHeight = 2.4;
const dayStartMinutes = 7 * 60;

function toMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

const timelineBlocks = rawBlocks.map((block, index) => {
  const startMinutes = toMinutes(block.start);
  const endMinutes = toMinutes(block.end);
  const previousEnd = index === 0 ? dayStartMinutes : toMinutes(rawBlocks[index - 1].end);
  const gap = Math.max(0, startMinutes - previousEnd);
  const duration = Math.max(30, endMinutes - startMinutes);

  return {
    ...block,
    offset: gap * minuteHeight,
    height: duration * minuteHeight,
    startMinutes,
    endMinutes
  };
});

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-card border border-border-subtle bg-surface/80 p-4">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Monday, Oct 13</h2>
            <p className="text-sm text-text-secondary">
              Drag to add blocks. S = start timer, P = pause, [ ] adjust minutes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-pill border border-border-subtle px-4 py-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
              day view
            </button>
            <button className="rounded-pill border border-border-subtle px-4 py-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
              week view
            </button>
          </div>
        </header>
        <div className="mt-6 grid grid-cols-[80px_minmax(0,1fr)] gap-6">
          <div className="space-y-8 text-right text-xs text-text-muted">
            {hours.map((hour) => (
              <div key={hour} className="h-16">{hour}:00</div>
            ))}
          </div>
          <div className="relative rounded-card border border-border-subtle bg-elevated/60 p-4">
            <div className="absolute inset-4 grid grid-rows-[repeat(12,64px)] gap-2">
              {hours.slice(0, 12).map((hour) => (
                <div key={hour} className="border-b border-border-subtle/40" />
              ))}
            </div>
            <div className="relative">
              {timelineBlocks.map((block) => {
                const background = getAccentHex(block.category);
                return (
                  <article
                    key={`${block.start}-${block.title}`}
                    className="relative mx-6 mb-4 rounded-card px-4 py-3 text-sm font-medium text-white shadow-sm"
                    style={{
                      marginTop: block.offset,
                      height: block.height,
                      backgroundColor: background,
                      boxShadow: `0 12px 30px -12px ${background}AA`
                    }}
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                      {block.start} – {block.end}
                    </div>
                    <p className="mt-2 text-base font-semibold text-white">{block.title}</p>
                    <p className="text-xs text-white/80">{block.category}</p>
                    <button className="absolute right-3 top-3 rounded-pill bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/80">
                      edit
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="rounded-card border border-border-subtle bg-surface/80 p-4">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Unassigned time</h3>
            <p className="text-xs text-text-secondary">
              Drag across open space or press S to start logging instantly.
            </p>
          </div>
          <button className="rounded-pill border border-border-subtle px-4 py-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
            log this time
          </button>
        </header>
        <div className="mt-4 rounded-card border border-dashed border-border-subtle/60 bg-elevated/40 p-6 text-sm text-text-secondary">
          02h 45m today unaccounted for. Capture it now while the details are still fresh.
        </div>
      </section>
    </div>
  );
}
