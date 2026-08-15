export const THEME_STORAGE_KEY = "settings_theme"

export type AppTheme = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

export function isAppTheme(value: string | null): value is AppTheme {
  return value === "light" || value === "dark" || value === "system"
}

export function resolveTheme(theme: AppTheme, systemPrefersDark: boolean): ResolvedTheme {
  if (theme === "system") return systemPrefersDark ? "dark" : "light"
  return theme
}
