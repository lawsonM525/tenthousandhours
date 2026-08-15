import { describe, expect, it } from 'vitest'
import { buildInsightPayload } from './insight-payload'
import { Session } from './types'

function session(overrides: Partial<Session>): Session {
  return {
    _id: 'session',
    userId: 'user',
    categoryId: 'work',
    title: 'Write proposal',
    start: new Date('2026-08-15T16:00:00.000Z'),
    end: new Date('2026-08-15T17:00:00.000Z'),
    durationMin: 60,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

describe('buildInsightPayload', () => {
  it('aggregates repeated activities instead of sending every raw session', () => {
    const payload = buildInsightPayload({
      granularity: 'week',
      startDate: new Date('2026-08-10T07:00:00.000Z'),
      endDate: new Date('2026-08-17T06:59:59.999Z'),
      timezone: 'America/Los_Angeles',
      categoryNames: new Map([['work', 'Work']]),
      sessions: [
        session({ _id: 'one' }),
        session({ _id: 'two', start: new Date('2026-08-16T16:00:00.000Z'), durationMin: 30 }),
      ],
    })

    expect(payload.activities).toEqual([{ title: 'Write proposal', category: 'Work', totalMinutes: 90, count: 2 }])
    expect(payload.timeOfDay).toEqual([{ name: 'morning', minutes: 90 }])
    expect(payload.days).toHaveLength(2)
  })

  it('removes titles originating from Google Calendar', () => {
    const payload = buildInsightPayload({
      granularity: 'day',
      startDate: new Date('2026-08-15T07:00:00.000Z'),
      endDate: new Date('2026-08-16T06:59:59.999Z'),
      timezone: 'America/Los_Angeles',
      categoryNames: new Map([['work', 'Work']]),
      sessions: [session({ sourceType: 'google_calendar', title: 'Private meeting name' })],
    })

    expect(payload.activities[0].title).toBe('Calendar session')
    expect(JSON.stringify(payload)).not.toContain('Private meeting name')
  })

  it('caps activity detail at thirty aggregated rows', () => {
    const sessions = Array.from({ length: 60 }, (_, index) => session({
      _id: String(index),
      title: `Activity ${index}`,
      durationMin: index + 1,
    }))
    const payload = buildInsightPayload({
      granularity: 'month',
      startDate: new Date('2026-08-01T07:00:00.000Z'),
      endDate: new Date('2026-09-01T06:59:59.999Z'),
      timezone: 'America/Los_Angeles',
      categoryNames: new Map([['work', 'Work']]),
      sessions,
    })

    expect(payload.activities).toHaveLength(30)
    expect(payload.activities[0].title).toBe('Activity 59')
  })
})
