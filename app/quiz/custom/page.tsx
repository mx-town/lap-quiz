"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Slider } from "@/components/ui/Slider"
import { PRESET_PROFILES, CHAPTERS } from "@/types"
import { cn } from "@/lib/utils"
import { SlidersHorizontal } from "lucide-react"

export default function CustomPage() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [focusWeight, setFocusWeight] = useState(60)
  const [questionCount, setQuestionCount] = useState(20)

  const profile = PRESET_PROFILES.find((p) => p.id === selectedProfile)

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Mein Fachbereich</h1>
          <p className="text-sm text-text-muted">
            Wähle dein Berufsprofil — 60% Schwerpunktfragen, 40% Querfragen aus dem gesamten Curriculum
          </p>
        </div>

        {/* Profile grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {PRESET_PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProfile(p.id)}
              className={cn(
                "text-left p-4 border-2 transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
                selectedProfile === p.id
                  ? "border-text-primary"
                  : "border-border-subtle hover:border-text-muted bg-bg-surface"
              )}
            >
              <h3 className="font-semibold text-sm text-text-primary mb-1 tracking-tight">{p.name}</h3>
              <p className="text-[12px] text-text-muted mb-2">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.focusChapters.map((ch) => {
                  const chapter = CHAPTERS.find((c) => c.number === ch)
                  return (
                    <span
                      key={ch}
                      className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary text-text-muted font-mono"
                    >
                      {chapter?.name || `Kap. ${ch}`}
                    </span>
                  )
                })}
              </div>
            </button>
          ))}
        </div>

        {/* Configuration */}
        {selectedProfile && (
          <div className="max-w-md mx-auto">
            <div className="bg-bg-surface border border-border-subtle p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal className="w-4 h-4 text-text-muted" />
                <h2 className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Konfiguration</h2>
              </div>

              {/* Weight slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Schwerpunkt-Gewichtung</label>
                  <div className="text-sm font-mono">
                    <span className="text-text-primary font-medium">{focusWeight}%</span>
                    <span className="text-text-muted"> / </span>
                    <span className="text-text-muted">{100 - focusWeight}%</span>
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
                <div className="flex justify-between text-[11px] text-text-muted mt-1 font-mono">
                  <span>Balance</span>
                  <span>Fokus</span>
                </div>
              </div>

              {/* Question count */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-widest text-text-muted block mb-3">Fragenanzahl</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[15, 20, 25, 30].map((n) => (
                    <button
                      key={n}
                      onClick={() => setQuestionCount(n)}
                      className={cn(
                        "py-2.5 border-2 text-sm font-medium transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface",
                        questionCount === n
                          ? "border-text-primary text-text-primary"
                          : "border-border-subtle text-text-muted hover:border-text-muted"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus chapters summary */}
              <div className="p-3 bg-bg-tertiary border border-border-subtle">
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-widest mb-2">Schwerpunktkapitel</p>
                <div className="flex flex-wrap gap-1">
                  {profile?.focusChapters.map((ch) => {
                    const chapter = CHAPTERS.find((c) => c.number === ch)
                    return (
                      <span key={ch} className="text-[11px] px-2 py-1 bg-bg-surface text-text-secondary font-mono border border-border-subtle">
                        {chapter?.name}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Start button */}
              <Link
                href={`/quiz/custom/play?profile=${selectedProfile}&weight=${focusWeight}&count=${questionCount}`}
                className="block w-full py-3.5 bg-text-primary text-bg-primary text-center font-medium hover:bg-accent-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface uppercase tracking-wider text-[13px]"
              >
                Quiz starten
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
