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
// These are normalized relative coordinates based on the WRIST (index 0)
// as origin, scaled to 0-1 range. Derived from ASL reference diagrams.
//
// ponytail: This is a simplified heuristic matcher — uses Euclidean distance
// on normalized landmarks. Upgrade path: train a proper classifier model
// or use a larger reference dataset for each sign.
export const signTemplates: Record<string, Landmark[]> = {
  hello: [
    // Hand waving — open hand, fingers extended, thumb out
    { x: 0.5, y: 0.5, z: 0 },   // wrist
    { x: 0.6, y: 0.4, z: 0 },   // thumb mcp
    { x: 0.7, y: 0.35, z: 0 },  // thumb ip
    { x: 0.8, y: 0.35, z: 0 },  // thumb tip
    { x: 0.45, y: 0.4, z: 0 },  // index mcp
    { x: 0.45, y: 0.3, z: 0 },  // index pip
    { x: 0.45, y: 0.25, z: 0 },  // index dip
    { x: 0.45, y: 0.2, z: 0 },   // index tip
    { x: 0.55, y: 0.4, z: 0 },   // middle mcp
    { x: 0.55, y: 0.28, z: 0 },  // middle pip
    { x: 0.55, y: 0.2, z: 0 },   // middle tip
    { x: 0.65, y: 0.4, z: 0 },   // ring mcp
    { x: 0.65, y: 0.3, z: 0 },   // ring pip
    { x: 0.65, y: 0.22, z: 0 },  // ring dip
    { x: 0.65, y: 0.18, z: 0 },  // ring tip
    { x: 0.75, y: 0.4, z: 0 },   // pinky mcp
    { x: 0.75, y: 0.32, z: 0 },  // pinky pip
    { x: 0.75, y: 0.27, z: 0 },  // pinky dip
    { x: 0.75, y: 0.23, z: 0 },  // pinky tip
    { x: 0.5, y: 0.5, z: 0 },    // pinky tip (base for reference)
    { x: 0.5, y: 0.5, z: 0 },    // placeholder
  ],
  // Fist-based signs (more, eat, please, sorry)
  please: [
    { x: 0.5, y: 0.5, z: 0 },   // wrist
    { x: 0.45, y: 0.45, z: 0 }, // thumb folded over
    { x: 0.42, y: 0.42, z: 0 },
    { x: 0.4, y: 0.4, z: 0 },   // thumb tip tucked
    { x: 0.48, y: 0.45, z: 0 }, // index curled
    { x: 0.47, y: 0.44, z: 0 },
    { x: 0.46, y: 0.43, z: 0 },
    { x: 0.45, y: 0.43, z: 0 }, // index tip curled
    { x: 0.52, y: 0.45, z: 0 }, // middle curled
    { x: 0.51, y: 0.44, z: 0 },
    { x: 0.5, y: 0.43, z: 0 },  // middle tip curled
    { x: 0.58, y: 0.46, z: 0 }, // ring curled
    { x: 0.57, y: 0.45, z: 0 },
    { x: 0.56, y: 0.44, z: 0 },
    { x: 0.55, y: 0.44, z: 0 }, // ring tip curled
    { x: 0.63, y: 0.47, z: 0 }, // pinky curled
    { x: 0.62, y: 0.46, z: 0 },
    { x: 0.61, y: 0.45, z: 0 },
    { x: 0.6, y: 0.45, z: 0 },  // pinky tip curled
    { x: 0.5, y: 0.5, z: 0 },    // pinky tip (base)
    { x: 0.5, y: 0.5, z: 0 },    // placeholder
  ],
  // Yes: fist nodding
  yes: [
    { x: 0.5, y: 0.5, z: 0 },   // wrist
    { x: 0.42, y: 0.45, z: 0 }, // thumb across index
    { x: 0.4, y: 0.44, z: 0 },
    { x: 0.38, y: 0.44, z: 0 }, // thumb tip
    { x: 0.48, y: 0.42, z: 0 }, // index folded over thumb
    { x: 0.47, y: 0.42, z: 0 },
    { x: 0.46, y: 0.42, z: 0 },
    { x: 0.45, y: 0.42, z: 0 },
    { x: 0.52, y: 0.42, z: 0 }, // middle folded
    { x: 0.51, y: 0.42, z: 0 },
    { x: 0.5, y: 0.42, z: 0 },
    { x: 0.58, y: 0.43, z: 0 }, // ring folded
    { x: 0.57, y: 0.42, z: 0 },
    { x: 0.56, y: 0.42, z: 0 },
    { x: 0.55, y: 0.42, z: 0 },
    { x: 0.63, y: 0.44, z: 0 }, // pinky folded
    { x: 0.62, y: 0.43, z: 0 },
    { x: 0.61, y: 0.43, z: 0 },
    { x: 0.6, y: 0.43, z: 0 },
    { x: 0.5, y: 0.5, z: 0 },
    { x: 0.5, y: 0.5, z: 0 },
  ],
  // No: index and middle extended, tap thumb
  no: [
    { x: 0.5, y: 0.5, z: 0 },   // wrist
    { x: 0.4, y: 0.45, z: 0 },  // thumb across
    { x: 0.35, y: 0.42, z: 0 },
    { x: 0.32, y: 0.4, z: 0 },  // thumb tip
    { x: 0.48, y: 0.3, z: 0 },  // index extended UP
    { x: 0.47, y: 0.25, z: 0 },
    { x: 0.46, y: 0.2, z: 0 },
    { x: 0.45, y: 0.15, z: 0 },  // index tip UP
    { x: 0.52, y: 0.3, z: 0 },  // middle extended UP
    { x: 0.51, y: 0.24, z: 0 },
    { x: 0.5, y: 0.17, z: 0 },
    { x: 0.62, y: 0.45, z: 0 }, // ring folded
    { x: 0.61, y: 0.43, z: 0 },
    { x: 0.6, y: 0.42, z: 0 },
    { x: 0.59, y: 0.42, z: 0 },
    { x: 0.7, y: 0.46, z: 0 },  // pinky folded
    { x: 0.69, y: 0.45, z: 0 },
    { x: 0.68, y: 0.44, z: 0 },
    { x: 0.67, y: 0.44, z: 0 },
    { x: 0.5, y: 0.5, z: 0 },
    { x: 0.5, y: 0.5, z: 0 },
  ],
  // Water: pinch thumb + index
  water: [
    { x: 0.5, y: 0.5, z: 0 },   // wrist
    { x: 0.6, y: 0.4, z: 0 },   // thumb
    { x: 0.7, y: 0.35, z: 0 },
    { x: 0.78, y: 0.35, z: 0 }, // thumb tip
    { x: 0.45, y: 0.4, z: 0 },  // index
    { x: 0.45, y: 0.3, z: 0 },
    { x: 0.45, y: 0.25, z: 0 },
    { x: 0.43, y: 0.35, z: 0 },  // index tip near thumb tip
    { x: 0.55, y: 0.45, z: 0 },  // other fingers extended
    { x: 0.55, y: 0.32, z: 0 },
    { x: 0.55, y: 0.2, z: 0 },
    { x: 0.65, y: 0.45, z: 0 },
    { x: 0.65, y: 0.32, z: 0 },
    { x: 0.65, y: 0.22, z: 0 },
    { x: 0.65, y: 0.15, z: 0 },
    { x: 0.75, y: 0.47, z: 0 },
    { x: 0.75, y: 0.35, z: 0 },
    { x: 0.75, y: 0.28, z: 0 },
    { x: 0.75, y: 0.22, z: 0 },
    { x: 0.5, y: 0.5, z: 0 },
    { x: 0.5, y: 0.5, z: 0 },
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

  // Normalize by the max distance from wrist
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
    // Convert distance to confidence (0-1, lower distance = higher confidence)
    const confidence = Math.max(0, 1 - avgDistance * 2)

    if (confidence > bestMatch.confidence) {
      bestMatch = { signId, confidence }
    }
  }

  return bestMatch.confidence > 0.3 ? bestMatch : null
}
