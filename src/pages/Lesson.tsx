import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, CheckCircle, Clock } from 'lucide-react'
import { lessons } from '../data'
import { Lesson as LessonType, Sign } from '../data/types'

export function Lesson() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const lesson: LessonType | undefined = lessons.find((l: LessonType) => l.id === id)

  if (!lesson) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Lesson not found
        </h2>
        <p className="text-gray-600 mb-6">
          The lesson you're looking for doesn't exist.
        </p>
        <Link to="/lessons" className="btn-primary">
          Back to all lessons
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
          </div>
          <p className="text-gray-600">{lesson.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {lesson.duration}
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {lesson.signs.length} signs
        </div>
        <span className="capitalize">{lesson.difficulty}</span>
      </div>

      <div className="space-y-8">
        {lesson.signs.map((sign: Sign, index: number) => (
          <div key={sign.id} className="card">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Sign Image */}
              <div className="text-center">
                <div className="bg-gray-100 rounded-xl p-6 mb-4 min-h-[200px] flex items-center justify-center">
                  {sign.image ? (
                    <img
                      src={sign.image}
                      alt={sign.word}
                      className="max-w-full max-h-[200px] object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `https://placehold.co/240x240/e0f2fe/0ea5e9?text=${encodeURIComponent(sign.word)}`
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-2">🤟</div>
                      <span className="text-gray-500">{sign.word}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{sign.word}</h3>
                <p className="text-gray-500 mt-1">{sign.category}</p>
              </div>

              {/* Sign Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How to Sign</h4>
                  <p className="text-gray-700 leading-relaxed">{sign.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Handshape</h4>
                  <p className="text-gray-700">{sign.handshape}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Movement</h4>
                  <p className="text-gray-700">{sign.movement}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-700">{sign.location}</p>
                </div>
                {sign.video && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Video Demo</h4>
                    <video
                      src={sign.video}
                      controls
                      className="w-full rounded-lg"
                      style={{ maxHeight: '150px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <Link to="/quiz" className="btn-primary">
          Test Your Knowledge
        </Link>
      </div>
    </div>
  )
}
