import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getDb } from "@/lib/db"
import { createNoteSchema } from "@/lib/schemas"
import { Note } from "@/lib/types"
import { z } from "zod"
import crypto from "crypto"

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
    const sessionId = searchParams.get("sessionId")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = parseInt(searchParams.get("skip") || "0")
    const search = searchParams.get("search")
    
    // Build query
    const query: any = { userId }
    
    if (sessionId) {
      query.sessionIds = sessionId
    }
    
    if (search) {
      query.$or = [
        { body: { $regex: search, $options: "i" } },
        { tags: { $in: [search] } }
      ]
    }
    
    // Fetch notes
    const notes = await db
      .collection<Note>("notes")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json(
      { error: "Failed to fetch notes" },
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
    const validatedData = createNoteSchema.parse(body)
    
    const db = await getDb()
    
    // Verify session IDs belong to user
    if (validatedData.sessionIds.length > 0) {
      const sessions = await db.collection<{ _id: string; userId: string }>("sessions").find({
        _id: { $in: validatedData.sessionIds },
        userId
      }).toArray()
      
      if (sessions.length !== validatedData.sessionIds.length) {
        return NextResponse.json(
          { error: "One or more sessions not found" },
          { status: 404 }
        )
      }
    }
    
    // Create note
    const now = new Date()
    const note: Note = {
      _id: crypto.randomUUID(),
      userId,
      body: validatedData.body,
      sessionIds: validatedData.sessionIds,
      tags: validatedData.tags,
      createdAt: now,
      updatedAt: now
    }
    
    // Insert note
    await db.collection("notes").insertOne(note as any)
    
    return NextResponse.json(note)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Error creating note:", error)
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    )
  }
}