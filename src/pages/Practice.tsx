import { useState, useRef, useEffect } from 'react'
import { Camera, CameraOff, CheckCircle, XCircle, RefreshCw, Trophy, Star } from 'lucide-react'
import { Hands, type Results, HAND_CONNECTIONS } from '@mediapipe/hands'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { signs } from '../data'
import { Sign } from '../data/types'
import { matchSign } from '../data/landmarks'

interface Level {
  id: number
  title: string
  signIds: string[]
  moves: number
  starsRequired: number
}

const levels: Level[] = [
  {
    id: 1,
    title: 'Welcome!',
    signIds: ['hello', 'thank', 'yes'],
    moves: 3,
    starsRequired: 2,
  },
  {
    id: 2,
    title: 'Greetings',
    signIds: ['please', 'sorry', 'no'],
    moves: 3,
    starsRequired: 2,
  },
  {
    id: 3,
    title: 'Daily Life',
    signIds: ['water', 'food', 'more'],
    moves: 3,
    starsRequired: 2,
  },
  {
    id: 4,
    title: 'Family',
    signIds: ['family', 'mother', 'father'],
    moves: 3,
    starsRequired: 2,
  },
  {
    id: 5,
    title: 'Everything!',
    signIds: ['name', 'eat', 'hello'],
    moves: 3,
    starsRequired: 2,
  },
]

