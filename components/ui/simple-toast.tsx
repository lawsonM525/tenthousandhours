"use client"

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export interface ToastMessage {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

let toastCounter = 0
let addToastFunction: ((toast: Omit<ToastMessage, 'id'>) => void) | null = null

export function showToast(toast: Omit<ToastMessage, 'id'>) {
  if (addToastFunction) {
    addToastFunction(toast)
  }
}

export function SimpleToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    addToastFunction = (toast: Omit<ToastMessage, 'id'>) => {
      const id = `toast-${toastCounter++}`
      setToasts(prev => [...prev, { ...toast, id }])
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 5000)
    }
    
    return () => {
      addToastFunction = null
    }
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              animate-in slide-in-from-right fade-in-0 duration-200
              rounded-lg border p-4 shadow-lg backdrop-blur-md
              ${toast.variant === 'destructive' 
                ? 'border-red-500/50 bg-red-500/10 text-red-200' 
                : 'border-border-subtle bg-bg-elevated text-text-primary'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {toast.title && (
                  <h3 className="font-medium text-sm">{toast.title}</h3>
                )}
                {toast.description && (
                  <p className="text-sm text-text-secondary mt-1">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}