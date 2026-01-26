"use client"

import { useState, useMemo, useEffect } from "react"
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, addDays, isToday, isSameDay, eachDayOfInterval } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar, Trash2, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useSessions, useUpdateSession, useDeleteSession, useCreateSession } from "@/lib/hooks/use-sessions"
import { useCategories } from "@/lib/hooks/use-categories"
import { useNotes, useCreateNote } from "@/lib/hooks/use-notes"
import { Session, Category } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import posthog from 'posthog-js'

export default function TimelinePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day')
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    title: "",
    start: "",
    end: "",
    categoryId: "",
    note: "",
  })
  
  // Add session state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    title: "",
    start: "",
    end: "",
    categoryId: "",
  })
  
  const updateSession = useUpdateSession()
  const deleteSession = useDeleteSession()
  const createSession = useCreateSession()
  const { toast } = useToast()

  // Track page view on mount
  useEffect(() => {
    posthog.capture('timeline_viewed', {
      view_mode: 'day',
      selected_date: new Date().toISOString(),
    })
  }, [])
  
  // Fetch sessions for the selected date range
  const dateRange = viewMode === 'day' 
    ? { start: startOfDay(selectedDate), end: endOfDay(selectedDate) }
    : { start: startOfWeek(selectedDate), end: endOfWeek(selectedDate) }
  
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions({
    startDate: dateRange.start.toISOString(),
    endDate: dateRange.end.toISOString()
  })
  
  const { data: categories = [] } = useCategories()
  
  // Fetch all notes to display on timeline blocks
  const { data: allNotes = [] } = useNotes()
  
  // Create a map of session IDs to notes for quick lookup
  const notesBySessionId = useMemo(() => {
    const map = new Map<string, string>()
    allNotes.forEach(note => {
      note.sessionIds.forEach(sessionId => {
        map.set(sessionId, note.body)
      })
    })
    return map
  }, [allNotes])
  
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
  
  // Open add session dialog with default times
  const openAddDialog = () => {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    setAddForm({
      title: "",
      start: format(oneHourAgo, "yyyy-MM-dd'T'HH:mm"),
      end: format(now, "yyyy-MM-dd'T'HH:mm"),
      categoryId: categories[0]?._id || "",
    })
    setIsAddOpen(true)
  }
  
  // Handle manual session creation
  const handleCreateSession = async () => {
    if (!addForm.title.trim() || !addForm.start || !addForm.end || !addForm.categoryId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }
    
    const startTime = new Date(addForm.start)
    const endTime = new Date(addForm.end)
    
    if (endTime <= startTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time",
        variant: "destructive"
      })
      return
    }
    
    try {
      await createSession.mutateAsync({
        title: addForm.title,
        categoryId: addForm.categoryId,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        tags: [],
      })
      
      posthog.capture('session_created_manual', {
        title: addForm.title,
        category_id: addForm.categoryId,
        duration_minutes: Math.round((endTime.getTime() - startTime.getTime()) / 60000),
      })
      
      toast({
        title: "Session logged",
        description: `"${addForm.title}" has been added to your timeline.`
      })
      
      setIsAddOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create session",
        variant: "destructive"
      })
    }
  }
  
  // Fetch note for the editing session
  const { data: sessionNotes = [] } = useNotes(
    editingSession ? { sessionId: editingSession._id } : undefined
  )
  const createNote = useCreateNote()
  
  // Open edit dialog for a session
  const openEditDialog = (session: Session) => {
    setEditingSession(session)
    setEditForm({
      title: session.title,
      start: format(new Date(session.start), "yyyy-MM-dd'T'HH:mm"),
      end: session.end ? format(new Date(session.end), "yyyy-MM-dd'T'HH:mm") : "",
      categoryId: session.categoryId,
      note: "",
    })
    setIsEditOpen(true)
  }
  
  // Update note field when session notes load
  useEffect(() => {
    if (sessionNotes.length > 0 && isEditOpen) {
      setEditForm(prev => ({ ...prev, note: sessionNotes[0].body }))
    }
  }, [sessionNotes, isEditOpen])
  
  // Handle session update
  const handleUpdateSession = async () => {
    if (!editingSession) return
    
    try {
      await updateSession.mutateAsync({
        id: editingSession._id,
        data: {
          title: editForm.title,
          start: new Date(editForm.start).toISOString(),
          end: editForm.end ? new Date(editForm.end).toISOString() : undefined,
          categoryId: editForm.categoryId,
        }
      })
      
      // Handle note: create new or update existing
      const existingNote = sessionNotes[0]
      const noteChanged = editForm.note.trim() !== (existingNote?.body || "")
      
      if (editForm.note.trim() && noteChanged) {
        await createNote.mutateAsync({
          body: editForm.note.trim(),
          sessionIds: [editingSession._id],
          tags: [],
        })
      }
      
      posthog.capture('session_updated', {
        session_id: editingSession._id,
        title_changed: editForm.title !== editingSession.title,
        time_changed: editForm.start !== format(new Date(editingSession.start), "yyyy-MM-dd'T'HH:mm"),
        note_added: noteChanged && editForm.note.trim().length > 0,
      })
      
      toast({
        title: "Session updated",
        description: `"${editForm.title}" has been updated.`
      })
      
      setIsEditOpen(false)
      setEditingSession(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update session",
        variant: "destructive"
      })
    }
  }
  
  // Handle session delete
  const handleDeleteSession = async () => {
    if (!editingSession) return
    
    if (confirm(`Are you sure you want to delete "${editingSession.title}"? This action cannot be undone.`)) {
      try {
        await deleteSession.mutateAsync(editingSession._id)
        
        posthog.capture('session_deleted', {
          session_id: editingSession._id,
          session_title: editingSession.title,
        })
        
        toast({
          title: "Session deleted",
          description: `"${editingSession.title}" has been removed.`
        })
        
        setIsEditOpen(false)
        setEditingSession(null)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete session",
          variant: "destructive"
        })
      }
    }
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
  const _sessionsByHour = useMemo(() => {
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
      {/* Header */}
      <header className="bg-white border-b-4 border-mango-dark px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto">
          {/* Mobile: Stack everything vertically */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Title - hidden on mobile, shown on desktop */}
            <div className="hidden sm:block">
              <div className="inline-block bg-mango-orange px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-2">
                <span className="font-bold text-xs uppercase text-white">See The Full Story</span>
              </div>
              <h1 className="text-3xl font-black uppercase text-mango-dark">Timeline</h1>
            </div>
            
            {/* Mobile title row */}
            <div className="flex items-center justify-between sm:hidden">
              <h1 className="text-xl font-black uppercase text-mango-dark">Timeline</h1>
              <button
                onClick={openAddDialog}
                className="px-3 py-1.5 bg-mango-green text-white font-bold text-xs uppercase border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] flex items-center gap-1"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
                Add
              </button>
            </div>
            
            {/* Navigation controls */}
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
              {/* Date navigation */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => navigateDate('prev')}
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-mango-dark text-white border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all flex items-center justify-center"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3]" />
                </button>
                
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-mango-dark text-white font-bold text-xs sm:text-sm uppercase">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="whitespace-nowrap">
                    {viewMode === 'day' 
                      ? format(selectedDate, 'MMM d')
                      : `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d')}`
                    }
                  </span>
                </div>
                
                <button
                  onClick={() => navigateDate('next')}
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-mango-dark text-white border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all flex items-center justify-center"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3]" />
                </button>
              </div>
              
              {/* Today button */}
              <button
                onClick={goToToday}
                disabled={isToday(selectedDate)}
                className="px-2 sm:px-3 py-1 bg-mango-yellow text-mango-dark font-bold text-xs sm:text-sm uppercase border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_#1a1a1a] disabled:hover:translate-y-0"
              >
                Today
              </button>
              
              {/* Day/Week toggle */}
              <div className="flex gap-0.5 sm:gap-1">
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-2 sm:px-3 py-1 font-bold text-xs sm:text-sm uppercase border-2 border-mango-dark transition-all ${
                    viewMode === 'day' 
                      ? 'bg-mango-red text-white shadow-[2px_2px_0px_#1a1a1a]' 
                      : 'bg-white text-mango-dark hover:bg-mango-red/10'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-2 sm:px-3 py-1 font-bold text-xs sm:text-sm uppercase border-2 border-mango-dark transition-all ${
                    viewMode === 'week' 
                      ? 'bg-mango-red text-white shadow-[2px_2px_0px_#1a1a1a]' 
                      : 'bg-white text-mango-dark hover:bg-mango-red/10'
                  }`}
                >
                  Week
                </button>
              </div>
              
              {/* Add Session - desktop only */}
              <button
                onClick={openAddDialog}
                className="hidden sm:flex ml-1 sm:ml-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-mango-green text-white font-bold text-xs sm:text-sm uppercase border-2 border-mango-dark shadow-[3px_3px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all items-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Add Session
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-6xl mx-auto">
          {sessionsLoading ? (
            <div className="text-center py-12">
              <p className="text-mango-dark font-bold">Loading timeline...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="distressed-card p-8">
                <h3 className="text-2xl font-black uppercase text-mango-dark mb-2">No Logs Yet</h3>
                <p className="text-slate-500">
                  Start a timer to begin tracking your focus time.
                </p>
              </div>
            </div>
          ) : viewMode === 'day' ? (
            <div className="space-y-4">
              {/* Summary */}
              <div className="distressed-card p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] sm:text-xs uppercase font-bold text-slate-500 tracking-widest">
                      {format(selectedDate, 'EEEE, MMMM d')}
                    </p>
                    <h3 className="text-lg sm:text-2xl font-black text-mango-dark mt-1">
                      {formatDuration(totalMinutes)} focus logged
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="inline-block bg-mango-orange px-2 sm:px-3 py-1 border-2 border-mango-dark">
                      <span className="font-bold text-xs sm:text-sm text-white">{sessions.length} sessions</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Timeline Grid - Day View */}
              <div className="distressed-card p-3 sm:p-6">
                <div className="grid grid-cols-[50px_1fr] sm:grid-cols-[80px_1fr] gap-2 sm:gap-6">
                  {/* Hour labels */}
                  <div className="space-y-4 sm:space-y-6 text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <div key={hour} className="h-8 sm:h-12 flex items-center">
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
                          className="h-8 sm:h-12 border-b-2 border-mango-dark/10"
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
                        // Mobile: 32px per hour, Desktop: 48px per hour
                        const topOffsetMobile = (startHour * 32) + (startMinutes / 60 * 32)
                        const topOffsetDesktop = (startHour * 48) + (startMinutes / 60 * 48)
                        
                        const durationMinutes = session.durationMin || 0
                        const heightMobile = Math.max((durationMinutes / 60) * 32, 16)
                        const heightDesktop = Math.max((durationMinutes / 60) * 48, 20)
                        
                        const color = category ? colorHex[category.color] : '#666'
                        const sessionNote = notesBySessionId.get(session._id)
                        
                        return (
                          <div
                            key={session._id}
                            onClick={() => openEditDialog(session)}
                            className="absolute left-0 right-0 mx-0.5 sm:mx-1 border-2 border-mango-dark p-1.5 sm:p-3 cursor-pointer shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all overflow-hidden"
                            style={{
                              top: `var(--top-offset)`,
                              height: `var(--height)`,
                              backgroundColor: color,
                              // @ts-expect-error - CSS custom properties
                              '--top-offset': `${topOffsetMobile}px`,
                              '--height': `${heightMobile}px`,
                            }}
                          >
                            <style>{`
                              @media (min-width: 640px) {
                                [data-session-id="${session._id}"] {
                                  --top-offset: ${topOffsetDesktop}px !important;
                                  --height: ${heightDesktop}px !important;
                                }
                              }
                            `}</style>
                            <div data-session-id={session._id} className="hidden" />
                            <div className="flex items-start justify-between text-[10px] sm:text-xs">
                              <span className="text-white/80 font-bold">
                                {format(startTime, 'HH:mm')} — {format(endTime, 'HH:mm')}
                              </span>
                              {session.quality && (
                                <div className="flex gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                                        i < session.quality!
                                          ? 'bg-mango-yellow'
                                          : 'bg-white/30'
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            <p className="font-bold text-xs sm:text-sm text-white mt-0.5 sm:mt-1 truncate">
                              {session.title}
                            </p>
                            <p className="hidden sm:block text-xs text-white/70 font-bold truncate uppercase">
                              {category?.name}
                            </p>
                            {sessionNote && (
                              <p className="hidden sm:block text-xs text-white/60 mt-1 italic line-clamp-2">
                                "{sessionNote}"
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Week View - Calendar Style */
            <div className="space-y-4">
              {/* Summary */}
              <div className="distressed-card p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] sm:text-xs uppercase font-bold text-slate-500 tracking-widest">
                      Week of {format(dateRange.start, 'MMMM d')}
                    </p>
                    <h3 className="text-lg sm:text-2xl font-black text-mango-dark mt-1">
                      {formatDuration(totalMinutes)} focus logged
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="inline-block bg-mango-orange px-2 sm:px-3 py-1 border-2 border-mango-dark">
                      <span className="font-bold text-xs sm:text-sm text-white">{sessions.length} sessions</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Week Calendar Grid */}
              <div className="distressed-card p-2 sm:p-4 overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Day headers */}
                  <div className="grid grid-cols-[50px_repeat(7,1fr)] gap-0 border-b-2 border-mango-dark/20 pb-2 mb-2">
                    <div></div>
                    {eachDayOfInterval({ start: dateRange.start, end: dateRange.end }).map((day) => (
                      <div key={day.toISOString()} className="text-center">
                        <p className={`text-[10px] sm:text-xs font-black uppercase ${isToday(day) ? 'text-mango-orange' : 'text-slate-500'}`}>
                          {format(day, 'EEE')}
                        </p>
                        <p className={`text-sm sm:text-lg font-black ${isToday(day) ? 'text-mango-orange' : 'text-mango-dark'}`}>
                          {format(day, 'd')}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Hour rows with session blocks */}
                  <div className="relative">
                    <div className="grid grid-cols-[50px_repeat(7,1fr)] gap-0">
                      {/* Hour labels and grid */}
                      {Array.from({ length: 24 }).map((_, hour) => (
                        <div key={hour} className="contents">
                          <div className="h-8 flex items-start justify-end pr-2 text-[10px] font-bold text-slate-400">
                            {hour.toString().padStart(2, '0')}:00
                          </div>
                          {eachDayOfInterval({ start: dateRange.start, end: dateRange.end }).map((day) => (
                            <div 
                              key={`${day.toISOString()}-${hour}`} 
                              className="h-8 border-l border-b border-mango-dark/10 relative"
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    
                    {/* Session blocks overlay */}
                    <div className="absolute inset-0 grid grid-cols-[50px_repeat(7,1fr)] gap-0 pointer-events-none">
                      <div></div>
                      {eachDayOfInterval({ start: dateRange.start, end: dateRange.end }).map((day, _dayIndex) => {
                        const daySessions = sessions.filter(s => isSameDay(new Date(s.start), day))
                        
                        return (
                          <div key={day.toISOString()} className="relative">
                            {daySessions.map((session) => {
                              const category = categoryMap.get(session.categoryId)
                              const color = category ? colorHex[category.color] : '#666'
                              const startTime = new Date(session.start)
                              const startHour = startTime.getHours()
                              const startMinutes = startTime.getMinutes()
                              const topOffset = (startHour * 32) + (startMinutes / 60 * 32)
                              const durationMinutes = session.durationMin || 0
                              const height = Math.max((durationMinutes / 60) * 32, 16)
                              
                              return (
                                <div
                                  key={session._id}
                                  onClick={() => openEditDialog(session)}
                                  className="absolute left-0.5 right-0.5 border border-mango-dark/50 cursor-pointer hover:shadow-md transition-shadow overflow-hidden pointer-events-auto"
                                  style={{
                                    top: `${topOffset}px`,
                                    height: `${height}px`,
                                    backgroundColor: color,
                                  }}
                                >
                                  <div className="p-0.5 text-[8px] text-white font-bold leading-tight truncate">
                                    {format(startTime, 'HH:mm')}
                                  </div>
                                  <div className="px-0.5 text-[8px] text-white/90 font-bold leading-tight truncate">
                                    {session.title}
                                  </div>
                                  {category && height > 40 && (
                                    <div className="px-0.5 text-[7px] text-white/70 font-bold uppercase truncate">
                                      {category.name}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
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
      
      {/* Add Session Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-white border-4 border-mango-dark shadow-[8px_8px_0px_#1a1a1a]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase text-mango-dark">Log a Session</DialogTitle>
            <DialogDescription className="text-slate-500">
              Manually add a past session to your timeline
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="add-title" className="font-bold uppercase text-sm text-mango-dark">What did you work on?</Label>
              <Input 
                id="add-title" 
                placeholder="e.g., Deep work on project X"
                value={addForm.title}
                onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                className="border-2 border-mango-dark bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-start" className="font-bold uppercase text-sm text-mango-dark">Start Time</Label>
                <Input 
                  id="add-start" 
                  type="datetime-local"
                  value={addForm.start}
                  onChange={(e) => setAddForm({ ...addForm, start: e.target.value })}
                  className="border-2 border-mango-dark bg-white font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-end" className="font-bold uppercase text-sm text-mango-dark">End Time</Label>
                <Input 
                  id="add-end" 
                  type="datetime-local"
                  value={addForm.end}
                  onChange={(e) => setAddForm({ ...addForm, end: e.target.value })}
                  className="border-2 border-mango-dark bg-white font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold uppercase text-sm text-mango-dark">Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isSelected = addForm.categoryId === category._id
                  const color = colorHex[category.color as keyof typeof colorHex] || '#666'
                  return (
                    <button
                      key={category._id}
                      onClick={() => setAddForm({ ...addForm, categoryId: category._id })}
                      className={`px-3 py-1.5 font-bold text-sm uppercase border-2 transition-all ${
                        isSelected 
                          ? 'border-mango-dark shadow-[2px_2px_0px_#1a1a1a] text-white' 
                          : 'border-transparent hover:border-mango-dark/50'
                      }`}
                      style={{ 
                        backgroundColor: isSelected ? color : `${color}20`,
                        color: isSelected ? 'white' : color
                      }}
                    >
                      {category.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={handleCreateSession} 
                disabled={!addForm.title.trim() || !addForm.categoryId || createSession.isPending}
                className="flex-1 px-4 py-2 bg-mango-green text-white font-bold uppercase text-sm border-2 border-mango-dark shadow-[3px_3px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createSession.isPending ? "Saving..." : "Log Session"}
              </button>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 bg-white text-mango-dark font-bold uppercase text-sm border-2 border-mango-dark shadow-[3px_3px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Session Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white border-4 border-mango-dark shadow-[8px_8px_0px_#1a1a1a]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase text-mango-dark">Edit Session</DialogTitle>
            <DialogDescription className="text-slate-500">
              Update session details or delete it
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="font-bold uppercase text-sm text-mango-dark">Title</Label>
              <Input 
                id="edit-title" 
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="border-2 border-mango-dark bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start" className="font-bold uppercase text-sm text-mango-dark">Start Time</Label>
                <Input 
                  id="edit-start" 
                  type="datetime-local"
                  value={editForm.start}
                  onChange={(e) => setEditForm({ ...editForm, start: e.target.value })}
                  className="border-2 border-mango-dark bg-white font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end" className="font-bold uppercase text-sm text-mango-dark">End Time</Label>
                <Input 
                  id="edit-end" 
                  type="datetime-local"
                  value={editForm.end}
                  onChange={(e) => setEditForm({ ...editForm, end: e.target.value })}
                  className="border-2 border-mango-dark bg-white font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold uppercase text-sm text-mango-dark">Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isSelected = editForm.categoryId === category._id
                  const color = colorHex[category.color as keyof typeof colorHex] || '#666'
                  return (
                    <button
                      key={category._id}
                      onClick={() => setEditForm({ ...editForm, categoryId: category._id })}
                      className={`px-3 py-1.5 font-bold text-sm uppercase border-2 transition-all ${
                        isSelected 
                          ? 'border-mango-dark shadow-[2px_2px_0px_#1a1a1a] text-white' 
                          : 'border-transparent hover:border-mango-dark/50'
                      }`}
                      style={{ 
                        backgroundColor: isSelected ? color : `${color}20`,
                        color: isSelected ? 'white' : color
                      }}
                    >
                      {category.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-note" className="font-bold uppercase text-sm text-mango-dark">Note (optional)</Label>
              <textarea 
                id="edit-note" 
                placeholder="What did you accomplish? Any reflections?"
                value={editForm.note}
                onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                className="w-full min-h-[80px] px-3 py-2 border-2 border-mango-dark bg-white font-medium text-sm resize-none focus:outline-none focus:ring-2 focus:ring-mango-orange"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={handleUpdateSession} 
                disabled={!editForm.title.trim() || updateSession.isPending || createNote.isPending}
                className="flex-1 px-4 py-2 bg-mango-yellow text-mango-dark font-bold uppercase text-sm border-2 border-mango-dark shadow-[3px_3px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateSession.isPending ? "Saving..." : "Save Changes"}
              </button>
              <button 
                onClick={handleDeleteSession}
                disabled={deleteSession.isPending}
                className="px-4 py-2 bg-mango-red text-white font-bold uppercase text-sm border-2 border-mango-dark shadow-[3px_3px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}