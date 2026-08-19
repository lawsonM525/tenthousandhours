import { describe, expect, it } from 'vitest'
import { bulkCreateSessionsSchema, createSessionSchema } from './schemas'

const baseSession = {
  categoryId: 'coding',
  title: 'Email catch-up and app development',
  start: '2026-08-17T20:00:00.000Z',
  end: '2026-08-17T21:00:00.000Z',
  tags: ['email', 'context-switching'],
}

describe('session categories', () => {
  it('keeps one primary category and accepts additional context categories', () => {
    const parsed = createSessionSchema.parse({
      ...baseSession,
      secondaryCategoryIds: ['misc'],
    })

    expect(parsed.categoryId).toBe('coding')
    expect(parsed.secondaryCategoryIds).toEqual(['misc'])
    expect(parsed.tags).toEqual(['email', 'context-switching'])
  })

  it('defaults additional categories to an empty list for old clients', () => {
    expect(createSessionSchema.parse(baseSession).secondaryCategoryIds).toEqual([])
  })

  it('accepts an explicit empty allocation list for a single-category session', () => {
    const parsed = createSessionSchema.parse({
      ...baseSession,
      categoryAllocations: [],
    })

    expect(parsed.categoryAllocations).toEqual([])
  })

  it('rejects double-counting the primary category as secondary', () => {
    expect(() => createSessionSchema.parse({
      ...baseSession,
      secondaryCategoryIds: ['coding'],
    })).toThrow('Primary category cannot also be secondary')
  })

  it('rejects duplicate secondary categories', () => {
    expect(() => createSessionSchema.parse({
      ...baseSession,
      secondaryCategoryIds: ['misc', 'misc'],
    })).toThrow('Categories must be unique')
  })

  it('accepts a category split that preserves the real duration', () => {
    const parsed = createSessionSchema.parse({
      ...baseSession,
      secondaryCategoryIds: ['misc'],
      categoryAllocations: [
        { categoryId: 'coding', minutes: 40 },
        { categoryId: 'misc', minutes: 20 },
      ],
    })
    expect(parsed.categoryAllocations).toEqual([
      { categoryId: 'coding', minutes: 40 },
      { categoryId: 'misc', minutes: 20 },
    ])
  })

  it('rejects a split that invents extra time', () => {
    expect(() => createSessionSchema.parse({
      ...baseSession,
      secondaryCategoryIds: ['misc'],
      categoryAllocations: [
        { categoryId: 'coding', minutes: 60 },
        { categoryId: 'misc', minutes: 60 },
      ],
    })).toThrow('Allocated minutes must equal session duration')
  })

  it('keeps optional recap notes aligned with their sessions', () => {
    expect(() => bulkCreateSessionsSchema.parse({
      sessions: [baseSession],
      notes: ['first note', 'orphaned note'],
    })).toThrow('Notes must line up with sessions')

    const parsed = bulkCreateSessionsSchema.parse({ sessions: [baseSession], notes: ['my note'] })
    expect(parsed.notes).toEqual(['my note'])
  })
})
