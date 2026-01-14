import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getDb } from "@/lib/db"
import { createCategorySchema } from "@/lib/schemas"
import { Category } from "@/lib/types"
import { z } from "zod"
import { nanoid } from "nanoid"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()
    const searchParams = req.nextUrl.searchParams
    
    // Parse query params
    const includeArchived = searchParams.get("includeArchived") === "true"
    const type = searchParams.get("type")
    const countsTowardMastery = searchParams.get("countsTowardMastery")
    
    // Build query
    const query: any = { userId }
    
    if (!includeArchived) {
      query.archived = false
    }
    
    if (type) {
      query.type = type
    }
    
    if (countsTowardMastery !== null) {
      query.countsTowardMastery = countsTowardMastery === "true"
    }
    
    // Fetch categories
    const categories = await db
      .collection<Category>("categories")
      .find(query)
      .sort({ name: 1 })
      .toArray()
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  console.log('Categories POST endpoint hit')
  try {
    const { userId } = await auth()
    console.log('User ID:', userId)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    console.log('Request body:', body)
    
    // Validate request body
    const validatedData = createCategorySchema.parse(body)
    
    const db = await getDb()
    
    // Check for duplicate name
    const existingCategory = await db.collection("categories").findOne({
      userId,
      name: validatedData.name,
      archived: false
    })
    
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 }
      )
    }
    
    // If parentId provided, verify it exists and belongs to user
    if (validatedData.parentId) {
      const parentCategory = await db.collection("categories").findOne({
        _id: validatedData.parentId as any,
        userId
      })
      
      if (!parentCategory) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 404 }
        )
      }
    }
    
    // Create category
    const now = new Date()
    const category: Category = {
      _id: nanoid(),
      userId,
      name: validatedData.name,
      color: validatedData.color,
      type: validatedData.type,
      countsTowardMastery: validatedData.countsTowardMastery,
      targetWeeklyHours: validatedData.targetWeeklyHours,
      parentId: validatedData.parentId,
      archived: false,
      createdAt: now
    }
    
    // Insert category
    await db.collection("categories").insertOne(category as any)
    
    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}