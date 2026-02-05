"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakCounterProps {
  streak: number
  bestStreak: number
  onMilestone?: (milestone: number) => void
}

function getContainerStyle(streak: number): string {
  if (streak >= 10) return "bg-accent-danger/10 shadow-glow-danger rounded-lg px-3 py-2"
  if (streak >= 5) return "bg-accent-orange/10 rounded-lg px-3 py-2"
  if (streak >= 3) return "bg-accent-warning/10 rounded-lg px-3 py-2"
  return ""
}

function getFlameColor(streak: number): string {
  if (streak >= 10) return "text-accent-danger"
  if (streak >= 5) return "text-accent-orange"
  if (streak >= 1) return "text-accent-warning"
  return "text-text-muted"
}

function getTextColor(streak: number): string {
  if (streak >= 10) return "text-accent-danger"
  if (streak >= 5) return "text-accent-orange"
  return "text-text-primary"
}

export function StreakCounter({ streak, bestStreak, onMilestone }: StreakCounterProps) {
  useEffect(() => {
    if (onMilestone && [5, 10, 15, 20].includes(streak)) {
      onMilestone(streak)
    }
  }, [streak, onMilestone])

  return (
    <div
      className={cn(
        "flex items-center gap-4 transition-all duration-300",
        getContainerStyle(streak)
      )}
    >
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
              "w-6 h-6 transition-all",
              getFlameColor(streak),
              streak >= 10 ? "glow-danger" : streak >= 5 ? "glow-warning" : ""
            )}
          />
          <span
            className={cn(
              "text-2xl font-bold font-mono transition-all",
              getTextColor(streak),
              streak >= 5 && "drop-shadow-[0_0_8px_currentColor]"
            )}
          >
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
