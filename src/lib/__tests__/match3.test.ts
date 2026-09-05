import { describe, it, expect } from 'vitest'
import { levels, createGrid, findMatches, settle, randomSign } from '../match3'
import { resolveCascade, removeSign } from '../gameEngine'

describe('match3 grid ops', () => {
  it('creates a full grid', () => {
    const g = createGrid(levels[0])
    expect(g.length).toBe(8)
    expect(g[0].length).toBe(8)
    expect(g.flat().filter(Boolean).length).toBe(64)
  })

  it('finds horizontal & vertical matches', () => {
    // build a grid with a horizontal run of 4 and vertical run of 3
    const lvl = levels[0]
    const g = createGrid(lvl)
    const id = lvl.signIds[0]
    // horizontal run row 0 cols 1-4
    for (let c = 1; c <= 4; c++) g[0][c] = { id: `${c}`, signId: id }
    // vertical run col 7 rows 0-2
    for (let r = 0; r <= 2; r++) g[r][7] = { id: `v${r}`, signId: id }
    const hits = findMatches(g)
    const coords = new Set(hits)
    expect(coords.has('0,1')).toBe(true)
    expect(coords.has('0,4')).toBe(true)
    expect(coords.has('0,7')).toBe(true)
    expect(coords.has('2,7')).toBe(true)
  })

  it('settles columns and fills gaps', () => {
    const lvl = levels[0]
    const g = createGrid(lvl)
    g[7][3] = null
    g[7][4] = null
    const s = settle(g, lvl)
    expect(s[7][3]).toBeTruthy()
    expect(s[7][4]).toBeTruthy()
    // everything filled
    expect(s.flat().filter(Boolean).length).toBe(64)
  })
})

describe('gameEngine', () => {
  it('resolveCascade pops a 3-run and settles', () => {
    const lvl = levels[0]
    const g = createGrid(lvl)
    const id = lvl.signIds[0]
    g[3][0] = { id: 'a', signId: id }
    g[3][1] = { id: 'b', signId: id }
    g[3][2] = { id: 'c', signId: id }
    const res = resolveCascade(g, lvl)
    expect(res.pops.length).toBeGreaterThan(0)
    expect(res.pops[0].count).toBeGreaterThanOrEqual(3)
    expect(res.totalPopped).toBeGreaterThanOrEqual(3)
  })

  it('removeSign removes all tiles of a sign', () => {
    const lvl = levels[0]
    const g = createGrid(lvl)
    const id = lvl.signIds[0]
    const before = g.flat().filter((t) => t?.signId === id).length
    const { removed, score } = removeSign(g, id, lvl)
    expect(removed).toBe(before)
    expect(score).toBeGreaterThan(0)
  })

  it('resolveCascade on empty grid returns 0 score', () => {
    const lvl = levels[0]
    const g: (import('../match3').Tile | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null))
    const res = resolveCascade(g, lvl)
    expect(res.totalScore).toBe(0)
    expect(res.totalPopped).toBe(0)
    expect(res.pops.length).toBe(0)
  })

  it('removeSign on empty grid returns 0', () => {
    const lvl = levels[0]
    const g: (import('../match3').Tile | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null))
    const { removed, score } = removeSign(g, 'any_sign', lvl)
    expect(removed).toBe(0)
    expect(score).toBe(0)
  })
})
