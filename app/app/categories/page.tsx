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
import { Plus, Edit2 } from "lucide-react"
import { CATEGORY_COLOR_OPTIONS, type CategoryColor } from "@/lib/utils"

export default function CategoriesPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState<CategoryColor>("blue")

  return (
    <div className="h-full flex flex-col">
      <header className="border-b border-border-subtle bg-bg-surface px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-h2 font-semibold text-text-primary">categories</h1>
          <Button onClick={() => setIsOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            add category
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-4xl mx-auto space-y-2">
          <CategoryRow 
            name="coding" 
            color="blue" 
            type="skill" 
            countsTowardMastery 
          />
          <CategoryRow 
            name="cs girlies" 
            color="teal" 
            type="skill" 
            countsTowardMastery 
          />
          <CategoryRow 
            name="sleep" 
            color="pink" 
            type="life" 
            countsTowardMastery={false} 
          />
          <CategoryRow 
            name="exercise" 
            color="lime" 
            type="life" 
            countsTowardMastery={false} 
          />
        </div>

        <div className="max-w-4xl mx-auto mt-8 p-4 bg-bg-surface border border-border-subtle rounded-component">
          <p className="text-label text-text-secondary">
            pick colors that read well on dark. you can change anytime.
          </p>
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>add category</DialogTitle>
            <DialogDescription>
              create a new category to organize your time
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">name</Label>
              <Input id="name" placeholder="e.g., deep work" />
            </div>

            <div className="space-y-2">
              <Label>color</Label>
              <div className="grid grid-cols-8 gap-2">
                {CATEGORY_COLOR_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedColor(option.value)}
                    className={`w-10 h-10 rounded-full transition-all duration-150 ${
                      selectedColor === option.value
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
              <Label htmlFor="type">type</Label>
              <select
                id="type"
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
                id="mastery"
                className="w-4 h-4"
              />
              <Label htmlFor="mastery">counts toward mastery</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={() => setIsOpen(false)} className="flex-1">
                create category
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsOpen(false)}
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
  name,
  color,
  type,
  countsTowardMastery,
}: {
  name: string
  color: CategoryColor
  type: string
  countsTowardMastery: boolean
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-bg-surface border border-border-subtle rounded-component hover:bg-bg-elevated transition-colors duration-150">
      <div className="flex items-center gap-4">
        <CategoryChip color={color} label={name} />
        <span className="text-label text-text-secondary capitalize">{type}</span>
        {countsTowardMastery && (
          <span className="text-small px-2 py-1 bg-accent-blue/10 text-accent-blue rounded">
            mastery
          </span>
        )}
      </div>
      <Button variant="ghost" size="icon">
        <Edit2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
