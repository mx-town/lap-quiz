"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { QuestionCard } from "@/components/quiz/QuestionCard"
import { ProgressBar } from "@/components/quiz/ProgressBar"
import { Timer } from "@/components/quiz/Timer"
import { ResultScreen } from "@/components/quiz/ResultScreen"
import { Question, QuizResult } from "@/types"
import { SEED_QUESTIONS } from "@/lib/seed-questions"
import { shuffleArray, cn } from "@/lib/utils"
import { checkAnswer } from "@/lib/quiz-engine"
import { Target, Shield, Clock } from "lucide-react"

export default function ExamPage() {
  const [started, setStarted] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answers, setAnswers] = useState<Map<string, boolean>>(new Map())
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [config, setConfig] = useState({ count: 20, timeMinutes: 30 })

  const startExam = () => {
    // Use seed questions for now; replace with Supabase fetch later
    const q = shuffleArray(SEED_QUESTIONS.map((sq, i) => ({ ...sq, id: `seed-${i}` }))).slice(0, config.count)
    setQuestions(q)
    setStarted(true)
    setStartTime(new Date())
    setCurrentIndex(0)
    setCorrectCount(0)
    setAnswers(new Map())
    setResult(null)
  }

  const finishExam = useCallback(() => {
    if (!startTime || questions.length === 0) return
    const duration = Math.round((Date.now() - startTime.getTime()) / 1000)

    const byChapter: Record<number, { total: number; correct: number }> = {}
    questions.forEach((q) => {
      if (!byChapter[q.chapter_number]) {
        byChapter[q.chapter_number] = { total: 0, correct: 0 }
      }
      byChapter[q.chapter_number].total++
      if (answers.get(q.id)) byChapter[q.chapter_number].correct++
    })

    setResult({
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      scorePercent: (correctCount / questions.length) * 100,
      durationSeconds: duration,
      byChapter,
      mode: "exam",
    })
  }, [startTime, questions, answers, correctCount])

  const handleAnswer = (answer: string) => {
    const question = questions[currentIndex]
    const correct = checkAnswer(question, answer)
    if (correct) setCorrectCount((c) => c + 1)
    setAnswers((prev) => new Map(prev).set(question.id, correct))

    // Move to next after delay
    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        finishExam()
      } else {
        setCurrentIndex((i) => i + 1)
      }
    }, 1500)
  }

  const handleTimeUp = useCallback(() => {
    finishExam()
  }, [finishExam])

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
            className="max-w-md mx-auto bg-gradient-to-br from-blue-950/50 to-bg-surface border-2 border-blue-700/30 rounded-2xl p-8 shadow-glow-blue"
          >
            {/* Official badge */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium text-blue-400">Offizielle LAP-Simulation</span>
              </div>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-blue flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-center text-blue-400">Prüfungssimulation</h1>
            <p className="text-text-secondary mb-8 text-center">
              Simuliert das mündliche LAP-Fachgespräch. Zufällige Fragen aus allen Kapiteln — keine Rückkehr zu beantworteten Fragen.
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="text-sm text-text-secondary block mb-2">Fragenanzahl</label>
                <div className="flex gap-2">
                  {[10, 20, 30].map((n) => (
                    <button
                      key={n}
                      onClick={() => setConfig((c) => ({ ...c, count: n }))}
                      className={cn(
                        "flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface",
                        config.count === n
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-border-subtle text-text-muted hover:border-border-panel"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-text-secondary block mb-2">Zeitlimit</label>
                <div className="flex gap-2">
                  {[15, 30, 45].map((m) => (
                    <button
                      key={m}
                      onClick={() => setConfig((c) => ({ ...c, timeMinutes: m }))}
                      className={cn(
                        "flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-center gap-1.5",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface",
                        config.timeMinutes === m
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-border-subtle text-text-muted hover:border-border-panel"
                      )}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {m} Min
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={startExam}
              className="w-full py-3.5 rounded-xl bg-gradient-blue text-white font-medium hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
            >
              Prüfung starten
            </button>
          </motion.div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Blue-themed header bar */}
          <div className="flex items-center gap-6 bg-blue-950/30 rounded-xl p-4 border border-blue-500/20">
            <div className="flex-1">
              <ProgressBar current={currentIndex + 1} total={questions.length} correctCount={correctCount} />
            </div>
            <Timer
              totalSeconds={config.timeMinutes * 60}
              onTimeUp={handleTimeUp}
              isRunning={true}
            />
          </div>

          {questions[currentIndex] && (
            <QuestionCard
              key={questions[currentIndex].id}
              question={questions[currentIndex]}
              index={currentIndex}
              total={questions.length}
              onAnswer={handleAnswer}
              showFeedback={true}
            />
          )}
        </div>
      </main>
    </>
  )
}
