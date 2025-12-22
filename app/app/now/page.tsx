"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CategoryChip } from "@/components/ui/category-chip"
import { Plus } from "lucide-react"
import CountdownTimer from "@/components/ui/countdown-timer"
import { useCategories } from "@/lib/hooks/use-categories"
import { Category } from "@/lib/types"

export default function NowPage() {
  const { data: categories = [] } = useCategories()
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [title, setTitle] = useState("")
  const [duration, setDuration] = useState(50) // Default 50 minutes

  const handleStart = () => {
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
      {/* Minimal Header */}
      <header className="border-b border-border-subtle bg-bg-surface px-6 py-4">
        <h1 className="text-h2 font-semibold text-text-primary">focus timer</h1>
      </header>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Timer Duration Setting */}
          <div className="text-center space-y-2">
            <Label htmlFor="duration" className="text-text-secondary">session duration</Label>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDuration(Math.max(1, duration - 5))}
                className="text-text-secondary"
              >
                -5
              </Button>
              <div className="flex items-center gap-2">
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={180}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 50)}
                  className="w-20 text-center text-xl font-light"
                />
                <span className="text-text-secondary">min</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDuration(Math.min(180, duration + 5))}
                className="text-text-secondary"
              >
                +5
              </Button>
            </div>
          </div>

          {/* Main Timer */}
          <div className="py-4 sm:py-8">
            <CountdownTimer
              categoryId={selectedCategory?._id || ""}
              categoryColor={selectedCategory?.color || "pink"}
              title={title}
              initialMinutes={duration}
              onStop={handleStop}
            />
          </div>

          {/* Category & Task Input - Only show when not running */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-center block text-text-secondary">what are you working on?</Label>
              <Input
                placeholder="e.g., website redesign, deep work session..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-center"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-center block text-text-secondary">category</Label>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/app/categories'}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Category
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="pt-4 border-t border-border-subtle">
            <p className="text-center text-sm text-text-secondary mb-3">quick presets</p>
            <div className="flex justify-center gap-2">
              {[
                { label: "Pomodoro", duration: 25 },
                { label: "Deep Work", duration: 50 },
                { label: "Long Focus", duration: 90 },
              ].map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => setDuration(preset.duration)}
                  className="text-xs"
                >
                  {preset.label} ({preset.duration}m)
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}