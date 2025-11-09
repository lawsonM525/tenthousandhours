export default function SettingsPage() {
  return (
    <div className="h-full flex flex-col">
      <header className="border-b border-border-subtle bg-bg-surface px-6 py-4">
        <h1 className="text-h2 font-semibold text-text-primary">settings</h1>
      </header>
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <section className="space-y-3">
            <h2 className="text-h3 text-text-primary">preferences</h2>
            <div className="bg-bg-surface border border-border-subtle rounded-component p-4">
              <p className="text-body text-text-secondary">
                settings coming soon
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
