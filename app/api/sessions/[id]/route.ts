import { NextRequest, NextResponse } from "next/server"
import { getAuthUserId } from "@/lib/auth-helper"
import { getDb } from "@/lib/db"
import { updateSessionSchema } from "@/lib/schemas"
import { Session } from "@/lib/types"
import { ObjectId } from "mongodb"
import { z } from "zod"

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const db = await getDb()
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 })
    }
    
    const session = await db.collection<Session>("sessions").findOne({
      _id: new ObjectId(id) as any,
      userId
    })
    
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }
    
    // Calculate duration
    const sessionWithDuration = {
      ...session,
      durationMin: session.end 
        ? Math.round((new Date(session.end).getTime() - new Date(session.start).getTime()) / 1000 / 60)
        : Math.round((Date.now() - new Date(session.start).getTime()) / 1000 / 60)
    }
    
    return NextResponse.json(sessionWithDuration)
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    
    // Validate request body
    const validatedData = updateSessionSchema.parse(body)
    
    const db = await getDb()
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 })
    }
    
    // Build update object
    const updateData: any = {
      updatedAt: new Date()
    }
    
    if (validatedData.categoryId) {
      // Verify category exists and belongs to user
      const category = await db.collection("categories").findOne({
        _id: validatedData.categoryId as any,
        userId
      })
      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 })
      }
      updateData.categoryId = validatedData.categoryId
    }
    
    if (validatedData.title) updateData.title = validatedData.title
    if (validatedData.start) updateData.start = new Date(validatedData.start)
    if (validatedData.end !== undefined) {
      updateData.end = validatedData.end ? new Date(validatedData.end) : null
    }
    if (validatedData.quality !== undefined) updateData.quality = validatedData.quality
    if (validatedData.tags !== undefined) updateData.tags = validatedData.tags
    
    // Recalculate duration if start or end changed
    if (validatedData.start || validatedData.end !== undefined) {
      const session = await db.collection<Session>("sessions").findOne({
        _id: new ObjectId(id) as any,
        userId
      })
      
      if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 })
      }
      
      const start = updateData.start || session.start
      const end = updateData.end !== undefined ? updateData.end : session.end
      
      if (end) {
        updateData.durationMin = Math.round(
          (new Date(end).getTime() - new Date(start).getTime()) / 1000 / 60
        )
      } else {
        updateData.durationMin = 0
      }
    }
    
    // Update session
    const result = await db.collection("sessions").findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      { $set: updateData },
      { returnDocument: "after" }
    )
    
    if (!result) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Error updating session:", error)
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const db = await getDb()
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 })
    }
    
    // Delete session
    const result = await db.collection("sessions").deleteOne({
      _id: new ObjectId(id),
      userId
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting session:", error)
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    )
  }
}