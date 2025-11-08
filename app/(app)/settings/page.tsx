"use client";

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Settings
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Manage your preferences
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Account Section */}
          <div 
            className="rounded-lg p-6"
            style={{ background: 'var(--bg-surface)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Account
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Managed by Clerk
            </p>
          </div>
          
          {/* Preferences Section */}
          <div 
            className="rounded-lg p-6"
            style={{ background: 'var(--bg-surface)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Preferences
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Time Rounding
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg"
                  style={{ 
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <option>1 minute</option>
                  <option>5 minutes</option>
                  <option>15 minutes</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Week Start Day
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg"
                  style={{ 
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <option>Sunday</option>
                  <option>Monday</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Time Format
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg"
                  style={{ 
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <option>12-hour</option>
                  <option>24-hour</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* AI Section */}
          <div 
            className="rounded-lg p-6"
            style={{ background: 'var(--bg-surface)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              AI Features
            </h2>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5" />
              <span style={{ color: 'var(--text-secondary)' }}>
                Enable AI summaries and insights
              </span>
            </label>
          </div>
          
          {/* Data Section */}
          <div 
            className="rounded-lg p-6"
            style={{ background: 'var(--bg-surface)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Data
            </h2>
            
            <div className="space-y-3">
              <button
                className="w-full px-4 py-2 rounded-lg font-medium text-left transition-colors hover:opacity-80"
                style={{ 
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                Export Data (CSV)
              </button>
              
              <button
                className="w-full px-4 py-2 rounded-lg font-medium text-left transition-colors hover:opacity-80"
                style={{ 
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                Export Data (JSON)
              </button>
              
              <button
                className="w-full px-4 py-2 rounded-lg font-medium text-left transition-colors hover:opacity-80"
                style={{ 
                  background: 'var(--danger)',
                  color: 'white',
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
