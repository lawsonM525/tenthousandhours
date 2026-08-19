import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { aiInsightSchema, insightRequestSchema } from "@/lib/ai-schemas"
import { aiErrorResponse, getGeminiClient, getGeminiModel, requireAiUser, reserveAiUsage } from "@/lib/premium-ai"
import { getDb } from "@/lib/db"
import { Category, Session } from "@/lib/types"
import { buildInsightPayload } from "@/lib/insight-payload"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const responseJsonSchema = {
  type: 'object',
  properties: {
    headline: { type: 'string', description: 'A specific headline under 12 words.' },
    summary: { type: 'string', description: 'A concise, evidence-based summary in 2-4 sentences.' },
    patterns: { type: 'array', maxItems: 3, items: { type: 'string' } },
    nextStep: { type: 'string', description: 'One realistic next action grounded in the supplied data.' },
  },
  required: ['headline', 'summary', 'patterns', 'nextStep'],
  additionalProperties: false,
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAiUser(req)
    const input = insightRequestSchema.parse(await req.json())
    const startDate = new Date(input.startDate)
    const endDate = new Date(input.endDate)
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: input.timezone }).format(startDate)
    } catch {
      return NextResponse.json({ error: 'Invalid timezone' }, { status: 400 })
    }
    const rangeDays = (endDate.getTime() - startDate.getTime()) / 86_400_000
    const maximumDays = input.granularity === 'day' ? 2 : input.granularity === 'week' ? 8 : 32
    if (endDate <= startDate || rangeDays > maximumDays) {
      return NextResponse.json({ error: 'Invalid insight date range' }, { status: 400 })
    }

    const db = await getDb()
    const cacheKey = {
      userId,
      granularity: input.granularity,
      startDate,
      endDate,
      timezone: input.timezone,
      version: 1,
    }
    const cached = await db.collection('ai_summaries').findOne(cacheKey)
    if (cached?.result) {
      return NextResponse.json({ result: cached.result, cached: true, generatedAt: cached.updatedAt })
    }

    const [sessions, categories] = await Promise.all([
      db.collection<Session>('sessions').find({
        userId,
        start: { $gte: startDate, $lte: endDate },
      }).sort({ start: 1 }).limit(500).toArray(),
      db.collection<Category>('categories').find({ userId }).toArray(),
    ])

    if (sessions.length === 0) {
      return NextResponse.json({ error: 'Track at least one session in this period first' }, { status: 400 })
    }

    const categoryNames = new Map(categories.map((category) => [category._id.toString(), category.name]))
    const compactData = buildInsightPayload({
      granularity: input.granularity,
      startDate,
      endDate,
      timezone: input.timezone,
      sessions,
      categoryNames,
    })

    const ai = getGeminiClient()
    const usage = await reserveAiUsage(userId, 'insight')
    const response = await ai.models.generateContent({
      model: getGeminiModel(),
      contents: `Analyze this time-tracking data and return only the requested structured insight. Do not invent motives, diagnoses, or events. Be warm, direct, and useful.\n\n${JSON.stringify(compactData)}`,
      config: {
        temperature: 0.2,
        maxOutputTokens: 500,
        responseMimeType: 'application/json',
        responseJsonSchema,
      },
    })

    const result = aiInsightSchema.parse(JSON.parse(response.text || '{}'))
    const updatedAt = new Date()
    await db.collection('ai_summaries').updateOne(
      cacheKey,
      { $set: { result, updatedAt, model: getGeminiModel() }, $setOnInsert: { createdAt: updatedAt } },
      { upsert: true },
    )

    return NextResponse.json({ result, cached: false, generatedAt: updatedAt, usage })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid AI insight request' }, { status: 400 })
    }
    const response = aiErrorResponse(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}
