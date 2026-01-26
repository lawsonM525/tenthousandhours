"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function GeneralSettingsPage() {
  const [defaultDuration, setDefaultDuration] = useState(50)
  const [weekStartsOn, setWeekStartsOn] = useState<"sunday" | "monday">("monday")
  const [saved, setSaved] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedDuration = localStorage.getItem("settings_defaultDuration")
    const storedWeekStart = localStorage.getItem("settings_weekStartsOn")
    
    if (storedDuration) setDefaultDuration(parseInt(storedDuration))
    if (storedWeekStart) setWeekStartsOn(storedWeekStart as "sunday" | "monday")
  }, [])

  const saveSettings = () => {
    localStorage.setItem("settings_defaultDuration", defaultDuration.toString())
    localStorage.setItem("settings_weekStartsOn", weekStartsOn)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b-4 border-mango-dark px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-mango-orange px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-2">
            <span className="font-bold text-xs uppercase text-white">Customize Your Experience</span>
          </div>
          <h1 className="text-3xl font-black uppercase text-mango-dark">General Settings</h1>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Default Timer Duration */}
          <div className="distressed-card p-6">
            <h2 className="font-black text-lg uppercase text-mango-dark mb-4">Timer Defaults</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="defaultDuration" className="text-mango-dark font-bold uppercase text-sm">
                  Default Session Duration (minutes)
                </Label>
                <p className="text-sm text-mango-dark/60 mb-2">
                  This will be the default time when you start a new focus session
                </p>
                <Input
                  id="defaultDuration"
                  type="number"
                  min={1}
                  max={180}
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(parseInt(e.target.value) || 50)}
                  className="w-32 border-2 border-mango-dark"
                />
              </div>
            </div>
          </div>

          {/* Week Start */}
          <div className="distressed-card p-6">
            <h2 className="font-black text-lg uppercase text-mango-dark mb-4">Calendar Preferences</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-mango-dark font-bold uppercase text-sm">
                  Week Starts On
                </Label>
                <p className="text-sm text-mango-dark/60 mb-3">
                  Choose which day your week begins
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setWeekStartsOn("sunday")}
                    className={`px-6 py-3 border-2 border-mango-dark font-bold uppercase transition-all ${
                      weekStartsOn === "sunday"
                        ? "bg-mango-dark text-white shadow-[3px_3px_0px_#FFB31A]"
                        : "bg-white hover:bg-mango-yellow/20"
                    }`}
                  >
                    Sunday
                  </button>
                  <button
                    onClick={() => setWeekStartsOn("monday")}
                    className={`px-6 py-3 border-2 border-mango-dark font-bold uppercase transition-all ${
                      weekStartsOn === "monday"
                        ? "bg-mango-dark text-white shadow-[3px_3px_0px_#FFB31A]"
                        : "bg-white hover:bg-mango-yellow/20"
                    }`}
                  >
                    Monday
                  </button>
                </div>
              </div>
            </div>
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
