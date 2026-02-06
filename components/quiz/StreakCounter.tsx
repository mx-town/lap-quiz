"use client"

import { useEffect } from "react"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakCounterProps {
  streak: number
  bestStreak: number
  onMilestone?: (milestone: number) => void
}

function getContainerStyle(streak: number): string {
  if (streak >= 10) return "bg-accent-danger/10 rounded-lg px-3 py-2"
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
      <div className="flex items-center gap-2">
        <Flame
          className={cn(
            "w-6 h-6 transition-all",
            getFlameColor(streak)
          )}
        />
        <span
          className={cn(
            "text-2xl font-bold font-mono transition-all",
            getTextColor(streak)
          )}
        >
          {streak}
        </span>
      </div>
      <span className="text-xs text-text-muted">
        Best: {bestStreak}
      </span>
    </div>
  )
}
