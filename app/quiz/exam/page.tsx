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
import { Slider } from "@/components/ui/Slider"
import { Target } from "lucide-react"

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
  }

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      finishExam()
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  const handleTimeUp = useCallback(() => {
    finishExam()
  }, [finishExam])

  if (result) {
    return (
      <>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
          <ResultScreen result={result} />
        </main>
      </>
    )
  }

  if (!started) {
    return (
      <>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
          <div className="max-w-md mx-auto bg-bg-surface border border-border-subtle p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-accent-primary" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Offizielle LAP-Simulation</span>
            </div>

            <h1 className="text-2xl font-bold mb-2 tracking-tight">Prüfungssimulation</h1>
            <p className="text-sm text-text-muted mb-8">
              Simuliert das mündliche LAP-Fachgespräch. Zufällige Fragen aus allen Kapiteln — keine Rückkehr zu beantworteten Fragen.
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Fragenanzahl</label>
                  <span className="text-sm font-mono font-medium text-text-primary">{config.count}</span>
                </div>
                <Slider
                  value={config.count}
                  onChange={(v) => setConfig((c) => ({ ...c, count: v }))}
                  min={5}
                  max={50}
                  step={1}
                  showValue={false}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Zeitlimit</label>
                  <span className="text-sm font-mono font-medium text-text-primary">{config.timeMinutes} Min</span>
                </div>
                <Slider
                  value={config.timeMinutes}
                  onChange={(v) => setConfig((c) => ({ ...c, timeMinutes: v }))}
                  min={5}
                  max={60}
                  step={5}
                  showValue={false}
                />
              </div>
            </div>

            <button
              onClick={startExam}
              className="w-full py-3.5 bg-text-primary text-bg-primary font-medium hover:bg-accent-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface uppercase tracking-wider text-[13px]"
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
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-6 bg-bg-surface p-4 border border-border-subtle">
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
              onNext={handleNext}
              showFeedback={true}
            />
          )}
        </div>
      </main>
    </>
  )
}
