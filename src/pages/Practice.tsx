import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Camera,
  CameraOff,
  RefreshCw,
  Trophy,
  Star,
  Target,
  Zap,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react'
import { Hands, type Results, HAND_CONNECTIONS } from '@mediapipe/hands'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { motion, AnimatePresence } from 'framer-motion'
import { signs } from '../data'
import { matchSign } from '../data/landmarks'
import {
  levels,
  createGrid,
  COLS,
  ROWS,
  signSetForLevel,
  type Level,
  type Tile,
  type Grid,
} from '../lib/match3'
import { removeSign } from '../lib/gameEngine'

const SIGN_COOLDOWN = 900
const SIGN_HOLD_FRAMES = 3
const PARTICLE_COUNT = 20

type Shatter = { id: number; x: number; y: number; color: string }

const signColors: Record<string, string> = {
  hello: '#38bdf8', // sky
  thank: '#a78bfa', // violet
  yes: '#4ade80', // green
  no: '#f87171', // red
  more: '#fb923c', // orange
  please: '#34d399', // teal
  sorry: '#fb7185', // rose
  water: '#60a5fa', // blue
  food: '#fcd34d', // amber
  eat: '#fbbf24', // yellow
  family: '#f472b6', // pink
  mother: '#c084fc', // light purple
  father: '#86efac', // light green
  name: '#2dd36f', // emerald
}
const signColor = (id: string) => signColors[id] ?? '#9ca3af'

