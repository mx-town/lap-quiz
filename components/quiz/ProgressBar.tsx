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
      <div className="flex justify-between text-[11px] font-mono uppercase tracking-widest text-text-muted mb-2">
        <span>
          {current} / {total}
        </span>
        {correctCount !== undefined && (
          <span className="text-accent-success">{correctCount} richtig</span>
        )}
      </div>
      <div className="w-full h-1.5 bg-bg-tertiary overflow-hidden">
        {showSegments && correctCount !== undefined ? (
          <>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full bg-text-muted relative"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${current > 0 ? (correctCount / current) * 100 : 0}%` }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                className="h-full bg-accent-success absolute left-0 top-0"
              />
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="h-full bg-text-primary"
          />
        )}
      </div>
    </div>
  )
}
