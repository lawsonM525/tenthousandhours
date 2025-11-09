"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CategoryChip } from "@/components/ui/category-chip"
import { Play, Pause, Square } from "lucide-react"

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
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Timer Card */}
          <div className="bg-bg-surface border border-border-subtle rounded-component p-8 space-y-6">
            {/* Category Selector */}
            <div className="space-y-2">
              <Label htmlFor="category">category</Label>
              <div className="flex flex-wrap gap-2">
                <CategoryChip color="blue" label="coding" active />
                <CategoryChip color="teal" label="cs girlies" />
                <CategoryChip color="pink" label="sleep" />
                <CategoryChip color="lime" label="exercise" />
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

            {/* Timer Display */}
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-6xl font-semibold text-text-primary tabular-nums">
                  {isRunning ? "00:42:15" : "00:00:00"}
                </div>
                <p className="text-label text-text-muted mt-2">
                  {isRunning ? "logging..." : "ready to start"}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {!isRunning ? (
                <Button 
                  size="lg" 
                  onClick={() => setIsRunning(true)}
                  className="gap-2"
                >
                  <Play className="w-5 h-5" />
                  start logging
                </Button>
              ) : (
                <>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => setIsRunning(false)}
                    className="gap-2"
                  >
                    <Pause className="w-5 h-5" />
                    pause
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => setIsRunning(false)}
                    className="gap-2"
                  >
                    <Square className="w-5 h-5" />
                    finish log
                  </Button>
                </>
              )}
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
            <div className="text-center py-12 text-text-muted">
              <p className="text-body">
                press start logging or pick a time on the timeline.
              </p>
            </div>
          )}
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
            <CategoryChip color={color} label={category} />
          </div>
        </div>
        <span className="text-label text-text-secondary">{duration}</span>
      </div>
    </button>
  )
}
