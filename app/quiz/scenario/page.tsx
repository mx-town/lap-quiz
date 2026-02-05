"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { QuestionCard } from "@/components/quiz/QuestionCard"
import { ProgressBar } from "@/components/quiz/ProgressBar"
import { ResultScreen } from "@/components/quiz/ResultScreen"
import { Question, QuizResult } from "@/types"
import { SEED_QUESTIONS } from "@/lib/seed-questions"
import { shuffleArray } from "@/lib/utils"
import { checkAnswer } from "@/lib/quiz-engine"

export default function ScenarioPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime] = useState(new Date())

  const questions: Question[] = SEED_QUESTIONS
    .filter((q) => q.question_type === "scenario")
    .map((q, i) => ({ ...q, id: `scenario-${i}` }))

  const handleAnswer = (answer: string) => {
    const question = questions[currentIndex]
    const correct = checkAnswer(question, answer)
    const newCount = correct ? correctCount + 1 : correctCount
    if (correct) setCorrectCount(newCount)

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        const duration = Math.round((Date.now() - startTime.getTime()) / 1000)
        const byChapter: Record<number, { total: number; correct: number }> = {}
        questions.forEach((q) => {
          if (!byChapter[q.chapter_number]) byChapter[q.chapter_number] = { total: 0, correct: 0 }
          byChapter[q.chapter_number].total++
        })
        setResult({
          totalQuestions: questions.length,
          correctAnswers: newCount,
          scorePercent: questions.length > 0 ? (newCount / questions.length) * 100 : 0,
          durationSeconds: duration,
          byChapter,
          mode: "scenario",
        })
      } else {
        setCurrentIndex((i) => i + 1)
      }
    }, 2500)
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
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Praxisszenarien</h1>
          <p className="text-text-muted">Noch keine Szenario-Fragen vorhanden. Fragen werden über Supabase geladen.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-lg font-semibold mb-1">Praxisszenario</h1>
            <ProgressBar current={currentIndex + 1} total={questions.length} correctCount={correctCount} />
          </div>
          <QuestionCard
            key={questions[currentIndex].id}
            question={questions[currentIndex]}
            index={currentIndex}
            total={questions.length}
            onAnswer={handleAnswer}
            showFeedback={true}
          />
        </div>
      </main>
    </>
  )
}
