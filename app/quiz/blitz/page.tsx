"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { Timer } from "@/components/quiz/Timer"
import { StreakCounter } from "@/components/quiz/StreakCounter"
import { ResultScreen } from "@/components/quiz/ResultScreen"
import { Confetti } from "@/components/ui/Confetti"
import { Question, QuizResult } from "@/types"
import { SEED_QUESTIONS } from "@/lib/seed-questions"
import { shuffleArray, cn } from "@/lib/utils"
import { checkAnswer } from "@/lib/quiz-engine"
import { Zap } from "lucide-react"

export default function BlitzPage() {
  const [started, setStarted] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [flashColor, setFlashColor] = useState<"green" | "red" | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [answersMap, setAnswersMap] = useState<Map<string, boolean>>(new Map())
  const [showMilestoneConfetti, setShowMilestoneConfetti] = useState(false)
  const [screenShake, setScreenShake] = useState(false)

  const startBlitz = () => {
    const blitzQuestions = SEED_QUESTIONS
      .filter((q) => q.question_type === "true_false" || q.question_type === "multiple_choice")
      .map((q, i) => ({ ...q, id: `blitz-${i}` }))
    setQuestions(shuffleArray(blitzQuestions).slice(0, 15))
    setStarted(true)
    setStartTime(new Date())
    setCurrentIndex(0)
    setCorrectCount(0)
    setStreak(0)
    setBestStreak(0)
    setAnswersMap(new Map())
    setResult(null)
    setShowMilestoneConfetti(false)
  }

  const finishBlitz = useCallback((correct: number, best: number) => {
    if (!startTime) return
    const duration = Math.round((Date.now() - startTime.getTime()) / 1000)
    const byChapter: Record<number, { total: number; correct: number }> = {}
    questions.forEach((q) => {
      if (!byChapter[q.chapter_number]) byChapter[q.chapter_number] = { total: 0, correct: 0 }
      byChapter[q.chapter_number].total++
      if (answersMap.get(q.id)) byChapter[q.chapter_number].correct++
    })
    setResult({
      totalQuestions: questions.length,
      correctAnswers: correct,
      scorePercent: questions.length > 0 ? (correct / questions.length) * 100 : 0,
      durationSeconds: duration,
      byChapter,
      mode: "blitz",
      bestStreak: best,
    })
  }, [startTime, questions, answersMap])

  const handleMilestone = useCallback((milestone: number) => {
    if (milestone >= 10) {
      setShowMilestoneConfetti(true)
      setScreenShake(true)
      setTimeout(() => {
        setShowMilestoneConfetti(false)
        setScreenShake(false)
      }, 1500)
    }
  }, [])

  const handleAnswer = (answer: string) => {
    const question = questions[currentIndex]
    const correct = checkAnswer(question, answer)
    setAnswersMap((prev) => new Map(prev).set(question.id, correct))

    if (correct) {
      setCorrectCount((c) => c + 1)
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > bestStreak) setBestStreak(newStreak)
      setFlashColor("green")
    } else {
      setStreak(0)
      setFlashColor("red")
    }

    setTimeout(() => {
      setFlashColor(null)
      if (currentIndex + 1 >= questions.length) {
        finishBlitz(correct ? correctCount + 1 : correctCount, correct ? Math.max(bestStreak, streak + 1) : bestStreak)
      } else {
        setCurrentIndex((i) => i + 1)
      }
    }, 600)
  }

  const handleTimeUp = useCallback(() => {
    // Skip to next question on time up
    if (currentIndex + 1 >= questions.length) {
      finishBlitz(correctCount, bestStreak)
    } else {
      setStreak(0)
      setFlashColor("red")
      setTimeout(() => {
        setFlashColor(null)
        setCurrentIndex((i) => i + 1)
      }, 600)
    }
  }, [currentIndex, questions.length, correctCount, bestStreak, finishBlitz])

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

  if (!started) {
    return (
      <>
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-gradient-to-br from-cyan-950/50 to-bg-surface border-2 border-cyan-500/30 rounded-2xl p-8 text-center shadow-glow-cyan"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-cyan flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-cyan-400">Blitzrunde</h1>
            <p className="text-text-secondary mb-8">
              Richtig oder Falsch — 10 Sekunden pro Frage. Baue Streaks auf für Bonuspunkte!
            </p>
            <button
              onClick={startBlitz}
              className="w-full py-3.5 rounded-xl bg-gradient-cyan text-white font-medium hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
            >
              Los geht&apos;s!
            </button>
          </motion.div>
        </main>
      </>
    )
  }

  const question = questions[currentIndex]

  return (
    <>
      <Confetti trigger={showMilestoneConfetti} />
      <Navbar />
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          flashColor === "green" && "bg-accent-success/5",
          flashColor === "red" && "bg-accent-danger/5",
          screenShake && "animate-screen-shake"
        )}
      >
        <div className="max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <StreakCounter streak={streak} bestStreak={bestStreak} onMilestone={handleMilestone} />
            <Timer
              key={currentIndex}
              totalSeconds={10}
              onTimeUp={handleTimeUp}
              isRunning={true}
              variant="ring"
            />
            <span className="text-sm text-text-muted font-mono">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-gradient-to-br from-cyan-950/30 to-bg-surface border border-cyan-500/20 rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                {question.question_text}
              </h2>

              {question.question_type === "true_false" && (
                <div className="flex gap-4">
                  {["true", "false"].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleAnswer(val)}
                      className="flex-1 py-4 rounded-xl border-2 border-border-subtle text-center font-medium text-text-secondary hover:border-cyan-500 hover:text-cyan-400 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
                    >
                      {val === "true" ? "Richtig" : "Falsch"}
                    </button>
                  ))}
                </div>
              )}

              {question.question_type === "multiple_choice" && question.options && (
                <div className="space-y-3">
                  {question.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(String(i))}
                      className="w-full text-left p-4 rounded-xl border-2 border-border-subtle text-text-secondary hover:border-cyan-500 hover:text-text-primary transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
                    >
                      <span className="font-mono text-sm mr-3 opacity-50">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </>
  )
}
