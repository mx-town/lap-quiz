"use client"

import { useState, useEffect } from "react"
import { cn, formatTime } from "@/lib/utils"

interface TimerProps {
  totalSeconds: number
  onTimeUp: () => void
  isRunning: boolean
  variant?: "bar" | "ring"
  onCritical?: () => void
}

function getTimerColor(percent: number): string {
  if (percent < 20) return "text-accent-danger"
  if (percent < 50) return "text-accent-warning"
  return "text-accent-primary"
}

function getTimerBarStyle(percent: number): string {
  if (percent < 20) return "bg-accent-danger shadow-glow-danger"
  if (percent < 50) return "bg-accent-warning"
  return "bg-gradient-to-r from-accent-primary to-accent-secondary"
}

export function Timer({ totalSeconds, onTimeUp, isRunning, variant = "bar", onCritical }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const [hasFiredCritical, setHasFiredCritical] = useState(false)

  useEffect(() => {
    setRemaining(totalSeconds)
    setHasFiredCritical(false)
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

  // Fire critical callback when entering low state
  useEffect(() => {
    if (isLow && !hasFiredCritical && onCritical) {
      setHasFiredCritical(true)
      onCritical()
    }
  }, [isLow, hasFiredCritical, onCritical])

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
            className={cn("transition-all duration-1000", getTimerColor(percent))}
            style={{
              filter: isLow ? "drop-shadow(0 0 4px currentColor)" : undefined
            }}
          />
        </svg>
        <span
          className={cn(
            "absolute text-sm font-mono font-bold transition-all",
            isLow ? "text-accent-danger animate-pulse" : "text-text-primary"
          )}
          style={{
            filter: isLow ? "drop-shadow(0 0 4px currentColor)" : undefined
          }}
        >
          {remaining}
        </span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-muted">Zeit</span>
        <span
          className={cn(
            "font-mono transition-all",
            isLow ? "text-accent-danger animate-pulse" : "text-text-secondary"
          )}
          style={{
            filter: isLow ? "drop-shadow(0 0 4px currentColor)" : undefined
          }}
        >
          {formatTime(remaining)}
        </span>
      </div>
      <div className="w-full h-2.5 bg-bg-tertiary rounded-full overflow-hidden border border-border-subtle">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", getTimerBarStyle(percent))}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
