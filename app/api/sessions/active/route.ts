import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getDb } from "@/lib/db"
import { Session } from "@/lib/types"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()
    
    // Find active session (no end time)
    const activeSession = await db.collection<Session>("sessions").findOne({
      userId,
      end: null
    }, {
      sort: { start: -1 }
    })
    
    if (!activeSession) {
      return NextResponse.json(null)
    }
    
    // Calculate current duration
    const sessionWithDuration = {
      ...activeSession,
      durationMin: Math.round((Date.now() - new Date(activeSession.start).getTime()) / 1000 / 60)
    }
    
    return NextResponse.json(sessionWithDuration)
  } catch (error) {
    console.error("Error fetching active session:", error)
    return NextResponse.json(
      { error: "Failed to fetch active session" },
      { status: 500 }
    )
  }
}