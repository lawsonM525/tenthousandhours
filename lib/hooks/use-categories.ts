import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Category } from "@/lib/types"
import { createCategorySchema, updateCategorySchema } from "@/lib/schemas"
import { z } from "zod"

// Fetch categories
export function useCategories({
  includeArchived = false,
  type,
  countsTowardMastery
}: {
  includeArchived?: boolean
  type?: string
  countsTowardMastery?: boolean
} = {}) {
  return useQuery({
    queryKey: ["categories", { includeArchived, type, countsTowardMastery }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (includeArchived) params.append("includeArchived", "true")
      if (type) params.append("type", type)
      if (countsTowardMastery !== undefined) {
        params.append("countsTowardMastery", countsTowardMastery.toString())
      }

      const response = await fetch(`/api/categories?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      return response.json() as Promise<Category[]>
    }
  })
}

// Get single category
export function useCategory(id: string) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch category")
      }
      return response.json() as Promise<Category>
    },
    enabled: !!id
  })
}

// Create category
export function useCreateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: z.infer<typeof createCategorySchema>) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
        console.error('Category API error:', error)
        throw new Error(error.error || error.message || "Failed to create category")
      }
      
      return response.json() as Promise<Category>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    }
  })
}

// Update category
export function useUpdateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: string
      data: z.infer<typeof updateCategorySchema> 
    }) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update category")
      }
      
      return response.json() as Promise<Category>
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["categories", data._id] })
    }
  })
}

// Delete (archive) category
export function useDeleteCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete category")
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    }
  })
}