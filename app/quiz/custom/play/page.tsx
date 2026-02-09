"use client"

import { useState, useCallback, useRef, Suspense, useEffect } from "react"
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
import { saveQuizProgress, getQuizProgress, clearQuizProgress } from "@/lib/local-storage"
import { useBeforeUnload } from "@/lib/useBeforeUnload"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"

function CustomPlayContent() {
  const searchParams = useSearchParams()
  const profileId = searchParams.get("profile") || "schaltschrankbau"
  const rawWeight = parseInt(searchParams.get("weight") || "60")
  const rawCount = parseInt(searchParams.get("count") || "20")

  const weight = isNaN(rawWeight) || rawWeight < 50 || rawWeight > 80 ? 60 : rawWeight
  const count = isNaN(rawCount) || rawCount < 1 ? 20 : rawCount

  const profile = PRESET_PROFILES.find((p) => p.id === profileId)

  const [resumeDialog, setResumeDialog] = useState(false)
  const [savedProgress, setSavedProgress] = useState<ReturnType<typeof getQuizProgress>>(null)

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

  const [questions, setQuestions] = useState(initialQuestions)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime] = useState(new Date())
  const correctByChapterRef = useRef<Record<number, number>>({})
  const [answersMap, setAnswersMap] = useState<Record<string, boolean>>({})

  useBeforeUnload(questions.length > 0 && result === null && !resumeDialog)

  // Check for saved progress on mount
  useEffect(() => {
    const progress = getQuizProgress()
    if (progress && progress.mode === "custom") {
      setSavedProgress(progress)
      setResumeDialog(true)
    }
  }, [])

  const resumeQuiz = () => {
    if (!savedProgress) return
    // Reconstruct questions in the saved order
    const allQ = SEED_QUESTIONS.map((q, i) => ({ ...q, id: `custom-${i}` }))
    const resumedQuestions = savedProgress.questionIds
      .map((id) => {
        const q = allQ.find((aq) => aq.id === id)
        if (!q) return null
        return { ...q, _isFocus: focusChapters.includes(q.chapter_number) }
      })
      .filter(Boolean) as (Question & { _isFocus: boolean })[]
    setQuestions(resumedQuestions)
    setCurrentIndex(savedProgress.currentIndex)
    setCorrectCount(savedProgress.correctCount)
    setAnswersMap(savedProgress.answers)

    // Reconstruct correctByChapter from answers
    for (const [qId, correct] of Object.entries(savedProgress.answers)) {
      if (correct) {
        const q = allQ.find((aq) => aq.id === qId)
        if (q) {
          correctByChapterRef.current[q.chapter_number] = (correctByChapterRef.current[q.chapter_number] || 0) + 1
        }
      }
    }
    setResumeDialog(false)
  }

  const discardProgress = () => {
    clearQuizProgress()
    setResumeDialog(false)
    setSavedProgress(null)
  }

  const handleAnswer = (answer: string) => {
    const question = questions[currentIndex]
    const correct = checkAnswer(question, answer)
    if (correct) {
      setCorrectCount((c) => c + 1)
      correctByChapterRef.current[question.chapter_number] = (correctByChapterRef.current[question.chapter_number] || 0) + 1
    }

    const newAnswers = { ...answersMap, [question.id]: correct }
    setAnswersMap(newAnswers)

    // Save progress
    saveQuizProgress({
      mode: "custom",
      questionIds: questions.map((q) => q.id),
      currentIndex,
      correctCount: correct ? correctCount + 1 : correctCount,
      answers: newAnswers,
      startTime: startTime.getTime(),
    })
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
      clearQuizProgress()
      setResult({
        totalQuestions: questions.length,
        correctAnswers: totalCorrect,
        scorePercent: questions.length > 0 ? (totalCorrect / questions.length) * 100 : 0,
        durationSeconds: duration,
        byChapter,
        mode: "custom",
      })
    } else {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      // Save progress with updated index
      saveQuizProgress({
        mode: "custom",
        questionIds: questions.map((q) => q.id),
        currentIndex: nextIndex,
        correctCount,
        answers: answersMap,
        startTime: startTime.getTime(),
      })
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
    <>
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

      {/* Resume dialog */}
      <Dialog.Root open={resumeDialog} onOpenChange={setResumeDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-surface border border-border-subtle p-6 max-w-sm w-[calc(100%-2rem)] z-50">
            <Dialog.Title className="text-lg font-semibold text-text-primary mb-2">
              Quiz fortsetzen?
            </Dialog.Title>
            <Dialog.Description className="text-sm text-text-muted mb-6">
              Du hast ein laufendes Custom-Quiz mit {savedProgress?.currentIndex ?? 0} beantworteten Fragen. Möchtest du fortfahren?
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
