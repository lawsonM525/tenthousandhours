"use client"

import { useState, useMemo, useEffect } from "react"
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfDay, endOfDay, isToday, subDays } from "date-fns"
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Flame, Trophy, Calendar as CalendarIcon } from "lucide-react"
import { useSessions } from "@/lib/hooks/use-sessions"
import { useCategories } from "@/lib/hooks/use-categories"
import { Category } from "@/lib/types"
import posthog from 'posthog-js'

export default function InsightsPage() {
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(new Date())

  // Track page view on mount
  useEffect(() => {
    posthog.capture('insights_viewed', {
      week_start: startOfWeek(new Date()).toISOString(),
    })
  }, [])
  
  // Get week range
  const weekStart = startOfWeek(selectedWeek)
  const weekEnd = endOfWeek(selectedWeek)
  
  // Fetch sessions for the week
  const { data: weekSessions = [], isLoading: weekLoading } = useSessions({
    startDate: weekStart.toISOString(),
    endDate: weekEnd.toISOString()
  })
  
  // Fetch sessions for previous week (for comparison)
  const prevWeekStart = subWeeks(weekStart, 1)
  const prevWeekEnd = subWeeks(weekEnd, 1)
  const { data: prevWeekSessions = [] } = useSessions({
    startDate: prevWeekStart.toISOString(),
    endDate: prevWeekEnd.toISOString()
  })
  
  // Fetch sessions for streak calculation (last 30 days)
  const thirtyDaysAgo = subDays(new Date(), 30)
  const { data: recentSessions = [] } = useSessions({
    startDate: thirtyDaysAgo.toISOString(),
    endDate: new Date().toISOString()
  })
  
  // Fetch sessions for selected day
  const { data: daySessions = [] } = useSessions({
    startDate: startOfDay(selectedDay).toISOString(),
    endDate: endOfDay(selectedDay).toISOString()
  })
  
  const { data: categories = [] } = useCategories()
  
  // Create category map
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>()
    categories.forEach(cat => map.set(cat._id, cat))
    return map
  }, [categories])
  
  // Helper functions - defined before useMemo hooks that use them
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }
  
  const formatHour = (hour: number) => {
    if (hour === 0) return 'Midnight'
    if (hour === 12) return 'Noon'
    if (hour < 12) return `${hour}am`
    return `${hour - 12}pm`
  }
  
  // Calculate stats
  const stats = useMemo(() => {
    const totalMinutes = weekSessions.reduce((sum, s) => sum + (s.durationMin || 0), 0)
    const sessionCount = weekSessions.length
    const avgSessionLength = sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0
    const daysWithSessions = new Set(weekSessions.map(s => format(new Date(s.start), 'yyyy-MM-dd'))).size
    const avgMinutesPerDay = daysWithSessions > 0 ? totalMinutes / daysWithSessions : 0
    
    // Previous week stats for comparison
    const prevTotalMinutes = prevWeekSessions.reduce((sum, s) => sum + (s.durationMin || 0), 0)
    const prevSessionCount = prevWeekSessions.length
    
    // Calculate percentage changes
    const totalChange = prevTotalMinutes > 0 
      ? Math.round(((totalMinutes - prevTotalMinutes) / prevTotalMinutes) * 100) 
      : totalMinutes > 0 ? 100 : 0
    const sessionCountChange = prevSessionCount > 0 
      ? Math.round(((sessionCount - prevSessionCount) / prevSessionCount) * 100) 
      : sessionCount > 0 ? 100 : 0
    
    // Find most productive hour
    const hourCounts = new Map<number, number>()
    weekSessions.forEach(session => {
      const hour = new Date(session.start).getHours()
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + (session.durationMin || 0))
    })
    
    let mostProductiveHour = 12
    let maxMinutes = 0
    hourCounts.forEach((minutes, hour) => {
      if (minutes > maxMinutes) {
        maxMinutes = minutes
        mostProductiveHour = hour
      }
    })
    
    // Calculate focus/break ratio
    const focusMinutes = weekSessions
      .filter(s => categoryMap.get(s.categoryId)?.type !== 'other')
      .reduce((sum, s) => sum + (s.durationMin || 0), 0)
    const breakMinutes = weekSessions
      .filter(s => categoryMap.get(s.categoryId)?.type === 'other')
      .reduce((sum, s) => sum + (s.durationMin || 0), 0)
    const focusBreakRatio = breakMinutes > 0 ? (focusMinutes / breakMinutes).toFixed(1) : focusMinutes > 0 ? '∞' : '0'
    
    // Best and worst day
    const dayMinutes = new Map<string, { date: Date, minutes: number }>()
    weekSessions.forEach(session => {
      const dateKey = format(new Date(session.start), 'yyyy-MM-dd')
      const existing = dayMinutes.get(dateKey) || { date: new Date(session.start), minutes: 0 }
      dayMinutes.set(dateKey, {
        date: existing.date,
        minutes: existing.minutes + (session.durationMin || 0)
      })
    })
    
    let bestDay: { date: Date, minutes: number } | null = null
    let worstDay: { date: Date, minutes: number } | null = null
    dayMinutes.forEach((data) => {
      if (!bestDay || data.minutes > bestDay.minutes) bestDay = { date: data.date, minutes: data.minutes }
      if (!worstDay || data.minutes < worstDay.minutes) worstDay = { date: data.date, minutes: data.minutes }
    })
    
    return {
      totalMinutes,
      avgMinutesPerDay,
      mostProductiveHour,
      focusBreakRatio,
      sessionCount,
      avgSessionLength,
      totalChange,
      sessionCountChange,
      bestDay: bestDay as { date: Date, minutes: number } | null,
      worstDay: worstDay as { date: Date, minutes: number } | null
    }
  }, [weekSessions, prevWeekSessions, categoryMap])
  
  // Calculate streak (consecutive days with sessions)
  const streak = useMemo(() => {
    const today = startOfDay(new Date())
    const daysWithSessions = new Set(
      recentSessions.map(s => format(new Date(s.start), 'yyyy-MM-dd'))
    )
    
    let currentStreak = 0
    let checkDate = today
    
    // Check if today has sessions, if not start from yesterday
    if (!daysWithSessions.has(format(today, 'yyyy-MM-dd'))) {
      checkDate = subDays(today, 1)
    }
    
    // Count consecutive days backwards
    while (daysWithSessions.has(format(checkDate, 'yyyy-MM-dd'))) {
      currentStreak++
      checkDate = subDays(checkDate, 1)
    }
    
    return currentStreak
  }, [recentSessions])
  
  // Calculate category distribution
  const categoryDistribution = useMemo(() => {
    const categoryMinutes = new Map<string, number>()
    
    weekSessions.forEach(session => {
      const categoryId = session.categoryId
      const minutes = session.durationMin || 0
      categoryMinutes.set(categoryId, (categoryMinutes.get(categoryId) || 0) + minutes)
    })
    
    const totalMinutes = stats.totalMinutes
    const distributions = Array.from(categoryMinutes.entries())
      .map(([categoryId, minutes]) => {
        const category = categoryMap.get(categoryId)
        const percentage = totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0
        
        return {
          categoryId,
          name: category?.name || 'Unknown',
          color: category?.color || 'blue',
          minutes,
          percentage,
          timeString: formatDuration(minutes)
        }
      })
      .sort((a, b) => b.minutes - a.minutes)
    
    return distributions
  }, [weekSessions, categoryMap, stats.totalMinutes])
  
  // Calculate task breakdown (by session title)
  const taskBreakdown = useMemo(() => {
    const taskMinutes = new Map<string, { categoryId: string, minutes: number }>()
    
    weekSessions.forEach(session => {
      const key = `${session.categoryId}:${session.title}`
      const existing = taskMinutes.get(key) || { categoryId: session.categoryId, minutes: 0 }
      taskMinutes.set(key, {
        categoryId: session.categoryId,
        minutes: existing.minutes + (session.durationMin || 0)
      })
    })
    
    const totalMinutes = stats.totalMinutes
    const tasks = Array.from(taskMinutes.entries())
      .map(([key, data]) => {
        const [categoryId, title] = key.split(':')
        const category = categoryMap.get(categoryId)
        const percentage = totalMinutes > 0 ? Math.round((data.minutes / totalMinutes) * 100) : 0
        
        return {
          name: `${category?.name}: ${title}`,
          color: category?.color || 'blue',
          minutes: data.minutes,
          percentage,
          timeString: formatDuration(data.minutes)
        }
      })
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 10) // Top 10 tasks
    
    return tasks
  }, [weekSessions, categoryMap, stats.totalMinutes])
  
  // Navigation
  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedWeek(current => direction === 'prev' ? subWeeks(current, 1) : addWeeks(current, 1))
  }
  
  // Color mappings
  const colorHex = {
    pink: '#F11D75',
    teal: '#16C7A8',
    blue: '#3A8DFF',
    violet: '#9373FF',
    lime: '#84CC16',
    amber: '#F59E0B',
    red: '#EF4444',
    cyan: '#06B6D4',
  } as const

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b-4 border-mango-dark px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="inline-block bg-mango-yellow px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-2">
              <span className="font-bold text-xs uppercase text-mango-dark">Analytics That Matter</span>
            </div>
            <h1 className="text-3xl font-black uppercase text-mango-dark">Insights</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Truth over vibes. Here&apos;s where your week actually went.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => navigateWeek('prev')}
              className="w-8 h-8 bg-mango-dark text-white border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5 stroke-[3]" />
            </button>
            <div className="px-4 py-2 bg-mango-dark text-white font-bold text-sm uppercase">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
            </div>
            <button
              onClick={() => navigateWeek('next')}
              className="w-8 h-8 bg-mango-dark text-white border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5 stroke-[3]" />
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        {weekLoading ? (
          <div className="text-center py-12">
            <p className="text-mango-dark font-bold">Loading insights...</p>
          </div>
        ) : weekSessions.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="distressed-card p-8">
              <h3 className="text-2xl font-black uppercase text-mango-dark mb-2">No Data Yet</h3>
              <p className="text-slate-500">
                Start tracking your time to see insights appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7 space-y-6">
              {/* Streak & Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Streak */}
                <div className="distressed-card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-mango-orange flex items-center justify-center border-2 border-mango-dark">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-mango-orange tracking-wider">Streak</p>
                    <p className="text-xl font-black text-mango-dark">{streak} days</p>
                  </div>
                </div>
                
                {/* Sessions */}
                <div className="distressed-card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-mango-green flex items-center justify-center border-2 border-mango-dark">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-mango-green tracking-wider">Sessions</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-black text-mango-dark">{stats.sessionCount}</p>
                      {stats.sessionCountChange !== 0 && (
                        <span className={`text-xs font-bold flex items-center ${stats.sessionCountChange > 0 ? 'text-mango-green' : 'text-mango-red'}`}>
                          {stats.sessionCountChange > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                          {Math.abs(stats.sessionCountChange)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Best Day */}
                {stats.bestDay && (
                  <div className="distressed-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-mango-yellow flex items-center justify-center border-2 border-mango-dark">
                      <Trophy className="w-5 h-5 text-mango-dark" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-mango-dark tracking-wider">Best Day</p>
                      <p className="text-sm font-black text-mango-dark">{format(stats.bestDay.date, 'EEE')}</p>
                      <p className="text-xs text-slate-500 font-bold">{formatDuration(stats.bestDay.minutes)}</p>
                    </div>
                  </div>
                )}
                
                {/* Avg Session */}
                <div className="distressed-card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#9373FF] flex items-center justify-center border-2 border-mango-dark">
                    <span className="text-white font-black text-sm">AVG</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-[#9373FF] tracking-wider">Per Session</p>
                    <p className="text-xl font-black text-mango-dark">{formatDuration(stats.avgSessionLength)}</p>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="distressed-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="inline-block bg-mango-orange px-3 py-1 border-2 border-mango-dark">
                    <span className="font-bold text-xs uppercase text-white">Week Overview</span>
                  </div>
                  {stats.totalChange !== 0 && (
                    <div className={`flex items-center gap-1 px-2 py-1 border-2 border-mango-dark font-bold text-xs ${stats.totalChange > 0 ? 'bg-mango-green/20 text-mango-green' : 'bg-mango-red/20 text-mango-red'}`}>
                      {stats.totalChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stats.totalChange > 0 ? '+' : ''}{stats.totalChange}% vs last week
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="p-4 bg-mango-red/10 border-2 border-mango-red">
                    <p className="text-[10px] uppercase font-black text-mango-red tracking-wider">Total Focus</p>
                    <p className="mt-2 text-2xl font-black text-mango-dark">
                      {formatDuration(stats.totalMinutes)}
                    </p>
                  </div>
                  <div className="p-4 bg-mango-orange/10 border-2 border-mango-orange">
                    <p className="text-[10px] uppercase font-black text-mango-orange tracking-wider">Avg Focus/Day</p>
                    <p className="mt-2 text-2xl font-black text-mango-dark">
                      {formatDuration(Math.round(stats.avgMinutesPerDay))}
                    </p>
                  </div>
                  <div className="p-4 bg-mango-yellow/10 border-2 border-mango-yellow">
                    <p className="text-[10px] uppercase font-black text-mango-dark tracking-wider">Most Focused</p>
                    <p className="mt-2 text-2xl font-black text-mango-dark">
                      {formatHour(stats.mostProductiveHour)}
                    </p>
                  </div>
                  <div className="p-4 bg-mango-green/10 border-2 border-mango-green">
                    <p className="text-[10px] uppercase font-black text-mango-green tracking-wider">Focus/Break</p>
                    <p className="mt-2 text-2xl font-black text-mango-dark">
                      {stats.focusBreakRatio} / 1
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Distribution */}
              {categoryDistribution.length > 0 && (
                <div className="distressed-card p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-black text-xl uppercase text-mango-dark">Category Breakdown</h3>
                    <span className="font-bold text-xs uppercase bg-mango-dark text-white px-3 py-1">This Week</span>
                  </div>
                  <div className="space-y-5">
                    {categoryDistribution.map((cat) => (
                      <div key={cat.categoryId}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: colorHex[cat.color as keyof typeof colorHex] || '#666' }} 
                            />
                            <span className="font-bold text-mango-dark">{cat.name}</span>
                          </div>
                          <span className="font-black text-lg text-mango-dark">{cat.timeString}</span>
                        </div>
                        <div className="h-2 bg-slate-100 border border-mango-dark overflow-hidden">
                          <div 
                            className="h-full transition-all duration-1000 ease-out" 
                            style={{ 
                              width: `${cat.percentage}%`, 
                              backgroundColor: colorHex[cat.color as keyof typeof colorHex] || '#666'
                            }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Task Breakdown */}
              {taskBreakdown.length > 0 && (
                <div className="distressed-card p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-black text-xl uppercase text-mango-dark">By Intention</h3>
                  </div>
                  <div className="space-y-5">
                    {taskBreakdown.map((task, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: colorHex[task.color as keyof typeof colorHex] || '#666' }} 
                            />
                            <span className="font-bold text-mango-dark">{task.name}</span>
                          </div>
                          <span className="font-black text-lg text-mango-dark">{task.timeString}</span>
                        </div>
                        <div className="h-2 bg-slate-100 border border-mango-dark overflow-hidden">
                          <div 
                            className="h-full transition-all duration-1000 ease-out" 
                            style={{ 
                              width: `${task.percentage}%`, 
                              backgroundColor: colorHex[task.color as keyof typeof colorHex] || '#666'
                            }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Day Timeline */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
              <div className="distressed-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-500 tracking-widest">
                      {format(selectedDay, 'EEE, MMM d')}
                    </p>
                    <h3 className="mt-1 text-2xl font-black text-mango-dark">
                      {formatDuration(daySessions.reduce((sum, s) => sum + (s.durationMin || 0), 0))} logged
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedDay(new Date())}
                    disabled={isToday(selectedDay)}
                    className="px-3 py-1 bg-mango-yellow text-mango-dark font-bold text-sm uppercase border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_#1a1a1a] disabled:hover:translate-y-0"
                  >
                    Today
                  </button>
                </div>
                
                {/* Mini Timeline */}
                <div className="mt-6 grid grid-cols-[60px_1fr] gap-4">
                  <div className="space-y-8 text-xs font-bold text-slate-500 uppercase">
                    {[9, 12, 15, 18, 21].map((hour) => (
                      <div key={hour}>
                        <span>{hour.toString().padStart(2, "0")}:00</span>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 grid grid-rows-5 gap-y-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="border-b-2 border-mango-dark/10" />
                      ))}
                    </div>
                    
                    {/* Session blocks */}
                    <div className="relative">
                      {daySessions.map((session) => {
                        const category = categoryMap.get(session.categoryId)
                        const startTime = new Date(session.start)
                        const startHour = startTime.getHours()
                        const startMinutes = startTime.getMinutes()
                        
                        // Only show sessions between 9am and 9pm
                        if (startHour < 9 || startHour >= 21) return null
                        
                        const topOffset = ((startHour - 9) * 40) + (startMinutes / 60 * 40)
                        const height = Math.max((session.durationMin || 0) / 60 * 40, 20)
                        const color = category ? colorHex[category.color as keyof typeof colorHex] : '#666'
                        
                        return (
                          <div
                            key={session._id}
                            className="absolute left-0 right-0 mx-1 border-2 border-mango-dark p-2 text-xs shadow-[2px_2px_0px_#1a1a1a]"
                            style={{
                              top: `${topOffset}px`,
                              height: `${height}px`,
                              backgroundColor: color,
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-white/80 font-bold">
                                {format(startTime, 'HH:mm')}
                              </span>
                            </div>
                            <p className="font-bold text-white truncate mt-1">
                              {session.title}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}