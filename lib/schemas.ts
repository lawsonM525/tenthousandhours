import { z } from 'zod'

export const categoryColorSchema = z.enum([
  'pink',
  'teal',
  'blue',
  'violet',
  'lime',
  'amber',
  'red',
  'cyan',
])

export const categoryTypeSchema = z.enum(['skill', 'life', 'admin', 'social', 'other'])

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50),
  color: categoryColorSchema,
  type: categoryTypeSchema,
  countsTowardMastery: z.boolean().default(false),
  targetWeeklyHours: z.number().min(0).optional(),
  parentId: z.string().optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

const categoryAllocationSchema = z.object({
  categoryId: z.string().min(1),
  minutes: z.number().int().positive(),
})

export const createSessionSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  secondaryCategoryIds: z.array(z.string().min(1)).max(10).default([]),
  categoryAllocations: z.array(categoryAllocationSchema).max(11).optional(),
  title: z.string().min(1, 'Activity title is required').max(200),
  start: z.string().datetime(),
  end: z.string().datetime().optional(),
  quality: z.number().min(1).max(5).optional(),
  tags: z.array(z.string()).default([]),
  clientId: z.string().optional(),
  sourceType: z.literal('google_calendar').optional(),
  sourceProvider: z.literal('google').optional(),
  sourceEventId: z.string().max(1024).optional(),
  sourceCalendarId: z.string().max(1024).optional(),
}).superRefine((session, ctx) => {
  const uniqueIds = new Set(session.secondaryCategoryIds)
  if (uniqueIds.size !== session.secondaryCategoryIds.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['secondaryCategoryIds'], message: 'Categories must be unique' })
  }
  if (uniqueIds.has(session.categoryId)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['secondaryCategoryIds'], message: 'Primary category cannot also be secondary' })
  }
  // An empty list means the session is not being split across categories.
  // Some clients send [] explicitly, so only validate a real allocation list.
  if (session.categoryAllocations?.length) {
    const selectedIds = new Set([session.categoryId, ...session.secondaryCategoryIds])
    const allocationIds = session.categoryAllocations.map((allocation) => allocation.categoryId)
    if (new Set(allocationIds).size !== allocationIds.length || allocationIds.some((id) => !selectedIds.has(id))) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['categoryAllocations'], message: 'Allocations must use each selected category at most once' })
    }
    if (session.end) {
      const duration = Math.round((new Date(session.end).getTime() - new Date(session.start).getTime()) / 60_000)
      const allocated = session.categoryAllocations.reduce((sum, allocation) => sum + allocation.minutes, 0)
      if (allocated !== duration) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['categoryAllocations'], message: 'Allocated minutes must equal session duration' })
      }
    }
  }
})

export const updateSessionSchema = z.object({
  categoryId: z.string().optional(),
  secondaryCategoryIds: z.array(z.string().min(1)).max(10).optional(),
  categoryAllocations: z.array(categoryAllocationSchema).max(11).optional(),
  title: z.string().min(1).max(200).optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  quality: z.number().min(1).max(5).optional(),
  tags: z.array(z.string()).optional(),
})

export const bulkCreateSessionsSchema = z.object({
  sessions: z.array(createSessionSchema).min(1).max(20),
  notes: z.array(z.string().max(5000)).max(20).optional(),
}).superRefine((batch, ctx) => {
  if (batch.notes && batch.notes.length !== batch.sessions.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['notes'],
      message: 'Notes must line up with sessions',
    })
  }
})

export const createNoteSchema = z.object({
  body: z.string().min(1, 'Note cannot be empty'),
  sessionIds: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
})

export const updateNoteSchema = createNoteSchema.partial()

export const userSettingsSchema = z.object({
  rounding: z.enum(['1', '5', '15']).transform(val => parseInt(val)),
  weekStart: z.enum(['0', '1']).transform(val => parseInt(val)),
  aiEnabled: z.boolean(),
  notificationsEnabled: z.boolean(),
  timeFormat: z.enum(['12h', '24h']),
})
