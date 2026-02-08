"use client"

import { useState, useCallback, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
import { QuestionCard } from "@/components/quiz/QuestionCard"
import { ProgressBar } from "@/components/quiz/ProgressBar"
import { ResultScreen } from "@/components/quiz/ResultScreen"
import { Question, QuizResult, PRESET_PROFILES } from "@/types"
import { SEED_QUESTIONS } from "@/lib/seed-questions"
import { shuffleArray } from "@/lib/utils"
import { checkAnswer } from "@/lib/quiz-engine"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

function CustomPlayContent() {
  const searchParams = useSearchParams()
  const profileId = searchParams.get("profile") || "schaltschrankbau"
  const rawWeight = parseInt(searchParams.get("weight") || "60")
  const rawCount = parseInt(searchParams.get("count") || "20")

  const weight = isNaN(rawWeight) || rawWeight < 50 || rawWeight > 80 ? 60 : rawWeight
  const count = isNaN(rawCount) || rawCount < 1 ? 20 : rawCount

  const profile = PRESET_PROFILES.find((p) => p.id === profileId)

  if (!profile) {
    return (
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 pb-20 md:pb-12">
        <div className="max-w-md mx-auto bg-bg-surface border border-border-subtle p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-accent-danger" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Fehler</span>
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight">Ungültiges Profil</h1>
          <p className="text-sm text-text-muted mb-6">
            Das Profil &quot;{profileId}&quot; wurde nicht gefunden.
          </p>
          <Link
            href="/quiz/custom"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-text-primary text-bg-primary font-medium hover:bg-accent-primary transition-colors uppercase tracking-wider text-[13px]"
          >
            Zurück zur Auswahl
          </Link>
        </div>
      </main>
    )
  }

  const focusChapters: number[] = [...profile.focusChapters]

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
  const correctByChapterRef = useRef<Record<number, number>>({})

  const handleAnswer = (answer: string) => {
    const question = questions[currentIndex]
    const correct = checkAnswer(question, answer)
    if (correct) {
      setCorrectCount((c) => c + 1)
      correctByChapterRef.current[question.chapter_number] = (correctByChapterRef.current[question.chapter_number] || 0) + 1
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      const duration = Math.round((Date.now() - startTime.getTime()) / 1000)
      const byChapter: Record<number, { total: number; correct: number }> = {}
      questions.forEach((q) => {
        if (!byChapter[q.chapter_number]) byChapter[q.chapter_number] = { total: 0, correct: 0 }
        byChapter[q.chapter_number].total++
      })
      Object.keys(byChapter).forEach((ch) => {
        byChapter[Number(ch)].correct = correctByChapterRef.current[Number(ch)] || 0
      })
      const totalCorrect = Object.values(correctByChapterRef.current).reduce((a, b) => a + b, 0)
      setResult({
        totalQuestions: questions.length,
        correctAnswers: totalCorrect,
        scorePercent: questions.length > 0 ? (totalCorrect / questions.length) * 100 : 0,
        durationSeconds: duration,
        byChapter,
        mode: "custom",
      })
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  if (result) {
    return (
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 pb-20 md:pb-12">
        <ResultScreen result={result} />
      </main>
    )
  }

  if (questions.length === 0) {
    return (
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 pb-20 md:pb-12 text-center">
        <p className="text-text-muted">Keine Fragen für dieses Profil vorhanden.</p>
      </main>
    )
  }

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-base font-semibold mb-2 tracking-tight">{profile?.name || "Mein Fachbereich"}</h1>
          <ProgressBar current={currentIndex + 1} total={questions.length} correctCount={correctCount} />
        </div>
        <QuestionCard
          key={questions[currentIndex].id}
          question={questions[currentIndex]}
          index={currentIndex}
          total={questions.length}
          onAnswer={handleAnswer}
          onNext={handleNext}
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
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-text-muted font-mono text-sm">Laden...</div>}>
        <CustomPlayContent />
      </Suspense>
      <BottomNav />
    </>
  )
}
