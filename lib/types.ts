import { CategoryColor } from './utils'
export type { CategoryColor }

export type CategoryType = 'skill' | 'life' | 'admin' | 'social' | 'other'

export interface Category {
  _id: string
  userId: string
  name: string
  color: CategoryColor
  type: CategoryType
  countsTowardMastery: boolean
  targetWeeklyHours?: number
  parentId?: string
  archived: boolean
  createdAt: Date
}

export interface Session {
  _id: string
  userId: string
  categoryId: string
  title: string
  start: Date
  end: Date | null
  durationMin: number
  quality?: number // 1-5
  tags: string[]
  noteId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Note {
  _id: string
  userId: string
  sessionIds: string[]
  body: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  summary?: string
  sentiment?: string
  keywords?: string[]
}

export interface Summary {
  _id: string
  userId: string
  granularity: 'day' | 'week' | 'month' | 'year'
  startDate: Date
  endDate: Date
  totalsByCategory: Record<string, number>
  unassignedMin: number
  aiSummary?: string
  milestones?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  _id: string
  clerkId: string
  email: string
  name: string
  tz: string
  createdAt: Date
  settings: {
    rounding: 1 | 5 | 15
    weekStart: 0 | 1
    aiEnabled: boolean
    notificationsEnabled: boolean
    timeFormat: '12h' | '24h'
  }
}
