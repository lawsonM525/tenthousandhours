"use client";

export const dynamic = 'force-dynamic';

export default function InsightsPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Insights
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Truth over vibes. Here's where your week actually went.
          </p>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "This Week Total", value: "0h" },
            { label: "Avg / Day", value: "0h" },
            { label: "Most Time", value: "—" },
            { label: "Unassigned", value: "168h" },
          ].map((card) => (
            <div
              key={card.label}
              className="p-6 rounded-lg"
              style={{ background: 'var(--bg-surface)' }}
            >
              <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                {card.label}
              </div>
              <div className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>
        
        <div 
          className="rounded-lg p-12 text-center"
          style={{ background: 'var(--bg-surface)' }}
        >
          <p style={{ color: 'var(--text-muted)' }}>
            Log some time to see insights appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
