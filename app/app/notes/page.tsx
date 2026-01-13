"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Search, Calendar, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNotes } from "@/lib/hooks/use-notes"
import { useSessions } from "@/lib/hooks/use-sessions"
import { useCategories } from "@/lib/hooks/use-categories"
import { Note, Session, Category } from "@/lib/types"

export default function NotesPage() {
  const [search, setSearch] = useState("")
  const { data: notes = [], isLoading: notesLoading } = useNotes({ search: search || undefined })
  const { data: sessions = [] } = useSessions()
  const { data: categories = [] } = useCategories()
  
  // Create maps for quick lookups
  const sessionMap = useMemo(() => {
    const map = new Map<string, Session>()
    sessions.forEach(session => map.set(session._id, session))
    return map
  }, [sessions])
  
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>()
    categories.forEach(cat => map.set(cat._id, cat))
    return map
  }, [categories])
  
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
  
  const formatSessionInfo = (sessionIds: string[]) => {
    const sessionInfos = sessionIds.map(id => {
      const session = sessionMap.get(id)
      if (!session) return null
      
      const category = categoryMap.get(session.categoryId)
      return {
        title: session.title,
        category: category,
        date: new Date(session.start),
        duration: session.durationMin || 0
      }
    }).filter(Boolean)
    
    return sessionInfos
  }

  return (
    <div className="h-full flex flex-col">
      <header className="border-b border-border-subtle bg-bg-surface px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-h2 font-semibold text-text-primary">notes</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-4xl mx-auto">
          {notesLoading ? (
            <div className="text-center py-12 text-text-muted">
              <p className="text-body">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12 text-text-muted space-y-2">
              <p className="text-body">
                {search 
                  ? "no notes found matching your search."
                  : "write it down while it's fresh. what worked? what hurt?"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => {
                const sessionInfos = formatSessionInfo(note.sessionIds)
                
                return (
                  <div
                    key={note._id}
                    className="bg-bg-surface border border-border-subtle rounded-component p-6 hover:bg-bg-elevated transition-colors"
                  >
                    {/* Note header with date */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(note.createdAt), 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div className="text-sm text-text-muted">
                        {format(new Date(note.createdAt), 'h:mm a')}
                      </div>
                    </div>
                    
                    {/* Note body */}
                    <p className="text-text-primary text-body whitespace-pre-wrap">
                      {note.body}
                    </p>
                    
                    {/* Related sessions */}
                    {sessionInfos.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border-subtle">
                        <div className="flex flex-wrap gap-2">
                          {sessionInfos.map((info, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 px-3 py-1.5 bg-bg-elevated rounded-pill text-sm"
                              style={{
                                borderLeft: `3px solid ${info.category ? colorHex[info.category.color as keyof typeof colorHex] : '#666'}`
                              }}
                            >
                              <span className="text-text-secondary">
                                {info.category?.name}:
                              </span>
                              <span className="text-text-primary">
                                {info.title}
                              </span>
                              <span className="text-text-muted text-xs">
                                {Math.floor(info.duration / 60)}h {info.duration % 60}m
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Tags */}
                    {note.tags.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-text-muted" />
                        <div className="flex flex-wrap gap-2">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-bg-elevated rounded-pill text-xs text-text-secondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}