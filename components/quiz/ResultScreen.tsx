"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { QuizResult, CHAPTERS } from "@/types"
import { cn, formatPercent, formatTime, getScoreColor } from "@/lib/utils"
import { RotateCcw, Home, TrendingUp, Flame } from "lucide-react"

function getProgressBarColor(percent: number): string {
  if (percent >= 70) return "bg-accent-success"
  if (percent >= 50) return "bg-accent-warning"
  return "bg-accent-danger"
}

interface ResultScreenProps {
  result: QuizResult
}

export function ResultScreen({ result }: ResultScreenProps) {
  const passed = result.scorePercent >= 70
  const excellent = result.scorePercent >= 90
  const [displayScore, setDisplayScore] = useState(0)

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
      } else {
        setDisplayScore(current)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [result.scorePercent])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-bg-surface border border-border-subtle p-8">
        {/* Score */}
        <div className="text-center mb-10">
          <p className={cn("text-6xl font-bold font-mono tracking-tight", getScoreColor(result.scorePercent))}>
            {formatPercent(displayScore)}
          </p>
          <div className="mt-3 space-y-1">
            <p className="text-lg font-semibold text-text-primary">
              {excellent ? "Ausgezeichnet" : passed ? "Bestanden" : "Nicht bestanden"}
            </p>
            <p className="text-sm text-text-muted">
              {result.correctAnswers} von {result.totalQuestions} richtig · {formatTime(result.durationSeconds)}
            </p>
          </div>
          {result.bestStreak !== undefined && result.bestStreak > 0 && (
            <div className="flex items-center justify-center gap-1.5 mt-3 text-text-secondary">
              <Flame className="w-4 h-4" />
              <span className="text-[13px] font-mono">Beste Serie: {result.bestStreak}</span>
            </div>
          )}
        </div>

        {/* Chapter breakdown */}
        <div className="mb-10">
          <h3 className="text-[11px] font-mono text-text-muted uppercase tracking-widest mb-4">
            Auswertung nach Kapitel
          </h3>
          <div className="space-y-3">
            {Object.entries(result.byChapter).map(([chapterNum, stats], index) => {
              const chapter = CHAPTERS.find((c) => c.number === parseInt(chapterNum))
              const percent = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
              return (
                <div
                  key={chapterNum}
                  className="flex items-center gap-3"
                >
                  <span className="text-[11px] text-text-muted w-5 font-mono">{chapterNum}</span>
                  <span className="text-[13px] text-text-secondary flex-1 truncate">
                    {chapter?.name || `Kapitel ${chapterNum}`}
                  </span>
                  <div className="w-20 h-1.5 bg-bg-tertiary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.7, delay: 0.3 + index * 0.05, ease: "easeOut" }}
                      className={cn("h-full", getProgressBarColor(percent))}
                    />
                  </div>
                  <span className={cn("text-[12px] font-mono w-10 text-right", getScoreColor(percent))}>
                    {stats.correct}/{stats.total}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={result.mode === "chapter" && result.chapterNumber
              ? `/quiz/chapter/${result.chapterNumber}`
              : `/quiz/${result.mode}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-text-primary text-bg-primary font-medium hover:bg-accent-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface uppercase tracking-wider text-[13px]"
          >
            <RotateCcw className="w-4 h-4" />
            Nochmal
          </Link>
          <Link
            href="/stats"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-bg-tertiary text-text-secondary font-medium hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface uppercase tracking-wider text-[13px]"
          >
            <TrendingUp className="w-4 h-4" />
            Statistik
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-bg-tertiary text-text-secondary font-medium hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface uppercase tracking-wider text-[13px]"
          >
            <Home className="w-4 h-4" />
            Start
          </Link>
        </div>
      </div>
    </div>
  )
}
