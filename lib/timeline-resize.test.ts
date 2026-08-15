import { describe, expect, it } from 'vitest'
import { calculateResizedTimeRange } from './timeline-resize'

describe('calculateResizedTimeRange', () => {
  it('snaps an end-time resize to five minutes', () => {
    const start = new Date(2026, 0, 10, 10, 0)
    const end = new Date(2026, 0, 10, 11, 0)
    const resized = calculateResizedTimeRange({
      start,
      end,
      edge: 'end',
      deltaPixels: 13,
      pixelsPerHour: 48,
    })

    expect(resized.start).toEqual(start)
    expect(resized.end).toEqual(new Date(2026, 0, 10, 11, 15))
  })

  it('keeps at least five minutes between the start and end', () => {
    const start = new Date(2026, 0, 10, 10, 0)
    const end = new Date(2026, 0, 10, 11, 0)
    const resized = calculateResizedTimeRange({
      start,
      end,
      edge: 'start',
      deltaPixels: 200,
      pixelsPerHour: 48,
    })

    expect(resized.start).toEqual(new Date(2026, 0, 10, 10, 55))
    expect(resized.end).toEqual(end)
  })

  it('does not resize beyond the edge of the session day', () => {
    const start = new Date(2026, 0, 10, 23, 0)
    const end = new Date(2026, 0, 10, 23, 30)
    const resized = calculateResizedTimeRange({
      start,
      end,
      edge: 'end',
      deltaPixels: 200,
      pixelsPerHour: 48,
    })

    expect(resized.end).toEqual(new Date(2026, 0, 11, 0, 0))
  })
})
