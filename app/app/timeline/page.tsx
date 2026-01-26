"use client"

import { useState, useMemo, useEffect } from "react"
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, addDays, isToday } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useSessions, useUpdateSession, useDeleteSession } from "@/lib/hooks/use-sessions"
import { useCategories } from "@/lib/hooks/use-categories"
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
  })
  
  const updateSession = useUpdateSession()
  const deleteSession = useDeleteSession()
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
  
  // Open edit dialog for a session
  const openEditDialog = (session: Session) => {
    setEditingSession(session)
    setEditForm({
      title: session.title,
      start: format(new Date(session.start), "yyyy-MM-dd'T'HH:mm"),
      end: session.end ? format(new Date(session.end), "yyyy-MM-dd'T'HH:mm") : "",
      categoryId: session.categoryId,
    })
    setIsEditOpen(true)
  }
  
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
      
      posthog.capture('session_updated', {
        session_id: editingSession._id,
        title_changed: editForm.title !== editingSession.title,
        time_changed: editForm.start !== format(new Date(editingSession.start), "yyyy-MM-dd'T'HH:mm"),
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
      <header className="bg-white border-b-4 border-mango-dark px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="inline-block bg-mango-orange px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-2">
              <span className="font-bold text-xs uppercase text-white">See The Full Story</span>
            </div>
            <h1 className="text-3xl font-black uppercase text-mango-dark">Timeline</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateDate('prev')}
              className="w-8 h-8 bg-mango-dark text-white border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5 stroke-[3]" />
            </button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-mango-dark text-white font-bold text-sm uppercase">
              <Calendar className="h-4 w-4" />
              <span>
                {viewMode === 'day' 
                  ? format(selectedDate, 'EEE, MMM d')
                  : `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d')}`
                }
              </span>
            </div>
            
            <button
              onClick={() => navigateDate('next')}
              className="w-8 h-8 bg-mango-dark text-white border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5 stroke-[3]" />
            </button>
            
            <button
              onClick={goToToday}
              disabled={isToday(selectedDate)}
              className="px-3 py-1 bg-mango-yellow text-mango-dark font-bold text-sm uppercase border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_#1a1a1a] disabled:hover:translate-y-0"
            >
              Today
            </button>
            
            <div className="flex gap-1 ml-3">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 font-bold text-sm uppercase border-2 border-mango-dark transition-all ${
                  viewMode === 'day' 
                    ? 'bg-mango-red text-white shadow-[2px_2px_0px_#1a1a1a]' 
                    : 'bg-white text-mango-dark hover:bg-mango-red/10'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 font-bold text-sm uppercase border-2 border-mango-dark transition-all ${
                  viewMode === 'week' 
                    ? 'bg-mango-red text-white shadow-[2px_2px_0px_#1a1a1a]' 
                    : 'bg-white text-mango-dark hover:bg-mango-red/10'
                }`}
              >
                Week
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
          ) : (
            <div className="space-y-4">
              {/* Summary */}
              <div className="distressed-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-500 tracking-widest">
                      {format(selectedDate, 'EEEE, MMMM d')}
                    </p>
                    <h3 className="text-2xl font-black text-mango-dark mt-1">
                      {formatDuration(totalMinutes)} focus logged
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="inline-block bg-mango-orange px-3 py-1 border-2 border-mango-dark">
                      <span className="font-bold text-sm text-white">{sessions.length} sessions</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Timeline Grid */}
              <div className="distressed-card p-6">
                <div className="grid grid-cols-[80px_1fr] gap-6">
                  {/* Hour labels */}
                  <div className="space-y-6 text-xs font-bold text-slate-500 uppercase">
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
                          className="h-12 border-b-2 border-mango-dark/10"
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
                            onClick={() => openEditDialog(session)}
                            className="absolute left-0 right-0 mx-1 border-2 border-mango-dark p-3 cursor-pointer shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all"
                            style={{
                              top: `${topOffset}px`,
                              height: `${height}px`,
                              backgroundColor: color,
                            }}
                          >
                            <div className="flex items-start justify-between text-xs">
                              <span className="text-white/80 font-bold">
                                {format(startTime, 'HH:mm')} — {format(endTime, 'HH:mm')}
                              </span>
                            </div>
                            <p className="font-bold text-sm text-white mt-1 truncate">
                              {session.title}
                            </p>
                            {category && (
                              <p className="text-xs text-white/70 font-bold truncate uppercase">
                                {category.name}
                              </p>
                            )}
                            {session.quality && (
                              <div className="flex gap-0.5 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      i < session.quality!
                                        ? 'bg-mango-yellow'
                                        : 'bg-white/30'
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

            <div className="flex gap-3 pt-4">
              <button 
                onClick={handleUpdateSession} 
                disabled={!editForm.title.trim() || updateSession.isPending}
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