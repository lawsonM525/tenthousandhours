"use client"

import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center mango-pattern">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "border-4 border-mango-dark shadow-[8px_8px_0px_#1a1a1a]",
          }
        }}
        afterSignInUrl="/app"
        signUpUrl="/sign-up"
      />
    </div>
  )
}
