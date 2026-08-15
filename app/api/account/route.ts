import { NextRequest, NextResponse } from "next/server"
import { getAuthUserId } from "@/lib/auth-helper"
import { getOrCreateCurrentUser, hasPremiumAccess } from "@/lib/current-user"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const clerkId = await getAuthUserId(req)
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await getOrCreateCurrentUser(clerkId)
  if (!user) return NextResponse.json({ error: "Could not create user record" }, { status: 500 })

  return NextResponse.json({
    email: user.email,
    plan: user.plan || 'free',
    isPremium: hasPremiumAccess(user),
  })
}
