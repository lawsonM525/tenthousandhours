import { useCallback } from 'react'
import { showToast } from './simple-toast'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const toast = useCallback(
    ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
      showToast({ title, description, variant })
    },
    []
  )

  return {
    toast,
  }
}