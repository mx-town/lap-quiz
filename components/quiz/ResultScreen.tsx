"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { QuizResult, CHAPTERS } from "@/types"
import { cn, formatPercent, formatTime, getScoreColor, getScoreBg } from "@/lib/utils"
import { Trophy, RotateCcw, Home, TrendingUp, Medal } from "lucide-react"

function getProgressBarColor(percent: number): string {
  if (percent >= 70) return "bg-accent-success shadow-glow-success"
  if (percent >= 50) return "bg-accent-warning"
  return "bg-accent-danger"
}
import { Confetti } from "@/components/ui/Confetti"

interface ResultScreenProps {
  result: QuizResult
}

export function ResultScreen({ result }: ResultScreenProps) {
  const passed = result.scorePercent >= 70
  const excellent = result.scorePercent >= 90
  const [displayScore, setDisplayScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Animated counter for score
  useEffect(() => {
    const duration = 1000
    const steps = 30
    const stepValue = result.scorePercent / steps
    const stepDuration = duration / steps
    let current = 0

    const interval = setInterval(() => {
      current += stepValue
      if (current >= result.scorePercent) {
        setDisplayScore(result.scorePercent)
        clearInterval(interval)
        // Trigger confetti after counter finishes for excellent scores
        if (excellent) {
          setShowConfetti(true)
        }
      } else {
        setDisplayScore(current)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [result.scorePercent, excellent])

  const getTrophyIcon = () => {
    if (excellent) return <Trophy className="w-8 h-8 text-accent-warning" />
    if (passed) return <Medal className="w-8 h-8 text-accent-success" />
    return null
  }

  return (
    <>
      <Confetti trigger={showConfetti} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-8 text-center">
          {/* Score */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={cn(
              "w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center relative",
              getScoreBg(result.scorePercent),
              excellent && "shadow-glow-warning",
              passed && !excellent && "shadow-glow-success"
            )}
          >
            {/* Trophy/Medal overlay */}
            {getTrophyIcon() && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2"
              >
                {getTrophyIcon()}
              </motion.div>
            )}
            <div>
              <motion.p
                className={cn("text-4xl font-bold", getScoreColor(result.scorePercent))}
              >
                {formatPercent(displayScore)}
              </motion.p>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold mb-2"
          >
            {excellent ? "Ausgezeichnet!" : passed ? "Bestanden!" : "Nicht bestanden"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-text-secondary mb-8"
          >
            {result.correctAnswers} von {result.totalQuestions} richtig · {formatTime(result.durationSeconds)}
          </motion.p>

          {/* Chapter breakdown */}
          <div className="text-left mb-8">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
              Auswertung nach Kapitel
            </h3>
            <div className="space-y-2">
              {Object.entries(result.byChapter).map(([chapterNum, stats], index) => {
                const chapter = CHAPTERS.find((c) => c.number === parseInt(chapterNum))
                const percent = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
                return (
                  <motion.div
                    key={chapterNum}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-xs text-text-muted w-6 font-mono">{chapterNum}</span>
                    <span className="text-sm text-text-secondary flex-1 truncate">
                      {chapter?.name || `Kapitel ${chapterNum}`}
                    </span>
                    <div className="w-24 h-2.5 bg-bg-tertiary border border-border-subtle rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.7, delay: 0.8 + index * 0.05, ease: "easeOut" }}
                        className={cn("h-full rounded-full", getProgressBarColor(percent))}
                      />
                    </div>
                    <span className={cn("text-xs font-mono w-10 text-right", getScoreColor(percent))}>
                      {stats.correct}/{stats.total}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              href={`/quiz/${result.mode}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-primary text-white font-medium hover:bg-accent-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
            >
              <RotateCcw className="w-4 h-4" />
              Nochmal
            </Link>
            <Link
              href="/stats"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-bg-tertiary text-text-secondary font-medium hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
            >
              <TrendingUp className="w-4 h-4" />
              Statistik
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-bg-tertiary text-text-secondary font-medium hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
            >
              <Home className="w-4 h-4" />
              Start
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
