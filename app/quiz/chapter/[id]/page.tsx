"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { QuestionCard } from "@/components/quiz/QuestionCard"
import { ProgressBar } from "@/components/quiz/ProgressBar"
import { ResultScreen } from "@/components/quiz/ResultScreen"
import { Question, QuizResult, CHAPTERS } from "@/types"
import { SEED_QUESTIONS } from "@/lib/seed-questions"
import { checkAnswer } from "@/lib/quiz-engine"

export default function ChapterQuizPage({ params }: { params: { id: string } }) {
  const { id } = params
  const chapterNum = parseInt(id)
  const isValidChapter = !isNaN(chapterNum)
  const chapter = isValidChapter ? CHAPTERS.find((c) => c.number === chapterNum) : undefined

  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime] = useState(new Date())
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nextCountRef = useRef<number>(0)

  // Filter questions for this chapter
  const questions: Question[] = isValidChapter
    ? SEED_QUESTIONS
        .filter((q) => q.chapter_number === chapterNum)
        .map((q, i) => ({ ...q, id: `chapter-${chapterNum}-${i}` }))
    : []

  const finishQuiz = (correct: number) => {
    const duration = Math.round((Date.now() - startTime.getTime()) / 1000)
    setResult({
      totalQuestions: questions.length,
      correctAnswers: correct,
      scorePercent: questions.length > 0 ? (correct / questions.length) * 100 : 0,
      durationSeconds: duration,
      byChapter: { [chapterNum]: { total: questions.length, correct } },
      mode: "chapter",
      chapterNumber: chapterNum,
    })
  }

  const goToNext = useCallback((newCount: number) => {
    if (currentIndex + 1 >= questions.length) {
      finishQuiz(newCount)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, questions.length])

  const handleNext = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    goToNext(nextCountRef.current)
  }, [goToNext])

  const handleAnswer = (answer: string) => {
    const question = questions[currentIndex]
    const correct = checkAnswer(question, answer)
    const newCount = correct ? correctCount + 1 : correctCount
    if (correct) setCorrectCount(newCount)
    nextCountRef.current = newCount

    timeoutRef.current = setTimeout(() => {
      goToNext(newCount)
    }, 2000)
  }

  // Bug 4: Invalid chapter ID
  if (!isValidChapter) {
    return (
      <>
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 text-center">
          <p className="text-text-primary text-lg font-semibold mb-2">Kapitel nicht gefunden</p>
          <p className="text-text-muted mb-6">Die angegebene Kapitel-ID ist ungültig.</p>
          <Link
            href="/quiz/chapter"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-primary text-white font-medium hover:bg-accent-secondary transition-colors"
          >
            Zur Kapitelauswahl
          </Link>
        </main>
      </>
    )
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
            onNext={handleNext}
            showFeedback={true}
          />
        </div>
      </main>
    </>
  )
}
