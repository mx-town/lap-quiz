"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { CHAPTERS } from "@/types"
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
  HelpCircle,
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

// Placeholder question counts - will be replaced with actual data from Supabase
const questionCounts: Record<number, number> = {
  1: 15, 2: 22, 3: 18, 4: 25, 5: 20, 6: 17, 7: 12, 8: 19, 9: 14, 10: 21, 11: 16
}

export default function ChapterPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Kapitelweises Lernen</h1>
          <p className="text-text-secondary mb-8">Wähle ein Kapitel zur gezielten Vertiefung</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CHAPTERS.map((chapter, i) => {
            const Icon = iconMap[chapter.icon] || Box
            const questionCount = questionCounts[chapter.number] || 0
            return (
              <motion.div
                key={chapter.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/quiz/chapter/${chapter.number}`} className="block group">
                  <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 transition-all hover:border-violet-500/50 hover:-translate-y-1 hover:shadow-glow-primary">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5 text-accent-primary" />
                        </div>
                        <span className="text-xs font-mono text-text-muted">Kap. {chapter.number}</span>
                      </div>
                      {/* Question count badge */}
                      <div className="flex items-center gap-1 text-xs text-text-muted bg-bg-tertiary px-2 py-1 rounded-full">
                        <HelpCircle className="w-3 h-3" />
                        <span>{questionCount}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                      {chapter.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </main>
    </>
  )
}
