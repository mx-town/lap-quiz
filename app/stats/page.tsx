"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { CHAPTERS } from "@/types"
import { BarChart3, Trophy, Target } from "lucide-react"
import { cn } from "@/lib/utils"

function getProgressBarColor(percent: number): string {
  if (percent >= 70) return "bg-accent-success"
  if (percent >= 50) return "bg-accent-warning"
  if (percent > 0) return "bg-accent-primary"
  return "bg-bg-tertiary"
}

function getScoreTextColor(percent: number): string {
  if (percent >= 70) return "text-accent-success"
  if (percent >= 50) return "text-accent-warning"
  return "text-text-muted"
}

export default function StatsPage() {
  // Placeholder data - will be connected to Supabase for real data
  // Using sample percentages to demonstrate the progress bars work
  const sampleProgress: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Statistik</h1>
          <p className="text-text-secondary mb-8">Dein Lernfortschritt im Überblick</p>
        </motion.div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-bg-surface border border-border-subtle rounded-xl p-6 hover:border-accent-primary/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-accent-primary" />
              </div>
              <span className="text-sm text-text-secondary">Gesamtfortschritt</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">—</p>
            <p className="text-xs text-text-secondary mt-1">Melde dich an, um deinen Fortschritt zu speichern</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-bg-surface border border-border-subtle rounded-xl p-6 hover:border-accent-success/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent-success/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent-success" />
              </div>
              <span className="text-sm text-text-secondary">Beste Blitz-Streak</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">—</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-bg-surface border border-border-subtle rounded-xl p-6 hover:border-accent-warning/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent-warning/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent-warning" />
              </div>
              <span className="text-sm text-text-secondary">Sessions gesamt</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">—</p>
          </motion.div>
        </div>

        {/* Chapter overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">Kapitel-Übersicht</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CHAPTERS.map((chapter, index) => {
            const percent = sampleProgress[chapter.number] || 0
            return (
              <motion.div
                key={chapter.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.03 }}
                whileHover={{ scale: 1.01 }}
                className="bg-bg-surface border border-border-subtle rounded-xl p-4 flex items-center gap-4 hover:border-border-panel transition-all"
              >
                <span className="text-sm font-mono text-text-muted w-6">{chapter.number}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary mb-2">{chapter.name}</p>
                  <div className="w-full h-2.5 bg-bg-tertiary border border-border-subtle rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.7, delay: 0.6 + index * 0.03, ease: "easeOut" }}
                      className={cn("h-full rounded-full", getProgressBarColor(percent))}
                    />
                  </div>
                </div>
                <span className={cn("text-xs font-mono w-10 text-right", getScoreTextColor(percent))}>
                  {percent > 0 ? `${percent}%` : "—%"}
                </span>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-text-secondary text-sm mt-12"
        >
          Statistikdaten werden nach Supabase-Anbindung angezeigt.
        </motion.p>
      </main>
    </>
  )
}
