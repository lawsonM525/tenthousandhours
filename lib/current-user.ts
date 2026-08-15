import { currentUser } from "@clerk/nextjs/server"
import { createUser, getUserById } from "@/lib/actions/user.actions"

export async function getOrCreateCurrentUser(clerkId: string) {
  const existing = await getUserById(clerkId)
  if (existing) return existing

  const clerkUser = await currentUser()
  if (!clerkUser || clerkUser.id !== clerkId) return null

  const primaryEmail = clerkUser.emailAddresses.find(
    (email) => email.id === clerkUser.primaryEmailAddressId,
  ) ?? clerkUser.emailAddresses[0]

  if (!primaryEmail?.emailAddress) return null

  return createUser({
    clerkId,
    email: primaryEmail.emailAddress,
    username: clerkUser.username,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    photo: clerkUser.imageUrl,
  })
}

export function hasPremiumAccess(user: any) {
  if (!user || user.plan !== 'premium' || user.premiumBeta?.status !== 'active') return false
  if (!user.premiumBeta.expiresAt) return true
  return new Date(user.premiumBeta.expiresAt).getTime() > Date.now()
}
