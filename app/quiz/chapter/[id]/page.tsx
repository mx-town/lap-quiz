"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
import { QuestionCard } from "@/components/quiz/QuestionCard"
import { ProgressBar } from "@/components/quiz/ProgressBar"
import { ResultScreen } from "@/components/quiz/ResultScreen"
import { Question, QuizResult, CHAPTERS } from "@/types"
import { SEED_QUESTIONS } from "@/lib/seed-questions"
import { shuffleArray } from "@/lib/utils"
import { checkAnswer } from "@/lib/quiz-engine"
import { saveQuizProgress, getQuizProgress, clearQuizProgress } from "@/lib/local-storage"
import { useBeforeUnload } from "@/lib/useBeforeUnload"
import * as Dialog from "@radix-ui/react-dialog"

export default function ChapterQuizPage({ params }: { params: { id: string } }) {
  const { id } = params
  const chapterNum = parseInt(id)
  const isValidChapter = !isNaN(chapterNum)
  const chapter = isValidChapter ? CHAPTERS.find((c) => c.number === chapterNum) : undefined

  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime] = useState(new Date())
  const [answersMap, setAnswersMap] = useState<Record<string, boolean>>({})
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nextCountRef = useRef<number>(0)
  const [resumeDialog, setResumeDialog] = useState(false)
  const [savedProgress, setSavedProgress] = useState<ReturnType<typeof getQuizProgress>>(null)
  const [hasResumed, setHasResumed] = useState(false)

  const [questions, setQuestions] = useState<Question[]>(() =>
    isValidChapter
      ? shuffleArray(
          SEED_QUESTIONS
            .filter((q) => q.chapter_number === chapterNum)
            .map((q, i) => ({ ...q, id: `chapter-${chapterNum}-${i}` }))
        )
      : []
  )

  useBeforeUnload(questions.length > 0 && result === null && !resumeDialog)

  // Check for saved progress on mount
  useEffect(() => {
    const progress = getQuizProgress()
    if (progress && progress.mode === "chapter" && progress.chapterNumber === chapterNum) {
      setSavedProgress(progress)
      setResumeDialog(true)
    }
  }, [chapterNum])

  const resumeQuiz = () => {
    if (!savedProgress) return
    // Reconstruct questions in the saved order
    const allChapterQuestions = SEED_QUESTIONS
      .filter((q) => q.chapter_number === chapterNum)
      .map((q, i) => ({ ...q, id: `chapter-${chapterNum}-${i}` }))
    const resumedQuestions = savedProgress.questionIds
      .map((id) => allChapterQuestions.find((q) => q.id === id))
      .filter(Boolean) as Question[]
    setQuestions(resumedQuestions)
    setCurrentIndex(savedProgress.currentIndex)
    setCorrectCount(savedProgress.correctCount)
    setAnswersMap(savedProgress.answers)
    nextCountRef.current = savedProgress.correctCount
    setHasResumed(true)
    setResumeDialog(false)
  }

  const discardProgress = () => {
    clearQuizProgress()
    setResumeDialog(false)
    setSavedProgress(null)
  }

  const finishQuiz = (correct: number) => {
    const duration = Math.round((Date.now() - startTime.getTime()) / 1000)
    clearQuizProgress()
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
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      // Save progress
      saveQuizProgress({
        mode: "chapter",
        questionIds: questions.map((q) => q.id),
        currentIndex: nextIndex,
        correctCount: newCount,
        answers: answersMap,
        startTime: startTime.getTime(),
        chapterNumber: chapterNum,
      })
    }
  }, [currentIndex, questions.length, answersMap, startTime, chapterNum])

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

    const newAnswers = { ...answersMap, [question.id]: correct }
    setAnswersMap(newAnswers)

    // Save progress
    saveQuizProgress({
      mode: "chapter",
      questionIds: questions.map((q) => q.id),
      currentIndex,
      correctCount: newCount,
      answers: newAnswers,
      startTime: startTime.getTime(),
      chapterNumber: chapterNum,
    })
  }

  if (!isValidChapter) {
    return (
      <>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 pb-20 md:pb-12 text-center">
          <p className="text-text-primary text-lg font-semibold mb-2">Kapitel nicht gefunden</p>
          <p className="text-text-muted mb-6 text-sm">Die angegebene Kapitel-ID ist ungültig.</p>
          <Link
            href="/quiz/chapter"
            className="inline-flex items-center gap-2 px-4 py-2 bg-text-primary text-bg-primary font-medium hover:bg-accent-primary transition-colors uppercase tracking-wider text-[13px]"
          >
            Zur Kapitelauswahl
          </Link>
        </main>
        <BottomNav />
      </>
    )
  }

  if (result) {
    return (
      <>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 pb-20 md:pb-12">
          <ResultScreen result={result} />
        </main>
        <BottomNav />
      </>
    )
  }

  if (questions.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 pb-20 md:pb-12 text-center">
          <p className="text-text-muted">Keine Fragen für Kapitel {chapterNum} vorhanden.</p>
        </main>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 pb-20 md:pb-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-base font-semibold mb-2 tracking-tight">
              <span className="text-text-muted font-mono mr-2">{String(chapterNum).padStart(2, "0")}</span>
              {chapter?.name}
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
      <BottomNav />

      {/* Resume dialog */}
      <Dialog.Root open={resumeDialog} onOpenChange={setResumeDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-surface border border-border-subtle p-6 max-w-sm w-[calc(100%-2rem)] z-50">
            <Dialog.Title className="text-lg font-semibold text-text-primary mb-2">
              Quiz fortsetzen?
            </Dialog.Title>
            <Dialog.Description className="text-sm text-text-muted mb-6">
              Du hast ein laufendes Kapitel-Quiz mit {savedProgress?.currentIndex ?? 0} beantworteten Fragen. Möchtest du fortfahren?
            </Dialog.Description>
            <div className="flex gap-3">
              <button
                onClick={discardProgress}
                className="flex-1 py-2.5 border border-border-subtle text-text-secondary text-[13px] font-medium hover:border-text-muted hover:text-text-primary transition-colors uppercase tracking-wider"
              >
                Verwerfen
              </button>
              <button
                onClick={resumeQuiz}
                className="flex-1 py-2.5 bg-text-primary text-bg-primary text-[13px] font-medium hover:bg-accent-primary transition-colors uppercase tracking-wider"
              >
                Fortsetzen
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
