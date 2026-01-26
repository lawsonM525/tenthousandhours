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
    ? "px-16 py-8 bg-mango-yellow text-mango-dark border-4 border-white font-black text-3xl lg:text-4xl uppercase hover:scale-105 hover:-rotate-2 transition-all shadow-[8px_8px_0px_#E62E2D]"
    : variant === "primary"
      ? "px-8 py-4 bg-mango-red text-white border-2 border-mango-dark font-bold text-2xl uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all"
      : "px-8 py-4 bg-white text-mango-dark border-2 border-mango-dark font-bold text-2xl uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all"

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
