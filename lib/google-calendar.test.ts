import { describe, expect, it } from "vitest"
import { buildGoogleCalendarAuthUrl, resolveGoogleCalendarRedirect } from "@/lib/google-calendar"

describe("resolveGoogleCalendarRedirect", () => {
  const fallback = "https://tenthousandhours.app/app/settings/calendar"

  it("allows an internal app path", () => {
    expect(resolveGoogleCalendarRedirect(
      "https://tenthousandhours.app",
      "/app/settings/calendar",
      fallback
    )).toBe("https://tenthousandhours.app/app/settings/calendar")
  })

  it.each([
    "https://evil.example/steal",
    "//evil.example/steal",
    "javascript:alert(1)",
    undefined,
  ])("rejects unsafe redirect %s", (redirectPath) => {
    expect(resolveGoogleCalendarRedirect(
      "https://tenthousandhours.app",
      redirectPath,
      fallback
    )).toBe(fallback)
  })
})

describe("buildGoogleCalendarAuthUrl", () => {
  it("requests only the identity and granular read-only Calendar scopes", () => {
    process.env.GOOGLE_CLIENT_ID = "calendar-client.example"
    process.env.GOOGLE_CALENDAR_REDIRECT_URI = "https://example.com/api/integrations/google-calendar/callback"
    process.env.GOOGLE_CALENDAR_STATE_SECRET = "test-state-secret"

    const url = new URL(buildGoogleCalendarAuthUrl("user_123", "/app/settings/calendar"))
    expect(url.searchParams.get("scope")?.split(" ")).toEqual([
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
      "https://www.googleapis.com/auth/calendar.events.readonly",
    ])
    expect(url.searchParams.get("redirect_uri")).toBe(
      "https://example.com/api/integrations/google-calendar/callback"
    )
    expect(url.searchParams.get("access_type")).toBe("offline")
  })
})
