"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { CHAPTERS } from "@/types"
import { BarChart3, Trophy, Target } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const sampleProgress: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Statistik</h1>
          <p className="text-sm text-text-muted">Dein Lernfortschritt im Überblick</p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
          <div className="bg-bg-surface border border-border-subtle p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-4 h-4 text-accent-primary" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Gesamtfortschritt</span>
            </div>
            <p className="text-3xl font-bold font-mono text-text-primary">—</p>
            <p className="text-[12px] text-text-muted mt-1">Melde dich an, um deinen Fortschritt zu speichern</p>
          </div>

          <div className="bg-bg-surface border border-border-subtle p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-4 h-4 text-accent-success" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Beste Blitz-Streak</span>
            </div>
            <p className="text-3xl font-bold font-mono text-text-primary">—</p>
          </div>

          <div className="bg-bg-surface border border-border-subtle p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-4 h-4 text-accent-warning" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Sessions gesamt</span>
            </div>
            <p className="text-3xl font-bold font-mono text-text-primary">—</p>
          </div>
        </div>

        {/* Chapter overview */}
        <div className="mb-6">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-4">Kapitel-Übersicht</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CHAPTERS.map((chapter, index) => {
            const percent = sampleProgress[chapter.number] || 0
            return (
              <div
                key={chapter.number}
                className="bg-bg-surface border border-border-subtle p-4 flex items-center gap-4 hover:border-text-muted transition-colors"
              >
                <span className="text-[11px] font-mono text-text-muted w-5">{String(chapter.number).padStart(2, "0")}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary mb-2 tracking-tight">{chapter.name}</p>
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

        <p className="text-center text-text-muted text-[12px] mt-12 font-mono">
          Statistikdaten werden nach Supabase-Anbindung angezeigt.
        </p>
      </main>
    </>
  )
}
