"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { Slider } from "@/components/ui/Slider"
import { PRESET_PROFILES, CHAPTERS } from "@/types"
import { cn } from "@/lib/utils"
import { Settings, ChevronRight, SlidersHorizontal, ArrowRight } from "lucide-react"

export default function CustomPage() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [focusWeight, setFocusWeight] = useState(60)
  const [questionCount, setQuestionCount] = useState(20)

  const profile = PRESET_PROFILES.find((p) => p.id === selectedProfile)

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Mein Fachbereich</h1>
          <p className="text-text-secondary mb-8">
            Wähle dein Berufsprofil — 60% Schwerpunktfragen, 40% Querfragen aus dem gesamten Curriculum
          </p>
        </motion.div>

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
                "text-left p-4 rounded-xl border-2 transition-all hover:-translate-y-0.5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
                selectedProfile === p.id
                  ? "border-accent-green bg-accent-green/10 shadow-glow-success"
                  : "border-border-subtle hover:border-border-panel bg-bg-surface"
              )}
            >
              <h3 className="font-semibold text-sm text-text-primary mb-1">{p.name}</h3>
              <p className="text-xs text-text-secondary mb-2">{p.description}</p>
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
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto"
          >
            {/* Visual connector arrow */}
            <div className="flex justify-center mb-4">
              <ArrowRight className="w-6 h-6 text-accent-green rotate-90" />
            </div>

            <div className="bg-bg-surface border-2 border-accent-green/30 rounded-2xl p-6 space-y-6 shadow-glow-success">
              <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal className="w-5 h-5 text-accent-green" />
                <h2 className="font-semibold">Konfiguration</h2>
              </div>

              {/* Weight slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-text-secondary">Schwerpunkt-Gewichtung</label>
                  <div className="text-sm">
                    <span className="text-accent-green font-medium">{focusWeight}%</span>
                    <span className="text-text-muted"> / </span>
                    <span className="text-text-secondary">{100 - focusWeight}%</span>
                  </div>
                </div>
                <Slider
                  value={focusWeight}
                  onChange={setFocusWeight}
                  min={50}
                  max={80}
                  step={5}
                  showValue={false}
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>Mehr Balance</span>
                  <span>Mehr Fokus</span>
                </div>
              </div>

              {/* Question count */}
              <div>
                <label className="text-sm text-text-secondary block mb-3">Fragenanzahl</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[15, 20, 25, 30].map((n) => (
                    <button
                      key={n}
                      onClick={() => setQuestionCount(n)}
                      className={cn(
                        "py-2.5 rounded-lg border-2 text-sm font-medium transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface",
                        questionCount === n
                          ? "border-accent-green bg-accent-green/10 text-accent-green"
                          : "border-border-subtle text-text-muted hover:border-border-panel"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus chapters summary */}
              <div className="p-3 rounded-lg bg-bg-tertiary border border-border-subtle">
                <p className="text-xs text-text-muted mb-2">Schwerpunktkapitel:</p>
                <div className="flex flex-wrap gap-1">
                  {profile?.focusChapters.map((ch) => {
                    const chapter = CHAPTERS.find((c) => c.number === ch)
                    return (
                      <span key={ch} className="text-xs px-2 py-1 rounded-full bg-accent-green/20 text-accent-green">
                        {chapter?.name}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Start button */}
              <Link
                href={`/quiz/custom/play?profile=${selectedProfile}&weight=${focusWeight}&count=${questionCount}`}
                className="block w-full py-3.5 rounded-xl bg-gradient-green text-white text-center font-medium hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
              >
                Quiz starten
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </>
  )
}
