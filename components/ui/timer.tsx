"use client"

import { Play, Pause, RotateCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

export default function Timer({ showControls = true }: { showControls?: boolean }) {
  const DEFAULT_DURATION = 25 * 60;
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [time, setTime] = useState(DEFAULT_DURATION);
  const [isActive, setIsActive] = useState(false);
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const toggleTimer = () => {
    if (!isActive && !startTimeRef.current) {
      startTimeRef.current = new Date();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(duration);
    startTimeRef.current = null;
  };

  const handleDurationChange = (mins: number) => {
    if (Number.isNaN(mins) || mins <= 0) return;
    if (isActive) return;
    const next = Math.floor(mins) * 60;
    setDuration(next);
    setTime(next);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatHM = (d: Date) => `${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  const ticksOuterR = 46;
  const ticksInnerRShort = 43;
  const ticksInnerRLong = 40;
  const donutR = 34;
  const donutStroke = 22; // donut thickness
  const circumference = 2 * Math.PI * donutR;
  const half = circumference / 2;

  const elapsedRatio = (duration - time) / duration;
  const handAngle = elapsedRatio * 360; // deg
  const progressLen = Math.max(0, Math.min(1, elapsedRatio)) * circumference;

  const startForDisplay = startTimeRef.current ?? new Date();
  const endForDisplay = new Date(startForDisplay.getTime() + duration * 1000);

  return (
    <div className="w-full max-w-sm mx-auto text-center" role="timer" aria-live="polite" aria-atomic="true">
      <div className="relative w-56 h-56 mx-auto mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 100" aria-hidden>
          {/* Outer ticks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * Math.PI) / 30; // 6deg
            const isMajor = i % 5 === 0;
            const r2 = isMajor ? ticksInnerRLong : ticksInnerRShort;
            const x1 = 50 + ticksOuterR * Math.cos(angle);
            const y1 = 50 + ticksOuterR * Math.sin(angle);
            const x2 = 50 + r2 * Math.cos(angle);
            const y2 = 50 + r2 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                className={isMajor ? "text-text-secondary" : "text-text-muted"}
                strokeWidth={isMajor ? 1.4 : 0.8}
              />
            );
          })}

          {/* Two-tone donut halves */}
          <circle
            cx="50"
            cy="50"
            r={donutR}
            fill="none"
            className="text-text-primary/10"
            stroke="currentColor"
            strokeWidth={donutStroke}
            strokeDasharray={`${half} ${half}`}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
          <circle
            cx="50"
            cy="50"
            r={donutR}
            fill="none"
            className="text-cta-pink/30"
            stroke="currentColor"
            strokeWidth={donutStroke}
            strokeDasharray={`${half} ${half}`}
            style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%' }}
          />

          {/* Elapsed progress arc */}
          <circle
            cx="50"
            cy="50"
            r={donutR}
            fill="none"
            stroke="currentColor"
            className="text-cta-pink"
            strokeOpacity={0.85}
            strokeWidth={donutStroke}
            strokeLinecap="round"
            strokeDasharray={`${progressLen} ${circumference}`}
            style={{ transition: 'stroke-dasharray 1s linear', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />

          {/* Hand */}
          <g style={{ transformOrigin: '50% 50%', transform: `rotate(${handAngle}deg)` }} className="text-cta-pink">
            <line x1="50" y1="50" x2={50 + 32} y2="50" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" />
            <circle cx="50" cy="50" r="5.5" fill="#F11D75" />
            <circle cx="50" cy="50" r="2.5" fill="#fff" />
          </g>
        </svg>

        {/* Center readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-semibold text-text-primary tracking-tight tabular-nums">{formatTime(time)}</span>
          <span className="mt-2 inline-flex items-center rounded-full border border-border-subtle bg-bg-elevated/60 px-2.5 py-1 text-xs text-text-secondary">
            {formatHM(startForDisplay)} <span className="mx-1">→</span> {formatHM(endForDisplay)}
          </span>
        </div>
      </div>

      <div className="sr-only" aria-live="polite">{formatTime(time)} remaining</div>

      <div className="mx-auto mb-2 flex items-center justify-center gap-2">
        <label htmlFor="duration-min" className="text-small text-text-secondary">duration</label>
        <input
          id="duration-min"
          type="number"
          min={1}
          step={1}
          value={Math.floor(duration / 60)}
          onChange={(e) => handleDurationChange(parseInt(e.target.value, 10))}
          className="w-20 rounded-component border border-border-subtle bg-bg-surface px-2 py-1 text-small text-text-primary focus:outline-none focus:border-cta-pink/50 focus:ring-1 focus:ring-cta-pink/50"
          aria-label="duration in minutes"
        />
        <span className="text-small text-text-secondary">min</span>
      </div>

      {showControls && (
        <div className="mt-4 flex justify-center items-center gap-6">
          <Button onClick={resetTimer} variant="ghost" size="icon" className="h-10 w-10 text-text-secondary hover:text-text-primary">
            <RotateCw className="h-5 w-5" />
          </Button>
          <Button onClick={toggleTimer} variant="primary" size="icon" className="h-16 w-16 rounded-full">
            {isActive ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-0.5" />}
          </Button>
          <div className="w-6" />
        </div>
      )}
    </div>
  );
}

