import { auth } from "@clerk/nextjs/server"
import { verifyToken } from "@clerk/backend"
import { NextRequest } from "next/server"

/**
 * Gets the userId from either:
 * 1. Clerk session cookies (web app)
 * 2. Bearer token in Authorization header (mobile app)
 */
export async function getAuthUserId(req: NextRequest): Promise<string | null> {
  // First, try the standard Clerk auth (works for web with cookies)
  const { userId } = await auth()

  console.log("[Auth] Cookie auth userId:", userId)

  if (userId) {
    return userId
  }

  // If no session cookie, check for Bearer token (mobile app)
  const authHeader = req.headers.get("authorization")
  console.log("[Auth] Authorization header present:", !!authHeader)

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7)
    console.log("[Auth] Bearer token found, length:", token.length)
    console.log("[Auth] Token preview:", token.substring(0, 50) + "...")

    try {
      // Verify the JWT token using Clerk's backend SDK
      const secretKey = process.env.CLERK_SECRET_KEY
      if (!secretKey) {
        console.error("[Auth] CLERK_SECRET_KEY not configured")
        return null
      }
      console.log("[Auth] Secret key present, length:", secretKey.length)

      // For mobile apps, we verify the token with clock skew tolerance
      // The authorizedParties check is skipped when not provided
      const verifiedToken = await verifyToken(token, {
        secretKey,
        // Allow 5 minutes of clock skew
        clockSkewInMs: 300000,
      })

      console.log("[Auth] Token verified successfully:", verifiedToken)

      if (verifiedToken.sub) {
        console.log("[Auth] Verified Bearer token for user:", verifiedToken.sub)
        return verifiedToken.sub
      }
    } catch (error: any) {
      console.error("[Auth] Failed to verify Bearer token:")
      console.error("[Auth] Error name:", error?.name)
      console.error("[Auth] Error message:", error?.message)
      console.error("[Auth] Full error:", error)
      return null
    }
  } else {
    console.log("[Auth] No Bearer token in Authorization header")
  }

  return null
}
