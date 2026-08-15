import { describe, expect, it } from 'vitest'
import { aiInsightSchema, recapResultSchema } from './ai-schemas'

describe('AI response schemas', () => {
  it('accepts a concise structured insight', () => {
    expect(aiInsightSchema.parse({
      headline: 'Your mornings carried the week',
      summary: 'Most tracked work happened before noon.',
      patterns: ['Three morning work sessions', 'Exercise was consistent'],
      nextStep: 'Protect one morning block next week.',
    }).patterns).toHaveLength(2)
  })

  it('rejects recap times that are not deterministic 24-hour values', () => {
    const result = recapResultSchema.safeParse({
      transcript: 'I worked after lunch.',
      sessions: [{
        title: 'Worked',
        startTime: 'after lunch',
        endTime: null,
        categoryId: null,
        confidence: 0.4,
        needsClarification: true,
        clarification: 'What time did you start?',
      }],
    })

    expect(result.success).toBe(false)
  })

  it('allows unclear recap timing to remain null for user review', () => {
    const result = recapResultSchema.parse({
      transcript: 'I worked on the pitch for two hours.',
      sessions: [{
        title: 'Work on pitch',
        startTime: null,
        endTime: null,
        categoryId: null,
        confidence: 0.7,
        needsClarification: true,
        clarification: 'Add the start and end time.',
      }],
    })

    expect(result.sessions[0].needsClarification).toBe(true)
  })
})
