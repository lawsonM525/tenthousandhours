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
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-pill border transition-colors duration-150",
          variant === "solid" ? undefined : "bg-bg-surface",
          variant === "solid"
            ? "border-transparent"
            : active
              ? "border-opacity-100"
              : "border-opacity-30 hover:border-opacity-50",
          className
        )}
        style={{
          borderColor: variant === "solid" ? "transparent" : hexColor,
          backgroundColor:
            variant === "solid"
              ? `${hexColor}26`
              : active
                ? `${hexColor}26`
                : undefined,
        }}
        {...props}
      >
        <div 
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: hexColor }}
        />
        <span className="text-label text-text-primary">{label}</span>
      </div>
    )
  }
)

CategoryChip.displayName = "CategoryChip"

