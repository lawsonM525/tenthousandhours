export default function InsightsPage() {
  return (
    <div className="h-full flex flex-col">
      <header className="border-b border-border-subtle bg-bg-surface px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-h2 font-semibold text-text-primary">insights</h1>
          <p className="text-body text-text-secondary mt-1">
            truth over vibes. here&apos;s where your week actually went.
          </p>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12 text-text-muted">
            <p className="text-body">
              log some time to see insights appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