export function Practice() {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
  const [level, setLevel] = useState<Level>(levels[0])
  const [grid, setGrid] = useState<Grid>(() => createGrid(levels[0]))
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [chainCount, setChainCount] = useState(0)
  const [movesLeft, setMovesLeft] = useState(levels[0].moves)
  const [clearedSigns, setClearedSigns] = useState<Record<string, number>>({})
  const [shatters, setShatters] = useState<Shatter[]>([])
  const [lastPop, setLastPop] = useState<{ signId: string; count: number; score: number } | null>(null)
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  const [hasPermission, setHasPermission] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isModelReady, setIsModelReady] = useState(false)
  const [isCameraRunning, setIsCameraRunning] = useState(true)
  const [detectedSign, setDetectedSign] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [forceCamKey, setForceCamKey] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handsRef = useRef<Hands | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastSignTime = useRef(0)
  const confirmStack = useRef(0)
  const confirmedSign = useRef<string | null>(null)
  const shatterIdRef = useRef(0)

  const levelSigns = signSetForLevel(level)
  // The current objective sign to match
  const targetSign = levelSigns.find(
    (s) => (clearedSigns[s.id] ?? 0) < level.clearTarget.count,
  ) ?? levelSigns[0]

  // ---- Level load ----
  const loadLevel = useCallback((idx: number) => {
    const lvl = levels[idx]
    if (!lvl) return
    setLevel(lvl)
    setGrid(createGrid(lvl))
    setScore(0)
    setCombo(0)
    setChainCount(0)
    setMovesLeft(lvl.moves)
    setClearedSigns({})
    setShatters([])
    setLastPop(null)
    setShowLevelComplete(false)
    setGameWon(false)
    setCurrentLevelIdx(idx)
  }, [])

  // ---- Win condition ----
  useEffect(() => {
    const t = level.clearTarget
    if ((clearedSigns[t.signId] ?? 0) >= t.count && score >= level.scoreTarget) {
      setGameWon(true)
      setShowLevelComplete(true)
    } else if (movesLeft <= 0 && !(score >= level.scoreTarget && isObjectiveCompleteCalc())) {
      setShowLevelComplete(true)
    }
  }, [clearedSigns, score, movesLeft, level])

  function isObjectiveCompleteCalc() {
    return (clearedSigns[level.clearTarget.signId] ?? 0) >= level.clearTarget.count
  }
  const isObjectiveComplete = () =>
    (clearedSigns[level.clearTarget.signId] ?? 0) >= level.clearTarget.count

  const starsEarned = gameWon
    ? movesLeft >= Math.ceil(level.moves * 0.5)
      ? 3
      : movesLeft >= 1
        ? 2
        : 1
    : 0

  // ---- Webcam setup ----
  useEffect(() => {
    if (showLevelComplete) return
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
        setIsCameraRunning(true)

        hands = new Hands({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
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
          rafRef.current = requestAnimationFrame(processFrame)
        }
        processFrame()
      } catch {
        setCameraError('Camera access denied. Please allow camera permissions.')
        setHasPermission(false)
      }
    }

    const onResults = (results: Results) => {
      const canvas = canvasRef.current
      const video = videoRef.current
      if (!canvas || !video) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (video.readyState >= 2) ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#0ea5e2', lineWidth: 2 })
        drawLandmarks(ctx, landmarks, { color: '#ef4444', lineWidth: 1 })

        const ourLandmarks = landmarks.map((lm) => ({ x: lm.x, y: lm.y, z: lm.z }))
        const match = matchSign(ourLandmarks)

        if (match) {
          setDetectedSign(match.signId)
          setConfidence(match.confidence)

          if (match.signId === confirmedSign.current) {
            confirmStack.current += 1
          } else {
            confirmStack.current = 1
            confirmedSign.current = match.signId
          }

          if (
            match.signId === targetSign?.id &&
            match.confidence > 0.55 &&
            confirmStack.current >= SIGN_HOLD_FRAMES &&
            Date.now() - lastSignTime.current > SIGN_COOLDOWN &&
            !showLevelComplete &&
            !gameWon &&
            movesLeft > 0
          ) {
            lastSignTime.current = Date.now()
            triggerSignAction(match.signId)
          }
        } else {
          setDetectedSign(null)
          setConfidence(0)
          confirmStack.current = 0
          confirmedSign.current = null
        }
      } else {
        setDetectedSign(null)
        setConfidence(0)
        confirmStack.current = 0
        confirmedSign.current = null
      }
    }

    setupCamera()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (hands) hands.close()
      if (stream) stream.getTracks().forEach((t) => t.stop())
    }
  }, [showLevelComplete, gameWon, movesLeft, targetSign?.id, level.signIds, forceCamKey])

  // ---- Sign action: remove target sign tiles + cascade ----
  const triggerSignAction = useCallback(
    (signId: string) => {
      setMovesLeft((m) => Math.max(0, m - 1))

      // find matching tiles for shatter FX
      const tilesToRemove = findSignTiles(grid, signId)
      if (tilesToRemove.length === 0) {
        setCombo(0)
        setChainCount(0)
        setLastPop(null)
        return
      }

      spawnShatters(tilesToRemove, signId)

      const { grid: newGrid, removed, score: earned } = removeSign(grid, signId, level)
      const chainBonus = Math.min(combo, 8) * 0.5 + 1
      const finalScore = Math.round(earned * chainBonus)

      setScore((s) => s + finalScore)
      setCombo((c) => c + 1)
      setChainCount((cc) => cc + 1)
      setClearedSigns((prev) => ({ ...prev, [signId]: (prev[signId] ?? 0) + removed }))
      setGrid(newGrid)
      setLastPop({ signId, count: removed, score: finalScore })

      setTimeout(() => setLastPop(null), 1400)
      setTimeout(() => setChainCount(0), 1600)
    },
    [grid, level, combo],
  )

  const findSignTiles = (g: Grid, signId: string): Tile[] => {
    const out: Tile[] = []
    for (let r = 0; r < g.length; r++) {
      for (let c = 0; c < (g[r]?.length ?? 0); c++) {
        if (g[r][c]?.signId === signId) out.push(g[r][c]!)
      }
    }
    return out
  }

  const spawnShatters = (tiles: Tile[], signId: string) => {
    // collect pixel positions of tiles that will be removed
    const pts: Array<{ r: number; c: number }> = []
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c]?.signId === signId) pts.push({ r, c })
      }
    }
    const color = signColor(signId)
    const newShatters: Shatter[] = []
    pts.forEach((p) => {
      const cx = p.c * CELL + CELL / 2
      const cy = p.r * CELL + CELL / 2
      for (let i = 0; i < PARTICLE_COUNT / pts.length; i++) {
        newShatters.push({ id: shatterIdRef.current++, x: cx, y: cy, color })
      }
    })
    setShatters((s) => [...s, ...newShatters])
    setTimeout(
      () => setShatters((s) => s.filter((p) => !newShatters.includes(p))),
      950,
    )
  }

  const restartLevel = () => loadLevel(currentLevelIdx)
  const nextLevel = () => loadLevel(currentLevelIdx + 1)
  const retry = () => loadLevel(currentLevelIdx)

  const cellSize = CELL
  const gridW = COLS * cellSize
  const gridH = ROWS * cellSize

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ASL Match-3</h1>
          <p className="text-gray-600 mt-1">
            Level {level.id}: <span className="font-medium">{level.title}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-medium">
          <motion.span animate={{ scale: score > 0 ? [1, 1.15, 1] : 1 }} transition={{ duration: 0.3 }}>
            Score: {score} / {level.scoreTarget}
          </motion.span>
          <motion.span animate={{ color: movesLeft <= 2 ? '#ef4444' : '#059669' }} transition={{ duration: 0.3 }}>
            Moves: {movesLeft}
          </motion.span>
          <span className="text-purple-600">Combo: x{combo}</span>
          {combo > 1 && <span className="text-yellow-500 animate-pulse">🔥</span>}
          <span>🎯 {targetSign?.word}</span>
        </div>
      </div>

      {/* Objectives */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-500" />
          Level Objectives
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm">
              <span>
                Clear {level.clearTarget.count} "{targetSign?.word}" tiles —{' '}
                {clearedSigns[level.clearTarget.signId] ?? 0}/{level.clearTarget.count}
              </span>
              <span className={isObjectiveComplete() ? 'text-green-600 font-bold' : 'text-gray-500'}>
                {isObjectiveComplete() ? 'DONE' : 'IN PROGRESS'}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, ((clearedSigns[level.clearTarget.signId] ?? 0) / level.clearTarget.count) * 100)}%` }}
                transition={{ type: 'spring', stiffness: 200 }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Score target: {score}/{level.scoreTarget}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <motion.div
                className="h-full bg-yellow-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (score / level.scoreTarget) * 100)}%` }}
                transition={{ type: 'spring', stiffness: 200 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detection status */}
      {isModelReady && (
        <div className="card">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium text-gray-700">AI Detection:</span>
              {detectedSign ? (
                <span className="text-primary-600 font-bold"> {signs[detectedSign]?.word || detectedSign}</span>
              ) : (
                <span className="text-gray-500"> Show a sign to detect</span>
              )}
              {targetSign && detectedSign === targetSign.id && (
                <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">TARGET</span>
              )}
            </div>
            {detectedSign && confidence > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Confidence: {Math.round(confidence * 100)}%</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${Math.round(confidence * 100)}%` }} />
                </div>
              </div>
            )}
          </div>
          {lastPop && (
            <motion.div
              className="mt-2 text-sm"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -10 }}
              exit={{ opacity: 0 }}
            >
              <span className="font-medium text-yellow-600">
                Removed {lastPop.count} "{signs[lastPop.signId]?.word}" tiles!
              </span>
              <span className="text-primary-600 font-bold"> +{lastPop.score} pts</span>
              {combo > 1 && <span className="text-purple-600"> (x{combo} combo)</span>}
            </motion.div>
          )}
        </div>
      )}

      {/* Main game: board + webcam */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Game board */}
        <div className="lg:col-span-2 card">
          <div className="flex justify-center mb-4">
            <h3 className="font-semibold text-gray-700">Sign Board — clear matching tiles</h3>
          </div>
          <div
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl mx-auto overflow-hidden border-4 border-gray-700"
            style={{ width: gridW, height: gridH }}
          >
            <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)`, gap: '2px' }}>
              {grid.map((row, r) =>
                row.map((tile, c) => {
                  if (!tile) return <div key={`${r}-${c}`} className="bg-gray-700" />
                  const isTarget = tile.signId === targetSign?.id
                  const color = signColor(tile.signId)
                  return (
                    <motion.div
                      key={tile.id}
                      className="relative rounded-sm flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: color, aspectRatio: '1' }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0, y: -20 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22, delay: (r + c) * 0.01 }}
                      whileHover={{ scale: 1.08, filter: 'brightness(1.2)' }}
                    >
                      <SignIcon signId={tile.signId} />
                      {isTarget && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        />
                      )}
                    </motion.div>
                  )
                }),
              )}
            </div>

            {/* Shatter particles */}
            <ShatterParticles shatters={shatters} />

            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: gridW, height: gridH }}>
              {Array.from({ length: COLS + 1 }).map((_, c) => (
                <line key={c} x1={c * CELL} y1={0} x2={c * CELL} y2={gridH} stroke="#374151" strokeWidth={1} opacity={0.25} />
              ))}
              {Array.from({ length: ROWS + 1 }).map((_, r) => (
                <line key={r} x1={0} y1={r * CELL} x2={gridW} y2={r * CELL} stroke="#374151" strokeWidth={1} opacity={0.25} />
              ))}
            </svg>

            {/* Combo burst */}
            <AnimatePresence>
              {combo > 2 && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-yellow-300 pointer-events-none drop-shadow-2xl"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [1, 1.4, 1], opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  COMBO x{combo}!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Webcam + reference */}
        <div className="space-y-6">
          {/* Reference sign */}
          <div className="card text-center">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" />
              Mimic This Sign
            </h3>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 min-h-[200px] flex items-center justify-center">
              {targetSign?.image ? (
                <img
                  src={targetSign.image}
                  alt={targetSign.word}
                  className="max-w-full max-h-[180px] object-contain"
                />
              ) : (
                <div className="text-6xl">🤟</div>
              )}
              <span className="sr-only">{targetSign?.word}</span>
            </div>
            {targetSign && <p className="mt-2 text-lg font-semibold text-gray-800">{targetSign.word}</p>}
            {showHint && targetSign && (
              <div className="mt-4 text-left space-y-2">
                <p className="text-sm"><strong className="text-gray-600">Handshape:</strong> {targetSign.handshape}</p>
                <p className="text-sm"><strong className="text-gray-600">Movement:</strong> {targetSign.movement}</p>
                <p className="text-sm"><strong className="text-gray-600">Location:</strong> {targetSign.location}</p>
              </div>
            )}
            <button onClick={() => setShowHint(!showHint)} className="mt-3 btn-secondary text-sm">
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
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
                  className="w-full h-[240px] object-cover rounded-xl bg-black mirror"
                />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
                {!isModelReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl text-white">
                    Loading AI model...
                  </div>
                )}
                <motion.div
                  className="absolute bottom-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <span className="w-2 h-2 bg-white rounded-full" />
                  Live
                </motion.div>
                {detectedSign && detectedSign === targetSign?.id && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1, 1.2] }}
                  >
                    {signs[detectedSign]?.word} ✓
                  </motion.div>
                )}
              </div>
            ) : cameraError ? (
              <div className="bg-gray-100 rounded-xl p-6 min-h-[240px] flex flex-col items-center justify-center">
                <CameraOff className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">{cameraError}</p>
                <button
                  onClick={async () => {
                    try {
                      const s = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
                      })
                      if (videoRef.current) videoRef.current.srcObject = s
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
              <div className="bg-gray-100 rounded-xl p-6 min-h-[240px] flex items-center justify-center">
                <Camera className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-500">Starting camera...</p>
              </div>
            )}

            {/* Instruction */}
            <div className="mt-4 text-center">
              {targetSign && detectedSign === targetSign.id && confidence > 0.55 ? (
                <motion.p
                  className="text-sm text-emerald-600 font-medium flex items-center justify-center gap-1"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                >
                  <Zap className="w-4 h-4" /> Hold the "{targetSign.word}" sign — matching tiles shatter!
                </motion.p>
              ) : (
                <p className="text-sm text-gray-500">
                  Make the "{targetSign?.word ?? '?'}" sign to remove matching tiles from the board.
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button onClick={() => loadLevel(currentLevelIdx)} className="btn-secondary flex-1 inline-flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
            <button
              onClick={() => {
                if (isCameraRunning) {
                  if (videoRef.current) {
                    videoRef.current.pause()
                    videoRef.current.srcObject = null
                  }
                  if (handsRef.current) handsRef.current.close()
                  if (rafRef.current) cancelAnimationFrame(rafRef.current)
                  setIsCameraRunning(false)
                } else {
                  setForceCamKey((k) => k + 1)
                  setIsCameraRunning(true)
                }
              }}
              className="btn-secondary flex-1 inline-flex items-center justify-center gap-2"
            >
              {isCameraRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isCameraRunning ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      </div>

      {/* Chain reaction banner */}
      <AnimatePresence>
        {chainCount > 2 && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-2xl z-40"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            CHAIN REACTION x{chainCount}!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score pop */}
      <AnimatePresence>
        {lastPop && (
          <motion.div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-bold shadow-xl z-40"
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -20 }}
          >
            +{lastPop.score} pts
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Complete Modal */}
      {showLevelComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md text-center mx-4"
          >
            <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {gameWon ? '🎉 Level Complete!' : '⏰ Out of Moves!'}
            </h2>
            {gameWon && (
              <motion.div
                className="flex justify-center gap-1 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {[...Array(starsEarned)].map((_, i: number) => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}>
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </motion.div>
            )}
            <p className="text-gray-600 mb-2">Score: {score} | Moves used: {level.moves - movesLeft}</p>
            {gameWon && isObjectiveComplete() && (
              <p className="text-gray-500 mb-4">
                Cleared {clearedSigns[level.clearTarget.signId] ?? 0} "{targetSign?.word}" tiles
              </p>
            )}
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={restartLevel} className="btn-secondary inline-flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Replay
              </button>
              {!gameWon ? (
                <button onClick={retry} className="btn-primary inline-flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              ) : currentLevelIdx < levels.length - 1 ? (
                <button onClick={nextLevel} className="btn-primary inline-flex items-center gap-2">
                  Next Level →
                </button>
              ) : (
                <button onClick={() => loadLevel(0)} className="btn-primary inline-flex items-center gap-2">
                  Play Again
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

const CELL = 48

function SignIcon({ signId }: { signId: string }) {
  const sign = signs[signId]
  return (
    <div className="flex flex-col items-center">
      {sign?.image ? (
        <img
          src={sign.image}
          alt={sign.word}
          className="w-7 h-7 object-contain drop-shadow"
        />
      ) : (
        <span className="text-xl">{emojiForSign(signId)}</span>
      )}
    </div>
  )
}

const emojiForSign = (id: string) => {
  const map: Record<string, string> = {
    hello: '👋', thank: '🙏', yes: '✅', no: '❌', more: '➕',
    please: '🤲', sorry: '🤲', water: '💧', food: '🍽', eat: '🍴',
    family: '👨‍👩‍👧', mother: '👩', father: '👨', name: '🧑',
  }
  return map[id] ?? '✋'
}

function ShatterParticles({ shatters }: { shatters: Shatter[] }) {
  return (
    <>
      {shatters.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{ width: 10, height: 10, backgroundColor: p.color, left: p.x, top: p.y }}
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: [1, 2.5, 0],
            opacity: [1, 0.8, 0],
            x: (Math.random() - 0.5) * 140,
            y: (Math.random() - 0.5) * 140 - 70,
            rotate: Math.random() * 360,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      ))}
    </>
  )
}
