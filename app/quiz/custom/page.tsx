"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { PRESET_PROFILES, CHAPTERS } from "@/types"
import { cn } from "@/lib/utils"
import { Settings, ChevronRight, SlidersHorizontal } from "lucide-react"

export default function CustomPage() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [focusWeight, setFocusWeight] = useState(60)
  const [questionCount, setQuestionCount] = useState(20)

  const profile = PRESET_PROFILES.find((p) => p.id === selectedProfile)

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Mein Fachbereich</h1>
        <p className="text-text-muted mb-8">
          Wähle dein Berufsprofil — 60% Schwerpunktfragen, 40% Querfragen aus dem gesamten Curriculum
        </p>

        {/* Profile grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {PRESET_PROFILES.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setSelectedProfile(p.id)}
              className={cn(
                "text-left p-4 rounded-xl border transition-all",
                selectedProfile === p.id
                  ? "border-accent-primary bg-accent-primary/10"
                  : "border-border-subtle hover:border-border-panel bg-bg-surface"
              )}
            >
              <h3 className="font-semibold text-sm text-text-primary mb-1">{p.name}</h3>
              <p className="text-xs text-text-muted mb-2">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.focusChapters.map((ch) => {
                  const chapter = CHAPTERS.find((c) => c.number === ch)
                  return (
                    <span
                      key={ch}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted"
                    >
                      {chapter?.name || `Kap. ${ch}`}
                    </span>
                  )
                })}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Configuration */}
        {selectedProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-bg-surface border border-border-subtle rounded-2xl p-6 space-y-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <SlidersHorizontal className="w-5 h-5 text-accent-primary" />
              <h2 className="font-semibold">Konfiguration</h2>
            </div>

            {/* Weight slider */}
            <div>
              <label className="text-sm text-text-muted block mb-2">
                Schwerpunkt-Gewichtung: <span className="text-accent-primary font-medium">{focusWeight}%</span> Schwerpunkt / <span className="text-text-secondary">{100 - focusWeight}%</span> Querfragen
              </label>
              <input
                type="range"
                min={50}
                max={80}
                step={5}
                value={focusWeight}
                onChange={(e) => setFocusWeight(parseInt(e.target.value))}
                className="w-full accent-accent-primary"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>50%</span>
                <span>80%</span>
              </div>
            </div>

            {/* Question count */}
            <div>
              <label className="text-sm text-text-muted block mb-2">Fragenanzahl</label>
              <div className="flex gap-2">
                {[15, 20, 25, 30].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={cn(
                      "flex-1 py-2 rounded-lg border text-sm font-medium transition-colors",
                      questionCount === n
                        ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                        : "border-border-subtle text-text-muted hover:border-border-panel"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus chapters summary */}
            <div className="p-3 rounded-lg bg-bg-tertiary">
              <p className="text-xs text-text-muted mb-2">Schwerpunktkapitel:</p>
              <div className="flex flex-wrap gap-1">
                {profile?.focusChapters.map((ch) => {
                  const chapter = CHAPTERS.find((c) => c.number === ch)
                  return (
                    <span key={ch} className="text-xs px-2 py-1 rounded-full bg-accent-primary/20 text-accent-primary">
                      {chapter?.name}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Start button */}
            <Link
              href={`/quiz/custom/play?profile=${selectedProfile}&weight=${focusWeight}&count=${questionCount}`}
              className="block w-full py-3 rounded-xl bg-gradient-green text-white text-center font-medium hover:opacity-90 transition-opacity"
            >
              Quiz starten
            </Link>
          </motion.div>
        )}
      </main>
    </>
  )
}
