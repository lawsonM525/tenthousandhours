"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Globe } from "lucide-react"

export default function CalendarSettingsPage() {
  const [dateFormat, setDateFormat] = useState<"mdy" | "dmy" | "ymd">("mdy")
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h")
  const [timezone, setTimezone] = useState("auto")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const storedDateFormat = localStorage.getItem("settings_dateFormat")
    const storedTimeFormat = localStorage.getItem("settings_timeFormat")
    const storedTimezone = localStorage.getItem("settings_timezone")
    
    if (storedDateFormat) setDateFormat(storedDateFormat as "mdy" | "dmy" | "ymd")
    if (storedTimeFormat) setTimeFormat(storedTimeFormat as "12h" | "24h")
    if (storedTimezone) setTimezone(storedTimezone)
  }, [])

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

          {/* Calendar Sync - Coming Soon */}
          <div className="distressed-card p-6 opacity-60">
            <h2 className="font-black text-lg uppercase text-mango-dark mb-2">Calendar Sync</h2>
            <p className="text-sm text-mango-dark/60 mb-4">
              Connect your Google Calendar or Outlook to automatically import events
            </p>
            <button
              disabled
              className="px-6 py-3 bg-slate-300 text-slate-500 border-2 border-slate-400 font-bold uppercase cursor-not-allowed"
            >
              Coming Soon
            </button>
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
