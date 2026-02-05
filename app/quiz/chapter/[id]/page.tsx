"use client"

import { useState, use } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { QuestionCard } from "@/components/quiz/QuestionCard"
import { ProgressBar } from "@/components/quiz/ProgressBar"
import { ResultScreen } from "@/components/quiz/ResultScreen"
import { Question, QuizResult, CHAPTERS } from "@/types"
import { SEED_QUESTIONS } from "@/lib/seed-questions"
import { checkAnswer } from "@/lib/quiz-engine"

export default function ChapterQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const chapterNum = parseInt(id)
  const chapter = CHAPTERS.find((c) => c.number === chapterNum)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime] = useState(new Date())

  // Filter questions for this chapter
  const questions: Question[] = SEED_QUESTIONS
    .filter((q) => q.chapter_number === chapterNum)
    .map((q, i) => ({ ...q, id: `chapter-${chapterNum}-${i}` }))

  const finishQuiz = (correct: number) => {
    const duration = Math.round((Date.now() - startTime.getTime()) / 1000)
    setResult({
      totalQuestions: questions.length,
      correctAnswers: correct,
      scorePercent: questions.length > 0 ? (correct / questions.length) * 100 : 0,
      durationSeconds: duration,
      byChapter: { [chapterNum]: { total: questions.length, correct } },
      mode: "chapter",
    })
  }

  const handleAnswer = (answer: string) => {
    const question = questions[currentIndex]
    const correct = checkAnswer(question, answer)
    const newCount = correct ? correctCount + 1 : correctCount
    if (correct) setCorrectCount(newCount)

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        finishQuiz(newCount)
      } else {
        setCurrentIndex((i) => i + 1)
      }
    }, 2000)
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
          <p className="text-text-muted">Keine Fragen für Kapitel {chapterNum} vorhanden.</p>
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
            <h1 className="text-lg font-semibold mb-1">
              Kap. {chapterNum}: {chapter?.name}
            </h1>
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
