import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function getScoreColor(percent: number): string {
  if (percent >= 70) return "text-accent-success"
  if (percent >= 50) return "text-accent-warning"
  return "text-accent-danger"
}

export function getScoreBg(percent: number): string {
  if (percent >= 70) return "bg-accent-success/20"
  if (percent >= 50) return "bg-accent-warning/20"
  return "bg-accent-danger/20"
}
