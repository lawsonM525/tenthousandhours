import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getDb } from "@/lib/db"
import { createSessionSchema } from "@/lib/schemas"
import { Session } from "@/lib/types"
import { z } from "zod"
import { getPostHogClient } from "@/lib/posthog-server"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()
    const searchParams = req.nextUrl.searchParams
    
    // Parse query params
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const categoryId = searchParams.get("categoryId")
    const limit = parseInt(searchParams.get("limit") || "100")
    const skip = parseInt(searchParams.get("skip") || "0")
    
    // Build query
    const query: any = { userId }
    
    if (startDate || endDate) {
      query.start = {}
      if (startDate) query.start.$gte = new Date(startDate)
      if (endDate) query.start.$lte = new Date(endDate)
    }
    
    if (categoryId) {
      query.categoryId = categoryId
    }
    
    // Fetch sessions
    const sessions = await db
      .collection<Session>("sessions")
      .find(query)
      .sort({ start: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    // Calculate duration for any active sessions
    const sessionsWithDuration = sessions.map(session => ({
      ...session,
      durationMin: session.end 
        ? Math.round((new Date(session.end).getTime() - new Date(session.start).getTime()) / 1000 / 60)
        : Math.round((Date.now() - new Date(session.start).getTime()) / 1000 / 60)
    }))
    
    return NextResponse.json(sessionsWithDuration)
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    
    // Validate request body
    const validatedData = createSessionSchema.parse(body)
    
    const db = await getDb()
    
    // Check if category exists and belongs to user
    const category = await db.collection("categories").findOne({
      _id: validatedData.categoryId as any,
      userId: userId
    })
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }
    
    // Create session
    const now = new Date()
    const session: Omit<Session, "_id"> = {
      userId,
      categoryId: validatedData.categoryId,
      title: validatedData.title,
      start: new Date(validatedData.start),
      end: validatedData.end ? new Date(validatedData.end) : null,
      durationMin: 0,
      quality: validatedData.quality,
      tags: validatedData.tags,
      createdAt: now,
      updatedAt: now
    }
    
    // Calculate duration if session has ended
    if (session.end) {
      session.durationMin = Math.round(
        (session.end.getTime() - session.start.getTime()) / 1000 / 60
      )
    }
    
    // Insert session
    const result = await db.collection("sessions").insertOne(session)

    // Track server-side session creation
    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: userId,
      event: 'api_session_created',
      properties: {
        session_id: result.insertedId.toString(),
        category_id: validatedData.categoryId,
        category_name: category.name,
        session_title: validatedData.title,
        has_end_time: !!validatedData.end,
        source: 'api',
      }
    })

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...session
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Error creating session:", error)
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    )
  }
}