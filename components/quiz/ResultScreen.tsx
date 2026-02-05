"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { QuizResult, CHAPTERS } from "@/types"
import { cn, formatPercent, formatTime, getScoreColor, getScoreBg } from "@/lib/utils"
import { Trophy, RotateCcw, Home, TrendingUp } from "lucide-react"

interface ResultScreenProps {
  result: QuizResult
}

export function ResultScreen({ result }: ResultScreenProps) {
  const passed = result.scorePercent >= 70

  return (
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
            "w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center",
            getScoreBg(result.scorePercent)
          )}
        >
          <div>
            <p className={cn("text-4xl font-bold", getScoreColor(result.scorePercent))}>
              {formatPercent(result.scorePercent)}
            </p>
          </div>
        </motion.div>

        <h2 className="text-2xl font-bold mb-2">
          {passed ? "Bestanden!" : "Nicht bestanden"}
        </h2>
        <p className="text-text-muted mb-8">
          {result.correctAnswers} von {result.totalQuestions} richtig · {formatTime(result.durationSeconds)}
        </p>

        {/* Chapter breakdown */}
        <div className="text-left mb-8">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
            Auswertung nach Kapitel
          </h3>
          <div className="space-y-2">
            {Object.entries(result.byChapter).map(([chapterNum, stats]) => {
              const chapter = CHAPTERS.find((c) => c.number === parseInt(chapterNum))
              const percent = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
              return (
                <div key={chapterNum} className="flex items-center gap-3">
                  <span className="text-xs text-text-muted w-6 font-mono">{chapterNum}</span>
                  <span className="text-sm text-text-secondary flex-1 truncate">
                    {chapter?.name || `Kapitel ${chapterNum}`}
                  </span>
                  <div className="w-24 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        percent >= 70 ? "bg-accent-success" : percent >= 50 ? "bg-accent-warning" : "bg-accent-danger"
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className={cn("text-xs font-mono w-10 text-right", getScoreColor(percent))}>
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
            href={`/quiz/${result.mode}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-primary text-white font-medium hover:bg-accent-secondary transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Nochmal
          </Link>
          <Link
            href="/stats"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-bg-tertiary text-text-secondary font-medium hover:text-text-primary transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Statistik
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-bg-tertiary text-text-secondary font-medium hover:text-text-primary transition-colors"
          >
            <Home className="w-4 h-4" />
            Start
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
