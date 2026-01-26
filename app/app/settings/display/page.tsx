"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Sun, Moon, Monitor, LayoutGrid, List } from "lucide-react"

export default function DisplaySettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [compactMode, setCompactMode] = useState(false)
  const [showSeconds, setShowSeconds] = useState(false)
  const [timelineView, setTimelineView] = useState<"blocks" | "list">("blocks")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem("settings_theme")
    const storedCompactMode = localStorage.getItem("settings_compactMode")
    const storedShowSeconds = localStorage.getItem("settings_showSeconds")
    const storedTimelineView = localStorage.getItem("settings_timelineView")
    
    if (storedTheme) setTheme(storedTheme as "light" | "dark" | "system")
    if (storedCompactMode) setCompactMode(storedCompactMode === "true")
    if (storedShowSeconds) setShowSeconds(storedShowSeconds === "true")
    if (storedTimelineView) setTimelineView(storedTimelineView as "blocks" | "list")
  }, [])

  const saveSettings = () => {
    localStorage.setItem("settings_theme", theme)
    localStorage.setItem("settings_compactMode", compactMode.toString())
    localStorage.setItem("settings_showSeconds", showSeconds.toString())
    localStorage.setItem("settings_timelineView", timelineView)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const themeOptions = [
    { id: "light", name: "Light", icon: Sun },
    { id: "dark", name: "Dark", icon: Moon },
    { id: "system", name: "System", icon: Monitor },
  ]

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b-4 border-mango-dark px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-mango-yellow px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-2">
            <span className="font-bold text-xs uppercase text-mango-dark">Visual Preferences</span>
          </div>
          <h1 className="text-3xl font-black uppercase text-mango-dark">Display</h1>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Theme Selection */}
          <div className="distressed-card p-6">
            <h2 className="font-black text-lg uppercase text-mango-dark mb-2">Theme</h2>
            <p className="text-sm text-mango-dark/60 mb-4">Choose your preferred color scheme</p>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={() => setTheme(option.id as "light" | "dark" | "system")}
                    className={`p-4 border-2 border-mango-dark font-bold uppercase text-sm transition-all ${
                      theme === option.id
                        ? "bg-mango-dark text-white shadow-[3px_3px_0px_#FFB31A]"
                        : "bg-white hover:bg-mango-yellow/20"
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    {option.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Timeline View */}
          <div className="distressed-card p-6">
            <h2 className="font-black text-lg uppercase text-mango-dark mb-2">Timeline View</h2>
            <p className="text-sm text-mango-dark/60 mb-4">How sessions appear in your timeline</p>
            <div className="flex gap-3">
              <button
                onClick={() => setTimelineView("blocks")}
                className={`flex-1 p-4 border-2 border-mango-dark font-bold uppercase text-sm transition-all ${
                  timelineView === "blocks"
                    ? "bg-mango-dark text-white shadow-[3px_3px_0px_#FFB31A]"
                    : "bg-white hover:bg-mango-yellow/20"
                }`}
              >
                <LayoutGrid className="w-6 h-6 mx-auto mb-2" />
                Blocks
              </button>
              <button
                onClick={() => setTimelineView("list")}
                className={`flex-1 p-4 border-2 border-mango-dark font-bold uppercase text-sm transition-all ${
                  timelineView === "list"
                    ? "bg-mango-dark text-white shadow-[3px_3px_0px_#FFB31A]"
                    : "bg-white hover:bg-mango-yellow/20"
                }`}
              >
                <List className="w-6 h-6 mx-auto mb-2" />
                List
              </button>
            </div>
          </div>

          {/* Timer Display Options */}
          <div className="distressed-card p-6">
            <h2 className="font-black text-lg uppercase text-mango-dark mb-4">Timer Display</h2>
            <div className="space-y-4">
              {/* Show Seconds */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-mango-dark font-bold uppercase text-sm">Show Seconds</Label>
                  <p className="text-sm text-mango-dark/60">Display seconds on the timer countdown</p>
                </div>
                <button
                  onClick={() => setShowSeconds(!showSeconds)}
                  className={`w-16 h-9 rounded-full border-2 border-mango-dark transition-all relative ${
                    showSeconds ? "bg-mango-yellow" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-7 h-7 bg-white border-2 border-mango-dark rounded-full absolute top-0 transition-all ${
                      showSeconds ? "right-0" : "left-0"
                    }`}
                  />
                </button>
              </div>

              {/* Compact Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-mango-dark font-bold uppercase text-sm">Compact Mode</Label>
                  <p className="text-sm text-mango-dark/60">Reduce spacing and padding throughout the app</p>
                </div>
                <button
                  onClick={() => setCompactMode(!compactMode)}
                  className={`w-16 h-9 rounded-full border-2 border-mango-dark transition-all relative ${
                    compactMode ? "bg-mango-orange" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-7 h-7 bg-white border-2 border-mango-dark rounded-full absolute top-0 transition-all ${
                      compactMode ? "right-0" : "left-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={saveSettings}
              className="px-8 py-3 bg-mango-yellow text-mango-dark border-2 border-mango-dark font-black uppercase shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#1a1a1a] transition-all"
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
