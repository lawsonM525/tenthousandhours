"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Globe, Loader2, RefreshCw, Unplug } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  useDisconnectGoogleCalendar,
  useGoogleCalendars,
  useGoogleCalendarStatus,
  useUpdateSelectedGoogleCalendars,
} from "@/lib/hooks/use-google-calendar"

export default function CalendarSettingsPage() {
  const [dateFormat, setDateFormat] = useState<"mdy" | "dmy" | "ymd">("mdy")
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h")
  const [timezone, setTimezone] = useState("auto")
  const [saved, setSaved] = useState(false)
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()
  const statusQuery = useGoogleCalendarStatus()
  const connected = statusQuery.data?.connected === true
  const calendarsQuery = useGoogleCalendars(connected)
  const updateCalendars = useUpdateSelectedGoogleCalendars()
  const disconnectCalendar = useDisconnectGoogleCalendar()

  useEffect(() => {
    const storedDateFormat = localStorage.getItem("settings_dateFormat")
    const storedTimeFormat = localStorage.getItem("settings_timeFormat")
    const storedTimezone = localStorage.getItem("settings_timezone")
    
    if (storedDateFormat) setDateFormat(storedDateFormat as "mdy" | "dmy" | "ymd")
    if (storedTimeFormat) setTimeFormat(storedTimeFormat as "12h" | "24h")
    if (storedTimezone) setTimezone(storedTimezone)
  }, [])

  useEffect(() => {
    if (statusQuery.data?.selectedCalendarIds) {
      setSelectedCalendarIds(statusQuery.data.selectedCalendarIds)
    }
  }, [statusQuery.data?.selectedCalendarIds])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const result = params.get("googleCalendar")
    if (!result) return

    toast(result === "connected"
      ? { title: "Google Calendar connected", description: "Choose which calendars should appear on your timeline." }
      : { title: "Connection failed", description: params.get("message") || "Google did not complete the connection.", variant: "destructive" })
    window.history.replaceState({}, "", window.location.pathname)
  }, [toast])

  const connectGoogleCalendar = async () => {
    setIsConnecting(true)
    try {
      const response = await fetch("/api/integrations/google-calendar/connect")
      const body = await response.json()
      if (!response.ok || !body.authUrl) throw new Error(body.error || "Could not start Google authorization")
      window.location.assign(body.authUrl)
    } catch (error: any) {
      toast({ title: "Could not connect", description: error.message, variant: "destructive" })
      setIsConnecting(false)
    }
  }

  const toggleCalendar = (calendarId: string) => {
    setSelectedCalendarIds((current) => current.includes(calendarId)
      ? current.filter((id) => id !== calendarId)
      : [...current, calendarId])
  }

  const saveSelectedCalendars = async () => {
    try {
      await updateCalendars.mutateAsync(selectedCalendarIds)
      toast({ title: "Calendars updated", description: "Your timeline will now use these calendars." })
    } catch (error: any) {
      toast({ title: "Could not save calendars", description: error.message, variant: "destructive" })
    }
  }

  const disconnectGoogleCalendar = async () => {
    if (!window.confirm("Disconnect Google Calendar? Imported time logs will stay in your account.")) return
    try {
      await disconnectCalendar.mutateAsync()
      setSelectedCalendarIds([])
      toast({ title: "Google Calendar disconnected" })
    } catch (error: any) {
      toast({ title: "Could not disconnect", description: error.message, variant: "destructive" })
    }
  }

  const saveSettings = () => {
    localStorage.setItem("settings_dateFormat", dateFormat)
    localStorage.setItem("settings_timeFormat", timeFormat)
    localStorage.setItem("settings_timezone", timezone)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const dateFormatOptions = [
    { id: "mdy", label: "MM/DD/YYYY", example: "01/26/2026" },
    { id: "dmy", label: "DD/MM/YYYY", example: "26/01/2026" },
    { id: "ymd", label: "YYYY-MM-DD", example: "2026-01-26" },
  ]

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b-4 border-mango-dark px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-mango-orange px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-2">
            <span className="font-bold text-xs uppercase text-white">Sync & Schedule</span>
          </div>
          <h1 className="text-3xl font-black uppercase text-mango-dark">Calendar</h1>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Date Format */}
          <div className="distressed-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-mango-dark" />
              <h2 className="font-black text-lg uppercase text-mango-dark">Date Format</h2>
            </div>
            <div className="grid gap-3">
              {dateFormatOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setDateFormat(option.id as "mdy" | "dmy" | "ymd")}
                  className={`p-4 border-2 border-mango-dark font-bold text-left transition-all ${
                    dateFormat === option.id
                      ? "bg-mango-dark text-white shadow-[3px_3px_0px_#FFB31A]"
                      : "bg-white hover:bg-mango-yellow/20"
                  }`}
                >
                  <span className="uppercase">{option.label}</span>
                  <span className={`ml-4 text-sm ${dateFormat === option.id ? "text-white/70" : "text-mango-dark/60"}`}>
                    ({option.example})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Format */}
          <div className="distressed-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-mango-dark" />
              <h2 className="font-black text-lg uppercase text-mango-dark">Time Format</h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setTimeFormat("12h")}
                className={`flex-1 p-4 border-2 border-mango-dark font-bold uppercase transition-all ${
                  timeFormat === "12h"
                    ? "bg-mango-dark text-white shadow-[3px_3px_0px_#FFB31A]"
                    : "bg-white hover:bg-mango-yellow/20"
                }`}
              >
                12-Hour
                <span className={`block text-sm font-normal ${timeFormat === "12h" ? "text-white/70" : "text-mango-dark/60"}`}>
                  2:30 PM
                </span>
              </button>
              <button
                onClick={() => setTimeFormat("24h")}
                className={`flex-1 p-4 border-2 border-mango-dark font-bold uppercase transition-all ${
                  timeFormat === "24h"
                    ? "bg-mango-dark text-white shadow-[3px_3px_0px_#FFB31A]"
                    : "bg-white hover:bg-mango-yellow/20"
                }`}
              >
                24-Hour
                <span className={`block text-sm font-normal ${timeFormat === "24h" ? "text-white/70" : "text-mango-dark/60"}`}>
                  14:30
                </span>
              </button>
            </div>
          </div>

          {/* Timezone */}
          <div className="distressed-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-6 h-6 text-mango-dark" />
              <h2 className="font-black text-lg uppercase text-mango-dark">Timezone</h2>
            </div>
            <p className="text-sm text-mango-dark/60 mb-4">
              Sessions will be recorded in your selected timezone
            </p>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full p-3 border-2 border-mango-dark bg-white font-bold text-mango-dark focus:outline-none focus:ring-2 focus:ring-mango-orange"
            >
              <option value="auto">Auto-detect ({Intl.DateTimeFormat().resolvedOptions().timeZone})</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Asia/Shanghai">Shanghai (CST)</option>
              <option value="Australia/Sydney">Sydney (AEST)</option>
            </select>
          </div>

          {/* Google Calendar */}
          <div className="distressed-card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-6 h-6 text-mango-dark" />
                  <h2 className="font-black text-lg uppercase text-mango-dark">Google Calendar</h2>
                </div>
                <p className="text-sm text-mango-dark/60">
                  Show calendar events on your timeline and turn them into time logs. Access is read-only.
                </p>
              </div>
              {statusQuery.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-mango-orange" />
              ) : (
                <span className={`self-start px-3 py-1 border-2 border-mango-dark text-xs font-black uppercase ${connected ? "bg-mango-green text-white" : "bg-slate-100 text-slate-500"}`}>
                  {connected ? "Connected" : "Not connected"}
                </span>
              )}
            </div>

            {statusQuery.isError && (
              <p className="mt-4 text-sm font-bold text-mango-red">Could not load Google Calendar status.</p>
            )}

            {!connected ? (
              <button
                onClick={connectGoogleCalendar}
                disabled={isConnecting || statusQuery.isLoading}
                className="mt-5 px-6 py-3 bg-mango-orange text-white border-2 border-mango-dark font-black uppercase shadow-[3px_3px_0px_#1a1a1a] disabled:opacity-60 flex items-center gap-2"
              >
                {isConnecting && <Loader2 className="w-4 h-4 animate-spin" />}
                Connect Google Calendar
              </button>
            ) : (
              <div className="mt-5 space-y-5">
                <div className="p-4 border-2 border-mango-dark bg-mango-yellow/10">
                  <p className="font-black text-mango-dark">{statusQuery.data?.email || statusQuery.data?.name || "Google account"}</p>
                  <p className="text-xs text-slate-500 mt-1">Only calendar names, times, and event details are read.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="font-black uppercase text-sm text-mango-dark">Calendars shown on timeline</h3>
                    <button onClick={() => calendarsQuery.refetch()} className="text-xs font-bold uppercase flex items-center gap-1 text-mango-dark hover:text-mango-orange">
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </button>
                  </div>
                  {calendarsQuery.isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading calendars…</div>
                  ) : calendarsQuery.isError ? (
                    <p className="text-sm font-bold text-mango-red">Could not load calendars. Try reconnecting your account.</p>
                  ) : (
                    <div className="grid gap-2">
                      {calendarsQuery.data?.map((calendar) => (
                        <label key={calendar.id} className="flex items-center gap-3 p-3 border-2 border-mango-dark/20 hover:border-mango-dark cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCalendarIds.includes(calendar.id)}
                            onChange={() => toggleCalendar(calendar.id)}
                            className="w-4 h-4 accent-mango-orange"
                          />
                          <span className="w-3 h-3 rounded-full border border-mango-dark/20" style={{ backgroundColor: calendar.backgroundColor || "#FFB31A" }} />
                          <span className="font-bold text-sm text-mango-dark">{calendar.summary}</span>
                          {calendar.primary && <span className="ml-auto text-[10px] font-black uppercase text-slate-400">Primary</span>}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={saveSelectedCalendars}
                    disabled={updateCalendars.isPending}
                    className="px-5 py-2.5 bg-mango-green text-white border-2 border-mango-dark font-black uppercase shadow-[3px_3px_0px_#1a1a1a] disabled:opacity-60"
                  >
                    {updateCalendars.isPending ? "Saving…" : "Save Calendars"}
                  </button>
                  <button
                    onClick={connectGoogleCalendar}
                    disabled={isConnecting}
                    className="px-5 py-2.5 bg-white text-mango-dark border-2 border-mango-dark font-black uppercase"
                  >
                    Reconnect
                  </button>
                  <button
                    onClick={disconnectGoogleCalendar}
                    disabled={disconnectCalendar.isPending}
                    className="px-5 py-2.5 text-mango-red font-black uppercase flex items-center gap-2"
                  >
                    <Unplug className="w-4 h-4" /> Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={saveSettings}
              className="px-8 py-3 bg-mango-orange text-white border-2 border-mango-dark font-black uppercase shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#1a1a1a] transition-all"
            >
              Save Settings
            </button>
            {saved && (
              <span className="text-mango-green font-bold uppercase text-sm">✓ Saved!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
