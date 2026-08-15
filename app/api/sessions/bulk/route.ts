import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAuthUserId } from "@/lib/auth-helper"
import { getDb } from "@/lib/db"
import { bulkCreateSessionsSchema } from "@/lib/schemas"
import { Category, Session } from "@/lib/types"
import { getPostHogClient } from "@/lib/posthog-server"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { sessions } = bulkCreateSessionsSchema.parse(await req.json())
    const db = await getDb()
    const categoryIds = [...new Set(sessions.map((session) => session.categoryId))]
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
    getPostHogClient().capture({
      distinctId: userId,
      event: 'daily_recall_confirmed',
      properties: { session_count: documents.length },
    })

    return NextResponse.json({
      insertedCount: result.insertedCount,
      sessionIds: Object.values(result.insertedIds).map((id) => id.toString()),
    })
  } catch (error) {
    if (error instanceof z.ZodError || (error instanceof Error && error.message === 'INVALID_SESSION_RANGE')) {
      return NextResponse.json({ error: 'Invalid session drafts' }, { status: 400 })
    }
    console.error('Error creating session drafts:', error)
    return NextResponse.json({ error: 'Failed to create session drafts' }, { status: 500 })
  }
}
