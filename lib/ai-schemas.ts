import { z } from 'zod'

export const insightGranularitySchema = z.enum(['day', 'week', 'month'])

export const insightRequestSchema = z.object({
  granularity: insightGranularitySchema,
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  timezone: z.string().min(1).max(100).default('UTC'),
})

export const aiInsightSchema = z.object({
  headline: z.string().min(1).max(120),
  summary: z.string().min(1).max(800),
  patterns: z.array(z.string().min(1).max(220)).max(3),
  nextStep: z.string().min(1).max(280),
})

export const recapSessionSchema = z.object({
  title: z.string().min(1).max(200),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable(),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable(),
  categoryId: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  needsClarification: z.boolean(),
  clarification: z.string().max(240),
})

export const recapResultSchema = z.object({
  transcript: z.string().max(5000),
  sessions: z.array(recapSessionSchema).max(20),
})
