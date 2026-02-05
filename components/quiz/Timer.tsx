"use client"

import { useState, useEffect } from "react"
import { formatTime } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface TimerProps {
  totalSeconds: number
  onTimeUp: () => void
  isRunning: boolean
  variant?: "bar" | "ring"
}

export function Timer({ totalSeconds, onTimeUp, isRunning, variant = "bar" }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds)

  useEffect(() => {
    setRemaining(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    if (!isRunning || remaining <= 0) return
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, remaining, onTimeUp])

  const percent = (remaining / totalSeconds) * 100
  const isLow = percent < 20
  const isMedium = percent < 50

  if (variant === "ring") {
    const radius = 28
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percent / 100) * circumference

    return (
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r={radius}
            fill="none" stroke="currentColor"
            className="text-border-subtle" strokeWidth="4"
          />
          <circle
            cx="32" cy="32" r={radius}
            fill="none" strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-1000",
              isLow ? "text-accent-danger" : isMedium ? "text-accent-warning" : "text-accent-primary"
            )}
          />
        </svg>
        <span className={cn(
          "absolute text-sm font-mono font-bold",
          isLow ? "text-accent-danger" : "text-text-primary"
        )}>
          {remaining}
        </span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-muted">Zeit</span>
        <span className={cn("font-mono", isLow ? "text-accent-danger" : "text-text-secondary")}>
          {formatTime(remaining)}
        </span>
      </div>
      <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            isLow ? "bg-accent-danger" : isMedium ? "bg-accent-warning" : "bg-accent-primary"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
