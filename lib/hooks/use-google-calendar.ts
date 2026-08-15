import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GoogleCalendarEvent, GoogleCalendarSummary } from "@/lib/types"

export interface GoogleCalendarStatus {
  connected: boolean
  provider: "google_calendar"
  email?: string | null
  name?: string | null
  scopes?: string[]
  expiresAt?: string | null
  selectedCalendarIds?: string[]
  lastSyncedAt?: string | null
  updatedAt?: string
}

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body.error || "Google Calendar request failed")
  }
  return body as T
}

export function useGoogleCalendarStatus() {
  return useQuery({
    queryKey: ["google-calendar", "status"],
    queryFn: async () => readJson<GoogleCalendarStatus>(await fetch("/api/integrations/google-calendar/status")),
    staleTime: 30_000,
  })
}

export function useGoogleCalendars(enabled = true) {
  return useQuery({
    queryKey: ["google-calendar", "calendars"],
    queryFn: async () => readJson<GoogleCalendarSummary[]>(await fetch("/api/integrations/google-calendar/calendars")),
    enabled,
  })
}

export function useGoogleCalendarEvents(args: { timeMin: string; timeMax: string; enabled?: boolean }) {
  return useQuery({
    queryKey: ["google-calendar", "events", args.timeMin, args.timeMax],
    queryFn: async () => {
      const params = new URLSearchParams({ timeMin: args.timeMin, timeMax: args.timeMax })
      return readJson<GoogleCalendarEvent[]>(await fetch(`/api/integrations/google-calendar/events?${params}`))
    },
    enabled: args.enabled ?? true,
    staleTime: 60_000,
  })
}

export function useUpdateSelectedGoogleCalendars() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (calendarIds: string[]) => readJson<{ selectedCalendarIds: string[] }>(
      await fetch("/api/integrations/google-calendar/calendars", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calendarIds }),
      })
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-calendar"] })
    },
  })
}

export function useDisconnectGoogleCalendar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => readJson<{ success: boolean }>(
      await fetch("/api/integrations/google-calendar/disconnect", { method: "POST" })
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-calendar"] })
    },
  })
}
