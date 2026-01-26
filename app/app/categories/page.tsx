"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CategoryChip } from "@/components/ui/category-chip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { CATEGORY_COLOR_OPTIONS, type CategoryColor } from "@/lib/utils"
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/lib/hooks/use-categories"
import { Category, CategoryType } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import posthog from 'posthog-js'

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const { toast } = useToast()
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  // Form state for add dialog
  const [addForm, setAddForm] = useState({
    name: "",
    color: "blue" as CategoryColor,
    type: "skill" as CategoryType,
    countsTowardMastery: false
  })
  
  // Form state for edit dialog
  const [editForm, setEditForm] = useState({
    name: "",
    color: "blue" as CategoryColor,
    type: "skill" as CategoryType,
    countsTowardMastery: false
  })

  const handleAddCategory = async () => {
    console.log('Creating category with data:', addForm)
    try {
      await createCategory.mutateAsync({
        name: addForm.name,
        color: addForm.color,
        type: addForm.type,
        countsTowardMastery: addForm.countsTowardMastery
      })

      // Track category created event
      posthog.capture('category_created', {
        category_name: addForm.name,
        category_color: addForm.color,
        category_type: addForm.type,
        counts_toward_mastery: addForm.countsTowardMastery,
        total_categories: categories.length + 1,
      })

      toast({
        title: "Category created",
        description: `"${addForm.name}" has been added to your categories.`
      })

      // Reset form and close dialog
      setAddForm({
        name: "",
        color: "blue",
        type: "skill",
        countsTowardMastery: false
      })
      setIsAddOpen(false)
    } catch (error: any) {
      console.error('Category creation error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive"
      })
      posthog.captureException(error)
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory) return

    try {
      await updateCategory.mutateAsync({
        id: editingCategory._id,
        data: {
          name: editForm.name,
          color: editForm.color,
          type: editForm.type,
          countsTowardMastery: editForm.countsTowardMastery
        }
      })

      // Track category updated event
      posthog.capture('category_updated', {
        category_id: editingCategory._id,
        category_name: editForm.name,
        previous_name: editingCategory.name,
        category_color: editForm.color,
        category_type: editForm.type,
        counts_toward_mastery: editForm.countsTowardMastery,
        name_changed: editForm.name !== editingCategory.name,
        color_changed: editForm.color !== editingCategory.color,
        type_changed: editForm.type !== editingCategory.type,
      })

      toast({
        title: "Category updated",
        description: `"${editForm.name}" has been updated.`
      })

      setIsEditOpen(false)
      setEditingCategory(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive"
      })
      posthog.captureException(error)
    }
  }

  const handleDeleteCategory = async (category: Category) => {
    if (confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone if the category has no sessions.`)) {
      try {
        await deleteCategory.mutateAsync(category._id)

        // Track category deleted event
        posthog.capture('category_deleted', {
          category_id: category._id,
          category_name: category.name,
          category_color: category.color,
          category_type: category.type,
          counts_toward_mastery: category.countsTowardMastery,
          remaining_categories: categories.length - 1,
        })

        toast({
          title: "Category archived",
          description: `"${category.name}" has been archived.`
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete category",
          variant: "destructive"
        })
        posthog.captureException(error)
      }
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setEditForm({
      name: category.name,
      color: category.color,
      type: category.type,
      countsTowardMastery: category.countsTowardMastery
    })
    setIsEditOpen(true)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b-4 border-mango-dark px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <div className="inline-block bg-mango-red px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-2">
              <span className="font-bold text-xs uppercase text-white">Organize Your Time</span>
            </div>
            <h1 className="text-3xl font-black uppercase text-mango-dark">Categories</h1>
          </div>
          <button 
            onClick={() => setIsAddOpen(true)} 
            className="px-4 py-2 bg-mango-yellow text-mango-dark font-bold uppercase text-sm border-2 border-mango-dark shadow-[3px_3px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-4xl mx-auto space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-mango-dark font-bold">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="distressed-card p-8">
                <h3 className="text-2xl font-black uppercase text-mango-dark mb-2">No Categories Yet</h3>
                <p className="text-slate-500">Create your first category to start tracking.</p>
              </div>
            </div>
          ) : (
            categories.map((category) => (
              <CategoryRow
                key={category._id}
                category={category}
                onEdit={() => openEditDialog(category)}
                onDelete={() => handleDeleteCategory(category)}
              />
            ))
          )}
        </div>
 
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>add category</DialogTitle>
            <DialogDescription>
              create a new category to organize your time
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">name</Label>
              <Input 
                id="add-name" 
                placeholder="e.g., deep work"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>color</Label>
              <div className="grid grid-cols-8 gap-2">
                {CATEGORY_COLOR_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAddForm({ ...addForm, color: option.value })}
                    className={`w-7 h-7 rounded-full transition-all duration-150 ${
                      addForm.color === option.value
                        ? "ring-2 ring-text-primary ring-offset-2 ring-offset-bg-elevated"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: option.hex }}
                    aria-label={option.value}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-type">type</Label>
              <select
                id="add-type"
                value={addForm.type}
                onChange={(e) => setAddForm({ ...addForm, type: e.target.value as CategoryType })}
                className="flex h-10 w-full rounded-component border border-border-subtle bg-bg-surface px-3 py-2 text-body text-text-primary"
              >
                <option value="skill">skill</option>
                <option value="life">life maintenance</option>
                <option value="admin">admin</option>
                <option value="social">social/spiritual</option>
                <option value="other">other</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="add-mastery"
                checked={addForm.countsTowardMastery}
                onChange={(e) => setAddForm({ ...addForm, countsTowardMastery: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="add-mastery">counts toward mastery</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleAddCategory} 
                disabled={!addForm.name.trim() || createCategory.isPending}
                className="flex-1"
              >
                {createCategory.isPending ? "Creating..." : "create category"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsAddOpen(false)}
                className="flex-1"
              >
                cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>edit category</DialogTitle>
            <DialogDescription>
              update category details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">name</Label>
              <Input 
                id="edit-name" 
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>color</Label>
              <div className="grid grid-cols-8 gap-2">
                {CATEGORY_COLOR_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setEditForm({ ...editForm, color: option.value })}
                    className={`w-7 h-7 rounded-full transition-all duration-150 ${
                      editForm.color === option.value
                        ? "ring-2 ring-text-primary ring-offset-2 ring-offset-bg-elevated"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: option.hex }}
                    aria-label={option.value}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">type</Label>
              <select
                id="edit-type"
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value as CategoryType })}
                className="flex h-10 w-full rounded-component border border-border-subtle bg-bg-surface px-3 py-2 text-body text-text-primary"
              >
                <option value="skill">skill</option>
                <option value="life">life maintenance</option>
                <option value="admin">admin</option>
                <option value="social">social/spiritual</option>
                <option value="other">other</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="edit-mastery"
                checked={editForm.countsTowardMastery}
                onChange={(e) => setEditForm({ ...editForm, countsTowardMastery: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="edit-mastery">counts toward mastery</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleEditCategory} 
                disabled={!editForm.name.trim() || updateCategory.isPending}
                className="flex-1"
              >
                {updateCategory.isPending ? "Updating..." : "update category"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsEditOpen(false)}
                className="flex-1"
              >
                cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CategoryRow({
  category,
  onEdit,
  onDelete
}: {
  category: Category
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-2 border-mango-dark shadow-[3px_3px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-0.5 transition-all">
      <div className="flex items-center gap-4">
        <CategoryChip color={category.color} label={category.name} />
        <span className="text-sm font-bold text-slate-500 uppercase">{category.type}</span>
        {category.countsTowardMastery && (
          <span className="text-xs px-2 py-1 bg-mango-yellow/20 border border-mango-yellow text-mango-dark font-bold uppercase">
            mastery
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={onEdit}
          className="w-8 h-8 bg-mango-orange/10 border-2 border-mango-orange text-mango-orange hover:bg-mango-orange hover:text-white transition-colors flex items-center justify-center"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          onClick={onDelete}
          className="w-8 h-8 bg-mango-red/10 border-2 border-mango-red text-mango-red hover:bg-mango-red hover:text-white transition-colors flex items-center justify-center"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}