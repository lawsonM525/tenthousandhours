import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL
const dbName = process.env.MONGODB_DB || "tenthousandhours"

type GlobalWithMongo = typeof globalThis & {
  _mongo?: { client: MongoClient | null; promise: Promise<MongoClient> | null; db: Db | null; indexes: Promise<void> | null }
}

const g = global as GlobalWithMongo

if (!g._mongo) {
  g._mongo = { client: null, promise: null, db: null, indexes: null }
}

async function ensureIndexes(database: Db) {
  await Promise.all([
    database.collection('users').createIndex({ clerkId: 1 }, { unique: true, name: 'users_clerk_id_unique' }),
    database.collection('sessions').createIndex({ userId: 1, start: 1 }, { name: 'sessions_user_start' }),
    database.collection('categories').createIndex({ userId: 1, archived: 1 }, { name: 'categories_user_archived' }),
    database.collection('ai_summaries').createIndex(
      { userId: 1, granularity: 1, startDate: 1, endDate: 1, timezone: 1, version: 1 },
      { unique: true, name: 'ai_summary_period_unique' },
    ),
    database.collection('ai_usage').createIndex({ userId: 1, feature: 1, createdAt: 1 }, { name: 'ai_usage_monthly' }),
  ])
}

export async function getDb(): Promise<Db> {
  if (g._mongo?.db) return g._mongo.db
  if (!uri) throw new Error("Missing MONGODB_URL")

  if (!g._mongo?.promise) {
    const client = new MongoClient(uri)
    g._mongo!.promise = client.connect()
  }
  const client = await g._mongo!.promise!
  const database = client.db(dbName)
  if (!g._mongo!.indexes) g._mongo!.indexes = ensureIndexes(database)
  await g._mongo!.indexes
  g._mongo!.client = client
  g._mongo!.db = database
  return database
}
