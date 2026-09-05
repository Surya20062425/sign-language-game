import { Sign } from '../data/types'
import { Tile, Grid, Level, findMatches, settle, allLevelSigns } from './match3'

export type { Tile, Grid } from './match3'
export { createGrid } from './match3'

export type Pop = { signId: string; count: number; score: number }
export type CascadeResult = {
  finalGrid: Grid
  totalScore: number
  totalPopped: number
  pops: Pop[]
}

// Resolve full cascade: repeatedly find matches, pop them, settle, until stable.
export function resolveCascade(grid: Grid, lvl: Level): CascadeResult {
  let g = grid
  let totalScore = 0
  let totalPopped = 0
  const pops: Pop[] = []
  let safety = 0

  while (safety++ < 20) {
    const hits = findMatches(g)
    if (!hits.length) break

    const bySign: Record<string, Tile[]> = {}
    let popCount = 0
    hits.forEach((key) => {
      const [r, c] = key.split(',').map(Number)
      const tile = g[r][c]
      if (tile) {
        bySign[tile.signId] = bySign[tile.signId] || []
        bySign[tile.signId].push(tile)
        g[r][c] = null
        popCount++
      }
    })

    let popScore = 0
    for (const [signId, tiles] of Object.entries(bySign)) {
      // 10pts per tile, 50pt group bonus, chain multiplier applied later
      const score = tiles.length * 10 + 50
      popScore += score
      pops.push({ signId, count: tiles.length, score })
    }
    totalScore += popScore
    totalPopped += popCount

    g = settle(g, lvl)
  }

  return { finalGrid: g, totalScore, totalPopped, pops }
}

// Remove every tile matching a signId across the whole grid (the webcam action).
export function removeSign(grid: Grid, signId: string, lvl: Level): {
  grid: Grid
  removed: number
  score: number
} {
  const g: Grid = grid.map((row) => row.slice())
  let removed = 0
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (g[r][c]?.signId === signId) {
        g[r][c] = null
        removed++
      }
    }
  }
  // cascade only if we actually removed tiles
  let score = removed * 10
  let finalGrid = g
  if (removed > 0) {
    const after = resolveCascade(g, lvl)
    finalGrid = after.finalGrid
    score += after.totalScore
  }
  return { grid: finalGrid, removed, score }
}

import { ROWS, COLS } from './match3'
export { ROWS, COLS }

export function signSetForLevel(lvl: Level): Sign[] {
  return allLevelSigns(lvl)
}
