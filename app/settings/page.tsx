const settings = [
  {
    title: "Account",
    description: "Manage profile, email, and authentication options.",
    actions: ["update profile", "manage devices"]
  },
  {
    title: "Time preferences",
    description: "Timezone, rounding, and week start.",
    actions: ["set timezone", "rounding options"]
  },
  {
    title: "Targets",
    description: "Daily focus goals and mastery pace.",
    actions: ["edit targets"]
  },
  {
    title: "Data",
    description: "Export, import, and delete your data.",
    actions: ["export", "import", "delete account"]
  },
  {
    title: "AI",
    description: "Opt into summaries and manage API keys.",
    actions: ["toggle ai", "clear history"]
  }
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-card border border-border-subtle bg-surface/80 p-4">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
            <p className="text-sm text-text-secondary">
              Configure the essentials. No clutter, no dark patterns.
            </p>
          </div>
          <button className="rounded-pill border border-border-subtle px-4 py-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
            view profile
          </button>
        </header>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {settings.map((section) => (
            <article
              key={section.title}
              className="rounded-card border border-border-subtle/60 bg-elevated/70 p-4"
            >
              <h3 className="text-sm font-semibold text-text-primary">{section.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{section.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {section.actions.map((action) => (
                  <button
                    key={action}
                    className="rounded-pill border border-border-subtle px-3 py-1 text-xs uppercase tracking-[0.18em] text-text-secondary hover:text-text-primary"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
