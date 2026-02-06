"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  current: number
  total: number
  correctCount?: number
  showSegments?: boolean
}

export function ProgressBar({ current, total, correctCount, showSegments = false }: ProgressBarProps) {
  const percent = total > 0 ? (current / total) * 100 : 0
  const correctPercent = correctCount !== undefined && current > 0
    ? (correctCount / current) * percent
    : 0

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-text-muted mb-2">
        <span>
          {current} / {total}
        </span>
        {correctCount !== undefined && (
          <span className="text-accent-success">{correctCount} richtig</span>
        )}
      </div>
      <div className="w-full h-2.5 bg-bg-tertiary rounded-full overflow-hidden border border-border-subtle">
        {showSegments && correctCount !== undefined ? (
          <>
            {/* Correct answers segment */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${correctPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-accent-success rounded-l-full absolute"
            />
            {/* Total progress segment */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full bg-accent-primary/50 rounded-full relative"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${current > 0 ? (correctCount / current) * 100 : 0}%` }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                className="h-full bg-accent-success rounded-l-full absolute left-0 top-0"
              />
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="h-full bg-accent-primary rounded-full"
          />
        )}
      </div>
    </div>
  )
}
