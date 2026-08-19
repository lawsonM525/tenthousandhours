import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import { getAuthUserId } from "@/lib/auth-helper"
import { getDb } from "@/lib/db"
import { bulkCreateSessionsSchema } from "@/lib/schemas"
import { Category, Note, Session } from "@/lib/types"
import { getPostHogClient } from "@/lib/posthog-server"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { sessions, notes = [] } = bulkCreateSessionsSchema.parse(await req.json())
    const db = await getDb()
    const categoryIds = [...new Set(sessions.flatMap((session) => [
      session.categoryId,
      ...session.secondaryCategoryIds,
    ]))]
    const ownedCategoryCount = await db.collection<Category>('categories').countDocuments({
      userId,
      _id: { $in: categoryIds },
    })
    if (ownedCategoryCount !== categoryIds.length) {
      return NextResponse.json({ error: 'One or more categories are invalid' }, { status: 400 })
    }

    const now = new Date()
    const documents: Omit<Session, '_id'>[] = sessions.map((session) => {
      const start = new Date(session.start)
      const end = session.end ? new Date(session.end) : null
      if (!end || end <= start) throw new Error('INVALID_SESSION_RANGE')
      return {
        userId,
        categoryId: session.categoryId,
        secondaryCategoryIds: session.secondaryCategoryIds,
        categoryAllocations: session.categoryAllocations,
        title: session.title,
        start,
        end,
        durationMin: Math.round((end.getTime() - start.getTime()) / 60_000),
        quality: session.quality,
        tags: session.tags,
        createdAt: now,
        updatedAt: now,
      }
    })

    const result = await db.collection('sessions').insertMany(documents)
    const sessionIds = Object.values(result.insertedIds)
    const noteDocuments: Note[] = notes.flatMap((body, index) => {
      const trimmedBody = body.trim()
      if (!trimmedBody) return []
      return [{
        _id: crypto.randomUUID(),
        userId,
        body: trimmedBody,
        sessionIds: [sessionIds[index].toString()],
        tags: [],
        createdAt: now,
        updatedAt: now,
      }]
    })

    try {
      if (noteDocuments.length > 0) {
        await db.collection<Note>('notes').insertMany(noteDocuments)
      }
    } catch (noteError) {
      await Promise.allSettled([
        db.collection<Note>('notes').deleteMany({ _id: { $in: noteDocuments.map((note) => note._id) }, userId }),
        db.collection('sessions').deleteMany({ _id: { $in: sessionIds }, userId }),
      ])
      throw noteError
    }
    getPostHogClient().capture({
      distinctId: userId,
      event: 'daily_recall_confirmed',
      properties: { session_count: documents.length },
    })

    return NextResponse.json({
      insertedCount: result.insertedCount,
      sessionIds: sessionIds.map((id) => id.toString()),
      noteCount: noteDocuments.length,
    })
  } catch (error) {
    if (error instanceof z.ZodError || (error instanceof Error && error.message === 'INVALID_SESSION_RANGE')) {
      return NextResponse.json({ error: 'Invalid session drafts' }, { status: 400 })
    }
    console.error('Error creating session drafts:', error)
    return NextResponse.json({ error: 'Failed to create session drafts' }, { status: 500 })
  }
}
