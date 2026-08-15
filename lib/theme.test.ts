import { describe, expect, it } from "vitest"
import { isAppTheme, resolveTheme } from "@/lib/theme"

describe("theme settings", () => {
  it("resolves explicit themes without using the system preference", () => {
    expect(resolveTheme("light", true)).toBe("light")
    expect(resolveTheme("dark", false)).toBe("dark")
  })

  it("follows the system preference when requested", () => {
    expect(resolveTheme("system", true)).toBe("dark")
    expect(resolveTheme("system", false)).toBe("light")
  })

  it("rejects invalid stored values", () => {
    expect(isAppTheme("dark")).toBe(true)
    expect(isAppTheme("sepia")).toBe(false)
    expect(isAppTheme(null)).toBe(false)
  })
})
