import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { recapResultSchema } from "@/lib/ai-schemas"
import { aiErrorResponse, getGeminiClient, getGeminiModel, requirePremiumAiUser, reserveAiUsage } from "@/lib/premium-ai"
import { getDb } from "@/lib/db"
import { Category } from "@/lib/types"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const allowedAudioTypes = new Set(['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-wav'])
const maxAudioBytes = 4 * 1024 * 1024

const responseJsonSchema = {
  type: 'object',
  properties: {
    transcript: { type: 'string' },
    sessions: {
      type: 'array',
      maxItems: 20,
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          startTime: { anyOf: [{ type: 'string' }, { type: 'null' }], description: '24-hour HH:mm or null.' },
          endTime: { anyOf: [{ type: 'string' }, { type: 'null' }], description: '24-hour HH:mm or null.' },
          categoryId: { anyOf: [{ type: 'string' }, { type: 'null' }] },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          needsClarification: { type: 'boolean' },
          clarification: { type: 'string' },
        },
        required: ['title', 'startTime', 'endTime', 'categoryId', 'confidence', 'needsClarification', 'clarification'],
        additionalProperties: false,
      },
    },
  },
  required: ['transcript', 'sessions'],
  additionalProperties: false,
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requirePremiumAiUser(req)
    const formData = await req.formData()
    const audio = formData.get('audio')
    const selectedDate = String(formData.get('selectedDate') || '')
    const timezone = String(formData.get('timezone') || 'UTC').slice(0, 100)

    const audioMimeType = audio instanceof File ? audio.type.split(';')[0] : ''
    if (!(audio instanceof File) || !allowedAudioTypes.has(audioMimeType) || audio.size === 0 || audio.size > maxAudioBytes) {
      return NextResponse.json({ error: 'Please record an audio note under 4 MB' }, { status: 400 })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      return NextResponse.json({ error: 'Invalid recap date' }, { status: 400 })
    }

    const db = await getDb()
    const categories = await db.collection<Category>('categories').find({ userId, archived: { $ne: true } }).toArray()
    if (categories.length === 0) {
      return NextResponse.json({ error: 'Create at least one category before using Daily Recall' }, { status: 400 })
    }

    const allowedCategoryIds = new Set(categories.map((category) => category._id.toString()))
    const categoryOptions = categories.map((category) => ({ id: category._id.toString(), name: category.name }))
    const ai = getGeminiClient()
    await reserveAiUsage(userId, 'recap')
    const audioBase64 = Buffer.from(await audio.arrayBuffer()).toString('base64')
    const prompt = [
      'Transcribe this end-of-day voice recap and extract proposed time-tracking sessions.',
      `The selected local date is ${selectedDate} and the timezone is ${timezone}.`,
      `Allowed categories: ${JSON.stringify(categoryOptions)}.`,
      'Use an allowed category id only when it clearly fits. Otherwise use null.',
      'Never invent an activity. When exact timing is unclear, use null times and explain the missing detail in clarification.',
      'When timing is clear, use local 24-hour HH:mm values. Sessions must not cross into another day.',
      'These are drafts only; the user will review them before anything is saved.',
    ].join('\n')

    const response = await ai.models.generateContent({
      model: getGeminiModel(),
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType: audioMimeType, data: audioBase64 } },
        ],
      }],
      config: {
        temperature: 0.1,
        maxOutputTokens: 1400,
        responseMimeType: 'application/json',
        responseJsonSchema,
      },
    })

    const parsed = recapResultSchema.parse(JSON.parse(response.text || '{}'))
    const result = {
      ...parsed,
      sessions: parsed.sessions.map((session) => ({
        ...session,
        categoryId: session.categoryId && allowedCategoryIds.has(session.categoryId) ? session.categoryId : null,
      })),
    }

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Gemini returned an invalid recap. Please try a shorter recording.' }, { status: 502 })
    }
    const response = aiErrorResponse(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}
