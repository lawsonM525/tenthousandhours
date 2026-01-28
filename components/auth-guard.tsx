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
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-mango-orange rounded-full mx-auto mb-4"></div>
            <p className="font-bold uppercase text-mango-dark">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // If not signed in, show sign-in modal overlay
  if (!isSignedIn) {
    return (
      <div className="h-screen flex flex-col mango-pattern">
        {/* Blurred/dimmed background hint of the dashboard */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-40" />

        {/* Auth modal overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <div className="inline-block bg-mango-red px-4 py-2 border-2 border-mango-dark transform -rotate-1 mb-4">
                <span className="font-bold text-sm uppercase text-white">Sign In Required</span>
              </div>
              <h2 className="text-2xl font-black uppercase text-mango-dark mb-2">
                Track Your 10,000 Hours
              </h2>
              <p className="text-mango-dark/70 font-medium">
                Sign in or create an account to start tracking your deep work sessions.
              </p>
            </div>

            <SignIn
              appearance={{
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "border-4 border-mango-dark shadow-[8px_8px_0px_#1a1a1a] bg-white",
                  headerTitle: "font-black uppercase text-mango-dark",
                  headerSubtitle: "text-mango-dark/70",
                  formButtonPrimary: "bg-mango-orange hover:bg-mango-yellow text-mango-dark font-bold uppercase border-2 border-mango-dark shadow-[3px_3px_0px_#1a1a1a]",
                  formFieldInput: "border-2 border-mango-dark",
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
    )
  }

  // User is authenticated, render children
  return <>{children}</>
}
