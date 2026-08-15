import { Session } from '@/lib/types'

type InsightPayloadArgs = {
  granularity: 'day' | 'week' | 'month'
  startDate: Date
  endDate: Date
  timezone: string
  sessions: Session[]
  categoryNames: Map<string, string>
}

function getLocalParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || ''
  return {
    date: `${value('year')}-${value('month')}-${value('day')}`,
    hour: Number.parseInt(value('hour'), 10),
  }
}

function getDaypart(hour: number) {
  if (hour < 6) return 'overnight'
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  if (hour < 22) return 'evening'
  return 'overnight'
}

export function buildInsightPayload({
  granularity,
  startDate,
  endDate,
  timezone,
  sessions,
  categoryNames,
}: InsightPayloadArgs) {
  const categoryTotals = new Map<string, number>()
  const dayTotals = new Map<string, { totalMinutes: number; sessionCount: number }>()
  const daypartTotals = new Map<string, number>()
  const activityTotals = new Map<string, { title: string; category: string; totalMinutes: number; count: number }>()

  for (const session of sessions) {
    const category = categoryNames.get(session.categoryId.toString()) || 'Uncategorized'
    const minutes = Math.max(0, session.durationMin || 0)
    const local = getLocalParts(new Date(session.start), timezone)
    const title = session.sourceType === 'google_calendar' ? 'Calendar session' : session.title.trim()
    const activityKey = `${category}\u0000${title.toLocaleLowerCase()}`

    categoryTotals.set(category, (categoryTotals.get(category) || 0) + minutes)
    const day = dayTotals.get(local.date) || { totalMinutes: 0, sessionCount: 0 }
    day.totalMinutes += minutes
    day.sessionCount += 1
    dayTotals.set(local.date, day)
    const daypart = getDaypart(local.hour)
    daypartTotals.set(daypart, (daypartTotals.get(daypart) || 0) + minutes)
    const activity = activityTotals.get(activityKey) || { title, category, totalMinutes: 0, count: 0 }
    activity.totalMinutes += minutes
    activity.count += 1
    activityTotals.set(activityKey, activity)
  }

  return {
    period: granularity,
    timezone,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    totalMinutes: sessions.reduce((sum, session) => sum + Math.max(0, session.durationMin || 0), 0),
    sessionCount: sessions.length,
    categories: Array.from(categoryTotals, ([name, minutes]) => ({ name, minutes }))
      .sort((a, b) => b.minutes - a.minutes),
    days: Array.from(dayTotals, ([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    timeOfDay: Array.from(daypartTotals, ([name, minutes]) => ({ name, minutes }))
      .sort((a, b) => b.minutes - a.minutes),
    activities: Array.from(activityTotals.values())
      .sort((a, b) => b.totalMinutes - a.totalMinutes)
      .slice(0, 30),
  }
}
