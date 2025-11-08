"use client";

export const dynamic = 'force-dynamic';

export default function NotesPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Notes
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Reflect on your time
          </p>
        </div>
        
        <div 
          className="rounded-lg p-12 text-center"
          style={{ background: 'var(--bg-surface)' }}
        >
          <p style={{ color: 'var(--text-muted)' }}>
            Write it down while it's fresh. What worked? What hurt?
          </p>
        </div>
      </div>
    </div>
  );
}
