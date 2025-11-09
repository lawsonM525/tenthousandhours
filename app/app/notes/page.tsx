export default function NotesPage() {
  return (
    <div className="h-full flex flex-col">
      <header className="border-b border-border-subtle bg-bg-surface px-6 py-4">
        <h1 className="text-h2 font-semibold text-text-primary">notes</h1>
      </header>
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12 text-text-muted space-y-2">
            <p className="text-body">
              write it down while it&apos;s fresh. what worked? what hurt?
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
