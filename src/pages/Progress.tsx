import { BookOpen, TrendingUp, Award, Calendar, CheckCircle } from 'lucide-react'
import { lessons } from '../data'
import { Lesson } from '../data/types'

export function Progress() {
  const totalLessons = lessons.length

  // Hardcoded progress for MVP demo
  const completedLessons = 3
  const masteredSigns = 15
  const quizScore = 80
  const streak = 7

  const progressPercent = Math.round((completedLessons / totalLessons) * 100)

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-gray-600">
          Track your learning journey and see what you've mastered.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <BookOpen className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{completedLessons}</div>
          <div className="text-sm text-gray-600">Lessons Completed</div>
        </div>
        <div className="card text-center">
          <Award className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{masteredSigns}</div>
          <div className="text-sm text-gray-600">Signs Mastered</div>
        </div>
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{quizScore}%</div>
          <div className="text-sm text-gray-600">Quiz Accuracy</div>
        </div>
        <div className="card text-center">
          <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{streak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Progress</h2>
        <div className="mb-2 flex justify-between">
          <span className="text-sm text-gray-600">{completedLessons} of {totalLessons} lessons completed</span>
          <span className="text-sm font-medium text-primary-600">{progressPercent}%</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Lessons List */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Lessons</h2>
        <div className="space-y-4">
          {lessons.map((lesson: Lesson) => {
            const isCompleted = lesson.id === 'greetings' || lesson.id === 'everyday' || lesson.id === 'people'
            return (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <Award className="w-5 h-5" />
                    ) : (
                      <BookOpen className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                    <p className="text-sm text-gray-600">
                      {lesson.duration} • {lesson.signs.length} signs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 capitalize">{lesson.difficulty}</span>
                  {isCompleted && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-semibold text-gray-900">First Lesson</div>
            <div className="text-sm text-gray-500">Completed your first lesson</div>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">🔥</div>
            <div className="font-semibold text-gray-900">Week Streak</div>
            <div className="text-sm text-gray-500">7 days of learning</div>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-semibold text-gray-900">Quiz Master</div>
            <div className="text-sm text-gray-500">80%+ on all quizzes</div>
          </div>
        </div>
      </div>
    </div>
  )
}
