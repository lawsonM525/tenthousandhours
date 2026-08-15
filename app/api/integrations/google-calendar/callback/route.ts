import { NextRequest, NextResponse } from "next/server"
import {
  exchangeGoogleCodeForTokens,
  parseGoogleOAuthState,
  resolveGoogleCalendarRedirect,
  upsertGoogleCalendarConnection,
} from "@/lib/google-calendar"

export const dynamic = "force-dynamic"

function appendStatus(urlString: string, status: "connected" | "error", message?: string) {
  const url = new URL(urlString)
  url.searchParams.set("googleCalendar", status)
  if (message) {
    url.searchParams.set("message", message)
  }
  return url.toString()
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  const state = req.nextUrl.searchParams.get("state")
  const error = req.nextUrl.searchParams.get("error")
  const defaultRedirect = process.env.GOOGLE_CALENDAR_SUCCESS_REDIRECT_URL || `${req.nextUrl.origin}/app/settings/calendar`

  try {
    if (!state) {
      return NextResponse.redirect(appendStatus(defaultRedirect, "error", "missing_state"))
    }

    const parsedState = parseGoogleOAuthState(state)
    const finalRedirect = resolveGoogleCalendarRedirect(req.nextUrl.origin, parsedState.redirectUri, defaultRedirect)

    if (error) {
      return NextResponse.redirect(appendStatus(finalRedirect, "error", error))
    }

    if (!code) {
      return NextResponse.redirect(appendStatus(finalRedirect, "error", "missing_code"))
    }

    const tokens = await exchangeGoogleCodeForTokens(code)
    await upsertGoogleCalendarConnection({
      userId: parsedState.userId,
      tokens,
    })

    return NextResponse.redirect(appendStatus(finalRedirect, "connected"))
  } catch (err: any) {
    console.error("Google Calendar callback failed:", err)
    return NextResponse.redirect(
      appendStatus(defaultRedirect, "error", err.message || "google_calendar_callback_failed")
    )
  }
}
