import { useState, useRef, useEffect } from 'react'
import { Camera, CameraOff, CheckCircle, XCircle, RefreshCw, Trophy, Star } from 'lucide-react'
import { signs } from '../data'
import { Sign } from '../data/types'

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
  const videoRef = useRef<HTMLVideoElement>(null)

  const level = levels[currentLevel]
  const gridSigns: Sign[] = level.signIds.map((id) => signs[id])

  useEffect(() => {
    let stream: MediaStream | null = null
    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        })
        if (videoRef.current) videoRef.current.srcObject = stream
        setHasPermission(true)
        setCameraError(null)
      } catch {
        setCameraError('Camera access denied. Please allow camera permissions.')
        setHasPermission(false)
      }
    }
    setupCamera()
    return () => stream?.getTracks().forEach((t) => t.stop())
  }, [])

  const handleSignTap = (signId: string) => {
    if (movesLeft <= 0 || pendingSignId !== null) return
    setPendingSignId(signId)
  }

  const confirmCorrect = () => {
    setScore((s) => s + 10)
    setMovesLeft((m) => m - 1)
    setPendingSignId(null)

    if (movesLeft <= 1) {
      setShowLevelComplete(true)
    }
  }

  const confirmWrong = () => {
    setMovesLeft((m) => m - 1)
    setPendingSignId(null)

    if (movesLeft <= 1) {
      setShowLevelComplete(true)
    }
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
  }

  const starsEarned = movesLeft >= 2 ? 3 : movesLeft >= 1 ? 2 : 1
  const levelSign = gridSigns[0]

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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-bold text-gray-900">{score}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium">Moves: {movesLeft}</span>
            <span className="font-medium">Stars: {starsEarned}/3</span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {gridSigns.map((sign) => (
          <button
            key={sign.id}
            onClick={() => handleSignTap(sign.id)}
            disabled={movesLeft <= 0 || pendingSignId !== null}
            className={`relative aspect-square rounded-2xl border-4 transition-all duration-300 ${
              pendingSignId === sign.id
                ? 'border-yellow-400 bg-yellow-50 scale-105'
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
            </div>
            {sign.id === 'hello' && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Webcam + Target Sign */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Target Sign */}
        <div className="card text-center">
          <h3 className="font-semibold text-gray-700 mb-4">Mimic This Sign</h3>
          <div className="bg-gray-100 rounded-xl p-6 min-h-[200px] flex items-center justify-center">
            {levelSign.image ? (
              <img
                src={levelSign.image}
                alt={levelSign.word}
                className="max-w-full max-h-[200px] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://placehold.co/240x240/e0f2fe/0ea5e9?text=${encodeURIComponent(levelSign.word)}`
                }}
              />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-2">🤟</div>
                <span className="text-gray-500">{levelSign.word}</span>
              </div>
            )}
          </div>
          {showHint && (
            <div className="mt-4 text-left bg-primary-50 p-3 rounded-xl">
              <p className="text-sm text-primary-800">
                <strong>Handshape:</strong> {levelSign.handshape}
              </p>
              <p className="text-sm text-primary-800">
                <strong>Movement:</strong> {levelSign.movement}
              </p>
              <p className="text-sm text-primary-800">
                <strong>Location:</strong> {levelSign.location}
              </p>
            </div>
          )}
          <button
            onClick={() => setShowHint(!showHint)}
            className="mt-3 btn-secondary text-sm"
          >
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
                  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
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
                Sign matched: "{signs[pendingSignId]?.word}"
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

          {!pendingSignId && movesLeft > 0 && hasPermission && (
            <p className="mt-4 text-xs text-gray-500 text-center">
              Tap a sign on the board, then check your webcam to compare your hand position.
            </p>
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
