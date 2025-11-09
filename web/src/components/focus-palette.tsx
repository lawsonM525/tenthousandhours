import { Search, Sparkles } from "lucide-react";

const suggestions = [
  { label: "website fix", category: "CS Girlies", tone: "#F11D75" },
  { label: "Vibecut", category: "Coding", tone: "#3A8DFF" },
  { label: "Pagez", category: "Social Media", tone: "#8B5CF6" },
  { label: "batch creating videos", category: "Content", tone: "#22D3EE" },
  { label: "Sleep", category: "Rest", tone: "#16C7A8" },
  { label: "call with Adonai", category: "Friends", tone: "#FFB020" },
];

export function FocusPalette() {
  return (
    <div className="card-elevated w-full max-w-xl p-6 text-white" id="product">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/40">
          What’s your focus?
        </p>
        <span className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
          <Sparkles className="h-3.5 w-3.5" />
          Suggestions
        </span>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
        <Search className="h-4 w-4" />
        <span className="text-white/50">What are you doing?</span>
      </div>
      <div className="mt-4 space-y-2">
        {suggestions.map((item) => (
          <button
            key={item.label}
            className="flex w-full items-center justify-between rounded-2xl border border-transparent bg-white/5 px-4 py-3 text-left transition hover:border-white/10"
          >
            <div>
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="text-xs text-white/50">{item.category}</p>
            </div>
            <span
              className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: `${item.tone}1f` }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.tone }}
              />
              {item.category}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-white/40">
        Quick keys: S start/stop · P pause · N notes · ⌘K quick add
      </p>
    </div>
  );
}
