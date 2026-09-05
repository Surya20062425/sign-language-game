import { useState } from 'react'
import { CheckCircle, XCircle, RotateCcw, TrendingUp } from 'lucide-react'
import { quizQuestions } from '../data'

export function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [answered, setAnswered] = useState(false)

  const currentQuestion = quizQuestions[currentQuestionIndex]

  const handleAnswerSelect = (answer: string) => {
    if (answered) return
    setSelectedAnswer(answer)
    setAnswered(true)
    if (answer === currentQuestion.correctAnswer) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setAnswered(false)
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1)
      setSelectedAnswer(null)
      setAnswered(false)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResults(false)
    setAnswered(false)
  }

  if (showResults) {
    const percentage = Math.round((score / quizQuestions.length) * 100)
    return (
      <div className="text-center py-16">
        <div className="mb-8">
          <TrendingUp className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
          <p className="text-xl text-gray-600">
            You scored <span className="font-bold text-primary-600">{score}</span> out of{' '}
            <span className="font-bold">{quizQuestions.length}</span>
          </p>
          <p className="text-4xl font-bold text-primary-600 my-4">{percentage}%</p>
          <div className="w-48 h-4 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <button onClick={handleRestart} className="btn-primary inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Take Quiz Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </span>
          <span className="text-sm font-medium text-primary-600">
            Score: {score}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Which sign is this?
        </h2>

        <div className="text-center mb-8">
          <div className="bg-gray-100 rounded-xl p-6 mb-4 min-h-[200px] flex items-center justify-center">
            <img
              src={currentQuestion.image}
              alt="Sign to identify"
              className="max-w-full max-h-[200px] object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = `https://placehold.co/200x200/e0f2fe/0ea5e9?text=?`
              }}
            />
          </div>
          <p className="text-lg text-gray-600">Choose the correct word:</p>
        </div>

        <div className="grid gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentQuestion.correctAnswer
            const getButtonClass = () => {
              if (!answered) return 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
              if (isCorrect) return 'border-green-500 bg-green-50 text-green-800'
              if (isSelected) return 'border-red-500 bg-red-50 text-red-800'
              return 'border-gray-200 opacity-50'
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option)}
                disabled={answered}
                className={`p-4 border-2 rounded-xl text-left transition-all text-lg font-medium ${getButtonClass()}`}
              >
                {option}
                {answered && isCorrect && (
                  <CheckCircle className="w-5 h-5 text-green-500 inline ml-2" />
                )}
                {answered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-500 inline ml-2" />
                )}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="mt-6 text-center">
            <div className="mb-4">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <p className="text-green-700 font-semibold flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Correct!
                </p>
              ) : (
                <p className="text-red-700 font-semibold flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" />
                  The correct answer is: {currentQuestion.correctAnswer}
                </p>
              )}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button onClick={handleNext} className="btn-primary">
                {currentQuestionIndex === quizQuestions.length - 1 ? 'See Results' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
