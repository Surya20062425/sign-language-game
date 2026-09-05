import { describe, it, expect } from 'vitest'
import { quizQuestions } from '../data'
import { QuizQuestion } from '../data/types'
import { lessons } from '../data'

describe('quiz data integrity', () => {
  it('every quiz question has a valid correctAnswer among its options', () => {
    quizQuestions.forEach((q: QuizQuestion) => {
      expect(q.options).toContain(q.correctAnswer)
      expect(q.image).toBeTruthy()
    })
  })

  it('quiz questions reference real signs (image is not empty)', () => {
    quizQuestions.forEach((q: QuizQuestion) => {
      expect(typeof q.image).toBe('string')
      expect(q.image.length).toBeGreaterThan(0)
    })
  })
})

describe('lessons data', () => {
  it('each lesson has at least one sign', () => {
    lessons.forEach((l) => {
      expect(l.signs.length).toBeGreaterThan(0)
    })
  })
})
