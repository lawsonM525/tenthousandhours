"use client"

import { useState, useMemo } from "react"
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfDay, endOfDay, isToday } from "date-fns"
import { ChevronLeft, ChevronRight, Filter, List, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSessions } from "@/lib/hooks/use-sessions"
import { useCategories } from "@/lib/hooks/use-categories"
import { Session, Category } from "@/lib/types"

export default function InsightsPage() {
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(new Date())
  
  // Get week range
  const weekStart = startOfWeek(selectedWeek)
  const weekEnd = endOfWeek(selectedWeek)
  
  // Fetch sessions for the week
  const { data: weekSessions = [], isLoading: weekLoading } = useSessions({
    startDate: weekStart.toISOString(),
    endDate: weekEnd.toISOString()
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
  
  // Calculate stats
  const stats = useMemo(() => {
    const totalMinutes = weekSessions.reduce((sum, s) => sum + (s.durationMin || 0), 0)
    const daysWithSessions = new Set(weekSessions.map(s => format(new Date(s.start), 'yyyy-MM-dd'))).size
    const avgMinutesPerDay = daysWithSessions > 0 ? totalMinutes / daysWithSessions : 0
    
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
    
    return {
      totalMinutes,
      avgMinutesPerDay,
      mostProductiveHour,
      focusBreakRatio
    }
  }, [weekSessions, categoryMap])
  
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
      <header className="border-b border-border-subtle bg-bg-surface px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-h2 font-semibold text-text-primary">insights</h1>
            <p className="text-body text-text-secondary mt-1">truth over vibes. here&apos;s where your week actually went.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="rounded-full border border-border-subtle bg-bg-surface px-4 py-1 text-xs text-text-secondary">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        {weekLoading ? (
          <div className="text-center py-12 text-text-muted">
            <p className="text-body">Loading insights...</p>
          </div>
        ) : weekSessions.length === 0 ? (
          <div className="text-center py-12 text-text-muted space-y-2">
            <p className="text-h3">no data for this week</p>
            <p className="text-body">
              start tracking your time to see insights appear here.
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7 space-y-6">
              {/* Stats Overview */}
              <div className="card-elevated p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full border border-border-subtle bg-bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
                    Week overview
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-component border border-border-subtle bg-bg-surface p-4">
                    <p className="text-small uppercase tracking-wide text-text-muted">Total focus</p>
                    <p className="mt-2 text-2xl font-semibold text-text-primary">
                      {formatDuration(stats.totalMinutes)}
                    </p>
                    <p className="text-small text-text-muted">&nbsp;</p>
                  </div>
                  <div className="rounded-component border border-border-subtle bg-bg-surface p-4">
                    <p className="text-small uppercase tracking-wide text-text-muted">Avg focus/day</p>
                    <p className="mt-2 text-2xl font-semibold text-text-primary">
                      {formatDuration(Math.round(stats.avgMinutesPerDay))}
                    </p>
                    <p className="text-small text-text-muted">&nbsp;</p>
                  </div>
                  <div className="rounded-component border border-border-subtle bg-bg-surface p-4">
                    <p className="text-small uppercase tracking-wide text-text-muted">Most focused</p>
                    <p className="mt-2 text-2xl font-semibold text-text-primary">
                      {formatHour(stats.mostProductiveHour)}
                    </p>
                    <p className="text-small text-text-muted">&nbsp;</p>
                  </div>
                  <div className="rounded-component border border-border-subtle bg-bg-surface p-4">
                    <p className="text-small uppercase tracking-wide text-text-muted">Focus/break</p>
                    <p className="mt-2 text-2xl font-semibold text-text-primary">
                      {stats.focusBreakRatio} / 1
                    </p>
                    <p className="text-small text-text-muted">&nbsp;</p>
                  </div>
                </div>
              </div>

              {/* Category Distribution */}
              {categoryDistribution.length > 0 && (
                <div className="card-elevated p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-small font-medium uppercase tracking-[0.35em] text-text-muted">
                      Category Distribution
                    </h3>
                    <div className="text-small text-text-secondary">This week</div>
                  </div>
                  <div className="space-y-4">
                    {categoryDistribution.map((cat) => (
                      <div key={cat.categoryId} className="space-y-2">
                        <div className="flex items-center justify-between text-body">
                          <span className="flex items-center gap-2 text-text-primary">
                            <span 
                              className="h-2.5 w-2.5 rounded-full" 
                              style={{ backgroundColor: colorHex[cat.color as keyof typeof colorHex] || '#666' }} 
                            />
                            {cat.name}
                          </span>
                          <span className="text-text-secondary">
                            {cat.percentage}% · {cat.timeString}
                          </span>
                        </div>
                        <div className="h-2 rounded-pill bg-bg-surface border border-border-subtle/60">
                          <div 
                            className="h-full rounded-pill" 
                            style={{ 
                              width: `${cat.percentage}%`, 
                              backgroundColor: `${colorHex[cat.color as keyof typeof colorHex] || '#666'}cc` 
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
                <div className="card-elevated p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-small font-medium uppercase tracking-[0.35em] text-text-muted">
                      By Intention
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {taskBreakdown.map((task, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-body">
                          <span className="flex items-center gap-2 text-text-primary">
                            <span 
                              className="h-2.5 w-2.5 rounded-full" 
                              style={{ backgroundColor: colorHex[task.color as keyof typeof colorHex] || '#666' }} 
                            />
                            {task.name}
                          </span>
                          <span className="text-text-secondary">
                            {task.percentage}% · {task.timeString}
                          </span>
                        </div>
                        <div className="h-2 rounded-pill bg-bg-surface border border-border-subtle/60">
                          <div 
                            className="h-full rounded-pill" 
                            style={{ 
                              width: `${task.percentage}%`, 
                              backgroundColor: `${colorHex[task.color as keyof typeof colorHex] || '#666'}cc` 
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
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-small uppercase tracking-[0.35em] text-text-muted">
                      {format(selectedDay, 'EEE, MMM d')}
                    </p>
                    <h3 className="mt-2 text-h3 font-semibold text-text-primary">
                      {formatDuration(daySessions.reduce((sum, s) => sum + (s.durationMin || 0), 0))} focus logged
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDay(new Date())}
                    disabled={isToday(selectedDay)}
                  >
                    Today
                  </Button>
                </div>
                
                {/* Mini Timeline */}
                <div className="mt-6 grid grid-cols-[60px_1fr] gap-4">
                  <div className="space-y-8 text-small text-text-secondary">
                    {[9, 12, 15, 18, 21].map((hour) => (
                      <div key={hour}>
                        <span>{hour.toString().padStart(2, "0")}:00</span>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 grid grid-rows-5 gap-y-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="border-b border-border-subtle/60" />
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
                            className="absolute left-0 right-0 mx-1 rounded-component border border-border-subtle p-2 text-xs"
                            style={{
                              top: `${topOffset}px`,
                              height: `${height}px`,
                              backgroundColor: `${color}1a`,
                              borderColor: color
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-text-secondary">
                                {format(startTime, 'HH:mm')}
                              </span>
                              <span 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            </div>
                            <p className="font-medium text-text-primary truncate mt-1">
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