import { Plus } from "lucide-react";

const categories = [
  { name: "General", tone: "#B2BCC9", type: "No category" },
  { name: "CS Girlies", tone: "#F11D75", type: "Skill" },
  { name: "Food", tone: "#FFB020", type: "Life" },
  { name: "Friends", tone: "#22D3EE", type: "Social" },
  { name: "Sleep", tone: "#16C7A8", type: "Life" },
  { name: "Coding", tone: "#3A8DFF", type: "Skill" },
  { name: "God", tone: "#8B5CF6", type: "Spiritual" },
  { name: "Social Media Posts", tone: "#45E06F", type: "Skill" },
];

export function CategoriesPanel() {
  return (
    <section className="section-grid" id="categories">
      <div className="space-y-6 text-white">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium text-white/60">
          Flexible categories, mastery-ready
        </span>
        <h2 className="text-3xl font-semibold sm:text-4xl">
          Color-code your life, flag the skills that count, and keep everything readable on dark.
        </h2>
        <p className="text-white/70">
          Categories are more than labels—they’re the backbone of your mastery plan. Choose from curated color tokens, group
          categories under parents, and decide which ones count toward your 10,000 hours.
        </p>
        <ul className="space-y-3 text-sm text-white/70">
          <li>• Skill vs. life-maintenance badges with pacing targets</li>
          <li>• Toggle whether a category contributes to mastery progress</li>
          <li>• Fixed color palette designed to pop against #0B0D10</li>
        </ul>
      </div>
      <div className="card-elevated p-6 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase tracking-[0.35em] text-white/50">Categories</h3>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 hover:text-white">
            <Plus className="h-3.5 w-3.5" />
            Add new
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: category.tone }}
                />
                <div>
                  <p className="font-medium text-white">{category.name}</p>
                  <p className="text-xs text-white/50">{category.type}</p>
                </div>
              </div>
              <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 hover:text-white">
                Edit
              </button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-white/40">Pick colors that read well on dark. You can change anytime.</p>
      </div>
    </section>
  );
}
