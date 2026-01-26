"use client"

import { useState } from "react"
import { Star, StarHalf } from "lucide-react"
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
import posthog from 'posthog-js'

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
  const [lastClickedStar, setLastClickedStar] = useState<number | null>(null)
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

        // Track session rated event
        const getFocusLevel = (r: number) => {
          if (r <= 1) return 'very_distracted'
          if (r <= 2) return 'somewhat_distracted'
          if (r <= 3) return 'moderately_focused'
          if (r <= 4) return 'well_focused'
          return 'deep_focus'
        }
        posthog.capture('session_rated', {
          session_id: session._id,
          category_id: session.categoryId,
          session_title: session.title,
          duration_minutes: Math.round(session.durationMin),
          focus_rating: rating,
          focus_level: getFocusLevel(rating),
        })
      }

      // Create note if provided
      if (note.trim()) {
        await createNote.mutateAsync({
          body: note,
          sessionIds: [session._id],
          tags: []
        })

        // Track note added event
        posthog.capture('note_added', {
          session_id: session._id,
          category_id: session.categoryId,
          note_length: note.trim().length,
          has_rating: rating > 0,
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
      setLastClickedStar(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save session details",
        variant: "destructive"
      })
      posthog.captureException(error)
    }
  }

  const handleSkip = () => {
    onComplete?.()
    onOpenChange(false)
    setRating(0)
    setNote("")
    setLastClickedStar(null)
  }

  if (!session) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session Complete!</DialogTitle>
          <DialogDescription>
            You focused on &ldquo;{session.title}&rdquo; for {Math.round(session.durationMin)} minutes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>How focused were you? (optional)</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => {
                const isHalfStar = rating === value - 0.5
                const isHalfFilled = isHalfStar && value === Math.ceil(rating)
                
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      if (lastClickedStar === value && rating === value) {
                        // Double-click on same star: toggle to half
                        setRating(value - 0.5)
                      } else {
                        setRating(value)
                      }
                      setLastClickedStar(value)
                    }}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110 relative"
                  >
                    {isHalfFilled && !hoveredRating ? (
                      <>
                        <Star className="h-8 w-8 fill-none text-border-subtle" />
                        <StarHalf className="h-8 w-8 fill-mango-yellow text-mango-yellow absolute inset-0 m-1" />
                      </>
                    ) : (
                      <Star
                        className={`h-8 w-8 ${
                          value <= (hoveredRating || Math.floor(rating)) || (value <= rating && !isHalfStar)
                            ? 'fill-mango-yellow text-mango-yellow'
                            : 'fill-none text-border-subtle'
                        }`}
                      />
                    )}
                  </button>
                )
              })}
            </div>
            {rating > 0 && (
              <p className="text-sm text-text-secondary">
                {rating === 0.5 && "Extremely distracted"}
                {rating === 1 && "Very distracted"}
                {rating === 1.5 && "Quite distracted"}
                {rating === 2 && "Somewhat distracted"}
                {rating === 2.5 && "Slightly distracted"}
                {rating === 3 && "Moderately focused"}
                {rating === 3.5 && "Fairly focused"}
                {rating === 4 && "Well focused"}
                {rating === 4.5 && "Very focused"}
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