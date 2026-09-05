import { useState, useRef, useEffect } from 'react'
import { Camera, CameraOff, AlertCircle, RefreshCw } from 'lucide-react'
import { signs } from '../data'

export function Practice() {
  const [hasPermission, setHasPermission] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSignIndex, setCurrentSignIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const beginnerSigns = Object.values(signs).filter((s) => s.difficulty === 'beginner')
  const currentSign = beginnerSigns[currentSignIndex]

  useEffect(() => {
    let stream: MediaStream | null = null

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setHasPermission(true)
        setError(null)
      } catch (err) {
        setError('Camera access denied. Please allow camera permissions.')
        setHasPermission(false)
      }
    }

    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const nextSign = () => {
    setCurrentSignIndex((i) => (i + 1) % beginnerSigns.length)
    setShowHint(false)
  }

  const prevSign = () => {
    setCurrentSignIndex((i) => (i - 1 + beginnerSigns.length) % beginnerSigns.length)
    setShowHint(false)
  }

  const restartCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
    setHasPermission(true)
    setError(null)
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Center</h1>
        <p className="text-gray-600">
          Practice signing in front of your webcam. The app shows the sign you should make.
        </p>
      </div>

      {currentSign && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Practice: {currentSign.word}
              </h2>
              <p className="text-gray-600 mt-1">{currentSign.category}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="btn-secondary text-sm"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              <button
                onClick={prevSign}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={nextSign}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          {showHint && (
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-primary-700 mb-2">How to Sign "{currentSign.word}"</h3>
              <p className="text-primary-800 mb-2">{currentSign.description}</p>
              <p className="text-sm"><strong>Handshape:</strong> {currentSign.handshape}</p>
              <p className="text-sm"><strong>Movement:</strong> {currentSign.movement}</p>
              <p className="text-sm"><strong>Location:</strong> {currentSign.location}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Reference Image */}
            <div className="text-center">
              <h3 className="font-semibold text-gray-700 mb-4">Reference</h3>
              <div className="bg-gray-100 rounded-xl p-6 min-h-[240px] flex items-center justify-center">
                {currentSign.image ? (
                  <img
                    src={currentSign.image}
                    alt={currentSign.word}
                    className="max-w-full max-h-[200px] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://placehold.co/240x240/e0f2fe/0ea5e9?text=${encodeURIComponent(currentSign.word)}`
                    }}
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-2">🤟</div>
                    <span className="text-gray-500">{currentSign.word}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Webcam */}
            <div className="text-center">
              <h3 className="font-semibold text-gray-700 mb-4">Your Camera</h3>
              <div className="relative">
                {hasPermission ? (
                  <div className="bg-black rounded-xl overflow-hidden relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-[240px] object-cover mirror"
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    />
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Live
                    </div>
                  </div>
                ) : error ? (
                  <div className="bg-gray-100 rounded-xl p-6 min-h-[240px] flex flex-col items-center justify-center">
                    <CameraOff className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                      onClick={restartCamera}
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
              </div>
              <p className="text-xs text-gray-500 mt-4">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Position your hand in front of the camera
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
