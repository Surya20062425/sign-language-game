import { useState, useRef, useEffect } from 'react'
import { Camera, CameraOff, RefreshCw, Trophy, Star } from 'lucide-react'
import { Hands, type Results, HAND_CONNECTIONS } from '@mediapipe/hands'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { signs } from '../data'
import type { Sign } from '../data/types'
import { matchSign, Landmark } from '../data/landmarks'
import {
  createGrid,
  type Grid,
  type Tile,
  type Level,
  levels,
} from '../lib/match3'
import { removeSign } from '../lib/gameEngine'

export function Practice() {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
  const [grid, setGrid] = useState<Grid>(() => createGrid(levels[0]))
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(levels[0].moves)
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isModelReady, setIsModelReady] = useState(false)
  const [detectedSign, setDetectedSign] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(0)
  const [shatteredTiles, setShatteredTiles] = useState<ShatterParticle[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handsRef = useRef<Hands | null>(null)
  const animationRef = useRef<number | null>(null)
  const detectionCooldownRef = useRef(false)

  const level: Level = levels[currentLevelIdx]

  useEffect(() => {
    let stream: MediaStream | null = null
    let hands: Hands | null = null

    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }

        setHasPermission(true)
        setCameraError(null)

        hands = new Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`
          },
        })

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        })

        hands.onResults(onResults)
        handsRef.current = hands
        setIsModelReady(true)

        const processFrame = async () => {
          if (videoRef.current && handsRef.current && videoRef.current.readyState >= 2) {
            await handsRef.current.send({ image: videoRef.current })
          }
          animationRef.current = requestAnimationFrame(processFrame)
        }
        processFrame()
      } catch {
        setCameraError('Camera access denied. Please allow camera permissions.')
        setHasPermission(false)
      }
    }

    const onResults = (results: Results) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = videoRef.current?.videoWidth || 640
      canvas.height = videoRef.current?.videoHeight || 480

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      }

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#0ea5e2', lineWidth: 2 })
        drawLandmarks(ctx, landmarks, { color: '#ef4444', lineWidth: 1 })

        if (!detectionCooldownRef.current && moves > 0 && !showLevelComplete) {
          const ourLandmarks: Landmark[] = landmarks.map((lm) => ({ x: lm.x, y: lm.y, z: lm.z }))
          const match = matchSign(ourLandmarks)

          if (match && level.signIds.includes(match.signId)) {
            setDetectedSign(match.signId)
            setConfidence(match.confidence)
            detectionCooldownRef.current = true

            // Animate: shatter particles on matching tiles
            const matchingTiles = getShatterTiles(grid, match.signId)
            if (matchingTiles.length > 0) {
              setShatteredTiles(createShatterParticles(matchingTiles))
            }

            // Apply the sign removal with cascade
            const result = removeSign(grid, match.signId, level)
            setGrid(result.grid)
            setScore((s) => s + result.score)
            setMoves((m) => m - 1)
            setDetectedSign(null)
            setConfidence(0)

            // Re-collapse any pre-existing matches from cascade
            setTimeout(() => {
              detectionCooldownRef.current = false
            }, 300)
          } else {
            setDetectedSign(match?.signId ?? null)
            setConfidence(match?.confidence ?? 0)
          }
        }
      } else {
        setDetectedSign(null)
        setConfidence(0)
      }
    }

    setupCamera()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (hands) hands.close()
      if (stream) stream.getTracks().forEach((t) => t.stop())
    }
  }, [currentLevelIdx, moves, grid, showLevelComplete, level])

  useEffect(() => {
    if (moves <= 0 && !showLevelComplete) {
      setShowLevelComplete(true)
    }
  }, [moves, showLevelComplete])

  const handleRestart = () => {
    setGrid(createGrid(level))
    setScore(0)
    setMoves(level.moves)
    setShowLevelComplete(false)
    setShatteredTiles([])
  }

  const handleNextLevel = () => {
    if (currentLevelIdx < levels.length - 1) {
      setCurrentLevelIdx((i) => i + 1)
      setGrid(createGrid(levels[currentLevelIdx + 1]))
      setScore(0)
      setMoves(levels[currentLevelIdx + 1].moves)
      setShowLevelComplete(false)
      setShatteredTiles([])
    }
  }

  const starsEarned = score >= level.scoreTarget * 0.66 ? 3 : score >= level.scoreTarget * 0.33 ? 2 : 1

  const clearTargetCount = getClearTargetProgress(grid, level)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sign Crush</h1>
          <p className="text-gray-600 mt-1">
            Level {level.id}: <span className="font-medium">{level.title}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="font-medium">Score: {score} / {level.scoreTarget}</span>
          <span className="font-medium">Moves: {moves}</span>
          <span className="font-medium">Clear: {clearTargetCount}/{level.clearTarget.count} {signs[level.clearTarget.signId]?.word}</span>
        </div>
      </div>

      {/* Detection overlay */}
      {isModelReady && (
        <div className="card mb-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium text-gray-700">AI Detection:</span>
              {detectedSign ? (
                <span className="text-primary-600 font-bold"> {signs[detectedSign]?.word || detectedSign}</span>
              ) : (
                <span className="text-gray-500"> Show a sign to detect</span>
              )}
            </div>
            {detectedSign && confidence > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Confidence: {Math.round(confidence * 100)}%</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 transition-all duration-300"
                    style={{ width: `${Math.round(confidence * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Board */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px' }}>
          {grid.map((row, r) =>
            row.map((tile, c) => {
              if (!tile) return <div key={`${r}-${c}`} className="aspect-square" />

              return (
                <TileCell
                  key={tile.id}
                  tile={tile}
                  r={r}
                  c={c}
                  sign={signs[tile.signId]}
                  shattered={shatteredTiles}
                />
              )
            })
          )}
        </div>

        {/* Shatter particles canvas overlay */}
        {shatteredTiles.length > 0 && (
          <canvas
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>

      {/* Webcam + Reference */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Reference Sign */}
        <div className="card text-center">
          <h3 className="font-semibold text-gray-700 mb-4">Mimic This Sign</h3>
          <div className="bg-gray-100 rounded-xl p-6 min-h-[240px] flex items-center justify-center">
            {signs[level.clearTarget.signId]?.image ? (
              <img
                src={signs[level.clearTarget.signId]!.image}
                alt={signs[level.clearTarget.signId]!.word}
                className="max-w-full max-h-[200px] object-contain"
              />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-2">🤟</div>
                <span className="text-gray-500">{signs[level.clearTarget.signId]?.word}</span>
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-600">{signs[level.clearTarget.signId]?.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            Handshape: {signs[level.clearTarget.signId]?.handshape} | Movement: {signs[level.clearTarget.signId]?.movement}
          </p>
        </div>

        {/* Webcam */}
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4">Your Camera</h3>
          {hasPermission ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-[280px] object-cover rounded-xl bg-black mirror"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              {!isModelReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl text-white">
                  Loading AI model...
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Live
              </div>
            </div>
          ) : cameraError ? (
            <div className="bg-gray-100 rounded-xl p-6 min-h-[280px] flex flex-col items-center justify-center">
              <CameraOff className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">{cameraError}</p>
              <button
                onClick={async () => {
                  try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                      video: { facingMode: 'user' },
                    })
                    if (videoRef.current) videoRef.current.srcObject = stream
                    setHasPermission(true)
                    setCameraError(null)
                  } catch {
                    setCameraError('Still no camera access. Check permissions.')
                  }
                }}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl p-6 min-h-[280px] flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-gray-500">Starting camera...</p>
            </div>
          )}
        </div>
      </div>

      {/* Level Complete Modal */}
      {showLevelComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center mx-4">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Level {starsEarned >= 3 ? 'Complete! 🌟' : 'Passed! ⭐'}
            </h2>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(starsEarned)].map((_, i: number) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${i < starsEarned ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-gray-600 mb-6">
              Score: {score} | Moves used: {level.moves - moves}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleRestart} className="btn-secondary">
                <RefreshCw className="w-4 h-4 inline mr-1" />
                Replay
              </button>
              {currentLevelIdx < levels.length - 1 ? (
                <button onClick={handleNextLevel} className="btn-primary">
                  Next Level →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCurrentLevelIdx(0)
                    handleRestart()
                  }}
                  className="btn-primary"
                >
                  Play Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface ShatterParticle {
  id: string
  r: number
  c: number
  vx: number
  vy: number
  life: number
}

function getShatterTiles(g: Grid, signId: string): { r: number; c: number }[] {
  const tiles: { r: number; c: number }[] = []
  for (let r = 0; r < g.length; r++) {
    for (let c = 0; c < g[r].length; c++) {
      if (g[r][c]?.signId === signId) {
        tiles.push({ r, c })
      }
    }
  }
  return tiles
}

function createShatterParticles(matches: { r: number; c: number }[]): ShatterParticle[] {
  return matches.map(({ r, c }) => ({
    id: `${r}-${c}-${Date.now()}`,
    r,
    c,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.5) * 6 - 3,
    life: 1,
  }))
}

function getClearTargetProgress(g: Grid, lvl: Level): number {
  return g.flat().filter((t) => t?.signId === lvl.clearTarget.signId).length
}

function TileCell({ tile, r, c, sign, shattered }: {
  tile: Tile
  r: number
  c: number
  sign: Sign | undefined
  shattered: ShatterParticle[]
}) {
  const imgUrl = sign?.image || `https://placehold.co/48x48/e0f2fe/0ea5e2?text=${sign?.word?.[0] || '?'}`
  const particle = shattered.find((p) => p.r === r && p.c === c)

  return (
    <div
      className={`relative aspect-square rounded-lg border-2 flex items-center justify-center overflow-hidden transition-all duration-300 ${
        particle
          ? 'absolute animate-ping opacity-0 scale-150'
          : 'bg-white border-primary-200 hover:scale-105 hover:shadow-lg'
      }`}
      style={{
        animation: particle ? `shatter 0.3s ease-out forwards` : undefined,
      }}
    >
      {!particle && (
        <>
          <img
            src={imgUrl}
            alt={sign?.word}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://placehold.co/48x48/e0f2fe/0ea5e2?text=${sign?.word?.[0] || '?'}`
            }}
          />
          <span className="absolute bottom-0 text-xs text-gray-600 bg-white/80 px-1 rounded-t">
            {sign?.word?.[0]}
          </span>
        </>
      )}
    </div>
  )
}
