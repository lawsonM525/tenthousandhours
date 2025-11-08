import CategoryChip from "../../components/category-chip";
import { getAccentHex } from "../../lib/accent";

const categories = [
  { name: "General", type: "life", mastery: false },
  { name: "CS Girlies", type: "skill", mastery: true },
  { name: "Food", type: "life", mastery: false },
  { name: "Friends", type: "social", mastery: false },
  { name: "Sleep", type: "life", mastery: false },
  { name: "Coding", type: "skill", mastery: true },
  { name: "God", type: "soul", mastery: true },
  { name: "Social Media Posts", type: "skill", mastery: true }
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-card border border-border-subtle bg-surface/80 p-4">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Categories</h2>
            <p className="text-sm text-text-secondary">
              Keep colors consistent across chips, timeline, and charts.
            </p>
          </div>
          <button className="rounded-pill bg-cta-pink px-4 py-2 text-sm font-medium text-base">
            add new category
          </button>
        </header>
        <div className="mt-6 overflow-hidden rounded-card border border-border-subtle/60">
          <table className="w-full table-auto text-left text-sm">
            <thead className="bg-elevated/80 text-xs uppercase tracking-[0.18em] text-text-secondary">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Counts toward mastery</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40 bg-elevated/40">
              {categories.map((category) => (
                <tr key={category.name} className="hover:bg-elevated/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: getAccentHex(category.name) }}
                        aria-hidden
                      />
                      <CategoryChip label={category.name} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{category.type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-pill px-3 py-1 text-xs font-medium ${
                        category.mastery ? "bg-accent-violet/15 text-text-primary" : "bg-elevated text-text-secondary"
                      }`}
                    >
                      {category.mastery ? "yes" : "no"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs uppercase tracking-[0.18em] text-text-muted hover:text-text-secondary">
                      edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
