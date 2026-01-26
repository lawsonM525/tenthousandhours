import { NextRequest, NextResponse } from "next/server"
import { getAuthUserId } from "@/lib/auth-helper"
import { getDb } from "@/lib/db"
import { updateCategorySchema } from "@/lib/schemas"
import { Category } from "@/lib/types"
import { z } from "zod"

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const db = await getDb()
    
    const category = await db.collection<Category>("categories").findOne({
      _id: id,
      userId
    })
    
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    
    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    
    // Validate request body
    const validatedData = updateCategorySchema.parse(body)
    
    const db = await getDb()
    
    // Check if category exists
    const existingCategory = await db.collection<Category>("categories").findOne({
      _id: id,
      userId
    })
    
    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    
    // Check for duplicate name if name is being changed
    if (validatedData.name && validatedData.name !== existingCategory.name) {
      const duplicateCategory = await db.collection("categories").findOne({
        userId,
        name: validatedData.name,
        archived: false,
        _id: { $ne: id } as any
      })
      
      if (duplicateCategory) {
        return NextResponse.json(
          { error: "Category with this name already exists" },
          { status: 409 }
        )
      }
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
      
      // Prevent setting parent to self
      if (validatedData.parentId === id) {
        return NextResponse.json(
          { error: "Category cannot be its own parent" },
          { status: 400 }
        )
      }
    }
    
    // Update category
    const result = await db.collection("categories").findOneAndUpdate(
      { _id: id as any, userId },
      { $set: validatedData },
      { returnDocument: "after" }
    )
    
    if (!result) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthUserId(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const db = await getDb()
    
    // Check if category has active sessions
    const activeSessionsCount = await db.collection("sessions").countDocuments({
      userId,
      categoryId: id
    })
    
    if (activeSessionsCount > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete category with existing sessions", 
          sessionsCount: activeSessionsCount 
        },
        { status: 409 }
      )
    }
    
    // Soft delete (archive) the category
    const result = await db.collection("categories").findOneAndUpdate(
      { _id: id as any, userId },
      { $set: { archived: true } },
      { returnDocument: "after" }
    )
    
    if (!result) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, archived: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}