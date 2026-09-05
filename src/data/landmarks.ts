import { Sign } from './types'

// MediaPipe Hand Landmark indices:
// 0: WRIST, 1-4: THUMB (CMC, MCP, IP, TIP), 5-8: INDEX (MCP, PIP, DIP, TIP),
// 9-12: MIDDLE (MCP, PIP, DIP, TIP), 13-16: RING, 17-20: PINKY

export interface Landmark {
  x: number
  y: number
  z: number
}

// Template landmarks for sign matching.
// Normalized relative coordinates based on the WRIST (index 0) as origin.
//
// ponytail: Simplified heuristic — Euclidean distance on normalized landmarks.
// Upgrade path: trained ML classifier or dynamic time warping for temporal matching.
export const signTemplates: Record<string, Landmark[]> = {
  hello: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.6, y: 0.43, z: 0 }, // 1 thumb_cmc
    { x: 0.65, y: 0.4, z: 0 }, // 2 thumb_mcp
    { x: 0.7, y: 0.38, z: 0 }, // 3 thumb_ip
    { x: 0.78, y: 0.38, z: 0 }, // 4 thumb_tip
    { x: 0.45, y: 0.4, z: 0 }, // 5 index_mcp
    { x: 0.45, y: 0.3, z: 0 }, // 6 index_pip
    { x: 0.45, y: 0.25, z: 0 }, // 7 index_dip
    { x: 0.42, y: 0.22, z: 0 }, // 8 index_tip
    { x: 0.5, y: 0.4, z: 0 }, // 9 middle_mcp
    { x: 0.5, y: 0.3, z: 0 }, // 10 middle_pip
    { x: 0.5, y: 0.25, z: 0 }, // 11 middle_dip
    { x: 0.5, y: 0.22, z: 0 }, // 12 middle_tip
    { x: 0.56, y: 0.4, z: 0 }, // 13 ring_mcp
    { x: 0.56, y: 0.3, z: 0 }, // 14 ring_pip
    { x: 0.56, y: 0.25, z: 0 }, // 15 ring_dip
    { x: 0.58, y: 0.22, z: 0 }, // 16 ring_tip
    { x: 0.62, y: 0.4, z: 0 }, // 17 pinky_mcp
    { x: 0.62, y: 0.3, z: 0 }, // 18 pinky_pip
    { x: 0.62, y: 0.22999999999999998, z: 0 }, // 19 pinky_dip
    { x: 0.66, y: 0.22, z: 0 }, // 20 pinky_tip
  ],
  thank: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.6, y: 0.43, z: 0 }, // 1 thumb_cmc
    { x: 0.65, y: 0.4, z: 0 }, // 2 thumb_mcp
    { x: 0.7, y: 0.38, z: 0 }, // 3 thumb_ip
    { x: 0.42, y: 0.42, z: 0 }, // 4 thumb_tip
    { x: 0.45, y: 0.4, z: 0 }, // 5 index_mcp
    { x: 0.45, y: 0.3, z: 0 }, // 6 index_pip
    { x: 0.45, y: 0.25, z: 0 }, // 7 index_dip
    { x: 0.43, y: 0.23, z: 0 }, // 8 index_tip
    { x: 0.5, y: 0.4, z: 0 }, // 9 middle_mcp
    { x: 0.5, y: 0.3, z: 0 }, // 10 middle_pip
    { x: 0.5, y: 0.25, z: 0 }, // 11 middle_dip
    { x: 0.5, y: 0.23, z: 0 }, // 12 middle_tip
    { x: 0.56, y: 0.4, z: 0 }, // 13 ring_mcp
    { x: 0.56, y: 0.3, z: 0 }, // 14 ring_pip
    { x: 0.56, y: 0.25, z: 0 }, // 15 ring_dip
    { x: 0.58, y: 0.23, z: 0 }, // 16 ring_tip
    { x: 0.62, y: 0.4, z: 0 }, // 17 pinky_mcp
    { x: 0.62, y: 0.3, z: 0 }, // 18 pinky_pip
    { x: 0.62, y: 0.22999999999999998, z: 0 }, // 19 pinky_dip
    { x: 0.66, y: 0.23, z: 0 }, // 20 pinky_tip
  ],
  please: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.42, y: 0.48, z: 0 }, // 1 thumb_cmc
    { x: 0.4, y: 0.46, z: 0 }, // 2 thumb_mcp
    { x: 0.38, y: 0.44, z: 0 }, // 3 thumb_ip
    { x: 0.36, y: 0.42, z: 0 }, // 4 thumb_tip
    { x: 0.48, y: 0.43, z: 0 }, // 5 index_mcp
    { x: 0.47, y: 0.41, z: 0 }, // 6 index_pip
    { x: 0.46, y: 0.4, z: 0 }, // 7 index_dip
    { x: 0.45, y: 0.39, z: 0 }, // 8 index_tip
    { x: 0.52, y: 0.43, z: 0 }, // 9 middle_mcp
    { x: 0.51, y: 0.41, z: 0 }, // 10 middle_pip
    { x: 0.5, y: 0.4, z: 0 }, // 11 middle_dip
    { x: 0.49, y: 0.39, z: 0 }, // 12 middle_tip
    { x: 0.56, y: 0.44, z: 0 }, // 13 ring_mcp
    { x: 0.55, y: 0.42, z: 0 }, // 14 ring_pip
    { x: 0.54, y: 0.41, z: 0 }, // 15 ring_dip
    { x: 0.53, y: 0.4, z: 0 }, // 16 ring_tip
    { x: 0.62, y: 0.45, z: 0 }, // 17 pinky_mcp
    { x: 0.61, y: 0.43, z: 0 }, // 18 pinky_pip
    { x: 0.6, y: 0.42, z: 0 }, // 19 pinky_dip
    { x: 0.59, y: 0.41, z: 0 }, // 20 pinky_tip
  ],
  sorry: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.48, y: 0.46, z: 0 }, // 1 thumb_cmc
    { x: 0.46, y: 0.44, z: 0 }, // 2 thumb_mcp
    { x: 0.44, y: 0.42, z: 0 }, // 3 thumb_ip
    { x: 0.42, y: 0.4, z: 0 }, // 4 thumb_tip
    { x: 0.48, y: 0.43, z: 0 }, // 5 index_mcp
    { x: 0.47, y: 0.41, z: 0 }, // 6 index_pip
    { x: 0.46, y: 0.4, z: 0 }, // 7 index_dip
    { x: 0.45, y: 0.39, z: 0 }, // 8 index_tip
    { x: 0.52, y: 0.43, z: 0 }, // 9 middle_mcp
    { x: 0.51, y: 0.41, z: 0 }, // 10 middle_pip
    { x: 0.5, y: 0.4, z: 0 }, // 11 middle_dip
    { x: 0.49, y: 0.39, z: 0 }, // 12 middle_tip
    { x: 0.56, y: 0.44, z: 0 }, // 13 ring_mcp
    { x: 0.55, y: 0.42, z: 0 }, // 14 ring_pip
    { x: 0.54, y: 0.41, z: 0 }, // 15 ring_dip
    { x: 0.53, y: 0.4, z: 0 }, // 16 ring_tip
    { x: 0.62, y: 0.45, z: 0 }, // 17 pinky_mcp
    { x: 0.61, y: 0.43, z: 0 }, // 18 pinky_pip
    { x: 0.6, y: 0.42, z: 0 }, // 19 pinky_dip
    { x: 0.59, y: 0.41, z: 0 }, // 20 pinky_tip
  ],
  yes: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.42, y: 0.48, z: 0 }, // 1 thumb_cmc
    { x: 0.4, y: 0.46, z: 0 }, // 2 thumb_mcp
    { x: 0.38, y: 0.44, z: 0 }, // 3 thumb_ip
    { x: 0.45, y: 0.42, z: 0 }, // 4 thumb_tip
    { x: 0.48, y: 0.43, z: 0 }, // 5 index_mcp
    { x: 0.47, y: 0.41, z: 0 }, // 6 index_pip
    { x: 0.46, y: 0.4, z: 0 }, // 7 index_dip
    { x: 0.45, y: 0.39, z: 0 }, // 8 index_tip
    { x: 0.52, y: 0.43, z: 0 }, // 9 middle_mcp
    { x: 0.51, y: 0.41, z: 0 }, // 10 middle_pip
    { x: 0.5, y: 0.4, z: 0 }, // 11 middle_dip
    { x: 0.49, y: 0.39, z: 0 }, // 12 middle_tip
    { x: 0.56, y: 0.44, z: 0 }, // 13 ring_mcp
    { x: 0.55, y: 0.42, z: 0 }, // 14 ring_pip
    { x: 0.54, y: 0.41, z: 0 }, // 15 ring_dip
    { x: 0.53, y: 0.4, z: 0 }, // 16 ring_tip
    { x: 0.62, y: 0.45, z: 0 }, // 17 pinky_mcp
    { x: 0.61, y: 0.43, z: 0 }, // 18 pinky_pip
    { x: 0.6, y: 0.42, z: 0 }, // 19 pinky_dip
    { x: 0.59, y: 0.41, z: 0 }, // 20 pinky_tip
  ],
  no: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.4, y: 0.47, z: 0 }, // 1 thumb_cmc
    { x: 0.38, y: 0.44, z: 0 }, // 2 thumb_mcp
    { x: 0.36, y: 0.41000000000000003, z: 0 }, // 3 thumb_ip
    { x: 0.33999999999999997, y: 0.38, z: 0 }, // 4 thumb_tip
    { x: 0.44, y: 0.42, z: 0 }, // 5 index_mcp
    { x: 0.44, y: 0.32, z: 0 }, // 6 index_pip
    { x: 0.44, y: 0.27, z: 0 }, // 7 index_dip
    { x: 0.44, y: 0.2, z: 0 }, // 8 index_tip
    { x: 0.52, y: 0.42, z: 0 }, // 9 middle_mcp
    { x: 0.52, y: 0.32, z: 0 }, // 10 middle_pip
    { x: 0.52, y: 0.27, z: 0 }, // 11 middle_dip
    { x: 0.52, y: 0.2, z: 0 }, // 12 middle_tip
    { x: 0.62, y: 0.47, z: 0 }, // 13 ring_mcp
    { x: 0.61, y: 0.49, z: 0 }, // 14 ring_pip
    { x: 0.6, y: 0.495, z: 0 }, // 15 ring_dip
    { x: 0.59, y: 0.49, z: 0 }, // 16 ring_tip
    { x: 0.6799999999999999, y: 0.48, z: 0 }, // 17 pinky_mcp
    { x: 0.67, y: 0.495, z: 0 }, // 18 pinky_pip
    { x: 0.66, y: 0.498, z: 0 }, // 19 pinky_dip
    { x: 0.65, y: 0.495, z: 0 }, // 20 pinky_tip
  ],
  water: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.58, y: 0.45, z: 0 }, // 1 thumb_cmc
    { x: 0.62, y: 0.44, z: 0 }, // 2 thumb_mcp
    { x: 0.66, y: 0.43, z: 0 }, // 3 thumb_ip
    { x: 0.0, y: 0.0, z: 0.0 }, // 4 thumb_tip
    { x: 0.48, y: 0.42, z: 0 }, // 5 index_mcp
    { x: 0.49, y: 0.35, z: 0 }, // 6 index_pip
    { x: 0.5, y: 0.32, z: 0 }, // 7 index_dip
    { x: 0.52, y: 0.3, z: 0 }, // 8 index_tip
    { x: 0.58, y: 0.42, z: 0 }, // 9 middle_mcp
    { x: 0.58, y: 0.32, z: 0 }, // 10 middle_pip
    { x: 0.58, y: 0.27, z: 0 }, // 11 middle_dip
    { x: 0.58, y: 0.2, z: 0 }, // 12 middle_tip
    { x: 0.66, y: 0.42, z: 0 }, // 13 ring_mcp
    { x: 0.66, y: 0.32, z: 0 }, // 14 ring_pip
    { x: 0.66, y: 0.27, z: 0 }, // 15 ring_dip
    { x: 0.66, y: 0.2, z: 0 }, // 16 ring_tip
    { x: 0.74, y: 0.42, z: 0 }, // 17 pinky_mcp
    { x: 0.74, y: 0.32, z: 0 }, // 18 pinky_pip
    { x: 0.74, y: 0.25, z: 0 }, // 19 pinky_dip
    { x: 0.74, y: 0.2, z: 0 }, // 20 pinky_tip
  ],
  more: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.42, y: 0.47, z: 0 }, // 1 thumb_cmc
    { x: 0.4, y: 0.45, z: 0 }, // 2 thumb_mcp
    { x: 0.38, y: 0.43, z: 0 }, // 3 thumb_ip
    { x: 0.0, y: 0.0, z: 0.0 }, // 4 thumb_tip
    { x: 0.44, y: 0.45, z: 0 }, // 5 index_mcp
    { x: 0.45, y: 0.38, z: 0 }, // 6 index_pip
    { x: 0.46, y: 0.33999999999999997, z: 0 }, // 7 index_dip
    { x: 0.48, y: 0.32, z: 0 }, // 8 index_tip
    { x: 0.52, y: 0.45, z: 0 }, // 9 middle_mcp
    { x: 0.52, y: 0.38, z: 0 }, // 10 middle_pip
    { x: 0.52, y: 0.33999999999999997, z: 0 }, // 11 middle_dip
    { x: 0.52, y: 0.32, z: 0 }, // 12 middle_tip
    { x: 0.58, y: 0.45, z: 0 }, // 13 ring_mcp
    { x: 0.58, y: 0.38, z: 0 }, // 14 ring_pip
    { x: 0.58, y: 0.33999999999999997, z: 0 }, // 15 ring_dip
    { x: 0.58, y: 0.32, z: 0 }, // 16 ring_tip
    { x: 0.64, y: 0.45, z: 0 }, // 17 pinky_mcp
    { x: 0.64, y: 0.38, z: 0 }, // 18 pinky_pip
    { x: 0.64, y: 0.33999999999999997, z: 0 }, // 19 pinky_dip
    { x: 0.64, y: 0.32, z: 0 }, // 20 pinky_tip
  ],
  food: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.6, y: 0.43, z: 0 }, // 1 thumb_cmc
    { x: 0.65, y: 0.4, z: 0 }, // 2 thumb_mcp
    { x: 0.7, y: 0.38, z: 0 }, // 3 thumb_ip
    { x: 0.75, y: 0.4, z: 0 }, // 4 thumb_tip
    { x: 0.45, y: 0.4, z: 0 }, // 5 index_mcp
    { x: 0.45, y: 0.3, z: 0 }, // 6 index_pip
    { x: 0.45, y: 0.25, z: 0 }, // 7 index_dip
    { x: 0.44, y: 0.25, z: 0 }, // 8 index_tip
    { x: 0.45, y: 0.26, z: 0 }, // 9 middle_mcp
    { x: 0.45, y: 0.27, z: 0 }, // 10 middle_pip
    { x: 0.45, y: 0.28, z: 0 }, // 11 middle_dip
    { x: 0.52, y: 0.25, z: 0 }, // 12 middle_tip
    { x: 0.53, y: 0.26, z: 0 }, // 13 ring_mcp
    { x: 0.53, y: 0.27, z: 0 }, // 14 ring_pip
    { x: 0.53, y: 0.28, z: 0 }, // 15 ring_dip
    { x: 0.6, y: 0.25, z: 0 }, // 16 ring_tip
    { x: 0.61, y: 0.26, z: 0 }, // 17 pinky_mcp
    { x: 0.61, y: 0.27, z: 0 }, // 18 pinky_pip
    { x: 0.61, y: 0.28, z: 0 }, // 19 pinky_dip
    { x: 0.66, y: 0.25, z: 0 }, // 20 pinky_tip
  ],
  family: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.42, y: 0.47, z: 0 }, // 1 thumb_cmc
    { x: 0.4, y: 0.44, z: 0 }, // 2 thumb_mcp
    { x: 0.38, y: 0.41, z: 0 }, // 3 thumb_ip
    { x: 0.36, y: 0.38, z: 0 }, // 4 thumb_tip
    { x: 0.44, y: 0.42, z: 0 }, // 5 index_mcp
    { x: 0.43, y: 0.34, z: 0 }, // 6 index_pip
    { x: 0.42, y: 0.28, z: 0 }, // 7 index_dip
    { x: 0.41, y: 0.22, z: 0 }, // 8 index_tip
    { x: 0.52, y: 0.44, z: 0 }, // 9 middle_mcp
    { x: 0.51, y: 0.36, z: 0 }, // 10 middle_pip
    { x: 0.505, y: 0.31, z: 0 }, // 11 middle_dip
    { x: 0.5, y: 0.26, z: 0 }, // 12 middle_tip
    { x: 0.6, y: 0.46, z: 0 }, // 13 ring_mcp
    { x: 0.59, y: 0.42, z: 0 }, // 14 ring_pip
    { x: 0.58, y: 0.39, z: 0 }, // 15 ring_dip
    { x: 0.57, y: 0.36, z: 0 }, // 16 ring_tip
    { x: 0.68, y: 0.48, z: 0 }, // 17 pinky_mcp
    { x: 0.67, y: 0.44, z: 0 }, // 18 pinky_pip
    { x: 0.66, y: 0.41, z: 0 }, // 19 pinky_dip
    { x: 0.65, y: 0.38, z: 0 }, // 20 pinky_tip
  ],
  mother: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.42, y: 0.48, z: 0 }, // 1 thumb_cmc
    { x: 0.4, y: 0.45, z: 0 }, // 2 thumb_mcp
    { x: 0.38, y: 0.42, z: 0 }, // 3 thumb_ip
    { x: 0.36, y: 0.4, z: 0 }, // 4 thumb_tip
    { x: 0.45, y: 0.4, z: 0 }, // 5 index_mcp
    { x: 0.45, y: 0.3, z: 0 }, // 6 index_pip
    { x: 0.45, y: 0.25, z: 0 }, // 7 index_dip
    { x: 0.43, y: 0.25, z: 0 }, // 8 index_tip
    { x: 0.5, y: 0.4, z: 0 }, // 9 middle_mcp
    { x: 0.5, y: 0.3, z: 0 }, // 10 middle_pip
    { x: 0.5, y: 0.25, z: 0 }, // 11 middle_dip
    { x: 0.5, y: 0.25, z: 0 }, // 12 middle_tip
    { x: 0.56, y: 0.4, z: 0 }, // 13 ring_mcp
    { x: 0.56, y: 0.3, z: 0 }, // 14 ring_pip
    { x: 0.56, y: 0.25, z: 0 }, // 15 ring_dip
    { x: 0.58, y: 0.25, z: 0 }, // 16 ring_tip
    { x: 0.62, y: 0.4, z: 0 }, // 17 pinky_mcp
    { x: 0.62, y: 0.3, z: 0 }, // 18 pinky_pip
    { x: 0.62, y: 0.22999999999999998, z: 0 }, // 19 pinky_dip
    { x: 0.66, y: 0.25, z: 0 }, // 20 pinky_tip
  ],
  father: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.4, y: 0.46, z: 0 }, // 1 thumb_cmc
    { x: 0.38, y: 0.44, z: 0 }, // 2 thumb_mcp
    { x: 0.36, y: 0.42, z: 0 }, // 3 thumb_ip
    { x: 0.36, y: 0.42, z: 0 }, // 4 thumb_tip
    { x: 0.45, y: 0.4, z: 0 }, // 5 index_mcp
    { x: 0.45, y: 0.3, z: 0 }, // 6 index_pip
    { x: 0.45, y: 0.25, z: 0 }, // 7 index_dip
    { x: 0.43, y: 0.27, z: 0 }, // 8 index_tip
    { x: 0.5, y: 0.4, z: 0 }, // 9 middle_mcp
    { x: 0.5, y: 0.3, z: 0 }, // 10 middle_pip
    { x: 0.5, y: 0.25, z: 0 }, // 11 middle_dip
    { x: 0.5, y: 0.27, z: 0 }, // 12 middle_tip
    { x: 0.56, y: 0.4, z: 0 }, // 13 ring_mcp
    { x: 0.56, y: 0.3, z: 0 }, // 14 ring_pip
    { x: 0.56, y: 0.25, z: 0 }, // 15 ring_dip
    { x: 0.58, y: 0.27, z: 0 }, // 16 ring_tip
    { x: 0.62, y: 0.4, z: 0 }, // 17 pinky_mcp
    { x: 0.62, y: 0.3, z: 0 }, // 18 pinky_pip
    { x: 0.62, y: 0.22999999999999998, z: 0 }, // 19 pinky_dip
    { x: 0.66, y: 0.27, z: 0 }, // 20 pinky_tip
  ],
  eat: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.6, y: 0.43, z: 0 }, // 1 thumb_cmc
    { x: 0.65, y: 0.4, z: 0 }, // 2 thumb_mcp
    { x: 0.7, y: 0.38, z: 0 }, // 3 thumb_ip
    { x: 0.4, y: 0.38, z: 0 }, // 4 thumb_tip
    { x: 0.45, y: 0.4, z: 0 }, // 5 index_mcp
    { x: 0.45, y: 0.3, z: 0 }, // 6 index_pip
    { x: 0.44, y: 0.2, z: 0 }, // 7 index_dip
    { x: 0.44, y: 0.28, z: 0 }, // 8 index_tip
    { x: 0.5, y: 0.4, z: 0 }, // 9 middle_mcp
    { x: 0.5, y: 0.3, z: 0 }, // 10 middle_pip
    { x: 0.5, y: 0.2, z: 0 }, // 11 middle_dip
    { x: 0.5, y: 0.28, z: 0 }, // 12 middle_tip
    { x: 0.56, y: 0.4, z: 0 }, // 13 ring_mcp
    { x: 0.56, y: 0.3, z: 0 }, // 14 ring_pip
    { x: 0.58, y: 0.2, z: 0 }, // 15 ring_dip
    { x: 0.58, y: 0.28, z: 0 }, // 16 ring_tip
    { x: 0.62, y: 0.4, z: 0 }, // 17 pinky_mcp
    { x: 0.62, y: 0.3, z: 0 }, // 18 pinky_pip
    { x: 0.66, y: 0.2, z: 0 }, // 19 pinky_dip
    { x: 0.66, y: 0.28, z: 0 }, // 20 pinky_tip
  ],
  name: [
    { x: 0.5, y: 0.5, z: 0 }, // 0 wrist
    { x: 0.44, y: 0.47, z: 0 }, // 1 thumb_cmc
    { x: 0.42, y: 0.44, z: 0 }, // 2 thumb_mcp
    { x: 0.4, y: 0.41, z: 0 }, // 3 thumb_ip
    { x: 0.38, y: 0.38, z: 0 }, // 4 thumb_tip
    { x: 0.44, y: 0.42, z: 0 }, // 5 index_mcp
    { x: 0.43, y: 0.3, z: 0 }, // 6 index_pip
    { x: 0.42, y: 0.22, z: 0 }, // 7 index_dip
    { x: 0.41, y: 0.15, z: 0 }, // 8 index_tip
    { x: 0.54, y: 0.44, z: 0 }, // 9 middle_mcp
    { x: 0.53, y: 0.4, z: 0 }, // 10 middle_pip
    { x: 0.53, y: 0.38, z: 0 }, // 11 middle_dip
    { x: 0.53, y: 0.36, z: 0 }, // 12 middle_tip
    { x: 0.62, y: 0.46, z: 0 }, // 13 ring_mcp
    { x: 0.61, y: 0.42, z: 0 }, // 14 ring_pip
    { x: 0.61, y: 0.4, z: 0 }, // 15 ring_dip
    { x: 0.61, y: 0.38, z: 0 }, // 16 ring_tip
    { x: 0.7, y: 0.48, z: 0 }, // 17 pinky_mcp
    { x: 0.69, y: 0.44, z: 0 }, // 18 pinky_pip
    { x: 0.69, y: 0.42, z: 0 }, // 19 pinky_dip
    { x: 0.69, y: 0.4, z: 0 }, // 20 pinky_tip
  ],
}

