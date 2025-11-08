"use client";

export const dynamic = 'force-dynamic';

export default function TimelinePage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Timeline
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            View and edit your day
          </p>
        </div>
        
        <div 
          className="rounded-lg p-12 text-center"
          style={{ background: 'var(--bg-surface)' }}
        >
          <p style={{ color: 'var(--text-muted)' }}>
            No logs yet. Drag anywhere to add a block or press S to start a timer.
          </p>
        </div>
      </div>
    </div>
  );
}
