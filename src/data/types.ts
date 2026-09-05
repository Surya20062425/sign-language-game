export interface Sign {
  id: string
  word: string
  category: string
  description: string
  handshape: string
  movement: string
  location: string
  image: string
  video: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface Lesson {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  signs: Sign[]
}

export interface QuizQuestion {
  id: string
  signId: string
  word: string
  image: string
  options: string[]
  correctAnswer: string
}
