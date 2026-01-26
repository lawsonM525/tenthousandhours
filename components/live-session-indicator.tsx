"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";

export function LiveSessionIndicator() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [inputTime, setInputTime] = useState("00:00");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d:]/g, "");
    
    // Auto-format: insert colon after 2 digits if not present
    if (val.length === 2 && !val.includes(":")) {
      val = val + ":";
    }
    
    // Limit to MM:SS format
    if (val.length > 5) val = val.slice(0, 5);
    
    setInputTime(val);
  };

  const handleStart = () => {
    const parts = inputTime.split(":");
    const mins = parseInt(parts[0]) || 0;
    const secs = parseInt(parts[1]) || 0;
    setSeconds(mins * 60 + Math.min(secs, 59));
    setIsRunning(true);
  };

  return (
    <div className="hidden lg:flex items-center gap-6 px-4 py-2 bg-mango-dark rounded-full border-2 border-mango-orange">
      <div className="flex items-center gap-2">
        <span 
          className={`w-2.5 h-2.5 rounded-full ${
            isRunning ? "live-indicator" : "bg-white/40"
          }`}
        />
        <span className="text-white font-bold text-xs uppercase tracking-widest">
          {isRunning ? "Live Session:" : "Start Session:"}
        </span>
      </div>
      {isRunning ? (
        <span className="font-bold text-2xl tabular-nums text-mango-yellow tracking-wider">
          {formatTime(seconds)}
        </span>
      ) : (
        <input
          type="text"
          value={inputTime}
          onChange={handleTimeChange}
          onFocus={(e) => e.target.select()}
          className="w-20 bg-transparent text-center font-bold text-2xl tabular-nums text-white/40 tracking-wider focus:outline-none focus:text-mango-yellow"
          placeholder="00:00"
        />
      )}
      <div className="h-4 w-px bg-white/20"></div>
      
      {isRunning ? (
        <button 
          onClick={() => setIsRunning(false)}
          className="text-white hover:text-mango-orange transition-colors"
        >
          <Pause className="h-5 w-5" />
        </button>
      ) : (
        <>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="text-white hover:text-mango-yellow transition-colors">
                <Play className="h-5 w-5" />
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <button 
              onClick={handleStart}
              className="text-white hover:text-mango-yellow transition-colors"
            >
              <Play className="h-5 w-5" />
            </button>
          </SignedIn>
        </>
      )}
    </div>
  );
}
