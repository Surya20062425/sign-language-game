import { signs } from '../data'
import { Sign } from '../data/types'

export const COLS = 8
export const ROWS = 8
export const CELL = 46

export type Tile = { id: string; signId: string }
export type Grid = (Tile | null)[][]

let _id = 0
export const nextId = () => String(++_id)

export type Level = {
  id: number
  title: string
  signIds: string[] // signs that spawn in the grid
  clearTarget: { signId: string; count: number }
  scoreTarget: number
  moves: number // allowed sign attempts
}

export const levels: Level[] = [
  {
    id: 1,
    title: 'Wavy Hello!',
    signIds: ['hello', 'thank', 'yes', 'no', 'more'],
    clearTarget: { signId: 'hello', count: 20 },
    scoreTarget: 600,
    moves: 20,
  },
  {
    id: 2,
    title: 'Please & Sorry',
    signIds: ['please', 'sorry', 'food', 'water', 'eat'],
    clearTarget: { signId: 'please', count: 15 },
    scoreTarget: 800,
    moves: 18,
  },
  {
    id: 3,
    title: 'Family Circle',
    signIds: ['family', 'mother', 'father', 'name', 'thank'],
    clearTarget: { signId: 'family', count: 12 },
    scoreTarget: 1000,
    moves: 16,
  },
  {
    id: 4,
    title: 'Master Mix',
    signIds: ['hello', 'thank', 'yes', 'no', 'more', 'please', 'sorry', 'water', 'food', 'eat'],
    clearTarget: { signId: 'eat', count: 18 },
    scoreTarget: 1400,
    moves: 24,
  },
]

export const allLevelSigns = (lvl: Level): Sign[] => lvl.signIds.map((id) => signs[id]).filter(Boolean)

// Build a fresh grid filled with random signs from the level.
export function createGrid(lvl: Level): Grid {
  const out: Grid = []
  for (let r = 0; r < ROWS; r++) {
    const row: (Tile | null)[] = []
    for (let c = 0; c < COLS; c++) {
      row.push({ id: nextId(), signId: randomSign(lvl) })
    }
    out.push(row)
  }
  return out
}

export function randomSign(lvl: Level): string {
  return lvl.signIds[Math.floor(Math.random() * lvl.signIds.length)]
}

export function signSetForLevel(lvl: Level): Sign[] {
  return lvl.signIds.map((id) => signs[id]).filter(Boolean)
}

// Find positions (as "r,c" strings) belonging to runs of 3+ same-sign tiles.
export function findMatches(grid: Grid): string[] {
  const hits = new Set<string>()

  // Scan for maximal horizontal runs of 3+
  for (let r = 0; r < ROWS; r++) {
    let c = 0
    while (c < COLS) {
      if (!grid[r][c]) { c++; continue }
      const signId = grid[r][c]!.signId
      let end = c
      while (end + 1 < COLS && grid[r][end + 1]?.signId === signId) end++
      if (end - c + 1 >= 3) {
        for (let k = c; k <= end; k++) hits.add(`${r},${k}`)
      }
      c = end + 1
    }
  }

  // Scan for maximal vertical runs of 3+
  for (let c = 0; c < COLS; c++) {
    let r = 0
    while (r < ROWS) {
      if (!grid[r][c]) { r++; continue }
      const signId = grid[r][c]!.signId
      let end = r
      while (end + 1 < ROWS && grid[end + 1]?.[c]?.signId === signId) end++
      if (end - r + 1 >= 3) {
        for (let k = r; k <= end; k++) hits.add(`${k},${c}`)
      }
      r = end + 1
    }
  }

  return [...hits]
}

// Apply gravity to each column and spawn new tiles at the top.
export function settle(grid: Grid, lvl: Level): Grid {
  const g: Grid = grid.map((row) => row.slice())
  for (let c = 0; c < COLS; c++) {
    const stack: Tile[] = []
    for (let r = ROWS - 1; r >= 0; r--) {
      if (g[r][c]) stack.push(g[r][c]!)
    }
    let r = ROWS - 1
    while (stack.length) {
      g[r][c] = stack.pop()!
      r--
    }
    while (r >= 0) {
      g[r][c] = { id: nextId(), signId: randomSign(lvl) }
      r--
    }
  }
  return g
}
