"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Volume2, VolumeX, Bell, Clock } from "lucide-react"

export default function SoundSettingsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [volume, setVolume] = useState(70)
  const [timerEndSound, setTimerEndSound] = useState("bell")
  const [tickingEnabled, setTickingEnabled] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const storedSoundEnabled = localStorage.getItem("settings_soundEnabled")
    const storedVolume = localStorage.getItem("settings_volume")
    const storedTimerEndSound = localStorage.getItem("settings_timerEndSound")
    const storedTickingEnabled = localStorage.getItem("settings_tickingEnabled")
    
    if (storedSoundEnabled) setSoundEnabled(storedSoundEnabled === "true")
    if (storedVolume) setVolume(parseInt(storedVolume))
    if (storedTimerEndSound) setTimerEndSound(storedTimerEndSound)
    if (storedTickingEnabled) setTickingEnabled(storedTickingEnabled === "true")
  }, [])

  const saveSettings = () => {
    localStorage.setItem("settings_soundEnabled", soundEnabled.toString())
    localStorage.setItem("settings_volume", volume.toString())
    localStorage.setItem("settings_timerEndSound", timerEndSound)
    localStorage.setItem("settings_tickingEnabled", tickingEnabled.toString())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const soundOptions = [
    { id: "bell", name: "Bell", icon: Bell },
    { id: "chime", name: "Chime", icon: Bell },
    { id: "gong", name: "Gong", icon: Bell },
    { id: "none", name: "None", icon: VolumeX },
  ]

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b-4 border-mango-dark px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-mango-green px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-2">
            <span className="font-bold text-xs uppercase text-white">Audio Preferences</span>
          </div>
          <h1 className="text-3xl font-black uppercase text-mango-dark">Sound</h1>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Master Sound Toggle */}
          <div className="distressed-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-lg uppercase text-mango-dark">Sound Effects</h2>
                <p className="text-sm text-mango-dark/60">Enable or disable all sounds</p>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-16 h-9 rounded-full border-2 border-mango-dark transition-all relative ${
                  soundEnabled ? "bg-mango-green" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-7 h-7 bg-white border-2 border-mango-dark rounded-full absolute top-0 transition-all ${
                    soundEnabled ? "right-0" : "left-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="distressed-card p-6">
            <h2 className="font-black text-lg uppercase text-mango-dark mb-4">Volume</h2>
            <div className="flex items-center gap-4">
              <VolumeX className="w-5 h-5 text-mango-dark/60" />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                disabled={!soundEnabled}
                className="flex-1 h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-mango-orange disabled:opacity-50"
              />
              <Volume2 className="w-5 h-5 text-mango-dark" />
              <span className="w-12 text-right font-bold text-mango-dark">{volume}%</span>
            </div>
          </div>

          {/* Timer End Sound */}
          <div className="distressed-card p-6">
            <h2 className="font-black text-lg uppercase text-mango-dark mb-2">Timer Completion Sound</h2>
            <p className="text-sm text-mango-dark/60 mb-4">Sound that plays when your focus session ends</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {soundOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={() => setTimerEndSound(option.id)}
                    disabled={!soundEnabled}
                    className={`p-4 border-2 border-mango-dark font-bold uppercase text-sm transition-all disabled:opacity-50 ${
                      timerEndSound === option.id
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

          {/* Ticking Sound */}
          <div className="distressed-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-mango-dark" />
                <div>
                  <Label className="text-mango-dark font-bold uppercase text-sm">Ticking Sound</Label>
                  <p className="text-sm text-mango-dark/60">Play a subtle tick during focus sessions</p>
                </div>
              </div>
              <button
                onClick={() => setTickingEnabled(!tickingEnabled)}
                disabled={!soundEnabled}
                className={`w-16 h-9 rounded-full border-2 border-mango-dark transition-all relative disabled:opacity-50 ${
                  tickingEnabled ? "bg-mango-orange" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-7 h-7 bg-white border-2 border-mango-dark rounded-full absolute top-0 transition-all ${
                    tickingEnabled ? "right-0" : "left-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={saveSettings}
              className="px-8 py-3 bg-mango-green text-white border-2 border-mango-dark font-black uppercase shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#1a1a1a] transition-all"
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
