import { getDb } from "@/lib/db"
import crypto from "crypto"
import { Category, CategoryColor } from "@/lib/types"
import { disconnectGoogleCalendar } from "@/lib/google-calendar"

export type CreateUserParams = {
  clerkId: string
  email: string
  username?: string | null
  firstName?: string | null
  lastName?: string | null
  photo?: string | null
}

export type UpdateUserParams = {
  email?: string
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  photo?: string | null
}

const COLLECTION = "users"

export async function createUser(user: CreateUserParams) {
  const db = await getDb()
  const existing = await db.collection(COLLECTION).findOne({ clerkId: user.clerkId })
  const now = new Date()
  const base = {
    clerkId: user.clerkId,
    tz: "UTC",
    plan: 'free' as const,
    settings: {
      rounding: 5,
      weekStart: 0,
      aiEnabled: false,
      notificationsEnabled: true,
      timeFormat: '12h' as const
    },
    createdAt: now,
  }
  const profile = {
    email: user.email.toLowerCase(),
    username: user.username ?? null,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    photo: user.photo ?? null,
    name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
    updatedAt: now,
  }
  const savedUser = await db.collection(COLLECTION).findOneAndUpdate(
    { clerkId: base.clerkId },
    { $set: profile, $setOnInsert: base },
    { upsert: true, returnDocument: "after" }
  )
  
  if (!existing) {
    await createDefaultCategories(user.clerkId)
  }
  
  return savedUser
}

async function createDefaultCategories(userId: string) {
  const db = await getDb()
  const existingCategoryCount = await db.collection("categories").countDocuments({ userId })
  if (existingCategoryCount > 0) return

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
  return db.collection(COLLECTION).findOneAndUpdate(
    { clerkId },
    { $set: { ...user, updatedAt: new Date() } },
    { returnDocument: "after" }
  )
}

export async function deleteUser(clerkId: string) {
  const db = await getDb()
  const user = await db.collection(COLLECTION).findOne({ clerkId })
  if (!user) return null

  await disconnectGoogleCalendar(clerkId)
  await Promise.all([
    db.collection(COLLECTION).deleteOne({ clerkId }),
    db.collection('categories').deleteMany({ userId: clerkId }),
    db.collection('sessions').deleteMany({ userId: clerkId }),
    db.collection('notes').deleteMany({ userId: clerkId }),
    db.collection('summaries').deleteMany({ userId: clerkId }),
    db.collection('ai_summaries').deleteMany({ userId: clerkId }),
    db.collection('ai_usage').deleteMany({ userId: clerkId }),
    db.collection('ai_usage_counters').deleteMany({ userId: clerkId }),
  ])
  return user
}
