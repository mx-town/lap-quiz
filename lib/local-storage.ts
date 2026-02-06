import { QuizResult } from "@/types"

const SESSIONS_KEY = "lap-quiz-sessions"
const BEST_STREAK_KEY = "lap-quiz-best-streak"

export interface StoredSession {
  result: QuizResult
  timestamp: number
}

function getSessions(): StoredSession[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSession(result: QuizResult): void {
  if (typeof window === "undefined") return
  const sessions = getSessions()
  sessions.push({ result, timestamp: Date.now() })
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))

  if (result.bestStreak !== undefined) {
    const prev = getBestStreak()
    if (result.bestStreak > prev) {
      localStorage.setItem(BEST_STREAK_KEY, String(result.bestStreak))
    }
  }
}

export function getBestStreak(): number {
  if (typeof window === "undefined") return 0
  return parseInt(localStorage.getItem(BEST_STREAK_KEY) || "0")
}

export interface StatsOverview {
  totalSessions: number
  averageScore: number
  bestStreak: number
  chapterCorrect: Record<number, number>
}

export function getStats(): StatsOverview {
  const sessions = getSessions()
  const chapterCorrect: Record<number, number> = {}

  let totalScore = 0

  for (const s of sessions) {
    totalScore += s.result.scorePercent
    for (const [ch, stats] of Object.entries(s.result.byChapter)) {
      const num = Number(ch)
      chapterCorrect[num] = (chapterCorrect[num] || 0) + stats.correct
    }
  }

  return {
    totalSessions: sessions.length,
    averageScore: sessions.length > 0 ? totalScore / sessions.length : 0,
    bestStreak: getBestStreak(),
    chapterCorrect,
  }
}
