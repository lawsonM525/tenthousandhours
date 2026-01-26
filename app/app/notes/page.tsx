"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Search, Calendar, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useNotes } from "@/lib/hooks/use-notes"
import { useSessions } from "@/lib/hooks/use-sessions"
import { useCategories } from "@/lib/hooks/use-categories"
import { Category, Session } from "@/lib/types"

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
    }).filter((info): info is NonNullable<typeof info> => info !== null)
    
    return sessionInfos
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b-4 border-mango-dark px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <div className="inline-block bg-mango-green px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-2">
              <span className="font-bold text-xs uppercase text-white">Capture The Story</span>
            </div>
            <h1 className="text-3xl font-black uppercase text-mango-dark">Notes</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mango-dark/50" />
              <Input
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64 border-2 border-mango-dark bg-white font-medium"
              />
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-4xl mx-auto">
          {notesLoading ? (
            <div className="text-center py-12">
              <p className="text-mango-dark font-bold">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="distressed-card p-8">
                <h3 className="text-2xl font-black uppercase text-mango-dark mb-2">
                  {search ? "No Matches" : "No Notes Yet"}
                </h3>
                <p className="text-slate-500">
                  {search 
                    ? "No notes found matching your search."
                    : "Write it down while it's fresh. What worked? What hurt?"
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => {
                const sessionInfos = formatSessionInfo(note.sessionIds)
                
                return (
                  <div
                    key={note._id}
                    className="distressed-card p-6 hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer"
                  >
                    {/* Note header with date */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-mango-orange" />
                        <span className="font-bold text-mango-dark">{format(new Date(note.createdAt), 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div className="text-sm font-bold text-slate-400">
                        {format(new Date(note.createdAt), 'h:mm a')}
                      </div>
                    </div>
                    
                    {/* Note body */}
                    <p className="text-mango-dark font-medium whitespace-pre-wrap">
                      {note.body}
                    </p>
                    
                    {/* Related sessions */}
                    {sessionInfos.length > 0 && (
                      <div className="mt-4 pt-4 border-t-2 border-mango-dark/10">
                        <div className="flex flex-wrap gap-2">
                          {sessionInfos.map((info, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-mango-dark text-sm shadow-[2px_2px_0px_#1a1a1a]"
                              style={{
                                borderLeftWidth: '4px',
                                borderLeftColor: info.category ? colorHex[info.category.color as keyof typeof colorHex] : '#666'
                              }}
                            >
                              <span className="text-slate-500 font-bold">
                                {info.category?.name}:
                              </span>
                              <span className="text-mango-dark font-bold">
                                {info.title}
                              </span>
                              <span className="text-slate-400 text-xs font-bold">
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
                        <Tag className="h-4 w-4 text-mango-yellow" />
                        <div className="flex flex-wrap gap-2">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-mango-yellow/20 border border-mango-yellow text-xs font-bold text-mango-dark uppercase"
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