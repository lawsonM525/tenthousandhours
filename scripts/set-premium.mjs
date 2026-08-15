import nextEnv from '@next/env'
import { MongoClient } from 'mongodb'

const { loadEnvConfig } = nextEnv
loadEnvConfig(process.cwd())

const [identifier, requestedPlan = 'premium'] = process.argv.slice(2)
if (!identifier || !['free', 'premium'].includes(requestedPlan)) {
  console.error('Usage: npm run premium:set -- <clerk-id-or-email> [free|premium]')
  process.exit(1)
}

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL
if (!uri) throw new Error('Missing MONGODB_URI')

const client = new MongoClient(uri)
await client.connect()

try {
  const db = client.db(process.env.MONGODB_DB || 'tenthousandhours')
  const lookup = identifier.startsWith('user_') ? { clerkId: identifier } : { email: identifier.toLowerCase() }
  const now = new Date()
  const update = requestedPlan === 'premium'
    ? {
        plan: 'premium',
        premiumBeta: { status: 'active', grantedAt: now, grantedBy: 'manual-cli', expiresAt: null },
        updatedAt: now,
      }
    : {
        plan: 'free',
        premiumBeta: { status: 'revoked', grantedBy: 'manual-cli', expiresAt: null },
        updatedAt: now,
      }

  const user = await db.collection('users').findOneAndUpdate(lookup, { $set: update }, { returnDocument: 'after' })
  if (!user) throw new Error(`No MongoDB user found for ${identifier}`)

  console.log(`${user.email} is now ${requestedPlan}.`)
} finally {
  await client.close()
}
