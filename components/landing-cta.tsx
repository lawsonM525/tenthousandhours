"use client"

import Link from "next/link"
import { SignUpButton } from "@clerk/nextjs"
import posthog from 'posthog-js'
import { ReactNode } from "react"

interface CTAButtonProps {
  href?: string
  variant: "primary" | "secondary" | "final"
  ctaName: string
  ctaLocation: string
  children: ReactNode
  isSignUp?: boolean
}

export function CTAButton({ href, variant, ctaName, ctaLocation, children, isSignUp }: CTAButtonProps) {
  const handleClick = () => {
    posthog.capture('cta_clicked', {
      cta_name: ctaName,
      cta_location: ctaLocation,
      cta_variant: variant,
      is_signup_flow: isSignUp,
    })
  }

  const baseClasses = variant === "final"
    ? "px-8 py-4 sm:px-12 sm:py-6 lg:px-16 lg:py-8 bg-mango-yellow text-mango-dark border-2 sm:border-4 border-white font-black text-xl sm:text-2xl lg:text-4xl uppercase hover:scale-105 hover:-rotate-2 transition-all shadow-[4px_4px_0px_#E62E2D] sm:shadow-[8px_8px_0px_#E62E2D]"
    : variant === "primary"
      ? "px-5 py-3 sm:px-8 sm:py-4 bg-mango-red text-white border-2 border-mango-dark font-bold text-base sm:text-xl lg:text-2xl uppercase shadow-[3px_3px_0px_#000] sm:shadow-[6px_6px_0px_#000] hover:scale-105 hover:-rotate-2 transition-all"
      : "px-5 py-3 sm:px-8 sm:py-4 bg-white text-mango-dark border-2 border-mango-dark font-bold text-base sm:text-xl lg:text-2xl uppercase shadow-[3px_3px_0px_#000] sm:shadow-[6px_6px_0px_#000] hover:scale-105 hover:-rotate-2 transition-all"

  if (isSignUp) {
    return (
      <SignUpButton mode="modal">
        <button onClick={handleClick} className={baseClasses}>
          {children}
        </button>
      </SignUpButton>
    )
  }

  if (href) {
    return (
      <Link
        href={href}
        onClick={handleClick}
        className={variant === "final" ? `inline-block ${baseClasses}` : baseClasses}
      >
        {children}
      </Link>
    )
  }

  return (
    <button onClick={handleClick} className={baseClasses}>
      {children}
    </button>
  )
}
