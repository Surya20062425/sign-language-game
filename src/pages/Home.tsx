import { Link } from 'react-router-dom'
import { BookOpen, PlayCircle, ClipboardCheck, TrendingUp, Globe } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Learn',
    description: 'Step-by-step lessons with clear sign illustrations and step-by-step instructions.',
    href: '/lessons',
  },
  {
    icon: PlayCircle,
    title: 'Practice',
    description: 'Practice signs with your webcam. See your hand position reflected in real-time.',
    href: '/practice',
  },
  {
    icon: ClipboardCheck,
    title: 'Quiz',
    description: 'Test your memory with quick quizzes and flashcards.',
    href: '/quiz',
  },
  {
    icon: TrendingUp,
    title: 'Progress',
    description: 'Track your learning streak and see what you\'ve mastered.',
    href: '/progress',
  },
]

export function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-16">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
            <Globe className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learn Sign Language
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start from zero and build confidence with friendly, step-by-step
            lessons. Perfect for beginners who want to learn American Sign Language (ASL).
          </p>
        </div>
        <Link to="/lessons" className="btn-primary inline-flex items-center gap-2 text-lg">
          <BookOpen className="w-5 h-5" />
          Start Learning
        </Link>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          How It Works
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <Link
                key={f.title}
                to={f.href}
                className="lesson-card group text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.description}</p>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