// Default template for unrecognized signs
const defaultTemplate: Landmark[] = Array(21).fill({ x: 0.5, y: 0.5, z: 0 })

export function getTemplate(signId: string): Landmark[] {
  return signTemplates[signId] ?? defaultTemplate
}

export function getTemplateIds(): string[] {
  return Object.keys(signTemplates)
}

// Compute normalized landmarks (subtract wrist as origin, normalize scale)
export function normalizeLandmarks(landmarks: Landmark[]): Landmark[] {
  if (landmarks.length < 21) return landmarks

  const wrist = landmarks[0]
  const normalized = landmarks.map((lm) => ({
    x: lm.x - wrist.x,
    y: lm.y - wrist.y,
    z: lm.z - wrist.z,
  }))

  const maxDist = Math.max(
    ...normalized.map((lm) => Math.sqrt(lm.x * lm.x + lm.y * lm.y + lm.z * lm.z)),
    0.001
  )

  return normalized.map((lm) => ({
    x: lm.x / maxDist,
    y: lm.y / maxDist,
    z: lm.z / maxDist,
  }))
}

// Match detected landmarks against known sign templates
export function matchSign(landmarks: Landmark[]): { signId: string; confidence: number } | null {
  if (landmarks.length < 21) return null

  const normalized = normalizeLandmarks(landmarks)
  const templateIds = getTemplateIds()

  let bestMatch = { signId: '', confidence: 0 }

  for (const signId of templateIds) {
    const template = getTemplate(signId)
    const templateNorm = normalizeLandmarks(template)

    let totalDistance = 0
    let validPoints = 0

    for (let i = 0; i < Math.min(normalized.length, templateNorm.length); i++) {
      const d = Math.sqrt(
        Math.pow(normalized[i].x - templateNorm[i].x, 2) +
        Math.pow(normalized[i].y - templateNorm[i].y, 2) +
        Math.pow(normalized[i].z - templateNorm[i].z, 2)
      )
      totalDistance += d
      validPoints++
    }

    if (validPoints === 0) continue

    const avgDistance = totalDistance / validPoints
    const confidence = Math.max(0, 1 - avgDistance * 2)

    if (confidence > bestMatch.confidence) {
      bestMatch = { signId, confidence }
    }
  }

  return bestMatch.confidence > 0.3 ? bestMatch : null
}
