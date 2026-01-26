"use client"

import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center mango-pattern">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "border-4 border-mango-dark shadow-[8px_8px_0px_#1a1a1a]",
          }
        }}
        afterSignUpUrl="/app"
        signInUrl="/sign-in"
      />
    </div>
  )
}
