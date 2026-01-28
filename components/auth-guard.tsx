"use client"

import { useAuth } from "@clerk/nextjs"
import { SignIn } from "@clerk/nextjs"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoaded, isSignedIn } = useAuth()

  // Show nothing while loading to prevent flash
  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center mango-pattern">
        <div className="distressed-card p-8 text-center">
          <div className="w-16 h-16 bg-mango-orange rounded-full mx-auto mb-4 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
          <p className="font-bold uppercase text-mango-dark">
            Loading
            <span className="inline-flex ml-1">
              <span className="animate-bounce" style={{ animationDuration: '1s' }}>.</span>
              <span className="animate-bounce" style={{ animationDuration: '1s', animationDelay: '0.15s' }}>.</span>
              <span className="animate-bounce" style={{ animationDuration: '1s', animationDelay: '0.3s' }}>.</span>
            </span>
          </p>
        </div>
      </div>
    )
  }

  // If not signed in, show sign-in modal overlay
  if (!isSignedIn) {
    return (
      <div className="min-h-screen mango-pattern">
        {/* Blurred/dimmed background hint of the dashboard */}
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40" />

        {/* Auth modal overlay - scrollable on mobile */}
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4 py-8 sm:py-12">
            <div className="w-full max-w-md">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-block bg-mango-red px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-mango-dark transform -rotate-1 mb-3 sm:mb-4">
                  <span className="font-bold text-xs sm:text-sm uppercase text-white">Sign In Required</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-mango-dark mb-2">
                  Track Your 10,000 Hours
                </h2>
                <p className="text-sm sm:text-base text-mango-dark/70 font-medium px-2">
                  Sign in or create an account to start tracking your deep work sessions.
                </p>
              </div>

              <SignIn
                appearance={{
                  elements: {
                    rootBox: "mx-auto w-full",
                    card: "border-2 sm:border-4 border-mango-dark shadow-[4px_4px_0px_#1a1a1a] sm:shadow-[8px_8px_0px_#1a1a1a] bg-white",
                    headerTitle: "font-black uppercase text-mango-dark text-lg sm:text-xl",
                    headerSubtitle: "text-mango-dark/70 text-sm",
                    formButtonPrimary: "bg-mango-orange hover:bg-mango-yellow text-mango-dark font-bold uppercase border-2 border-mango-dark shadow-[2px_2px_0px_#1a1a1a] sm:shadow-[3px_3px_0px_#1a1a1a]",
                    formFieldInput: "border-2 border-mango-dark text-base",
                    footerActionLink: "text-mango-red hover:text-mango-orange font-bold",
                  }
                }}
                afterSignInUrl="/app/now"
                signUpUrl="/sign-up"
                routing="hash"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // User is authenticated, render children
  return <>{children}</>
}
