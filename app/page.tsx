"use client"

import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
import { ModeSelector } from "@/components/layout/ModeSelector"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16 pb-20 md:pb-16">
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
            <span className="text-accent-primary">LAP</span>{" "}
            <span className="text-text-primary">Quiz</span>
          </h1>
          <p className="text-base text-text-muted max-w-lg">
            Mechatronik-Prüfungsvorbereitung — 4 Quiz-Modi, 12 Kapitel
          </p>
        </div>

        <ModeSelector />
      </main>
      <BottomNav />
    </>
  )
}
