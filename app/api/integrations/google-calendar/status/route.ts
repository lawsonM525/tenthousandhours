import { NextRequest, NextResponse } from "next/server"
import { getAuthUserId } from "@/lib/auth-helper"
import { getGoogleCalendarConnection } from "@/lib/google-calendar"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const connection = await getGoogleCalendarConnection(userId)
    if (!connection) {
      return NextResponse.json({
        connected: false,
        provider: "google_calendar",
      })
    }

    return NextResponse.json({
      connected: true,
      provider: "google_calendar",
      email: connection.googleUserEmail || null,
      name: connection.googleUserName || null,
      scopes: connection.scope,
      expiresAt: connection.expiryDate?.toISOString() || null,
      selectedCalendarIds: connection.selectedCalendarIds || [],
      lastSyncedAt: connection.lastSyncedAt?.toISOString() || null,
      updatedAt: connection.updatedAt.toISOString(),
    })
  } catch (error: any) {
    console.error("Error fetching Google Calendar status:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch Google Calendar status" },
      { status: 500 }
    )
  }
}
