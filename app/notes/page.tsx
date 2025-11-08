import { getAccentHex } from "../../lib/accent";

const notes = [
  {
    title: "website fix",
    timestamp: "Oct 13 · 10:53",
    body: "Refined timer dial to improve accessibility. Next: keyboard shortcuts.",
    category: "Coding",
    tags: ["deep work", "frontend"]
  },
  {
    title: "sleep log",
    timestamp: "Oct 13 · 07:05",
    body: "6h 48m sleep. Felt groggy. Try winding down at 22:30 with chamomile tea.",
    category: "Sleep",
    tags: ["health"]
  },
  {
    title: "call with Adonai",
    timestamp: "Oct 13 · 16:12",
    body: "Aligned on launch stories. Need social proof deck + schedule community kickoff.",
    category: "Friends",
    tags: ["community", "action"]
  }
];

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-card border border-border-subtle bg-surface/80 p-4">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Notes</h2>
            <p className="text-sm text-text-secondary">Write what happened… wins, blockers, context.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-pill border border-border-subtle px-4 py-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
              new note
            </button>
            <button className="rounded-pill border border-border-subtle px-4 py-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
              summarize day
            </button>
          </div>
        </header>
        <div className="mt-6 space-y-4">
          {notes.map((note) => (
            <article
              key={note.title}
              className="relative overflow-hidden rounded-card border border-border-subtle bg-elevated/70"
            >
              <span
                className="absolute inset-y-0 left-0 w-1"
                style={{ backgroundColor: getAccentHex(note.category) }}
                aria-hidden
              />
              <div className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                    <span className="font-semibold text-text-primary">{note.title}</span>
                    <span>•</span>
                    <span>{note.timestamp}</span>
                    <span>•</span>
                    <span>{note.category}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{note.body}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-pill border border-border-subtle px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-pill border border-border-subtle px-3 py-1 text-xs uppercase tracking-[0.18em] text-text-secondary">
                    edit
                  </button>
                  <button className="rounded-pill border border-border-subtle px-3 py-1 text-xs uppercase tracking-[0.18em] text-text-secondary">
                    link session
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
