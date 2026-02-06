"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Slider } from "@/components/ui/Slider"
import { PRESET_PROFILES, CHAPTERS } from "@/types"
import { SlidersHorizontal, ChevronDown } from "lucide-react"

export default function CustomPage() {
  const [selectedProfile, setSelectedProfile] = useState<string>(PRESET_PROFILES[0].id)
  const [focusWeight, setFocusWeight] = useState(60)
  const [questionCount, setQuestionCount] = useState(20)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const profile = PRESET_PROFILES.find((p) => p.id === selectedProfile)!

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Mein Fachbereich</h1>
          <p className="text-sm text-text-muted">
            Wähle dein Berufsprofil — Schwerpunktfragen + Querfragen aus dem gesamten Curriculum
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-bg-surface border border-border-subtle p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <SlidersHorizontal className="w-4 h-4 text-text-muted" />
              <h2 className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Konfiguration</h2>
            </div>

            {/* Profile dropdown */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-widest text-text-muted block mb-2">Fachbereich</label>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex items-center justify-between p-3 border-2 border-border-subtle bg-bg-primary text-left transition-all hover:border-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{profile.name}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">{profile.description}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 ml-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-bg-surface border border-border-subtle max-h-64 overflow-y-auto shadow-lg">
                    {PRESET_PROFILES.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProfile(p.id)
                          setDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2.5 transition-colors ${
                          selectedProfile === p.id
                            ? "bg-bg-tertiary text-text-primary"
                            : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                        }`}
                      >
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-[11px] text-text-muted">{p.description}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Fragenanzahl</label>
                <span className="text-sm font-mono font-medium text-text-primary">{questionCount}</span>
              </div>
              <Slider
                value={questionCount}
                onChange={setQuestionCount}
                min={5}
                max={50}
                step={1}
                showValue={false}
              />
            </div>

            {/* Focus chapters summary */}
            <div className="p-3 bg-bg-tertiary border border-border-subtle">
              <p className="text-[11px] font-mono text-text-muted uppercase tracking-widest mb-2">Schwerpunktkapitel</p>
              <div className="flex flex-wrap gap-1">
                {profile.focusChapters.map((ch) => {
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
      </main>
    </>
  )
}
