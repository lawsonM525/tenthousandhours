"use client"

import { Square } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { useActiveSession, useCreateSession, useUpdateSession } from '@/lib/hooks/use-sessions'
import { CategoryColor } from '@/lib/types'

interface SessionTimerProps {
  categoryId: string
  categoryColor: CategoryColor
  title: string
  onStop?: () => void
}

export default function SessionTimer({ 
  categoryId, 
  categoryColor, 
  title,
  onStop 
}: SessionTimerProps) {
  const { data: activeSession, refetch: refetchActive } = useActiveSession()
  const createSession = useCreateSession()
  const updateSession = useUpdateSession()
  
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Calculate elapsed time from active session
  useEffect(() => {
    if (activeSession) {
      const startTime = new Date(activeSession.start).getTime()
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setElapsedSeconds(elapsed)
      setIsRunning(true)
    } else {
      setElapsedSeconds(0)
      setIsRunning(false)
    }
  }, [activeSession])

  // Update elapsed time every second when running
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      if (activeSession) {
        const startTime = new Date(activeSession.start).getTime()
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setElapsedSeconds(elapsed)
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, activeSession])

  const handleStart = async () => {
    if (!categoryId || !title) return
    
    try {
      await createSession.mutateAsync({
        categoryId,
        title,
        start: new Date().toISOString(),
        tags: []
      })
      await refetchActive()
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  const handleStop = async () => {
    if (!activeSession) return
    
    try {
      await updateSession.mutateAsync({
        id: activeSession._id,
        data: {
          end: new Date().toISOString()
        }
      })
      await refetchActive()
      onStop?.()
    } catch (error) {
      console.error('Failed to stop session:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Color mappings for our palette
  const colorHex = {
    pink: '#F11D75',
    teal: '#16C7A8',
    blue: '#3A8DFF',
    violet: '#9373FF',
    lime: '#84CC16',
    amber: '#F59E0B',
    red: '#EF4444',
    cyan: '#06B6D4',
  }

  // SVG circle calculations
  const size = 280
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  
  // For continuous timer, show progress through current hour
  const hourProgress = (elapsedSeconds % 3600) / 3600
  const progressOffset = circumference - (hourProgress * circumference)

  // Clock tick marks
  const tickMarks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 - 90) * (Math.PI / 180)
    const isMajor = i % 5 === 0
    const innerRadius = isMajor ? radius - 20 : radius - 12
    const outerRadius = radius - 6
    
    return {
      x1: Math.round((size/2 + innerRadius * Math.cos(angle)) * 1000) / 1000,
      y1: Math.round((size/2 + innerRadius * Math.sin(angle)) * 1000) / 1000,
      x2: Math.round((size/2 + outerRadius * Math.cos(angle)) * 1000) / 1000,
      y2: Math.round((size/2 + outerRadius * Math.sin(angle)) * 1000) / 1000,
      isMajor,
    }
  })

  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const startTime = activeSession ? new Date(activeSession.start) : new Date()

  return (
    <div className="w-full max-w-sm mx-auto text-center space-y-6">
      {/* Timer circle */}
      <div className="relative">
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size/2}
            cy={size/2}
            r={radius}
            fill="none"
            stroke="rgb(38 38 38)" // border-subtle
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle */}
          {isRunning && (
            <circle
              cx={size/2}
              cy={size/2}
              r={radius}
              fill="none"
              stroke={colorHex[categoryColor]}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              style={{
                transition: 'stroke-dashoffset 1s linear',
                filter: `drop-shadow(0 0 8px ${colorHex[categoryColor]}50)`,
              }}
            />
          )}
        </svg>

        {/* Clock tick marks */}
        <svg 
          width={size} 
          height={size} 
          className="absolute top-0 left-0 pointer-events-none"
        >
          {tickMarks.map((tick, i) => (
            <line
              key={i}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.isMajor ? 'rgb(115 115 115)' : 'rgb(64 64 64)'} // text-secondary : text-muted
              strokeWidth={tick.isMajor ? 2 : 1}
            />
          ))}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className="text-5xl font-light tracking-wider tabular-nums"
            style={{ color: isRunning ? colorHex[categoryColor] : 'rgb(245 245 245)' }}
          >
            {formatTime(elapsedSeconds)}
          </div>
          <div className="text-sm text-text-secondary mt-1">
            {mounted && isRunning ? `started ${startTime.toLocaleTimeString()}` : 'ready to track'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <Button
            onClick={handleStart}
            disabled={!categoryId || !title || createSession.isPending}
            size="lg"
            className="min-w-[120px]"
            style={{
              backgroundColor: colorHex[categoryColor],
              borderColor: colorHex[categoryColor]
            }}
          >
            {elapsedSeconds > 0 ? 'Resume' : 'Start'}
          </Button>
        ) : (
          <Button
            onClick={handleStop}
            disabled={updateSession.isPending}
            variant="secondary"
            size="lg"
            className="min-w-[120px]"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        )}
      </div>

      {/* Time info */}
      {elapsedSeconds > 0 && (
        <div className="flex justify-center gap-6 text-sm text-text-secondary">
          <span>Elapsed: {formatTime(elapsedSeconds)}</span>
          {activeSession && (
            <span>Activity: {activeSession.title}</span>
          )}
        </div>
      )}
      
      {!isRunning && (
        <div className="mt-4 text-sm text-text-muted">
          {!categoryId && "Select a category to start"}
          {categoryId && !title && "Enter what you're doing"}
        </div>
      )}
    </div>
  )
}