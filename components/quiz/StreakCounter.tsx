"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakCounterProps {
  streak: number
  bestStreak: number
}

export function StreakCounter({ streak, bestStreak }: StreakCounterProps) {
  return (
    <div className="flex items-center gap-4">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={streak}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="flex items-center gap-2"
        >
          <Flame
            className={cn(
              "w-6 h-6",
              streak >= 10 ? "text-accent-danger" :
              streak >= 5 ? "text-accent-orange" :
              streak >= 1 ? "text-accent-warning" :
              "text-text-muted"
            )}
          />
          <span className={cn(
            "text-2xl font-bold font-mono",
            streak >= 10 ? "text-accent-danger" :
            streak >= 5 ? "text-accent-orange" :
            "text-text-primary"
          )}>
            {streak}
          </span>
        </motion.div>
      </AnimatePresence>
      <span className="text-xs text-text-muted">
        Best: {bestStreak}
      </span>
    </div>
  )
}