export function Practice() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [movesLeft, setMovesLeft] = useState(levels[0].moves)
  const [score, setScore] = useState(0)
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [pendingSignId, setPendingSignId] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [isModelReady, setIsModelReady] = useState(false)
  const [detectedSign, setDetectedSign] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handsRef = useRef<Hands | null>(null)
  const animationRef = useRef<number | null>(null)

  const level = levels[currentLevel]
  const gridSigns: Sign[] = level.signIds.map((id) => signs[id])

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

        // Initialize MediaPipe Hands
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

        // Start processing loop
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

      // Set canvas size to match video
      canvas.width = videoRef.current?.videoWidth || 640
      canvas.height = videoRef.current?.videoHeight || 480

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw video frame onto canvas
      if (videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      }

      // Process hand landmarks
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]

        // Draw landmarks and connections
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#0ea5e9', lineWidth: 2 })
        drawLandmarks(ctx, landmarks, { color: '#ef4444', lineWidth: 1 })

        // Convert to our landmark format and try to match
        if (!pendingSignId) {
          const ourLandmarks = landmarks.map((lm) => ({ x: lm.x, y: lm.y, z: lm.z }))
          const match = matchSign(ourLandmarks)

          if (match) {
            setDetectedSign(match.signId)
            setConfidence(match.confidence)

            // If detected sign matches a sign in the current level, auto-select it
            if (level.signIds.includes(match.signId)) {
              setPendingSignId(match.signId)
            }
          } else {
            setDetectedSign(null)
            setConfidence(0)
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
  }, [pendingSignId, level.signIds])

  const confirmCorrect = () => {
    setScore((s) => s + 10)
    setMovesLeft((m) => m - 1)
    setPendingSignId(null)
    setDetectedSign(null)
    setConfidence(0)
    if (movesLeft <= 1) setShowLevelComplete(true)
  }

  const confirmWrong = () => {
    setMovesLeft((m) => m - 1)
    setPendingSignId(null)
    setDetectedSign(null)
    setConfidence(0)
    if (movesLeft <= 1) setShowLevelComplete(true)
  }

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel((l) => l + 1)
      setMovesLeft(levels[currentLevel + 1]?.moves ?? 3)
      setScore(0)
      setShowLevelComplete(false)
    }
  }

  const restartLevel = () => {
    setMovesLeft(level.moves)
    setScore(0)
    setPendingSignId(null)
    setShowLevelComplete(false)
    setDetectedSign(null)
    setConfidence(0)
  }

  const starsEarned = movesLeft >= 2 ? 3 : movesLeft >= 1 ? 2 : 1
  const targetSign = gridSigns[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ASL Practice</h1>
          <p className="text-gray-600 mt-1">
            Level {currentLevel + 1}: <span className="font-medium">{level.title}</span>
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium">Score: {score}</span>
          <span className="font-medium">Moves: {movesLeft}</span>
          <span className="font-medium">Stars: {starsEarned}/3</span>
        </div>
      </div>

      {/* Detection Status */}
      {isModelReady && (
        <div className="card">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium text-gray-700">AI Detection:</span>
              {detectedSign ? (
                <span className="text-primary-600 font-bold"> {signs[detectedSign]?.word || detectedSign}</span>
              ) : (
                <span className="text-gray-500"> No hand detected</span>
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

      {/* Game Board - Grid of signs */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {gridSigns.map((sign: Sign) => (
          <button
            key={sign.id}
            onClick={() => !pendingSignId && movesLeft > 0 && setPendingSignId(sign.id)}
            disabled={movesLeft <= 0 || pendingSignId !== null}
            className={`relative aspect-square rounded-2xl border-4 transition-all duration-300 ${
              pendingSignId === sign.id
                ? 'border-yellow-400 bg-yellow-50 scale-105'
                : detectedSign === sign.id
                ? 'border-green-400 bg-green-50 scale-105 animate-pulse'
                : movesLeft <= 0 || pendingSignId !== null
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                : 'border-primary-200 bg-white hover:border-primary-400 hover:bg-primary-50 hover:scale-105'
            }`}
          >
            <div className="h-full flex flex-col items-center justify-center p-4">
              <div className="text-3xl mb-2">
                {sign.image ? (
                  <img
                    src={sign.image}
                    alt={sign.word}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://placehold.co/64x64/e0f2fe/0ea5e9?text=?`
                    }}
                  />
                ) : (
                  '🤟'
                )}
              </div>
              <span className="text-lg font-semibold text-gray-800">{sign.word}</span>
              {detectedSign === sign.id && (
                <CheckCircle className="w-5 h-5 text-green-500 absolute top-1 right-1" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Webcam + Reference */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Reference Sign */}
        <div className="card text-center">
          <h3 className="font-semibold text-gray-700 mb-4">Mimic This Sign</h3>
          <div className="bg-gray-100 rounded-xl p-6 min-h-[240px] flex items-center justify-center">
            {targetSign?.image ? (
              <img
                src={targetSign.image}
                alt={targetSign.word}
                className="max-w-full max-h-[200px] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://placehold.co/240x240/e0f2fe/0ea5e9?text=${encodeURIComponent(targetSign.word)}`
                }}
              />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-2">🤟</div>
                <span className="text-gray-500">{targetSign?.word}</span>
              </div>
            )}
          </div>
          {showHint && (
            <div className="mt-4 text-left bg-primary-50 p-3 rounded-xl">
              <p className="text-sm text-primary-800"><strong>Handshape:</strong> {targetSign?.handshape}</p>
              <p className="text-sm text-primary-800"><strong>Movement:</strong> {targetSign?.movement}</p>
              <p className="text-sm text-primary-800"><strong>Location:</strong> {targetSign?.location}</p>
            </div>
          )}
          <button
            onClick={() => setShowHint(!showHint)}
            className="mt-3 btn-secondary text-sm"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        </div>

        {/* Webcam with overlay */}
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
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              {!isModelReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl text-white">
                  Loading AI model...
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Live
              </div>
            </div>
          ) : cameraError ? (
            <div className="bg-gray-100 rounded-xl p-6 min-h-[240px] flex flex-col items-center justify-center">
              <CameraOff className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">{cameraError}</p>
              <button
                onClick={async () => {
                  const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
                  })
                  if (videoRef.current) videoRef.current.srcObject = stream
                  setHasPermission(true)
                  setCameraError(null)
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

          {pendingSignId && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-800 font-medium text-center">
                Detected: "{signs[pendingSignId]?.word}"
              </p>
              <div className="flex justify-center gap-3 mt-3">
                <button
                  onClick={confirmCorrect}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
                >
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Correct
                </button>
                <button
                  onClick={confirmWrong}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
                >
                  <XCircle className="w-4 h-4 inline mr-1" />
                  Wrong
                </button>
              </div>
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
              Level {starsEarned >= 3 ? 'Complete! 🌟' : 'Passed! ⭐'} {level.title}
            </h2>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${i < starsEarned ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-gray-600 mb-6">
              Score: {score} points | Stars: {starsEarned}/3
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={restartLevel} className="btn-secondary">
                <RefreshCw className="w-4 h-4 inline mr-1" />
                Replay
              </button>
              {currentLevel < levels.length - 1 ? (
                <button onClick={nextLevel} className="btn-primary">
                  Next Level →
                </button>
              ) : (
                <button
                  onClick={() => window.location.reload()}
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
