import clsx from "clsx";
import { accentPalette } from "../lib/accent";

const fallback = {
  dot: "bg-accent-pink",
  border: "border-accent-pink/30",
  active: "bg-accent-pink/15"
};

interface CategoryChipProps {
  label: string;
  active?: boolean;
}

export default function CategoryChip({ label, active }: CategoryChipProps) {
  const accent = accentPalette[label];
  const styles = accent
    ? {
        dot: accent.className,
        border: accent.className.replace("bg-", "border-") + "/30",
        active: accent.className.replace("bg-", "bg-") + "/15"
      }
    : fallback;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-pill border px-3 py-1 text-xs font-medium transition-colors",
        styles.border,
        active ? `${styles.active} text-text-primary` : "bg-surface text-text-secondary"
      )}
    >
      <span className={`h-2 w-2 rounded-full ${styles.dot}`} aria-hidden />
      {label}
    </span>
  );
}
