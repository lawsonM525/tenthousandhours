"use client"

import { useState, useMemo } from "react"
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, addDays, isToday } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSessions } from "@/lib/hooks/use-sessions"
import { useCategories } from "@/lib/hooks/use-categories"
import { Session, Category } from "@/lib/types"

export default function TimelinePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day')
  
  // Fetch sessions for the selected date range
  const dateRange = viewMode === 'day' 
    ? { start: startOfDay(selectedDate), end: endOfDay(selectedDate) }
    : { start: startOfWeek(selectedDate), end: endOfWeek(selectedDate) }
  
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions({
    startDate: dateRange.start.toISOString(),
    endDate: dateRange.end.toISOString()
  })
  
  const { data: categories = [] } = useCategories()
  
  // Create a map of category IDs to categories for quick lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>()
    categories.forEach(cat => map.set(cat._id, cat))
    return map
  }, [categories])
  
  // Calculate total focus time for the day
  const totalMinutes = useMemo(() => {
    return sessions.reduce((total, session) => {
      if (session.durationMin) {
        return total + session.durationMin
      }
      return total
    }, 0)
  }, [sessions])
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }
  
  // Navigate dates
  const navigateDate = (direction: 'prev' | 'next') => {
    const days = viewMode === 'week' ? 7 : 1
    setSelectedDate(current => 
      direction === 'prev' 
        ? addDays(current, -days)
        : addDays(current, days)
    )
  }
  
  const goToToday = () => {
    setSelectedDate(new Date())
  }
  
  // Color mappings for our palette
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
  
  // Group sessions by hour for timeline display
  const sessionsByHour = useMemo(() => {
    const hourMap = new Map<number, Session[]>()
    
    sessions.forEach(session => {
      const startHour = new Date(session.start).getHours()
      const existing = hourMap.get(startHour) || []
      hourMap.set(startHour, [...existing, session])
    })
    
    return hourMap
  }, [sessions])

  return (
    <div className="h-full flex flex-col">
      <header className="border-b border-border-subtle bg-bg-surface px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-h2 font-semibold text-text-primary">timeline</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-text-muted" />
              <span className="text-sm font-medium">
                {viewMode === 'day' 
                  ? format(selectedDate, 'EEE, MMM d')
                  : `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d')}`
                }
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
              disabled={isToday(selectedDate)}
            >
              Today
            </Button>
            
            <div className="flex gap-1 ml-3">
              <Button
                variant={viewMode === 'day' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('day')}
              >
                Day
              </Button>
              <Button
                variant={viewMode === 'week' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-6xl mx-auto">
          {sessionsLoading ? (
            <div className="text-center py-12 text-text-muted">
              <p className="text-body">Loading timeline...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 text-text-muted space-y-2">
              <p className="text-h3">no logs yet</p>
              <p className="text-body">
                start a timer to begin tracking your focus time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-bg-surface border border-border-subtle rounded-component p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-label uppercase tracking-wider text-text-secondary">
                      {format(selectedDate, 'EEEE, MMMM d')}
                    </p>
                    <h3 className="text-h3 font-semibold text-text-primary mt-1">
                      {formatDuration(totalMinutes)} focus logged
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-label text-text-secondary">{sessions.length} sessions</p>
                  </div>
                </div>
              </div>
              
              {/* Timeline Grid */}
              <div className="bg-bg-surface border border-border-subtle rounded-component p-6">
                <div className="grid grid-cols-[80px_1fr] gap-6">
                  {/* Hour labels */}
                  <div className="space-y-6 text-label text-text-secondary">
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <div key={hour} className="h-12 flex items-center">
                        <span>{hour.toString().padStart(2, '0')}:00</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Sessions */}
                  <div className="relative">
                    {/* Hour grid lines */}
                    <div className="absolute inset-0">
                      {Array.from({ length: 24 }).map((_, hour) => (
                        <div 
                          key={hour} 
                          className="h-12 border-b border-border-subtle/50"
                        />
                      ))}
                    </div>
                    
                    {/* Session blocks */}
                    <div className="relative">
                      {sessions.map((session) => {
                        const category = categoryMap.get(session.categoryId)
                        const startTime = new Date(session.start)
                        const endTime = session.end ? new Date(session.end) : new Date()
                        
                        const startHour = startTime.getHours()
                        const startMinutes = startTime.getMinutes()
                        const topOffset = (startHour * 48) + (startMinutes / 60 * 48)
                        
                        const durationMinutes = session.durationMin || 0
                        const height = Math.max((durationMinutes / 60) * 48, 20)
                        
                        const color = category ? colorHex[category.color] : '#666'
                        
                        return (
                          <div
                            key={session._id}
                            className="absolute left-0 right-0 mx-1 rounded-component border border-border-subtle p-3 cursor-pointer hover:shadow-lg transition-shadow"
                            style={{
                              top: `${topOffset}px`,
                              height: `${height}px`,
                              backgroundColor: `${color}1a`,
                              borderColor: color
                            }}
                          >
                            <div className="flex items-start justify-between text-xs">
                              <span className="text-text-secondary">
                                {format(startTime, 'HH:mm')} — {format(endTime, 'HH:mm')}
                              </span>
                              <span 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            </div>
                            <p className="font-medium text-sm text-text-primary mt-1 truncate">
                              {session.title}
                            </p>
                            {category && (
                              <p className="text-xs text-text-secondary truncate">
                                {category.name}
                              </p>
                            )}
                            {session.quality && (
                              <div className="flex gap-0.5 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      i < session.quality
                                        ? 'bg-cta-amber'
                                        : 'bg-border-subtle'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}