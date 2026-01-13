import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Note } from '@/lib/types'
import { createNoteSchema } from '@/lib/schemas'
import { z } from 'zod'

async function fetchNotes(params?: {
  sessionId?: string
  limit?: number
  skip?: number
  search?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.sessionId) searchParams.append('sessionId', params.sessionId)
  if (params?.limit) searchParams.append('limit', params.limit.toString())
  if (params?.skip) searchParams.append('skip', params.skip.toString())
  if (params?.search) searchParams.append('search', params.search)
  
  const response = await fetch(`/api/notes?${searchParams}`)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return response.json() as Promise<Note[]>
}

async function createNote(data: z.infer<typeof createNoteSchema>) {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create note')
  }
  
  return response.json() as Promise<Note>
}

export function useNotes(params?: {
  sessionId?: string
  limit?: number
  skip?: number
  search?: string
}) {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => fetchNotes(params),
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}