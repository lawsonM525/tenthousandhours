import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_URL
const dbName = process.env.MONGODB_DB || "tenthousandhours"

type GlobalWithMongo = typeof globalThis & {
  _mongo?: { client: MongoClient | null; promise: Promise<MongoClient> | null; db: Db | null }
}

const g = global as GlobalWithMongo

if (!g._mongo) {
  g._mongo = { client: null, promise: null, db: null }
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
  g._mongo!.client = client
  g._mongo!.db = database
  return database
}
