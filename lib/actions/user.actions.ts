import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db"
import crypto from "crypto"
import { Category, CategoryColor } from "@/lib/types"

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
    name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    settings: {
      rounding: 5,
      weekStart: 0,
      aiEnabled: false,
      notificationsEnabled: true,
      timeFormat: '12h' as const
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const res = await db.collection(COLLECTION).findOneAndUpdate(
    { clerkId: base.clerkId },
    { $setOnInsert: base },
    { upsert: true, returnDocument: "after" }
  )
  
  // Create default categories for new users
  if (res?.lastErrorObject?.upserted) {
    const userId = res.value?._id?.toString()
    if (userId) {
      await createDefaultCategories(userId)
    }
  }
  
  return res?.value ?? null
}

async function createDefaultCategories(userId: string) {
  const db = await getDb()
  const now = new Date()
  
  const defaultCategories: Omit<Category, "_id">[] = [
    {
      userId,
      name: "Work",
      color: "blue" as CategoryColor,
      type: "skill",
      countsTowardMastery: true,
      archived: false,
      createdAt: now
    },
    {
      userId,
      name: "Learning",
      color: "violet" as CategoryColor,
      type: "skill",
      countsTowardMastery: true,
      archived: false,
      createdAt: now
    },
    {
      userId,
      name: "Exercise",
      color: "lime" as CategoryColor,
      type: "life",
      countsTowardMastery: false,
      archived: false,
      createdAt: now
    },
    {
      userId,
      name: "Social",
      color: "pink" as CategoryColor,
      type: "social",
      countsTowardMastery: false,
      archived: false,
      createdAt: now
    },
    {
      userId,
      name: "Admin",
      color: "amber" as CategoryColor,
      type: "admin",
      countsTowardMastery: false,
      archived: false,
      createdAt: now
    },
    {
      userId,
      name: "Entertainment",
      color: "teal" as CategoryColor,
      type: "life",
      countsTowardMastery: false,
      archived: false,
      createdAt: now
    },
    {
      userId,
      name: "Sleep",
      color: "cyan" as CategoryColor,
      type: "life",
      countsTowardMastery: false,
      archived: false,
      createdAt: now
    }
  ]
  
  const categoriesWithIds = defaultCategories.map(cat => ({
    _id: crypto.randomUUID(),
    ...cat
  }))
  
  await db.collection("categories").insertMany(categoriesWithIds as any)
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
