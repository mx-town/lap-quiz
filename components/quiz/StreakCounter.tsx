"use client"

import { useEffect } from "react"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakCounterProps {
  streak: number
  bestStreak: number
  onMilestone?: (milestone: number) => void
}

function getFlameColor(streak: number): string {
  if (streak >= 10) return "text-accent-danger"
  if (streak >= 5) return "text-accent-warning"
  if (streak >= 1) return "text-text-primary"
  return "text-text-muted"
}

export function StreakCounter({ streak, bestStreak, onMilestone }: StreakCounterProps) {
  useEffect(() => {
    if (onMilestone && [5, 10, 15, 20].includes(streak)) {
      onMilestone(streak)
    }
  }, [streak, onMilestone])

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Flame
          className={cn("w-5 h-5 transition-all", getFlameColor(streak))}
        />
        <span
          className={cn(
            "text-xl font-bold font-mono transition-all",
            streak >= 5 ? "text-accent-primary" : "text-text-primary"
          )}
        >
          {streak}
        </span>
      </div>
      <span className="text-[11px] font-mono text-text-muted uppercase tracking-widest">
        Best: {bestStreak}
      </span>
    </div>
  )
}
