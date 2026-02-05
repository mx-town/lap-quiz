"use client"

import { useState, useCallback, useEffect } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { QuestionCard } from "@/components/quiz/QuestionCard"
import { ProgressBar } from "@/components/quiz/ProgressBar"
import { Timer } from "@/components/quiz/Timer"
import { ResultScreen } from "@/components/quiz/ResultScreen"
import { Question, QuizResult } from "@/types"
import { SEED_QUESTIONS } from "@/lib/seed-questions"
import { shuffleArray } from "@/lib/utils"
import { checkAnswer } from "@/lib/quiz-engine"

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
          <div className="max-w-md mx-auto bg-bg-surface border border-border-subtle rounded-2xl p-8">
            <h1 className="text-2xl font-bold mb-6">Prüfungssimulation</h1>
            <p className="text-text-muted mb-8">
              Simuliert das mündliche LAP-Fachgespräch. Zufällige Fragen aus allen Kapiteln — keine Rückkehr zu beantworteten Fragen.
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="text-sm text-text-muted block mb-2">Fragenanzahl</label>
                <div className="flex gap-2">
                  {[10, 20, 30].map((n) => (
                    <button
                      key={n}
                      onClick={() => setConfig((c) => ({ ...c, count: n }))}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        config.count === n
                          ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                          : "border-border-subtle text-text-muted hover:border-border-panel"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-text-muted block mb-2">Zeitlimit</label>
                <div className="flex gap-2">
                  {[15, 30, 45].map((m) => (
                    <button
                      key={m}
                      onClick={() => setConfig((c) => ({ ...c, timeMinutes: m }))}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        config.timeMinutes === m
                          ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                          : "border-border-subtle text-text-muted hover:border-border-panel"
                      }`}
                    >
                      {m} Min
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={startExam}
              className="w-full py-3 rounded-xl bg-accent-primary text-white font-medium hover:bg-accent-secondary transition-colors"
            >
              Prüfung starten
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-6">
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
