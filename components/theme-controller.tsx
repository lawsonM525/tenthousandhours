"use client"

import { useEffect } from "react"
import { AppTheme, isAppTheme, resolveTheme, THEME_STORAGE_KEY } from "@/lib/theme"

export const themeBootstrapScript = `
  (function () {
    try {
      var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
      var theme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
      var resolved = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      document.documentElement.classList.toggle('dark', resolved === 'dark');
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
    } catch (_) {}
  })();
`

export function applyTheme(theme: AppTheme) {
  const resolved = resolveTheme(
    theme,
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )

  document.documentElement.classList.toggle("dark", resolved === "dark")
  document.documentElement.dataset.theme = resolved
  document.documentElement.style.colorScheme = resolved
}

function readStoredTheme(): AppTheme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return isAppTheme(stored) ? stored : "system"
}

export function ThemeController() {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const syncTheme = () => applyTheme(readStoredTheme())
    const syncStoredTheme = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) syncTheme()
    }

    syncTheme()
    mediaQuery.addEventListener("change", syncTheme)
    window.addEventListener("storage", syncStoredTheme)

    return () => {
      mediaQuery.removeEventListener("change", syncTheme)
      window.removeEventListener("storage", syncStoredTheme)
    }
  }, [])

  return null
}
