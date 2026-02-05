"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { CHAPTERS } from "@/types"
import { Shield, Zap, Box, Cpu, Cable, Wrench, Ruler, Wind, Settings, Network, CircuitBoard } from "lucide-react"

const iconMap: Record<string, any> = {
  Shield, Zap, Box, Cpu, Cable, Wrench, Ruler, Wind, Settings, Network, CircuitBoard,
}

export default function ChapterPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Kapitelweises Lernen</h1>
        <p className="text-text-muted mb-8">Wähle ein Kapitel zur gezielten Vertiefung</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHAPTERS.map((chapter, i) => {
            const Icon = iconMap[chapter.icon] || Box
            return (
              <motion.div
                key={chapter.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/quiz/chapter/${chapter.number}`} className="block group">
                  <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 transition-all hover:border-accent-primary/30 hover:-translate-y-0.5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent-primary" />
                      </div>
                      <span className="text-xs font-mono text-text-muted">Kap. {chapter.number}</span>
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
