import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CATEGORY_COLORS = {
  pink: '#F11D75',
  teal: '#16C7A8',
  blue: '#3A8DFF',
  violet: '#8B5CF6',
  lime: '#45E06F',
  amber: '#FFB020',
  red: '#FF5C5C',
  cyan: '#22D3EE',
} as const

export type CategoryColor = keyof typeof CATEGORY_COLORS

export const CATEGORY_COLOR_OPTIONS: { value: CategoryColor; hex: string }[] = [
  { value: 'pink', hex: CATEGORY_COLORS.pink },
  { value: 'teal', hex: CATEGORY_COLORS.teal },
  { value: 'blue', hex: CATEGORY_COLORS.blue },
  { value: 'violet', hex: CATEGORY_COLORS.violet },
  { value: 'lime', hex: CATEGORY_COLORS.lime },
  { value: 'amber', hex: CATEGORY_COLORS.amber },
  { value: 'red', hex: CATEGORY_COLORS.red },
  { value: 'cyan', hex: CATEGORY_COLORS.cyan },
]
