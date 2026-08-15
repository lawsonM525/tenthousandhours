type PremiumRecord = {
  plan?: unknown
  premiumBeta?: {
    status?: unknown
    expiresAt?: Date | string | null
  }
}

export function hasPremiumAccess(user: unknown, now = Date.now()) {
  if (!user || typeof user !== 'object') return false
  const record = user as PremiumRecord
  if (record.plan !== 'premium' || record.premiumBeta?.status !== 'active') return false
  if (!record.premiumBeta.expiresAt) return true
  const expiresAt = new Date(record.premiumBeta.expiresAt).getTime()
  return Number.isFinite(expiresAt) && expiresAt > now
}
