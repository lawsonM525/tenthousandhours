"use client"

import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { useActiveSession, useCreateSession, useUpdateSession } from '@/lib/hooks/use-sessions'
import { CategoryColor } from '@/lib/types'

interface CountdownTimerProps {
  categoryId: string
  categoryColor: CategoryColor
  title: string
  initialMinutes: number
  onStop?: () => void
}

export default function CountdownTimer({ 
  categoryId, 
  categoryColor, 
  title,
  initialMinutes,
  onStop 
}: CountdownTimerProps) {
  const { data: activeSession, refetch: refetchActive } = useActiveSession()
  const createSession = useCreateSession()
  const updateSession = useUpdateSession()
  
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60)
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isOvertime, setIsOvertime] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Update timer when initialMinutes changes
  useEffect(() => {
    if (!isRunning && !activeSession) {
      setTotalSeconds(initialMinutes * 60)
      setRemainingSeconds(initialMinutes * 60)
    }
  }, [initialMinutes, isRunning, activeSession])
  
  // Handle active session
  useEffect(() => {
    if (activeSession) {
      const startTime = new Date(activeSession.start).getTime()
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = totalSeconds - elapsed
      
      if (remaining <= 0) {
        setRemainingSeconds(0)
        setIsOvertime(true)
      } else {
        setRemainingSeconds(remaining)
        setIsOvertime(false)
      }
      setIsRunning(true)
    } else {
      setIsRunning(false)
      setRemainingSeconds(totalSeconds)
      setIsOvertime(false)
    }
  }, [activeSession, totalSeconds])

  // Countdown timer
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
        const remaining = totalSeconds - elapsed
        
        if (remaining <= 0) {
          setRemainingSeconds(0)
          if (!isOvertime) {
            setIsOvertime(true)
            // Could add notification here
          }
        } else {
          setRemainingSeconds(remaining)
        }
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, activeSession, totalSeconds, isOvertime])

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
    const absSeconds = Math.abs(seconds)
    const hours = Math.floor(absSeconds / 3600)
    const minutes = Math.floor((absSeconds % 3600) / 60)
    const secs = absSeconds % 60
    
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

  // SVG circle calculations - responsive sizing
  const size = 240 // Reduced from 280 for better mobile fit
  const strokeWidth = 6 // Reduced from 8
  const center = size / 2
  const radius = center - strokeWidth
  const circumference = 2 * Math.PI * radius
  
  // Progress calculation (1 to 0 as time runs out)
  const progress = isOvertime ? 1 : (remainingSeconds / totalSeconds)
  const progressOffset = circumference - (progress * circumference)
  
  // For overtime, show how far past we are
  const elapsedSeconds = totalSeconds - remainingSeconds
  const overtimeSeconds = Math.max(0, elapsedSeconds - totalSeconds)
  const overtimeProgress = isOvertime ? (overtimeSeconds % totalSeconds) / totalSeconds : 0
  const overtimeOffset = circumference - (overtimeProgress * circumference)

  // Clock tick marks
  const tickMarks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 - 90) * (Math.PI / 180)
    const isMajor = i % 5 === 0
    const innerRadius = isMajor ? radius - 15 : radius - 10
    const outerRadius = radius - 4
    
    return {
      x1: Math.round((center + innerRadius * Math.cos(angle)) * 1000) / 1000,
      y1: Math.round((center + innerRadius * Math.sin(angle)) * 1000) / 1000,
      x2: Math.round((center + outerRadius * Math.cos(angle)) * 1000) / 1000,
      y2: Math.round((center + outerRadius * Math.sin(angle)) * 1000) / 1000,
      isMajor,
    }
  })

  const [startTime, setStartTime] = useState<Date | null>(null)
  
  useEffect(() => {
    setStartTime(activeSession ? new Date(activeSession.start) : new Date())
  }, [activeSession])

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Timer circle container with explicit sizing */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          className="transform -rotate-90"
          style={{ width: size, height: size }}
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgb(38 38 38)" // border-subtle
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle (countdown) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={isOvertime ? 'rgb(38 38 38)' : colorHex[categoryColor]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            style={{
              transition: 'stroke-dashoffset 1s linear',
              filter: !isOvertime ? `drop-shadow(0 0 8px ${colorHex[categoryColor]}50)` : 'none',
            }}
          />
          
          {/* Overtime circle (different color, pulsing) */}
          {isOvertime && (
            <circle
              cx={center}
              cy={center}
              r={radius - 12}
              fill="none"
              stroke={colorHex.pink}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={overtimeOffset}
              style={{
                transition: 'stroke-dashoffset 1s linear',
                filter: `drop-shadow(0 0 12px ${colorHex.pink})`,
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          )}
        </svg>

        {/* Clock tick marks */}
        <svg 
          width={size} 
          height={size} 
          className="absolute inset-0"
          style={{ width: size, height: size }}
        >
          {tickMarks.map((tick, i) => (
            <line
              key={i}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.isMajor ? 'rgb(115 115 115)' : 'rgb(64 64 64)'} // text-secondary : text-muted
              strokeWidth={tick.isMajor ? 1.5 : 1}
            />
          ))}
        </svg>

        {/* Center content - properly centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div 
              className="text-4xl sm:text-5xl font-light tracking-wider tabular-nums"
              style={{ color: isOvertime ? colorHex.pink : (isRunning ? colorHex[categoryColor] : 'rgb(245 245 245)') }}
            >
              {isOvertime ? '+' : ''}{formatTime(isOvertime ? overtimeSeconds : remainingSeconds)}
            </div>
            <div className="text-xs sm:text-sm text-text-secondary mt-1">
              {isRunning ? (isOvertime ? 'overtime' : 'remaining') : 'ready to focus'}
            </div>
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
              backgroundColor: categoryId ? colorHex[categoryColor] : undefined,
              borderColor: categoryId ? colorHex[categoryColor] : undefined
            }}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Focus
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
            End Session
          </Button>
        )}
      </div>

      {/* Status info */}
      {isRunning && (
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 text-xs sm:text-sm text-text-secondary">
          <span>Total: {formatTime(totalSeconds)}</span>
          <span>Started: {startTime?.toLocaleTimeString()}</span>
        </div>
      )}
      
      {!isRunning && (
        <div className="text-xs sm:text-sm text-text-muted text-center px-4">
          {!categoryId && "Select a category to start"}
          {categoryId && !title && "Name your task to begin"}
          {categoryId && title && "Ready to start your focus session"}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}