# Sign Language Game

A friendly, welcoming web app for learning American Sign Language (ASL) — designed for complete beginners.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start learning.

## Features

- **Guided lessons** — Step-by-step ASL signs for common words
- **Practice mode** — Candy Crush-style grid game with webcam gesture recognition
- **Quizzes** — Test your knowledge with quick flashcards
- **Progress tracking** — Visual progress and achievements
- **Mobile-first** — Works on desktop and mobile
- **No backend required** — Fully client-side

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 3
- Framer Motion
- React Router 7
- MediaPipe Hands (CDN-loaded, client-side ML)
- Lucide React

## Project Structure

```
src/
├── data/          # Lesson content and sign data
├── components/    # Reusable UI components
├── pages/         # Route pages
├── hooks/         # Custom React hooks
├── lib/           # Utilities and types
└── App.tsx        # Root app with router
```

## License

MIT
