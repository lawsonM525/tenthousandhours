import { NextRequest, NextResponse } from "next/server"
import { getAuthUserId } from "@/lib/auth-helper"
import { disconnectGoogleCalendar } from "@/lib/google-calendar"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await disconnectGoogleCalendar(userId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error disconnecting Google Calendar:", error)
    return NextResponse.json(
      { error: error.message || "Failed to disconnect Google Calendar" },
      { status: 500 }
    )
  }
}
