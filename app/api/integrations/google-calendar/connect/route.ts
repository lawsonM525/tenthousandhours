import { NextRequest, NextResponse } from "next/server"
import { getAuthUserId } from "@/lib/auth-helper"
import { buildGoogleCalendarAuthUrl } from "@/lib/google-calendar"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const authUrl = buildGoogleCalendarAuthUrl(userId, "/app/settings/calendar")

    return NextResponse.json({ authUrl })
  } catch (error: any) {
    console.error("Error building Google Calendar auth URL:", error)
    return NextResponse.json(
      { error: error.message || "Failed to start Google Calendar connection" },
      { status: 500 }
    )
  }
}
