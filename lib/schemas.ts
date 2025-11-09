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

export const createSessionSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  title: z.string().min(1, 'Activity title is required').max(200),
  start: z.string().datetime(),
  end: z.string().datetime().optional(),
  quality: z.number().min(1).max(5).optional(),
  tags: z.array(z.string()).default([]),
  clientId: z.string().optional(),
})

export const updateSessionSchema = z.object({
  categoryId: z.string().optional(),
  title: z.string().min(1).max(200).optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  quality: z.number().min(1).max(5).optional(),
  tags: z.array(z.string()).optional(),
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
