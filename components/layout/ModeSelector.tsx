"use client"

import Link from "next/link"
import { Target, BookOpen, Zap, Settings } from "lucide-react"

const modes = [
  {
    href: "/quiz/exam",
    title: "Prüfungssimulation",
    subtitle: "20 Fragen · 30 Min · Alle Kapitel",
    icon: Target,
    number: "01",
  },
  {
    href: "/quiz/chapter",
    title: "Kapitelweises Lernen",
    subtitle: "Gezielt vertiefen · Sofortiges Feedback",
    icon: BookOpen,
    number: "02",
  },
  {
    href: "/quiz/blitz",
    title: "Blitzrunde",
    subtitle: "Richtig oder Falsch · 20 Sek. pro Frage",
    icon: Zap,
    number: "03",
  },
  {
    href: "/quiz/custom",
    title: "Mein Fachbereich",
    subtitle: "Dein Tätigkeitsbereich · Schwerpunkt + Querfragen",
    icon: Settings,
    number: "04",
  },
]

export function ModeSelector() {
  const topModes = modes.slice(0, 3)
  const bottomMode = modes[3]
  const BottomIcon = bottomMode.icon

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topModes.map((mode) => {
          const Icon = mode.icon
          return (
            <Link key={mode.href} href={mode.href} className="block group">
              <div className="bg-bg-surface border border-border-subtle p-6 transition-all hover:border-text-primary">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono text-text-muted uppercase tracking-widest">
                    {mode.number}
                  </span>
                  <Icon className="w-5 h-5 text-text-muted group-hover:text-accent-primary transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-1 tracking-tight">
                  {mode.title}
                </h3>
                <p className="text-[13px] text-text-muted">{mode.subtitle}</p>
              </div>
            </Link>
          )
        })}
      </div>
      <div className="flex justify-center">
        <Link href={bottomMode.href} className="block group w-full md:w-1/2 lg:w-1/3">
          <div className="bg-bg-surface border border-border-subtle p-6 transition-all hover:border-text-primary">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] font-mono text-text-muted uppercase tracking-widest">
                {bottomMode.number}
              </span>
              <BottomIcon className="w-5 h-5 text-text-muted group-hover:text-accent-primary transition-colors" />
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1 tracking-tight">
              {bottomMode.title}
            </h3>
            <p className="text-[13px] text-text-muted">{bottomMode.subtitle}</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
