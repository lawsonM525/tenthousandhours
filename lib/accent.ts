export const accentPalette: Record<string, { hex: string; className: string }> = {
  General: { hex: "#F11D75", className: "bg-accent-pink" },
  "CS Girlies": { hex: "#3A8DFF", className: "bg-accent-blue" },
  Food: { hex: "#FFB020", className: "bg-accent-amber" },
  Friends: { hex: "#45E06F", className: "bg-accent-lime" },
  Sleep: { hex: "#16C7A8", className: "bg-accent-teal" },
  Coding: { hex: "#8B5CF6", className: "bg-accent-violet" },
  God: { hex: "#22D3EE", className: "bg-accent-cyan" },
  "Social Media Posts": { hex: "#FF5C5C", className: "bg-accent-red" }
};

export function getAccentHex(category: string, fallback = "#F11D75") {
  return accentPalette[category]?.hex ?? fallback;
}

export function getAccentClass(category: string, fallback = "bg-accent-pink") {
  return accentPalette[category]?.className ?? fallback;
}
