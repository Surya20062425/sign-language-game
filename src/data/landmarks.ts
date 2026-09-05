import { Sign } from './types'

// MediaPipe Hand Landmark indices:
// 0: WRIST, 1-4: THUMB (tip=4), 5-8: INDEX (tip=8), 9-12: MIDDLE (tip=12),
// 13-16: RING (tip=16), 17-20: PINKY (tip=20)

export interface Landmark {
  x: number
  y: number
  z: number
}

// Template landmarks for sign matching.
// Normalized relative to WRIST (index 0) as origin.
// Derived from ASL reference diagrams.
//
// ponytail: This is a simplified heuristic matcher — uses Euclidean distance
// on normalized landmarks. Upgrade path: train a proper classifier model
// or use a larger reference dataset for each sign.
export const signTemplates: Record<string, Landmark[]> = {
  hello: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.6, y: 0.4, z: 0 },    // 1  thumb mcp
    { x: 0.7, y: 0.35, z: 0 },   // 2  thumb ip
    { x: 0.8, y: 0.35, z: 0 },   // 3  thumb tip
    { x: 0.45, y: 0.4, z: 0 },   // 4  index mcp
    { x: 0.45, y: 0.3, z: 0 },   // 5  index pip
    { x: 0.45, y: 0.25, z: 0 },  // 6  index dip
    { x: 0.45, y: 0.2, z: 0 },   // 7  index tip
    { x: 0.55, y: 0.4, z: 0 },   // 8  middle mcp
    { x: 0.55, y: 0.28, z: 0 },  // 9  middle pip
    { x: 0.55, y: 0.2, z: 0 },   // 10 middle tip
    { x: 0.65, y: 0.4, z: 0 },   // 11 ring mcp
    { x: 0.65, y: 0.3, z: 0 },   // 12 ring pip
    { x: 0.65, y: 0.22, z: 0 },  // 13 ring dip
    { x: 0.65, y: 0.18, z: 0 },  // 14 ring tip
    { x: 0.75, y: 0.4, z: 0 },   // 15 pinky mcp
    { x: 0.75, y: 0.32, z: 0 },  // 16 pinky pip
    { x: 0.75, y: 0.27, z: 0 },  // 17 pinky dip
    { x: 0.75, y: 0.23, z: 0 },  // 18 pinky tip
    { x: 0.55, y: 0.42, z: 0 },  // 19 thumb ip2 (extra)
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2 (extra)
  ],
  thank: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.58, y: 0.42, z: 0 },  // 1  thumb mcp — hand tilted slightly
    { x: 0.66, y: 0.38, z: 0 },  // 2  thumb ip
    { x: 0.74, y: 0.38, z: 0 },  // 3  thumb tip — extended
    { x: 0.42, y: 0.4, z: 0 },   // 4  index mcp
    { x: 0.4, y: 0.3, z: 0 },    // 5  index pip
    { x: 0.39, y: 0.24, z: 0 },  // 6  index dip
    { x: 0.38, y: 0.18, z: 0 },  // 7  index tip — extended (tilted hand)
    { x: 0.52, y: 0.4, z: 0 },   // 8  middle mcp
    { x: 0.5, y: 0.28, z: 0 },   // 9  middle pip
    { x: 0.49, y: 0.2, z: 0 },   // 10 middle tip — extended
    { x: 0.62, y: 0.4, z: 0 },   // 11 ring mcp
    { x: 0.6, y: 0.3, z: 0 },    // 12 ring pip
    { x: 0.59, y: 0.22, z: 0 },  // 13 ring dip
    { x: 0.58, y: 0.18, z: 0 },  // 14 ring tip — extended
    { x: 0.72, y: 0.4, z: 0 },   // 15 pinky mcp
    { x: 0.7, y: 0.32, z: 0 },   // 16 pinky pip
    { x: 0.69, y: 0.27, z: 0 },  // 17 pinky dip
    { x: 0.68, y: 0.23, z: 0 },  // 18 pinky tip — extended
    { x: 0.53, y: 0.42, z: 0 },  // 19 thumb ip2
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2
  ],
  please: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.45, y: 0.45, z: 0 },  // 1  thumb mcp — folded
    { x: 0.42, y: 0.42, z: 0 },  // 2  thumb ip
    { x: 0.4, y: 0.4, z: 0 },    // 3  thumb tip — tucked
    { x: 0.48, y: 0.45, z: 0 },  // 4  index mcp — curled
    { x: 0.47, y: 0.44, z: 0 },  // 5  index pip
    { x: 0.46, y: 0.43, z: 0 },  // 6  index dip
    { x: 0.45, y: 0.43, z: 0 },  // 7  index tip — curled
    { x: 0.52, y: 0.45, z: 0 },  // 8  middle mcp — curled
    { x: 0.51, y: 0.44, z: 0 },  // 9  middle pip
    { x: 0.5, y: 0.43, z: 0 },   // 10 middle tip — curled
    { x: 0.58, y: 0.46, z: 0 },  // 11 ring mcp — curled
    { x: 0.57, y: 0.45, z: 0 },  // 12 ring pip
    { x: 0.56, y: 0.44, z: 0 },  // 13 ring dip
    { x: 0.55, y: 0.44, z: 0 },  // 14 ring tip — curled
    { x: 0.63, y: 0.47, z: 0 },  // 15 pinky mcp — curled
    { x: 0.62, y: 0.46, z: 0 },  // 16 pinky pip
    { x: 0.61, y: 0.45, z: 0 },  // 17 pinky dip
    { x: 0.6, y: 0.45, z: 0 },   // 18 pinky tip — curled
    { x: 0.5, y: 0.5, z: 0 },    // 19 thumb ip2
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2
  ],
  sorry: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.42, y: 0.48, z: 0 },  // 1  thumb mcp
    { x: 0.38, y: 0.45, z: 0 },  // 2  thumb ip
    { x: 0.35, y: 0.42, z: 0 },  // 3  thumb tip — extended (fist nodding)
    { x: 0.48, y: 0.45, z: 0 },  // 4  index mcp — curled into fist
    { x: 0.47, y: 0.44, z: 0 },  // 5  index pip
    { x: 0.46, y: 0.43, z: 0 },  // 6  index dip
    { x: 0.45, y: 0.43, z: 0 },  // 7  index tip — curled
    { x: 0.52, y: 0.45, z: 0 },  // 8  middle mcp — curled
    { x: 0.51, y: 0.44, z: 0 },  // 9  middle pip
    { x: 0.5, y: 0.43, z: 0 },   // 10 middle tip — curled
    { x: 0.58, y: 0.46, z: 0 },  // 11 ring mcp — curled
    { x: 0.57, y: 0.45, z: 0 },  // 12 ring pip
    { x: 0.56, y: 0.44, z: 0 },  // 13 ring dip
    { x: 0.55, y: 0.44, z: 0 },  // 14 ring tip — curled
    { x: 0.63, y: 0.47, z: 0 },  // 15 pinky mcp — curled
    { x: 0.62, y: 0.46, z: 0 },  // 16 pinky pip
    { x: 0.61, y: 0.45, z: 0 },  // 17 pinky dip
    { x: 0.6, y: 0.45, z: 0 },   // 18 pinky tip — curled
    { x: 0.42, y: 0.43, z: 0 },  // 19 thumb ip2
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2
  ],
  yes: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.42, y: 0.45, z: 0 },  // 1  thumb mcp — across index
    { x: 0.4, y: 0.44, z: 0 },   // 2  thumb ip
    { x: 0.38, y: 0.44, z: 0 },  // 3  thumb tip — tucked (fist)
    { x: 0.48, y: 0.42, z: 0 },  // 4  index mcp — folded
    { x: 0.47, y: 0.42, z: 0 },  // 5  index pip
    { x: 0.46, y: 0.42, z: 0 },  // 6  index dip
    { x: 0.45, y: 0.42, z: 0 },  // 7  index tip — folded
    { x: 0.52, y: 0.42, z: 0 },  // 8  middle mcp — folded
    { x: 0.51, y: 0.42, z: 0 },  // 9  middle pip
    { x: 0.5, y: 0.42, z: 0 },   // 10 middle tip — folded
    { x: 0.58, y: 0.43, z: 0 },  // 11 ring mcp — folded
    { x: 0.57, y: 0.42, z: 0 },  // 12 ring pip
    { x: 0.56, y: 0.42, z: 0 },  // 13 ring dip
    { x: 0.55, y: 0.42, z: 0 },  // 14 ring tip — folded
    { x: 0.63, y: 0.44, z: 0 },  // 15 pinky mcp — folded
    { x: 0.62, y: 0.43, z: 0 },  // 16 pinky pip
    { x: 0.61, y: 0.43, z: 0 },  // 17 pinky dip
    { x: 0.6, y: 0.43, z: 0 },   // 18 pinky tip — folded
    { x: 0.5, y: 0.5, z: 0 },    // 19 thumb ip2
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2
  ],
  no: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.4, y: 0.45, z: 0 },   // 1  thumb mcp
    { x: 0.35, y: 0.42, z: 0 },  // 2  thumb ip
    { x: 0.32, y: 0.4, z: 0 },   // 3  thumb tip — tucked
    { x: 0.48, y: 0.3, z: 0 },   // 4  index mcp — extended UP
    { x: 0.47, y: 0.25, z: 0 },  // 5  index pip
    { x: 0.46, y: 0.2, z: 0 },   // 6  index dip
    { x: 0.45, y: 0.15, z: 0 },  // 7  index tip — extended UP
    { x: 0.52, y: 0.3, z: 0 },   // 8  middle mcp — extended UP
    { x: 0.51, y: 0.24, z: 0 },  // 9  middle pip
    { x: 0.5, y: 0.17, z: 0 },   // 10 middle tip — extended UP
    { x: 0.62, y: 0.45, z: 0 },  // 11 ring mcp — folded
    { x: 0.61, y: 0.43, z: 0 },  // 12 ring pip
    { x: 0.6, y: 0.42, z: 0 },   // 13 ring dip
    { x: 0.59, y: 0.42, z: 0 },  // 14 ring tip — folded
    { x: 0.7, y: 0.46, z: 0 },   // 15 pinky mcp — folded
    { x: 0.69, y: 0.45, z: 0 },  // 16 pinky pip
    { x: 0.68, y: 0.44, z: 0 },  // 17 pinky dip
    { x: 0.67, y: 0.44, z: 0 },  // 18 pinky tip — folded
    { x: 0.5, y: 0.5, z: 0 },    // 19 thumb ip2
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2
  ],
  water: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.6, y: 0.4, z: 0 },    // 1  thumb mcp
    { x: 0.7, y: 0.35, z: 0 },   // 2  thumb ip
    { x: 0.78, y: 0.35, z: 0 },  // 3  thumb tip — extended
    { x: 0.45, y: 0.4, z: 0 },   // 4  index mcp
    { x: 0.45, y: 0.3, z: 0 },   // 5  index pip
    { x: 0.45, y: 0.25, z: 0 },  // 6  index dip
    { x: 0.43, y: 0.35, z: 0 },  // 7  index tip — pinched (near thumb tip)
    { x: 0.55, y: 0.45, z: 0 },  // 8  middle mcp — extended
    { x: 0.55, y: 0.32, z: 0 },  // 9  middle pip
    { x: 0.55, y: 0.2, z: 0 },   // 10 middle tip — extended
    { x: 0.65, y: 0.45, z: 0 },  // 11 ring mcp — extended
    { x: 0.65, y: 0.32, z: 0 },  // 12 ring pip
    { x: 0.65, y: 0.22, z: 0 },  // 13 ring dip
    { x: 0.65, y: 0.15, z: 0 },  // 14 ring tip — extended
    { x: 0.75, y: 0.47, z: 0 },  // 15 pinky mcp — extended
    { x: 0.75, y: 0.35, z: 0 },  // 16 pinky pip
    { x: 0.75, y: 0.28, z: 0 },  // 17 pinky dip
    { x: 0.75, y: 0.22, z: 0 },  // 18 pinky tip — extended
    { x: 0.55, y: 0.42, z: 0 },  // 19 thumb ip2
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2
  ],
  // --- Additional signs ---
  more: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.5, y: 0.45, z: 0 },   // 1  thumb mcp
    { x: 0.5, y: 0.4, z: 0 },    // 2  thumb ip
    { x: 0.5, y: 0.35, z: 0 },   // 3  thumb tip — fingertips together (both hands)
    { x: 0.4, y: 0.4, z: 0 },    // 4  index mcp
    { x: 0.4, y: 0.3, z: 0 },    // 5  index pip
    { x: 0.4, y: 0.25, z: 0 },   // 6  index dip
    { x: 0.4, y: 0.2, z: 0 },    // 7  index tip — fingertips together
    { x: 0.6, y: 0.4, z: 0 },    // 8  middle mcp
    { x: 0.6, y: 0.3, z: 0 },    // 9  middle pip
    { x: 0.6, y: 0.25, z: 0 },   // 10 middle tip
    { x: 0.7, y: 0.45, z: 0 },   // 11 ring mcp — curled
    { x: 0.69, y: 0.42, z: 0 },  // 12 ring ip
    { x: 0.68, y: 0.41, z: 0 },  // 13 ring dip
    { x: 0.67, y: 0.4, z: 0 },   // 14 ring tip — curled
    { x: 0.8, y: 0.47, z: 0 },   // 15 pinky mcp — curled
    { x: 0.79, y: 0.44, z: 0 },  // 16 pinky ip
    { x: 0.78, y: 0.43, z: 0 },  // 17 pinky dip
    { x: 0.77, y: 0.42, z: 0 },  // 18 pinky tip — curled
    { x: 0.5, y: 0.42, z: 0 },   // 19 thumb ip2
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2
  ],
  food: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.5, y: 0.45, z: 0 },   // 1  thumb mcp
    { x: 0.5, y: 0.42, z: 0 },   // 2  thumb ip
    { x: 0.5, y: 0.4, z: 0 },    // 3  thumb tip — slightly extended
    { x: 0.45, y: 0.4, z: 0 },   // 4  index mcp
    { x: 0.43, y: 0.35, z: 0 },  // 5  index pip
    { x: 0.41, y: 0.3, z: 0 },   // 6  index dip
    { x: 0.4, y: 0.26, z: 0 },   // 7  index tip — fingertips to mouth area
    { x: 0.55, y: 0.4, z: 0 },   // 8  middle mcp
    { x: 0.54, y: 0.34, z: 0 },  // 9  middle pip
    { x: 0.53, y: 0.29, z: 0 },  // 10 middle dip
    { x: 0.52, y: 0.25, z: 0 },  // 11 middle tip
    { x: 0.65, y: 0.45, z: 0 },  // 12 ring mcp
    { x: 0.64, y: 0.38, z: 0 },  // 13 ring pip
    { x: 0.63, y: 0.32, z: 0 },  // 14 ring dip
    { x: 0.62, y: 0.28, z: 0 },  // 15 ring tip
    { x: 0.75, y: 0.47, z: 0 },  // 16 pinky mcp
    { x: 0.74, y: 0.4, z: 0 },   // 17 pinky pip
    { x: 0.73, y: 0.32, z: 0 },  // 18 pinky tip
    { x: 0.72, y: 0.28, z: 0 },  // 19 pinky tip2
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2
  ],
  family: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.6, y: 0.4, z: 0 },    // 1  thumb mcp
    { x: 0.7, y: 0.35, z: 0 },   // 2  thumb ip
    { x: 0.8, y: 0.35, z: 0 },   // 3  thumb tip — extended
    { x: 0.45, y: 0.4, z: 0 },   // 4  index mcp
    { x: 0.45, y: 0.3, z: 0 },   // 5  index pip
    { x: 0.45, y: 0.25, z: 0 },  // 6  index dip
    { x: 0.45, y: 0.2, z: 0 },   // 7  index tip — extended
    { x: 0.55, y: 0.4, z: 0 },   // 8  middle mcp
    { x: 0.55, y: 0.28, z: 0 },  // 9  middle pip
    { x: 0.55, y: 0.2, z: 0 },   // 10 middle tip — extended
    { x: 0.65, y: 0.4, z: 0 },   // 11 ring mcp
    { x: 0.65, y: 0.3, z: 0 },   // 12 ring pip
    { x: 0.65, y: 0.22, z: 0 },  // 13 ring dip
    { x: 0.65, y: 0.18, z: 0 },  // 14 ring tip — extended
    { x: 0.75, y: 0.4, z: 0 },   // 15 pinky mcp
    { x: 0.75, y: 0.32, z: 0 },  // 16 pinky pip
    { x: 0.75, y: 0.27, z: 0 },  // 17 pinky dip
    { x: 0.75, y: 0.23, z: 0 },  // 18 pinky tip — extended
    { x: 0.55, y: 0.42, z: 0 },  // 19 thumb ip2
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2
  ],
  mother: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.5, y: 0.4, z: 0 },    // 1  thumb mcp — resting
    { x: 0.5, y: 0.38, z: 0 },   // 2  thumb ip
    { x: 0.5, y: 0.36, z: 0 },   // 3  thumb tip — flat (tucked under)
    { x: 0.45, y: 0.4, z: 0 },   // 4  index mcp
    { x: 0.45, y: 0.32, z: 0 },  // 5  index pip
    { x: 0.45, y: 0.26, z: 0 },  // 6  index dip
    { x: 0.45, y: 0.2, z: 0 },   // 7  index tip — extended (flat hand to chin)
    { x: 0.55, y: 0.4, z: 0 },   // 8  middle mcp
    { x: 0.55, y: 0.32, z: 0 },  // 9  middle pip
    { x: 0.55, y: 0.2, z: 0 },   // 10 middle tip — extended
    { x: 0.65, y: 0.4, z: 0 },   // 11 ring mcp
    { x: 0.65, y: 0.3, z: 0 },   // 12 ring pip
    { x: 0.65, y: 0.25, z: 0 },  // 13 ring dip
    { x: 0.65, y: 0.18, z: 0 },  // 14 ring tip — extended
    { x: 0.75, y: 0.42, z: 0 },  // 15 pinky mcp
    { x: 0.75, y: 0.34, z: 0 },  // 16 pinky pip
    { x: 0.75, y: 0.29, z: 0 },  // 17 pinky dip
    { x: 0.75, y: 0.23, z: 0 },  // 18 pinky tip — extended
    { x: 0.52, y: 0.42, z: 0 },  // 19 thumb ip2
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2
  ],
  father: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.5, y: 0.4, z: 0 },    // 1  thumb mcp — resting
    { x: 0.5, y: 0.38, z: 0 },   // 2  thumb ip
    { x: 0.5, y: 0.36, z: 0 },   // 3  thumb tip — flat (forehead position)
    { x: 0.45, y: 0.4, z: 0 },   // 4  index mcp
    { x: 0.45, y: 0.32, z: 0 },  // 5  index pip
    { x: 0.45, y: 0.26, z: 0 },  // 6  index dip
    { x: 0.45, y: 0.2, z: 0 },   // 7  index tip — extended
    { x: 0.55, y: 0.4, z: 0 },   // 8  middle mcp
    { x: 0.55, y: 0.32, z: 0 },  // 9  middle pip
    { x: 0.55, y: 0.2, z: 0 },   // 10 middle tip — extended
    { x: 0.65, y: 0.4, z: 0 },   // 11 ring mcp
    { x: 0.65, y: 0.3, z: 0 },   // 12 ring pip
    { x: 0.65, y: 0.25, z: 0 },  // 13 ring dip
    { x: 0.65, y: 0.18, z: 0 },  // 14 ring tip — extended
    { x: 0.75, y: 0.42, z: 0 },  // 15 pinky mcp
    { x: 0.75, y: 0.34, z: 0 },  // 16 pinky pip
    { x: 0.75, y: 0.29, z: 0 },  // 17 pinky dip
    { x: 0.75, y: 0.23, z: 0 },  // 18 pinky tip — extended
    { x: 0.52, y: 0.42, z: 0 },  // 19 thumb ip2
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2
  ],
  eat: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.5, y: 0.45, z: 0 },   // 1  thumb mcp
    { x: 0.5, y: 0.4, z: 0 },    // 2  thumb ip
    { x: 0.5, y: 0.36, z: 0 },   // 3  thumb tip — slightly curled
    { x: 0.45, y: 0.4, z: 0 },   // 4  index mcp
    { x: 0.43, y: 0.3, z: 0 },   // 5  index pip
    { x: 0.41, y: 0.24, z: 0 },  // 6  index dip
    { x: 0.4, y: 0.18, z: 0 },   // 7  index tip — fingertips to mouth, slightly curled
    { x: 0.55, y: 0.4, z: 0 },   // 8  middle mcp
    { x: 0.54, y: 0.3, z: 0 },   // 9  middle pip
    { x: 0.53, y: 0.25, z: 0 },  // 10 middle dip
    { x: 0.52, y: 0.2, z: 0 },   // 11 middle tip
    { x: 0.65, y: 0.45, z: 0 },  // 12 ring mcp
    { x: 0.64, y: 0.35, z: 0 },  // 13 ring pip
    { x: 0.63, y: 0.3, z: 0 },   // 14 ring dip
    { x: 0.62, y: 0.27, z: 0 },  // 15 ring tip
    { x: 0.75, y: 0.47, z: 0 },  // 16 pinky mcp
    { x: 0.74, y: 0.38, z: 0 },  // 17 pinky pip
    { x: 0.73, y: 0.32, z: 0 },  // 18 pinky dip
    { x: 0.72, y: 0.28, z: 0 },  // 19 pinky tip
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2
  ],
  name: [
    { x: 0.5, y: 0.5, z: 0 },    // 0  wrist
    { x: 0.5, y: 0.45, z: 0 },   // 1  thumb mcp
    { x: 0.5, y: 0.4, z: 0 },    // 2  thumb ip
    { x: 0.5, y: 0.37, z: 0 },   // 3  thumb tip — slightly extended
    { x: 0.45, y: 0.4, z: 0 },   // 4  index mcp
    { x: 0.43, y: 0.32, z: 0 },  // 5  index pip
    { x: 0.41, y: 0.26, z: 0 },  // 6  index dip
    { x: 0.4, y: 0.22, z: 0 },   // 7  index tip — fingertips tapping chest then extending
    { x: 0.55, y: 0.4, z: 0 },   // 8  middle mcp
    { x: 0.54, y: 0.32, z: 0 },  // 9  middle pip
    { x: 0.53, y: 0.26, z: 0 },  // 10 middle tip
    { x: 0.65, y: 0.45, z: 0 },  // 11 ring mcp
    { x: 0.64, y: 0.35, z: 0 },  // 12 ring pip
    { x: 0.63, y: 0.3, z: 0 },   // 13 ring tip
    { x: 0.62, y: 0.26, z: 0 },  // 14 ring tip2
    { x: 0.75, y: 0.47, z: 0 },  // 15 pinky mcp
    { x: 0.74, y: 0.38, z: 0 },  // 16 pinky pip
    { x: 0.73, y: 0.32, z: 0 },  // 17 pinky dip
    { x: 0.72, y: 0.28, z: 0 },  // 18 pinky tip
    { x: 0.52, y: 0.42, z: 0 },  // 19 thumb ip2
    { x: 0.5, y: 0.5, z: 0 },    // 20 pinky tip2
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

  // Normalize by max distance from wrist
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
// ponytail: simple Euclidean distance matcher. Upgrade to a trained ML model
// or dynamic time warping for temporal gesture matching.
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
