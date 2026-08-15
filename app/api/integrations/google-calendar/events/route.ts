import { NextRequest, NextResponse } from "next/server"
import { getAuthUserId } from "@/lib/auth-helper"
import { listGoogleCalendarEvents } from "@/lib/google-calendar"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const timeMin = req.nextUrl.searchParams.get("timeMin")
    const timeMax = req.nextUrl.searchParams.get("timeMax")
    const calendarIds = req.nextUrl.searchParams.getAll("calendarId")

    if (!timeMin || !timeMax) {
      return NextResponse.json(
        { error: "timeMin and timeMax are required" },
        { status: 400 }
      )
    }

    const events = await listGoogleCalendarEvents({
      userId,
      timeMin,
      timeMax,
      calendarIds,
    })

    return NextResponse.json(events)
  } catch (error: any) {
    console.error("Error fetching Google Calendar events:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch Google Calendar events" },
      { status: 500 }
    )
  }
}
