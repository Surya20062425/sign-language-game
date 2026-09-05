import { Link } from 'react-router-dom'
import { Clock, User } from 'lucide-react'
import { lessons } from '../data'

export function Lessons() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Lessons</h1>
        <p className="text-gray-600">
          Choose a lesson to start learning American Sign Language.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/lessons/${lesson.id}`}
            className="lesson-card"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                {lesson.difficulty}
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {lesson.duration}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{lesson.title}</h3>
            <p className="text-gray-600 mb-4">{lesson.description}</p>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {lesson.signs.length} signs
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
