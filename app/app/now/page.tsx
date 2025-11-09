"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CategoryChip } from "@/components/ui/category-chip"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Timer from "@/components/ui/timer"

export default function NowPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [title, setTitle] = useState("")

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="border-b border-border-subtle bg-bg-surface px-6 py-4">
        <h1 className="text-h2 font-semibold text-text-primary">now</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-6 pb-24 lg:pb-6">
        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
          {/* Left column: Focus & timer */}
          <div className="flex flex-col gap-6">
            <div className="bg-bg-surface border border-border-subtle rounded-component p-8 space-y-6">
              {/* Category Selector */}
              <div className="space-y-2">
                <Label htmlFor="category">category</Label>
                <div className="flex flex-wrap gap-2">
                  <CategoryChip color="blue" label="coding" active variant="solid" />
                  <CategoryChip color="teal" label="cs girlies" variant="solid" />
                  <CategoryChip color="pink" label="sleep" variant="solid" />
                  <CategoryChip color="lime" label="exercise" variant="solid" />
                </div>
              </div>

              {/* Activity Input */}
              <div className="space-y-2">
                <Label htmlFor="activity">what are you doing?</Label>
                <Input
                  id="activity"
                  placeholder="e.g., building time tracking app"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Progress circle timer */}
              <div className="pt-4">
                <Timer />
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-3">
              <h2 className="text-h3 text-text-primary">recent activities</h2>
              <div className="space-y-2">
                <SuggestionCard 
                  title="building time tracking app"
                  category="coding"
                  color="blue"
                  duration="2h 15m"
                />
                <SuggestionCard 
                  title="cs girlies planning"
                  category="cs girlies"
                  color="teal"
                  duration="45m"
                />
                <SuggestionCard 
                  title="morning workout"
                  category="exercise"
                  color="lime"
                  duration="30m"
                />
              </div>
            </div>

            {/* Empty State */}
            {!isRunning && !title && (
              <div className="text-center py-6 text-text-muted">
                <p className="text-body">
                  press start logging or pick a time on the timeline.
                </p>
              </div>
            )}
          </div>

          {/* Right column: Timeline skeleton */}
          <div className="bg-bg-surface border border-border-subtle rounded-component overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-body font-medium text-text-primary">Today</div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="secondary">today</Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-[72px_1fr] gap-4">
                {/* Time labels */}
                <div className="space-y-6 text-xs text-text-secondary">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const hour = 9 + i
                    const h = String(hour).padStart(2, "0")
                    return (
                      <div key={hour} className="flex flex-col">
                        <span>{h}:00</span>
                      </div>
                    )
                  })}
                </div>
                {/* Timeline grid */}
                <div className="relative">
                  {/* Background hour lines */}
                  <div className="absolute inset-0 grid grid-rows-16">
                    {Array.from({ length: 16 }).map((_, idx) => (
                      <div key={idx} className="border-b border-border-subtle/60" />
                    ))}
                  </div>
                  {/* Example blocks */}
                  <div className="relative grid auto-rows-[48px] gap-2">
                    <div className="relative row-start-12 row-span-3 overflow-hidden rounded-xl border border-border-subtle bg-cta-pink/20 p-3 text-sm text-text-primary">
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span>22:10 — 23:00</span>
                        <span className="h-2 w-2 rounded-full bg-cta-pink" />
                      </div>
                      <p className="mt-2 font-medium">ohomin focus</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SuggestionCard({ 
  title, 
  category, 
  color, 
  duration 
}: { 
  title: string
  category: string
  color: any
  duration: string
}) {
  return (
    <button className="w-full bg-bg-surface border border-border-subtle rounded-component p-4 hover:bg-bg-elevated transition-colors duration-150 text-left">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-body text-text-primary truncate">{title}</p>
          <div className="mt-1">
            <CategoryChip color={color} label={category} variant="solid" />
          </div>
        </div>
        <span className="text-label text-text-secondary">{duration}</span>
      </div>
    </button>
  )
}

