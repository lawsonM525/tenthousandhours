"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CategoryChip } from "@/components/ui/category-chip"
import { Plus, Minus } from "lucide-react"
import CountdownTimer from "@/components/ui/countdown-timer"
import { useCategories } from "@/lib/hooks/use-categories"
import { Category } from "@/lib/types"
import posthog from 'posthog-js'

export default function NowPage() {
  const { data: categories = [] } = useCategories()
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [title, setTitle] = useState("")
  const [duration, setDuration] = useState(50) // Default 50 minutes

  const _handleStart = () => {
    // Timer component will handle the actual start
    // This just ensures we have the required data
  }

  const handleStop = () => {
    // Reset selection when stopping
    setSelectedCategory(null)
    setTitle("")
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b-4 border-mango-dark px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <div className="inline-block bg-mango-red px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-2">
              <span className="font-bold text-xs uppercase text-white">Deep Work Mode</span>
            </div>
            <h1 className="text-3xl font-black uppercase text-mango-dark">Session Timer</h1>
          </div>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-mango-red"></div>
            <div className="w-3 h-3 rounded-full bg-mango-orange"></div>
            <div className="w-3 h-3 rounded-full bg-mango-yellow"></div>
          </div>
        </div>
      </header>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg space-y-6 sm:space-y-8">
          {/* Timer Card */}
          <div className="distressed-card p-8 rounded-sm">
            {/* Timer Duration Setting */}
            <div className="text-center space-y-3 mb-6">
              <Label htmlFor="duration" className="text-mango-dark font-bold uppercase text-sm tracking-wider">Session Duration</Label>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setDuration(Math.max(1, duration - 5))}
                  className="w-10 h-10 bg-mango-orange text-white font-black border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all flex items-center justify-center"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    max={180}
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 50)}
                    className="w-24 text-center text-2xl font-black border-2 border-mango-dark bg-white"
                  />
                  <span className="text-mango-dark font-bold uppercase">min</span>
                </div>
                <button
                  onClick={() => setDuration(Math.min(180, duration + 5))}
                  className="w-10 h-10 bg-mango-yellow text-mango-dark font-black border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Timer */}
            <div className="py-4 sm:py-6">
              <CountdownTimer
                categoryId={selectedCategory?._id || ""}
                categoryColor={selectedCategory?.color || "pink"}
                title={title}
                initialMinutes={duration}
                onStop={handleStop}
              />
            </div>
          </div>

          {/* Task Input Card */}
          <div className="distressed-card p-6 rounded-sm">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-center block text-mango-dark font-bold uppercase text-sm tracking-wider">What are you working on?</Label>
                <Input
                  placeholder="e.g., website redesign, deep work session..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-center border-2 border-mango-dark bg-white font-medium"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-center block text-mango-dark font-bold uppercase text-sm tracking-wider">Category</Label>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((category) => (
                    <CategoryChip
                      key={category._id}
                      color={category.color}
                      label={category.name}
                      active={selectedCategory?._id === category._id}
                      variant="solid"
                      onClick={() => setSelectedCategory(category)}
                      className="cursor-pointer"
                    />
                  ))}
                  {categories.length === 0 && (
                    <button 
                      onClick={() => window.location.href = '/app/categories'}
                      className="px-4 py-2 bg-mango-yellow text-mango-dark font-bold uppercase text-sm border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[3px_3px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Category
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="distressed-card p-4 rounded-sm bg-mango-dark">
            <p className="text-center text-sm text-white/80 mb-3 font-bold uppercase tracking-wider">Quick Presets</p>
            <div className="flex justify-center gap-3">
              {[
                { label: "Pomodoro", duration: 25, color: "bg-mango-red" },
                { label: "Deep Work", duration: 50, color: "bg-mango-orange" },
                { label: "Long Focus", duration: 90, color: "bg-mango-yellow" },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setDuration(preset.duration)
                    posthog.capture('timer_preset_selected', {
                      preset_name: preset.label,
                      preset_duration_minutes: preset.duration,
                      previous_duration: duration,
                    })
                  }}
                  className={`${preset.color} px-3 py-2 text-xs font-bold uppercase border-2 border-white/20 hover:border-white transition-colors ${preset.color === 'bg-mango-yellow' ? 'text-mango-dark' : 'text-white'}`}
                >
                  {preset.label} ({preset.duration}m)
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}