export const RESIZE_SNAP_MINUTES = 5
export const MIN_SESSION_MINUTES = 5

type ResizeSessionArgs = {
  start: Date
  end: Date
  edge: 'start' | 'end'
  deltaPixels: number
  pixelsPerHour: number
}

export function calculateResizedTimeRange({
  start,
  end,
  edge,
  deltaPixels,
  pixelsPerHour,
}: ResizeSessionArgs) {
  const dayStart = new Date(start)
  dayStart.setHours(0, 0, 0, 0)

  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)

  const snapMs = RESIZE_SNAP_MINUTES * 60_000
  const minimumDurationMs = MIN_SESSION_MINUTES * 60_000
  const rawDeltaMinutes = (deltaPixels / pixelsPerHour) * 60
  const snappedDeltaMs = Math.round(rawDeltaMinutes / RESIZE_SNAP_MINUTES) * snapMs

  if (edge === 'start') {
    return {
      start: new Date(Math.max(
        dayStart.getTime(),
        Math.min(start.getTime() + snappedDeltaMs, end.getTime() - minimumDurationMs),
      )),
      end,
    }
  }

  return {
    start,
    end: new Date(Math.min(
      dayEnd.getTime(),
      Math.max(end.getTime() + snappedDeltaMs, start.getTime() + minimumDurationMs),
    )),
  }
}
