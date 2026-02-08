"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
import { PageTransition } from "@/components/layout/PageTransition"
import { CHAPTERS } from "@/types"
import { BarChart3, Trophy, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { getStats, StatsOverview } from "@/lib/local-storage"
import { CHAPTER_QUESTIONS } from "@/lib/questions"
import { StatsCardSkeleton, ChapterCardSkeleton } from "@/components/ui/Skeleton"

function getProgressBarColor(percent: number): string {
  if (percent >= 70) return "bg-accent-success"
  if (percent >= 50) return "bg-accent-warning"
  if (percent > 0) return "bg-text-primary"
  return "bg-bg-tertiary"
}

function getScoreTextColor(percent: number): string {
  if (percent >= 70) return "text-accent-success"
  if (percent >= 50) return "text-accent-warning"
  return "text-text-muted"
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsOverview | null>(null)

  useEffect(() => {
    setStats(getStats())
  }, [])

  const chapterTotal = (chapterNum: number): number =>
    CHAPTER_QUESTIONS[chapterNum]?.length ?? 0

  const chapterCorrect = (chapterNum: number): number =>
    stats?.chapterCorrect[chapterNum] ?? 0

  const chapterPercent = (chapterNum: number): number => {
    const total = chapterTotal(chapterNum)
    if (total === 0) return 0
    return Math.round((chapterCorrect(chapterNum) / total) * 100)
  }

  const overallPercent = stats ? Math.round(stats.averageScore) : 0

  // Loading state
  if (stats === null) {
    return (
      <>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 pb-20 md:pb-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Statistik</h1>
            <p className="text-sm text-text-muted">Dein Lernfortschritt im Überblick</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
            {[1, 2, 3].map((i) => <StatsCardSkeleton key={i} />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <ChapterCardSkeleton key={i} />)}
          </div>
        </main>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 pb-20 md:pb-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Statistik</h1>
            <p className="text-sm text-text-muted">Dein Lernfortschritt im Überblick</p>
          </div>

          {/* Overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
            <div className="bg-bg-surface border border-border-subtle p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-4 h-4 text-accent-primary" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Durchschnitt</span>
              </div>
              <p className="text-3xl font-bold font-mono text-text-primary">
                {stats && stats.totalSessions > 0 ? `${overallPercent}%` : "—"}
              </p>
              {stats && stats.totalSessions > 0 && (
                <p className="text-[12px] text-text-muted mt-1">aus {stats.totalSessions} Sessions</p>
              )}
            </div>

            <div className="bg-bg-surface border border-border-subtle p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-4 h-4 text-accent-success" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Beste Blitz-Streak</span>
              </div>
              <p className="text-3xl font-bold font-mono text-text-primary">
                {stats && stats.bestStreak > 0 ? stats.bestStreak : "—"}
              </p>
            </div>

            <div className="bg-bg-surface border border-border-subtle p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-4 h-4 text-accent-warning" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Sessions gesamt</span>
              </div>
              <p className="text-3xl font-bold font-mono text-text-primary">
                {stats ? stats.totalSessions : "—"}
              </p>
            </div>
          </div>

          {/* Chapter overview */}
          <div className="mb-6">
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-4">Kapitel-Übersicht</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CHAPTERS.map((chapter, index) => {
              const percent = chapterPercent(chapter.number)
              const correct = chapterCorrect(chapter.number)
              const total = chapterTotal(chapter.number)
              return (
                <div
                  key={chapter.number}
                  className="bg-bg-surface border border-border-subtle p-4 flex items-center gap-4 hover:border-text-muted transition-colors"
                >
                  <span className="text-[11px] font-mono text-text-muted w-5">{String(chapter.number).padStart(2, "0")}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-text-primary tracking-tight">{chapter.name}</p>
                      <span className="text-[11px] font-mono text-text-muted">{correct}/{total}</span>
                    </div>
                    <div className="w-full h-1.5 bg-bg-tertiary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.7, delay: 0.2 + index * 0.03, ease: "easeOut" }}
                        className={cn("h-full", getProgressBarColor(percent))}
                      />
                    </div>
                  </div>
                  <span className={cn("text-[12px] font-mono w-10 text-right", getScoreTextColor(percent))}>
                    {percent > 0 ? `${percent}%` : "—%"}
                  </span>
                </div>
              )
            })}
          </div>
        </main>
      </PageTransition>
      <BottomNav />
    </>
  )
}
