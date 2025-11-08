import CategoryChip from "../components/category-chip";
import TimerDial from "../components/timer-dial";
import { getAccentHex } from "../lib/accent";

const categories = [
  "General",
  "CS Girlies",
  "Food",
  "Friends",
  "Sleep",
  "Coding",
  "God",
  "Social Media Posts"
];

const suggestions = [
  { title: "website fix", category: "Coding", accent: "bg-accent-violet" },
  { title: "Vibecut", category: "CS Girlies", accent: "bg-accent-blue" },
  { title: "Pagez", category: "Coding", accent: "bg-accent-violet" },
  { title: "batch creating videos", category: "Social Media Posts", accent: "bg-accent-red" },
  { title: "Sleep", category: "Sleep", accent: "bg-accent-teal" },
  { title: "call with Adonai", category: "Friends", accent: "bg-accent-lime" }
];

export default function TimerPage() {
  const selectedCategory = "CS Girlies";

  return (
    <div className="space-y-6">
      <section className="rounded-card border border-border-subtle bg-surface/80 p-4">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-text-secondary">Category</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((category) => (
                <CategoryChip key={category} label={category} active={category === selectedCategory} />
              ))}
            </div>
          </div>
          <button className="self-start rounded-pill border border-border-subtle px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-text-secondary transition hover:text-text-primary">
            edit list
          </button>
        </header>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <label className="rounded-card border border-border-subtle bg-elevated/80 p-4">
              <span className="text-xs uppercase tracking-[0.18em] text-text-muted">what are you doing?</span>
              <input
                className="mt-3 w-full bg-transparent text-2xl font-semibold text-text-primary outline-none placeholder:text-text-muted"
                defaultValue="website fix"
              />
            </label>
            <div className="rounded-card border border-border-subtle bg-elevated/60 p-4">
              <header className="flex items-center justify-between">
                <p className="text-sm font-medium text-text-secondary">Suggestions</p>
                <button className="text-xs uppercase tracking-[0.18em] text-text-muted hover:text-text-secondary">
                  refresh
                </button>
              </header>
              <ul className="mt-4 space-y-2">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.title}
                    className="flex items-center justify-between rounded-card border border-border-subtle/60 bg-surface/60 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-2 w-2 rounded-full ${suggestion.accent}`} aria-hidden />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{suggestion.title}</p>
                        <p className="text-xs text-text-secondary">{suggestion.category}</p>
                      </div>
                    </div>
                    <button className="rounded-pill border border-border-subtle px-3 py-1 text-xs text-text-secondary hover:text-text-primary">
                      use
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <TimerDial label={selectedCategory} elapsed={24.88} total={25} accentColor={getAccentHex(selectedCategory)} />
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-card border border-border-subtle bg-surface/70 p-4">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">Daily focus streak</p>
              <p className="text-xs text-text-secondary">6 days hitting 6h+ deep work</p>
            </div>
            <span className="rounded-pill bg-accent-violet/15 px-3 py-1 text-xs font-medium text-text-primary">
              +1 day
            </span>
          </header>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-text-secondary">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <div key={day} className="space-y-2">
                <div
                  className={`h-16 rounded-card border border-border-subtle/60 bg-elevated/60 ${
                    index < 6 ? "ring-2 ring-accent-violet/60" : ""
                  }`}
                />
                <span>{day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-card border border-border-subtle bg-surface/70 p-4">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">Recent notes</p>
              <p className="text-xs text-text-secondary">Capture context while it’s fresh</p>
            </div>
            <button className="text-xs uppercase tracking-[0.18em] text-text-muted hover:text-text-secondary">
              view all
            </button>
          </header>
          <ul className="mt-4 space-y-3">
            {[
              { title: "website fix", body: "Need to refactor auth hooks.", category: "Coding" },
              { title: "sleep log", body: "Fell asleep late; aim for 23:00 lights out.", category: "Sleep" },
              { title: "call with Adonai", body: "Talked about community launch plan.", category: "Friends" }
            ].map((note) => (
              <li
                key={note.title}
                className="rounded-card border border-border-subtle/60 bg-elevated/70 p-3"
              >
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="font-medium text-text-primary">{note.title}</span>
                  <span className="text-text-muted">•</span>
                  <span>{note.category}</span>
                </div>
                <p className="mt-2 text-sm text-text-secondary">{note.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
