"use client"

import { useEffect, useMemo, useState } from "react"
import {
  addDays,
  addMonths,
  addWeeks,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { Brain, ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react"

type Granularity = 'day' | 'week' | 'month'
type AiInsight = {
  headline: string
  summary: string
  patterns: string[]
  nextStep: string
}

type AiInsightCardProps = {
  anchorDate: Date
}

export function AiInsightCard({ anchorDate }: AiInsightCardProps) {
  const [granularity, setGranularity] = useState<Granularity>('week')
  const [referenceDate, setReferenceDate] = useState(anchorDate)
  const [insight, setInsight] = useState<AiInsight | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const anchorTime = anchorDate.getTime()

  useEffect(() => {
    setReferenceDate(new Date(anchorTime))
    setInsight(null)
    setError(null)
  }, [anchorTime])

  const range = useMemo(() => {
    if (granularity === 'day') {
      return { start: startOfDay(referenceDate), end: endOfDay(referenceDate) }
    }
    if (granularity === 'month') {
      return { start: startOfMonth(referenceDate), end: endOfMonth(referenceDate) }
    }
    return { start: startOfWeek(referenceDate), end: endOfWeek(referenceDate) }
  }, [granularity, referenceDate])

  const rangeLabel = granularity === 'day'
    ? format(range.start, 'MMM d, yyyy')
    : granularity === 'month'
      ? format(range.start, 'MMMM yyyy')
      : `${format(range.start, 'MMM d')} – ${format(range.end, 'MMM d')}`

  const moveRange = (direction: -1 | 1) => {
    setReferenceDate((current) => granularity === 'day'
      ? addDays(current, direction)
      : granularity === 'week'
        ? addWeeks(current, direction)
        : addMonths(current, direction))
    setInsight(null)
    setError(null)
  }

  const selectGranularity = (next: Granularity) => {
    setGranularity(next)
    setInsight(null)
    setError(null)
  }

  const generateInsight = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          granularity,
          startDate: range.start.toISOString(),
          endDate: range.end.toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'Could not generate insight')
      setInsight(body.result)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not generate insight')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="border-4 border-mango-dark bg-white p-5 shadow-[6px_6px_0px_#1a1a1a]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-mango-dark bg-[#9373FF]">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black uppercase text-mango-dark">AI perspective</h2>
              <span className="inline-flex items-center gap-1 bg-mango-yellow px-2 py-0.5 text-[9px] font-black uppercase text-mango-dark">
                <Sparkles className="h-3 w-3" /> AI beta
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-500">A concise read on the time you actually tracked.</p>
          </div>
        </div>
        <div className="flex border-2 border-mango-dark">
          {(['day', 'week', 'month'] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => selectGranularity(period)}
              className={`px-3 py-1.5 text-xs font-black uppercase ${granularity === period ? 'bg-mango-dark text-white' : 'bg-white text-mango-dark hover:bg-mango-yellow/20'}`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-y-2 border-mango-dark/15 py-3">
        <button type="button" aria-label={`Previous ${granularity}`} onClick={() => moveRange(-1)} className="border-2 border-mango-dark p-1 hover:bg-mango-yellow">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-black uppercase text-mango-dark">{rangeLabel}</span>
        <button type="button" aria-label={`Next ${granularity}`} onClick={() => moveRange(1)} className="border-2 border-mango-dark p-1 hover:bg-mango-yellow">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {insight ? (
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#9373FF]">The read</p>
            <h3 className="mt-1 text-2xl font-black text-mango-dark">{insight.headline}</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{insight.summary}</p>
          </div>
          {insight.patterns.length > 0 && (
            <ul className="grid gap-2 sm:grid-cols-3">
              {insight.patterns.map((pattern) => (
                <li key={pattern} className="border-2 border-mango-dark/20 bg-slate-50 p-3 text-xs font-bold text-mango-dark">{pattern}</li>
              ))}
            </ul>
          )}
          <div className="border-l-4 border-mango-green bg-mango-green/10 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-mango-green">Try next</p>
            <p className="mt-1 text-sm font-bold text-mango-dark">{insight.nextStep}</p>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className={`text-sm font-bold ${error ? 'text-mango-red' : 'text-slate-500'}`}>
            {error || <>Generating sends the displayed period&apos;s session titles, categories, times, and durations to Google Gemini. <a href="/privacy" target="_blank" className="underline">Privacy details</a>.</>}
          </p>
          <button
            type="button"
            onClick={generateInsight}
            disabled={isLoading}
            className="inline-flex shrink-0 items-center gap-2 border-2 border-mango-dark bg-[#9373FF] px-4 py-2 text-xs font-black uppercase text-white shadow-[3px_3px_0px_#1a1a1a] disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isLoading ? 'Reading your time…' : 'Generate insight'}
          </button>
        </div>
      )}
    </section>
  )
}
