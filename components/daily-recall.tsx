"use client"

import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { Check, Crown, Loader2, Mic, Square, Trash2, WandSparkles } from "lucide-react"
import { Category } from "@/lib/types"
import { useCreateSessions } from "@/lib/hooks/use-sessions"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type DraftSession = {
  title: string
  startTime: string | null
  endTime: string | null
  categoryId: string | null
  confidence: number
  needsClarification: boolean
  clarification: string
  selected: boolean
}

export function DailyRecall({ selectedDate, categories }: { selectedDate: Date; categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPremium, setIsPremium] = useState<boolean | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [drafts, setDrafts] = useState<DraftSession[]>([])
  const [error, setError] = useState<string | null>(null)
  const [aiConsent, setAiConsent] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const createSessions = useCreateSessions()
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/account')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Could not load plan')))
      .then((account) => setIsPremium(account.isPremium === true))
      .catch(() => setIsPremium(false))
  }, [])

  useEffect(() => {
    if (!isRecording) return
    const timer = window.setInterval(() => {
      setRecordingSeconds((seconds) => {
        if (seconds >= 299) recorderRef.current?.stop()
        return seconds + 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [isRecording])

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), [])

  const reset = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setIsRecording(false)
    setRecordingSeconds(0)
    setAudioBlob(null)
    setTranscript('')
    setDrafts([])
    setError(null)
    setAiConsent(false)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) reset()
  }

  const startRecording = async () => {
    setError(null)
    setAudioBlob(null)
    setDrafts([])
    setTranscript('')
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
        setError('Voice recording is not supported in this browser. Try current Chrome, Safari, or Edge.')
        return
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const preferredMimeType = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm']
        .find((type) => MediaRecorder.isTypeSupported(type))
      const recorder = new MediaRecorder(stream, preferredMimeType ? { mimeType: preferredMimeType } : undefined)
      chunksRef.current = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        setAudioBlob(new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' }))
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        setIsRecording(false)
      }
      recorderRef.current = recorder
      recorder.start(1000)
      setRecordingSeconds(0)
      setIsRecording(true)
    } catch {
      setError('Microphone access is needed to record your recap.')
    }
  }

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  const processRecording = async () => {
    if (!audioBlob) return
    setIsProcessing(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'daily-recall')
      formData.append('selectedDate', format(selectedDate, 'yyyy-MM-dd'))
      formData.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone)
      const response = await fetch('/api/ai/recap', { method: 'POST', body: formData })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'Could not understand that recording')
      setTranscript(body.transcript || '')
      setDrafts(body.sessions.map((session: Omit<DraftSession, 'selected'>) => ({ ...session, selected: true })))
      setAudioBlob(null)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not understand that recording')
    } finally {
      setIsProcessing(false)
    }
  }

  const updateDraft = (index: number, changes: Partial<DraftSession>) => {
    setDrafts((current) => current.map((draft, draftIndex) => draftIndex === index ? { ...draft, ...changes } : draft))
  }

  const saveDrafts = async () => {
    const selectedDrafts = drafts.filter((draft) => draft.selected)
    const invalid = selectedDrafts.some((draft) => !draft.title.trim() || !draft.startTime || !draft.endTime || !draft.categoryId || draft.endTime <= draft.startTime)
    if (selectedDrafts.length === 0 || invalid) {
      setError('Every selected session needs a title, category, and valid start/end time.')
      return
    }

    setIsSaving(true)
    setError(null)
    try {
      const date = format(selectedDate, 'yyyy-MM-dd')
      await createSessions.mutateAsync(selectedDrafts.map((draft) => ({
          title: draft.title.trim(),
          categoryId: draft.categoryId!,
          start: new Date(`${date}T${draft.startTime}:00`).toISOString(),
          end: new Date(`${date}T${draft.endTime}:00`).toISOString(),
          tags: ['daily-recall'],
      })))
      toast({ title: 'Daily Recall added', description: `${selectedDrafts.length} session${selectedDrafts.length === 1 ? '' : 's'} added to your timeline.` })
      setIsOpen(false)
      reset()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save the proposed sessions')
    } finally {
      setIsSaving(false)
    }
  }

  const recordingLabel = `${Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:${(recordingSeconds % 60).toString().padStart(2, '0')}`

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 border-2 border-mango-dark bg-[#9373FF] px-3 py-1.5 text-xs font-black uppercase text-white shadow-[2px_2px_0px_#1a1a1a]"
      >
        <Mic className="h-4 w-4" /> Daily Recall
        <Crown className="h-3 w-3 text-mango-yellow" />
      </button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-4 border-mango-dark bg-white shadow-[8px_8px_0px_#1a1a1a]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-black uppercase text-mango-dark">
              <WandSparkles className="h-6 w-6 text-[#9373FF]" /> Recap {format(selectedDate, 'MMM d')}
            </DialogTitle>
            <DialogDescription className="text-slate-500">Tell me what you did today or what you want to add. Nothing is saved until you confirm it.</DialogDescription>
          </DialogHeader>

          {isPremium === false ? (
            <div className="border-2 border-mango-dark bg-mango-yellow/20 p-4">
              <p className="font-black uppercase text-mango-dark">Premium beta feature</p>
              <p className="mt-1 text-sm font-medium text-slate-600">Email <a className="font-black underline" href="mailto:michelle@michellelawson.me?subject=10%2C000%20Hours%20Premium%20Beta">michelle@michellelawson.me</a> to request access.</p>
            </div>
          ) : drafts.length > 0 ? (
            <div className="space-y-4">
              {transcript && <div className="border-2 border-slate-200 bg-slate-50 p-3 text-xs italic text-slate-500">“{transcript}”</div>}
              {drafts.map((draft, index) => (
                <div key={index} className={`border-2 p-3 ${draft.selected ? 'border-mango-dark bg-white' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex min-w-0 flex-1 items-center gap-2">
                      <input type="checkbox" checked={draft.selected} onChange={(event) => updateDraft(index, { selected: event.target.checked })} className="h-4 w-4 accent-[#9373FF]" />
                      <input value={draft.title} onChange={(event) => updateDraft(index, { title: event.target.value })} className="min-w-0 flex-1 border-b-2 border-mango-dark bg-transparent px-1 py-1 font-black text-mango-dark outline-none" />
                    </label>
                    <span className="text-[10px] font-black uppercase text-slate-400">{Math.round(draft.confidence * 100)}% sure</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_2fr]">
                    <label className="text-[10px] font-black uppercase text-slate-500">Start<input type="time" value={draft.startTime || ''} onChange={(event) => updateDraft(index, { startTime: event.target.value || null })} className="mt-1 w-full border-2 border-mango-dark bg-white p-2 text-sm text-mango-dark" /></label>
                    <label className="text-[10px] font-black uppercase text-slate-500">End<input type="time" value={draft.endTime || ''} onChange={(event) => updateDraft(index, { endTime: event.target.value || null })} className="mt-1 w-full border-2 border-mango-dark bg-white p-2 text-sm text-mango-dark" /></label>
                    <label className="col-span-2 text-[10px] font-black uppercase text-slate-500 sm:col-span-1">Category<select value={draft.categoryId || ''} onChange={(event) => updateDraft(index, { categoryId: event.target.value || null })} className="mt-1 w-full border-2 border-mango-dark bg-white p-2 text-sm font-bold text-mango-dark"><option value="">Choose category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></label>
                  </div>
                  {draft.needsClarification && draft.clarification && <p className="mt-2 text-xs font-bold text-mango-orange">Check this one: {draft.clarification}</p>}
                </div>
              ))}
              <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={reset} className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-500"><Trash2 className="h-4 w-4" /> Start over</button>
                <button type="button" onClick={saveDrafts} disabled={isSaving} className="inline-flex items-center gap-2 border-2 border-mango-dark bg-mango-green px-4 py-2 text-xs font-black uppercase text-white shadow-[3px_3px_0px_#1a1a1a] disabled:opacity-60">{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Confirm sessions</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 border-mango-dark ${isRecording ? 'animate-pulse bg-mango-red' : 'bg-[#9373FF]'}`}>
                {isRecording ? <Mic className="h-10 w-10 text-white" /> : <WandSparkles className="h-10 w-10 text-white" />}
              </div>
              <p className="mt-4 text-lg font-black text-mango-dark">{isRecording ? recordingLabel : audioBlob ? 'Ready for AI' : 'What did you do?'}</p>
              <p className="mt-1 max-w-md text-sm text-slate-500">Mention activities, approximate times, and durations. If you do not know an exact time, AI will leave it for you to fill in.</p>
              {!audioBlob && !isRecording && (
                <label className="mt-4 flex max-w-md items-start gap-2 border-2 border-mango-dark/20 bg-slate-50 p-3 text-left text-xs font-medium text-slate-600">
                  <input type="checkbox" checked={aiConsent} onChange={(event) => setAiConsent(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#9373FF]" />
                  <span>I understand this recording will be sent to Google Gemini for transcription and draft creation. <a href="/privacy" target="_blank" className="font-black underline">Privacy details</a></span>
                </label>
              )}
              <div className="mt-5 flex gap-3">
                {isRecording ? (
                  <button type="button" onClick={stopRecording} className="inline-flex items-center gap-2 border-2 border-mango-dark bg-mango-red px-5 py-2 font-black uppercase text-white shadow-[3px_3px_0px_#1a1a1a]"><Square className="h-4 w-4 fill-current" /> Stop</button>
                ) : audioBlob ? (
                  <><button type="button" onClick={reset} className="border-2 border-mango-dark bg-white px-4 py-2 text-xs font-black uppercase text-mango-dark">Discard</button><button type="button" onClick={processRecording} disabled={isProcessing} className="inline-flex items-center gap-2 border-2 border-mango-dark bg-[#9373FF] px-5 py-2 font-black uppercase text-white shadow-[3px_3px_0px_#1a1a1a] disabled:opacity-60">{isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />} {isProcessing ? 'Understanding…' : 'Create draft sessions'}</button></>
                ) : (
                  <button type="button" onClick={startRecording} disabled={isPremium !== true || !aiConsent} className="inline-flex items-center gap-2 border-2 border-mango-dark bg-[#9373FF] px-5 py-2 font-black uppercase text-white shadow-[3px_3px_0px_#1a1a1a] disabled:opacity-50"><Mic className="h-4 w-4" /> Start recording</button>
                )}
              </div>
            </div>
          )}
          {error && <p className="border-2 border-mango-red bg-mango-red/10 p-3 text-sm font-bold text-mango-red">{error}</p>}
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Audio is processed once and never stored.</p>
        </DialogContent>
      </Dialog>
    </>
  )
}
