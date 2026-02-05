"use client"

import { Navbar } from "@/components/layout/Navbar"
import { CHAPTERS } from "@/types"
import { BarChart3, Trophy, Target } from "lucide-react"

export default function StatsPage() {
  // Placeholder - will be connected to Supabase for real data
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Statistik</h1>
        <p className="text-text-muted mb-8">Dein Lernfortschritt im Überblick</p>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-accent-primary" />
              </div>
              <span className="text-sm text-text-muted">Gesamtfortschritt</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">—</p>
            <p className="text-xs text-text-muted mt-1">Melde dich an, um deinen Fortschritt zu speichern</p>
          </div>

          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent-success/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent-success" />
              </div>
              <span className="text-sm text-text-muted">Beste Blitz-Streak</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">—</p>
          </div>

          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent-warning/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent-warning" />
              </div>
              <span className="text-sm text-text-muted">Sessions gesamt</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">—</p>
          </div>
        </div>

        {/* Chapter overview */}
        <h2 className="text-xl font-semibold mb-4">Kapitel-Übersicht</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CHAPTERS.map((chapter) => (
            <div
              key={chapter.number}
              className="bg-bg-surface border border-border-subtle rounded-xl p-4 flex items-center gap-4"
            >
              <span className="text-sm font-mono text-text-muted w-6">{chapter.number}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{chapter.name}</p>
                <div className="w-full h-1.5 bg-bg-tertiary rounded-full mt-2">
                  <div className="h-full bg-bg-tertiary rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
              <span className="text-xs text-text-muted">—%</span>
            </div>
          ))}
        </div>

        <p className="text-center text-text-muted text-sm mt-12">
          Statistikdaten werden nach Supabase-Anbindung angezeigt.
        </p>
      </main>
    </>
  )
}
