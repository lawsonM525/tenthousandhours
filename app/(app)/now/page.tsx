"use client";

import { useState } from "react";
import { Play, Pause, Square } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function NowPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [category, setCategory] = useState("General");
  const [activity, setActivity] = useState("");
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Now
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Start logging your time
          </p>
        </div>
        
        {/* Timer Card */}
        <div 
          className="rounded-lg p-8 space-y-6"
          style={{ background: 'var(--bg-surface)' }}
        >
          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Category
            </label>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ background: 'var(--accent-pink)' }}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg text-base font-medium"
                style={{ 
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <option>General</option>
                <option>Work</option>
                <option>Learning</option>
                <option>Exercise</option>
              </select>
            </div>
          </div>
          
          {/* Activity Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Activity
            </label>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="what are you doing?"
              className="w-full px-4 py-3 rounded-lg text-base"
              style={{ 
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
              }}
            />
          </div>
          
          {/* Timer Display */}
          <div className="flex flex-col items-center justify-center py-12">
            <div 
              className="text-6xl font-semibold mb-8" 
              style={{ color: 'var(--text-primary)' }}
            >
              00:00:00
            </div>
            
            {/* Control Buttons */}
            <div className="flex gap-4">
              {!isRunning ? (
                <button
                  onClick={() => setIsRunning(true)}
                  className="flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--cta-pink)' }}
                >
                  <Play className="h-5 w-5" />
                  Start Logging
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsRunning(false)}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors"
                    style={{ 
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <Pause className="h-5 w-5" />
                    Pause
                  </button>
                  <button
                    onClick={() => {
                      setIsRunning(false);
                      // TODO: Show finish dialog
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
                    style={{ background: 'var(--cta-pink)' }}
                  >
                    <Square className="h-5 w-5" />
                    Finish Log
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Keyboard Shortcuts */}
          <div 
            className="pt-6 border-t text-sm text-center"
            style={{ 
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            Press <kbd className="px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)' }}>S</kbd> to start/stop •{' '}
            <kbd className="px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)' }}>P</kbd> to pause •{' '}
            <kbd className="px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)' }}>N</kbd> for notes
          </div>
        </div>
        
        {/* Suggestions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Recent Activities
          </h3>
          <div className="space-y-2">
            <div 
              className="p-4 rounded-lg flex items-center justify-between cursor-pointer transition-colors hover:opacity-80"
              style={{ background: 'var(--bg-surface)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-teal)' }} />
                <div>
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Morning standup
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Work • 30 min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
