import * as React from "react"
import { cn, CATEGORY_COLORS, type CategoryColor } from "@/lib/utils"

interface CategoryChipProps extends React.HTMLAttributes<HTMLDivElement> {
  color: CategoryColor
  label: string
  active?: boolean
  variant?: "outline" | "solid"
}

export const CategoryChip = React.forwardRef<HTMLDivElement, CategoryChipProps>(
  ({ color, label, active = false, variant = "outline", className, ...props }, ref) => {
    const hexColor = CATEGORY_COLORS[color]
    
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 border-2 transition-all duration-150",
          active 
            ? "shadow-[2px_2px_0px_#1a1a1a] -translate-y-0.5" 
            : "hover:shadow-[2px_2px_0px_#1a1a1a] hover:-translate-y-0.5",
          className
        )}
        style={{
          borderColor: hexColor,
          backgroundColor: active ? hexColor : `${hexColor}20`,
          color: active ? 'white' : hexColor,
        }}
        {...props}
      >
        <div 
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-current"
          style={{ backgroundColor: active ? 'white' : hexColor }}
        />
        <span className="text-sm font-bold">{label}</span>
      </div>
    )
  }
)

CategoryChip.displayName = "CategoryChip"

