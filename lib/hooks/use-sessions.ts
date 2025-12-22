import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Session } from "@/lib/types"
import { createSessionSchema, updateSessionSchema } from "@/lib/schemas"
import { z } from "zod"

// Fetch sessions
export function useSessions({
  startDate,
  endDate,
  categoryId,
  limit = 100,
  skip = 0
}: {
  startDate?: string
  endDate?: string
  categoryId?: string
  limit?: number
  skip?: number
} = {}) {
  return useQuery({
    queryKey: ["sessions", { startDate, endDate, categoryId, limit, skip }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)
      if (categoryId) params.append("categoryId", categoryId)
      params.append("limit", limit.toString())
      params.append("skip", skip.toString())

      const response = await fetch(`/api/sessions?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch sessions")
      }
      return response.json() as Promise<Session[]>
    }
  })
}

// Get active session
export function useActiveSession() {
  return useQuery({
    queryKey: ["sessions", "active"],
    queryFn: async () => {
      const response = await fetch("/api/sessions/active")
      if (!response.ok) {
        throw new Error("Failed to fetch active session")
      }
      const data = await response.json()
      return data as Session | null
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  })
}

// Create session
export function useCreateSession() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: z.infer<typeof createSessionSchema>) => {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create session")
      }
      
      return response.json() as Promise<Session>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
    }
  })
}

// Update session
export function useUpdateSession() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: string
      data: z.infer<typeof updateSessionSchema> 
    }) => {
      const response = await fetch(`/api/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update session")
      }
      
      return response.json() as Promise<Session>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
    }
  })
}

// Delete session
export function useDeleteSession() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/sessions/${id}`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to delete session")
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
    }
  })
}