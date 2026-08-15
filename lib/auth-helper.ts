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

  if (userId) {
    return userId
  }

  // If no session cookie, check for Bearer token (mobile app)
  const authHeader = req.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7)

    try {
      // Verify the JWT token using Clerk's backend SDK
      const secretKey = process.env.CLERK_SECRET_KEY
      if (!secretKey) {
        console.error("[Auth] CLERK_SECRET_KEY not configured")
        return null
      }
      // For mobile apps, we verify the token with clock skew tolerance
      // The authorizedParties check is skipped when not provided
      const verifiedToken = await verifyToken(token, {
        secretKey,
        // Allow 5 minutes of clock skew
        clockSkewInMs: 300000,
      })

      if (verifiedToken.sub) {
        return verifiedToken.sub
      }
    } catch (error: any) {
      console.error("[Auth] Failed to verify Bearer token", error?.name || "UnknownError")
      return null
    }
  }

  return null
}
