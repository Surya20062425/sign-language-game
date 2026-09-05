import { describe, it, expect } from 'vitest'
import { matchSign, normalizeLandmarks, getTemplate, getTemplateIds } from '../data/landmarks'
import { signs } from '../data'

describe('sign templates & matching', () => {
  it('every level sign has a template so the Practice grid can detect it', () => {
    // Practice levels reference these signIds; each must have a template
    // so matchSign can recognize a hand forming that shape.
    const levelIds = ['hello', 'thank', 'yes', 'please', 'sorry', 'no', 'water', 'food', 'more', 'family', 'mother', 'father', 'name', 'eat']
    const templateIds = new Set(getTemplateIds())
    levelIds.forEach((id) => {
      expect(templateIds.has(id), `missing template for ${id}`).toBe(true)
      expect(signs[id]).toBeDefined()
    })
  })

  it('matchSign returns null for too-few landmarks (safety gate)', () => {
    expect(matchSign([])).toBeNull()
    expect(matchSign([{ x: 0, y: 0, z: 0 }])).toBeNull()
  })

  it('matchSign returns a confident match for a clean template', () => {
    // Templates are designed to be self-recognizable. Note: some open-hand
    // signs (e.g. hello/thank) share geometry and may cross-match — the
    // matcher is a heuristic (see ponytail note in landmarks.ts).
    const ids = getTemplateIds()
    expect(ids.length).toBeGreaterThan(0)
    let selfMatched = 0
    ids.forEach((id) => {
      const result = matchSign(getTemplate(id))
      expect(result, `template for ${id} should produce a match`).not.toBeNull()
      if (result && result.signId === id) selfMatched++
    })
    // Most templates should self-match; the rest collapse into a sibling open-hand sign
    expect(selfMatched).toBeGreaterThan(ids.length * 0.6)
  })

  it('normalizeLandmarks requires 21 points (MediaPipe count)', () => {
    // Under 21 points the data is returned as-is (not normalized) — matches Practice.tsx usage
    const short = [{ x: 0.5, y: 0.5, z: 0 }]
    expect(normalizeLandmarks(short)).toBe(short)
    // Full 21-point hand: wrist becomes origin (0,0,0)
    const full = Array.from({ length: 21 }, (_, i) => ({
      x: i * 0.01 + 0.5,
      y: 0.5,
      z: 0,
    }))
    const norm = normalizeLandmarks(full)
    expect(norm[0].x).toBeCloseTo(0, 5)
    expect(norm[0].y).toBeCloseTo(0, 5)
  })
})
