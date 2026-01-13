"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateSession } from "@/lib/hooks/use-sessions"
import { useCreateNote } from "@/lib/hooks/use-notes"
import { Session } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

interface SessionCompleteDialogProps {
  session: Session | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: () => void
}

export function SessionCompleteDialog({
  session,
  open,
  onOpenChange,
  onComplete
}: SessionCompleteDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [note, setNote] = useState("")
  const updateSession = useUpdateSession()
  const createNote = useCreateNote()
  const { toast } = useToast()

  const handleComplete = async () => {
    if (!session) return

    try {
      // Update session with rating
      if (rating > 0) {
        await updateSession.mutateAsync({
          id: session._id,
          data: {
            quality: rating
          }
        })
      }

      // Create note if provided
      if (note.trim()) {
        await createNote.mutateAsync({
          body: note,
          sessionIds: [session._id],
          tags: []
        })
      }

      toast({
        title: "Session completed",
        description: `Great job! You focused for ${Math.round(session.durationMin)} minutes.`
      })

      onComplete?.()
      onOpenChange(false)
      
      // Reset form
      setRating(0)
      setNote("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save session details",
        variant: "destructive"
      })
    }
  }

  const handleSkip = () => {
    onComplete?.()
    onOpenChange(false)
    setRating(0)
    setNote("")
  }

  if (!session) return null

  const displayRating = hoveredRating || rating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session Complete!</DialogTitle>
          <DialogDescription>
            You focused on "{session.title}" for {Math.round(session.durationMin)} minutes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>How focused were you? (optional)</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= displayRating
                        ? 'fill-cta-amber text-cta-amber'
                        : 'fill-none text-border-subtle'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-text-secondary">
                {rating === 1 && "Very distracted"}
                {rating === 2 && "Somewhat distracted"}
                {rating === 3 && "Moderately focused"}
                {rating === 4 && "Well focused"}
                {rating === 5 && "Deep focus"}
              </p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Add a note (optional)</Label>
            <Textarea
              id="note"
              placeholder="What did you work on? Any reflections?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleComplete}
            disabled={updateSession.isPending || createNote.isPending}
            className="flex-1"
          >
            {updateSession.isPending || createNote.isPending ? "Saving..." : "Save & Continue"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="flex-1"
          >
            Skip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}