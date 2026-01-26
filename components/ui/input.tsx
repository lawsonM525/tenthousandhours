import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-component border border-border-subtle bg-bg-surface px-3 py-2 text-body text-text-primary placeholder:text-text-muted transition-colors duration-150",
          "focus:outline-none focus:border-cta-pink/50 focus:ring-1 focus:ring-cta-pink/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
