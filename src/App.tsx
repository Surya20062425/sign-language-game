import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Lessons } from './pages/Lessons'
import { Lesson } from './pages/Lesson'
import { Practice } from './pages/Practice'
import { Quiz } from './pages/Quiz'
import { Progress } from './pages/Progress'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="lessons/:id" element={<Lesson />} />
        <Route path="practice" element={<Practice />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="progress" element={<Progress />} />
      </Route>
    </Routes>
  )
}
