"use client"

import { Play, Pause, RotateCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Timer() {
  const initialTime = 25 * 60; // 25 minutes
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

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
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(initialTime);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (time / initialTime) * circumference;

  return (
    <div className="bg-[#1C1C1E] border border-gray-700 rounded-2xl p-6 text-center shadow-2xl w-full max-w-xs mx-auto">
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-gray-800"
            strokeWidth="7"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className="text-cta-pink"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-white tracking-tighter">{formatTime(time)}</span>
          <span className="text-sm text-gray-400 mt-1">0h 35m</span>
        </div>
      </div>
      <div className="flex justify-center items-center space-x-6">
        <button onClick={resetTimer} className="text-gray-400 hover:text-white transition-colors">
          <RotateCw size={22} />
        </button>
        <button onClick={toggleTimer} className="bg-cta-pink text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
          {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1"/>}
        </button>
        <div className="w-6">{/* Spacer */}</div>
      </div>
    </div>
  );
}

