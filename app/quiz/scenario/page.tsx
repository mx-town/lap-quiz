"use client"

import { useState, useRef } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { QuestionCard } from "@/components/quiz/QuestionCard"
import { ProgressBar } from "@/components/quiz/ProgressBar"
import { ResultScreen } from "@/components/quiz/ResultScreen"
import { Question, QuizResult, CHAPTERS } from "@/types"
import { SEED_QUESTIONS } from "@/lib/seed-questions"
import { shuffleArray } from "@/lib/utils"
import { checkAnswer } from "@/lib/quiz-engine"
import { Wrench, AlertTriangle, BookOpen } from "lucide-react"

export default function ScenarioPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime] = useState(new Date())
  const correctByChapterRef = useRef<Record<number, number>>({})

  const questions: Question[] = SEED_QUESTIONS
    .filter((q) => q.question_type === "scenario")
    .map((q, i) => ({ ...q, id: `scenario-${i}` }))

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
        mode: "scenario",
      })
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  if (result) {
    return (
      <>
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
          <ResultScreen result={result} />
        </main>
      </>
    )
  }

  if (questions.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
          <div className="max-w-md mx-auto bg-bg-surface border border-border-subtle rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">Praxisszenarien</h1>
            <p className="text-text-secondary">Noch keine Szenario-Fragen vorhanden. Fragen werden über Supabase geladen.</p>
          </div>
        </main>
      </>
    )
  }

  const currentQuestion = questions[currentIndex]
  const chapter = CHAPTERS.find((c) => c.number === currentQuestion.chapter_number)

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Scenario context header */}
          <div className="bg-bg-surface rounded-xl p-5 border border-border-subtle">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-amber-600 dark:text-amber-400">Praxisszenario</h1>
                  <p className="text-xs text-text-muted">Praktische Anwendung & Fehleranalyse</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 px-3 py-1.5 rounded-full">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Kap. {currentQuestion.chapter_number}</span>
              </div>
            </div>

            {/* Scenario context card */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-bg-tertiary border border-border-subtle">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-text-secondary">
                <span className="font-medium text-amber-600 dark:text-amber-400">Kontext: </span>
                Du bist Mechatroniker im Aussendienst und stößt auf folgende Situation im Bereich{" "}
                <span className="text-amber-600 dark:text-amber-400">{chapter?.name || `Kapitel ${currentQuestion.chapter_number}`}</span>.
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-bg-surface rounded-xl p-4 border border-border-subtle">
            <ProgressBar current={currentIndex + 1} total={questions.length} correctCount={correctCount} />
          </div>

          {/* Question card */}
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            index={currentIndex}
            total={questions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
            showFeedback={true}
          />
        </div>
      </main>
    </>
  )
}
