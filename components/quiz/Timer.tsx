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
  return "text-text-primary"
}

function getTimerBarStyle(percent: number): string {
  if (percent < 20) return "bg-accent-danger"
  if (percent < 50) return "bg-accent-warning"
  return "bg-text-primary"
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
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r={radius}
            fill="none" stroke="currentColor"
            className="text-border-subtle" strokeWidth="3"
          />
          <circle
            cx="32" cy="32" r={radius}
            fill="none" strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            className={cn("transition-all duration-1000", getTimerColor(percent))}
          />
        </svg>
        <span
          className={cn(
            "absolute text-[13px] font-mono font-semibold transition-all",
            isLow ? "text-accent-danger" : "text-text-primary"
          )}
        >
          {remaining}
        </span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between text-[13px] mb-1">
        <span className="text-text-muted font-mono uppercase tracking-widest text-[11px]">Zeit</span>
        <span
          className={cn(
            "font-mono transition-all",
            isLow ? "text-accent-danger" : "text-text-secondary"
          )}
        >
          {formatTime(remaining)}
        </span>
      </div>
      <div className="w-full h-1.5 bg-bg-tertiary overflow-hidden">
        <div
          className={cn("h-full transition-all duration-1000", getTimerBarStyle(percent))}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
