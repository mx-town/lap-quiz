"use client"

import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { BottomNav } from "@/components/layout/BottomNav"
import { CHAPTERS } from "@/types"
import { CHAPTER_QUESTIONS } from "@/lib/questions"
import {
  Shield,
  Zap,
  Box,
  Cpu,
  Cable,
  Wrench,
  Ruler,
  Wind,
  Settings,
  Network,
  CircuitBoard,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Zap,
  Box,
  Cpu,
  Cable,
  Wrench,
  Ruler,
  Wind,
  Settings,
  Network,
  CircuitBoard,
}

export default function ChapterPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 pb-20 md:pb-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Kapitelweises Lernen</h1>
          <p className="text-sm text-text-muted">Wähle ein Kapitel zur gezielten Vertiefung</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {CHAPTERS.map((chapter) => {
            const Icon = iconMap[chapter.icon] || Box
            const questionCount = CHAPTER_QUESTIONS[chapter.number]?.length ?? 0
            return (
              <Link key={chapter.number} href={`/quiz/chapter/${chapter.number}`} className="block group">
                <div className="bg-bg-surface border border-border-subtle p-5 transition-all hover:border-text-primary">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono text-text-muted uppercase tracking-widest">
                      {String(chapter.number).padStart(2, "0")}
                    </span>
                    <Icon className="w-4 h-4 text-text-muted group-hover:text-accent-primary transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-primary transition-colors mb-1 tracking-tight">
                    {chapter.name}
                  </h3>
                  <span className="text-[11px] font-mono text-text-muted">
                    {questionCount} Fragen
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
