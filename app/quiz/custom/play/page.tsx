"use client"

import { useState, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { QuestionCard } from "@/components/quiz/QuestionCard"
import { ProgressBar } from "@/components/quiz/ProgressBar"
import { ResultScreen } from "@/components/quiz/ResultScreen"
import { Question, QuizResult, PRESET_PROFILES } from "@/types"
import { SEED_QUESTIONS } from "@/lib/seed-questions"
import { shuffleArray } from "@/lib/utils"
import { checkAnswer } from "@/lib/quiz-engine"

function CustomPlayContent() {
  const searchParams = useSearchParams()
  const profileId = searchParams.get("profile") || "schaltschrankbau"
  const weight = parseInt(searchParams.get("weight") || "60")
  const count = parseInt(searchParams.get("count") || "20")

  const profile = PRESET_PROFILES.find((p) => p.id === profileId)
  const focusChapters: number[] = profile ? [...profile.focusChapters] : [1, 2, 3]

  // Build question pool with focus/cross split
  const focusCount = Math.round(count * (weight / 100))
  const crossCount = count - focusCount

  const allQuestions = SEED_QUESTIONS.map((q, i) => ({ ...q, id: `custom-${i}` }))
  const focusPool = allQuestions.filter((q) => focusChapters.includes(q.chapter_number))
  const crossPool = allQuestions.filter((q) => !focusChapters.includes(q.chapter_number))

  const selectedFocus = shuffleArray(focusPool).slice(0, focusCount).map((q) => ({ ...q, _isFocus: true }))
  const selectedCross = shuffleArray(crossPool).slice(0, crossCount).map((q) => ({ ...q, _isFocus: false }))
  const initialQuestions = shuffleArray([...selectedFocus, ...selectedCross]) as (Question & { _isFocus: boolean })[]

  const [questions] = useState(initialQuestions)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime] = useState(new Date())

  const handleAnswer = (answer: string) => {
    const question = questions[currentIndex]
    const correct = checkAnswer(question, answer)
    const newCount = correct ? correctCount + 1 : correctCount
    if (correct) setCorrectCount(newCount)

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        const duration = Math.round((Date.now() - startTime.getTime()) / 1000)
        const byChapter: Record<number, { total: number; correct: number }> = {}
        questions.forEach((q, i) => {
          if (!byChapter[q.chapter_number]) byChapter[q.chapter_number] = { total: 0, correct: 0 }
          byChapter[q.chapter_number].total++
        })
        setResult({
          totalQuestions: questions.length,
          correctAnswers: newCount,
          scorePercent: questions.length > 0 ? (newCount / questions.length) * 100 : 0,
          durationSeconds: duration,
          byChapter,
          mode: "custom",
        })
      } else {
        setCurrentIndex((i) => i + 1)
      }
    }, 2000)
  }

  if (result) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <ResultScreen result={result} />
      </main>
    )
  }

  if (questions.length === 0) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 text-center">
        <p className="text-text-muted">Keine Fragen für dieses Profil vorhanden.</p>
      </main>
    )
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-lg font-semibold mb-1">{profile?.name || "Mein Fachbereich"}</h1>
          <ProgressBar current={currentIndex + 1} total={questions.length} correctCount={correctCount} />
        </div>
        <QuestionCard
          key={questions[currentIndex].id}
          question={questions[currentIndex]}
          index={currentIndex}
          total={questions.length}
          onAnswer={handleAnswer}
          showFeedback={true}
          isFocus={(questions[currentIndex] as any)._isFocus}
        />
      </div>
    </main>
  )
}

export default function CustomPlayPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-text-muted">Laden...</div>}>
        <CustomPlayContent />
      </Suspense>
    </>
  )
}
