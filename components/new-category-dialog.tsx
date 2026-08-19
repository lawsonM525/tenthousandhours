"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateCategory } from "@/lib/hooks/use-categories"
import { Category, CategoryType } from "@/lib/types"
import { CATEGORY_COLOR_OPTIONS, CategoryColor } from "@/lib/utils"

type NewCategoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (category: Category) => void
}

export function NewCategoryDialog({ open, onOpenChange, onCreated }: NewCategoryDialogProps) {
  const createCategory = useCreateCategory()
  const [name, setName] = useState("")
  const [color, setColor] = useState<CategoryColor>("blue")
  const [type, setType] = useState<CategoryType>("other")
  const [countsTowardMastery, setCountsTowardMastery] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setName("")
    setColor("blue")
    setType("other")
    setCountsTowardMastery(false)
    setError(null)
  }, [open])

  const save = async () => {
    if (!name.trim()) return
    setError(null)
    try {
      const category = await createCategory.mutateAsync({
        name: name.trim(),
        color,
        type,
        countsTowardMastery,
      })
      onCreated(category)
      onOpenChange(false)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not create category")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-4 border-mango-dark bg-white shadow-[8px_8px_0px_#1a1a1a]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase text-mango-dark">New Category</DialogTitle>
          <DialogDescription className="text-slate-500">Create it here, then get straight back to logging your session.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="quick-category-name" className="font-bold uppercase text-sm text-mango-dark">Category name</Label>
            <Input
              id="quick-category-name"
              autoFocus
              maxLength={50}
              placeholder="e.g., Meetings"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && name.trim() && !createCategory.isPending) void save()
              }}
              className="border-2 border-mango-dark bg-white font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold uppercase text-sm text-mango-dark">Color</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLOR_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-label={`${option.value} category color`}
                  aria-pressed={color === option.value}
                  onClick={() => setColor(option.value)}
                  className={`flex h-10 w-10 items-center justify-center border-2 transition-transform hover:scale-105 ${color === option.value ? "border-mango-dark shadow-[2px_2px_0px_#1a1a1a]" : "border-transparent"}`}
                  style={{ backgroundColor: option.hex }}
                >
                  {color === option.value && <Check className="h-5 w-5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-category-type" className="font-bold uppercase text-sm text-mango-dark">Type</Label>
            <select
              id="quick-category-type"
              value={type}
              onChange={(event) => setType(event.target.value as CategoryType)}
              className="h-10 w-full border-2 border-mango-dark bg-white px-3 text-sm font-bold text-mango-dark"
            >
              <option value="skill">Skill</option>
              <option value="life">Life maintenance</option>
              <option value="admin">Admin</option>
              <option value="social">Social / spiritual</option>
              <option value="other">Other</option>
            </select>
          </div>

          <label className="flex cursor-pointer items-start gap-3 border-2 border-slate-200 bg-slate-50 p-3">
            <input
              type="checkbox"
              checked={countsTowardMastery}
              onChange={(event) => setCountsTowardMastery(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-mango-green"
            />
            <span>
              <span className="block text-sm font-black text-mango-dark">Counts toward mastery</span>
              <span className="block text-xs text-slate-500">Include this category in your 10,000-hour progress.</span>
            </span>
          </label>

          {error && <p role="alert" className="border-2 border-mango-red bg-mango-red/10 p-3 text-sm font-bold text-mango-red">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={save}
              disabled={!name.trim() || createCategory.isPending}
              className="flex-1 border-2 border-mango-dark bg-mango-green px-4 py-2 text-sm font-bold uppercase text-white shadow-[3px_3px_0px_#1a1a1a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createCategory.isPending ? "Creating..." : "Create category"}
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={createCategory.isPending}
              className="border-2 border-mango-dark bg-white px-4 py-2 text-sm font-bold uppercase text-mango-dark"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
