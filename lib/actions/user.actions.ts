import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db"

export type CreateUserParams = {
  clerkId: string
  email: string
  username?: string | null
  firstName?: string | null
  lastName?: string | null
  photo?: string | null
}

export type UpdateUserParams = {
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  photo?: string | null
}

const COLLECTION = "users"

export async function createUser(user: CreateUserParams) {
  const db = await getDb()
  const base = {
    clerkId: user.clerkId,
    email: user.email,
    username: user.username ?? null,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    photo: user.photo ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const res = await db.collection(COLLECTION).findOneAndUpdate(
    { clerkId: base.clerkId },
    { $setOnInsert: base },
    { upsert: true, returnDocument: "after" }
  )
  return res?.value ?? null
}

export async function getUserById(clerkId: string) {
  const db = await getDb()
  return db.collection(COLLECTION).findOne({ clerkId })
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  const db = await getDb()
  const res = await db.collection(COLLECTION).findOneAndUpdate(
    { clerkId },
    { $set: { ...user, updatedAt: new Date() } },
    { returnDocument: "after" }
  )
  return res?.value ?? null
}

export async function deleteUser(clerkId: string) {
  const db = await getDb()
  const doc = await db.collection(COLLECTION).findOne({ clerkId })
  if (!doc) return null
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(doc._id) })
  return doc
}
