import { NextRequest, NextResponse } from "next/server"
import { getAuthUserId } from "@/lib/auth-helper"
import { listGoogleCalendars, updateSelectedGoogleCalendars } from "@/lib/google-calendar"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const calendars = await listGoogleCalendars(userId)
    return NextResponse.json(calendars)
  } catch (error: any) {
    console.error("Error fetching Google calendars:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch Google calendars" },
      { status: 500 }
    )
  }
}


export async function PUT(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    if (!Array.isArray(body.calendarIds) || body.calendarIds.some((id: unknown) => typeof id !== "string")) {
      return NextResponse.json({ error: "calendarIds must be an array of strings" }, { status: 400 })
    }

    const selectedCalendarIds = await updateSelectedGoogleCalendars(userId, body.calendarIds)
    return NextResponse.json({ selectedCalendarIds })
  } catch (error: any) {
    console.error("Error updating selected Google calendars:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update selected calendars" },
      { status: 500 }
    )
  }
}
