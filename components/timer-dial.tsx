interface TimerDialProps {
  label: string;
  elapsed: number;
  total: number;
  accentColor: string;
}

export default function TimerDial({
  label,
  elapsed,
  total,
  accentColor
}: TimerDialProps) {
  const progress = Math.min(elapsed / total, 1);
  const degrees = Math.round(progress * 360);
  const minutes = Math.floor(elapsed);
  const seconds = Math.round((elapsed % 1) * 60)
    .toString()
    .padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-6 rounded-card border border-border-subtle bg-surface/80 p-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: accentColor }}
          aria-hidden
        />
        {label}
      </div>
      <div className="relative flex h-64 w-64 items-center justify-center">
        <div
          className="h-full w-full rounded-full"
          style={{
            background: `conic-gradient(${accentColor} 0deg ${degrees}deg, #1D232B ${degrees}deg 360deg)`,
            boxShadow: "inset 0 0 0 12px #111418"
          }}
        />
        <div className="absolute inset-10 flex flex-col items-center justify-center rounded-full border border-border-subtle bg-elevated">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted">elapsed</p>
          <p className="text-4xl font-semibold">
            {minutes}
            <span className="text-base text-text-secondary">:{seconds}</span>
          </p>
          <p className="text-xs text-text-secondary">of {total.toFixed(0)} minutes</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-text-secondary">
        <button className="rounded-pill border border-border-subtle px-4 py-2">- 1 min</button>
        <button className="rounded-pill bg-cta-pink px-6 py-2 text-sm font-medium text-base">
          start logging
        </button>
        <button className="rounded-pill border border-border-subtle px-4 py-2">+ 1 min</button>
      </div>
      <dl className="grid w-full grid-cols-3 gap-4 text-sm text-text-secondary">
        <div className="rounded-card border border-border-subtle/60 bg-elevated/70 p-3">
          <dt className="uppercase tracking-[0.18em] text-text-muted">focus</dt>
          <dd className="mt-2 text-lg font-semibold text-text-primary">25m</dd>
        </div>
        <div className="rounded-card border border-border-subtle/60 bg-elevated/70 p-3">
          <dt className="uppercase tracking-[0.18em] text-text-muted">break</dt>
          <dd className="mt-2 text-lg font-semibold text-text-primary">5m</dd>
        </div>
        <div className="rounded-card border border-border-subtle/60 bg-elevated/70 p-3">
          <dt className="uppercase tracking-[0.18em] text-text-muted">goal</dt>
          <dd className="mt-2 text-lg font-semibold text-text-primary">10k hrs</dd>
        </div>
      </dl>
    </div>
  );
}
