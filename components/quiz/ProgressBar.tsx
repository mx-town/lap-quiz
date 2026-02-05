"use client"

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  current: number
  total: number
  correctCount?: number
}

export function ProgressBar({ current, total, correctCount }: ProgressBarProps) {
  const percent = total > 0 ? (current / total) * 100 : 0

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
      <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-primary rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
