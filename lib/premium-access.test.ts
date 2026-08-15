import { describe, expect, it } from 'vitest'
import { hasPremiumAccess } from './premium-access'

describe('hasPremiumAccess', () => {
  it('requires both the premium plan and an active manual entitlement', () => {
    expect(hasPremiumAccess({ plan: 'premium', premiumBeta: { status: 'active' } })).toBe(true)
    expect(hasPremiumAccess({ plan: 'premium', premiumBeta: { status: 'revoked' } })).toBe(false)
    expect(hasPremiumAccess({ plan: 'free', premiumBeta: { status: 'active' } })).toBe(false)
  })

  it('rejects expired and malformed expiration dates', () => {
    const now = new Date('2026-08-15T12:00:00.000Z').getTime()
    expect(hasPremiumAccess({ plan: 'premium', premiumBeta: { status: 'active', expiresAt: '2026-08-15T11:59:59.000Z' } }, now)).toBe(false)
    expect(hasPremiumAccess({ plan: 'premium', premiumBeta: { status: 'active', expiresAt: 'not-a-date' } }, now)).toBe(false)
    expect(hasPremiumAccess({ plan: 'premium', premiumBeta: { status: 'active', expiresAt: '2026-08-16T00:00:00.000Z' } }, now)).toBe(true)
  })
})
