import "server-only"

import { GoogleGenAI } from "@google/genai"
import { NextRequest } from "next/server"
import { getAuthUserId } from "@/lib/auth-helper"
import { getOrCreateCurrentUser, hasPremiumAccess } from "@/lib/current-user"
import { getDb } from "@/lib/db"

export type AiFeature = 'insight' | 'recap'

export class AiAccessError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

export async function requirePremiumAiUser(req: NextRequest) {
  const userId = await getAuthUserId(req)
  if (!userId) throw new AiAccessError('Unauthorized', 401)

  const user = await getOrCreateCurrentUser(userId)
  if (!user) throw new AiAccessError('Could not load your account', 500)
  if (!hasPremiumAccess(user)) {
    throw new AiAccessError('Premium beta access is required for AI features', 403)
  }

  return { userId, user }
}

export async function reserveAiUsage(userId: string, feature: AiFeature) {
  const configuredLimit = feature === 'insight'
    ? process.env.AI_MONTHLY_INSIGHT_LIMIT
    : process.env.AI_MONTHLY_RECAP_LIMIT
  const fallbackLimit = feature === 'insight' ? 50 : 20
  const limit = Math.max(1, Number.parseInt(configuredLimit || String(fallbackLimit), 10) || fallbackLimit)
  const periodStart = new Date()
  periodStart.setUTCDate(1)
  periodStart.setUTCHours(0, 0, 0, 0)
  const periodKey = periodStart.toISOString().slice(0, 7)

  const db = await getDb()
  const counterId = `${userId}:${feature}:${periodKey}`
  const counters = db.collection<{
    _id: string
    userId: string
    feature: AiFeature
    periodKey: string
    count: number
    createdAt: Date
    updatedAt: Date
  }>('ai_usage_counters')
  const now = new Date()

  try {
    const counter = await counters.findOneAndUpdate(
      {
        _id: counterId,
        $or: [{ count: { $lt: limit } }, { count: { $exists: false } }],
      },
      {
        $inc: { count: 1 },
        $set: { updatedAt: now },
        $setOnInsert: { userId, feature, periodKey, createdAt: now },
      },
      { upsert: true, returnDocument: 'after' },
    )
    if (!counter) throw new AiAccessError(`Monthly ${feature} limit reached`, 429)

    await db.collection('ai_usage').insertOne({
      userId,
      feature,
      periodKey,
      sequence: counter.count,
      createdAt: now,
    })
    return { used: counter.count, limit }
  } catch (error: any) {
    if (error instanceof AiAccessError || error?.code === 11000) {
      throw new AiAccessError(`Monthly ${feature} limit reached`, 429)
    }
    throw error
  }
}

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new AiAccessError('Gemini is not configured yet', 503)
  return new GoogleGenAI({ apiKey })
}

export function getGeminiModel() {
  return process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite'
}

export function aiErrorResponse(error: unknown) {
  if (error instanceof AiAccessError) {
    return { status: error.status, body: { error: error.message } }
  }
  console.error('[AI] Request failed', error instanceof Error ? error.message : 'Unknown error')
  return { status: 500, body: { error: 'AI could not complete that request' } }
}
