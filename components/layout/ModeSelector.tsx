"use client"

import Link from "next/link"
import { Target, BookOpen, Zap, Wrench, Settings } from "lucide-react"

const modes = [
  {
    href: "/quiz/exam",
    title: "Prüfungssimulation",
    subtitle: "20 Fragen · 30 Min · Alle Kapitel",
    icon: Target,
    accentColor: "blue",
  },
  {
    href: "/quiz/chapter",
    title: "Kapitelweises Lernen",
    subtitle: "Gezielt vertiefen · Sofortiges Feedback",
    icon: BookOpen,
    accentColor: "violet",
  },
  {
    href: "/quiz/blitz",
    title: "Blitzrunde",
    subtitle: "Richtig oder Falsch · 10 Sek. pro Frage",
    icon: Zap,
    accentColor: "cyan",
  },
  {
    href: "/quiz/scenario",
    title: "Praxisszenario",
    subtitle: "Fehlersuche · Anlagenanalyse · Normen",
    icon: Wrench,
    accentColor: "amber",
  },
  {
    href: "/quiz/custom",
    title: "Mein Fachbereich",
    subtitle: "Dein Tätigkeitsbereich · Schwerpunkt + Querfragen",
    icon: Settings,
    accentColor: "green",
  },
]

const accentStyles = {
  blue: {
    icon: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-500/10",
    hover: "hover:border-blue-400",
  },
  violet: {
    icon: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-500/10",
    hover: "hover:border-violet-400",
  },
  cyan: {
    icon: "text-cyan-600 dark:text-cyan-400",
    iconBg: "bg-cyan-100 dark:bg-cyan-500/10",
    hover: "hover:border-cyan-400",
  },
  amber: {
    icon: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-500/10",
    hover: "hover:border-amber-400",
  },
  green: {
    icon: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-500/10",
    hover: "hover:border-green-400",
  },
}

export function ModeSelector() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modes.map((mode) => {
        const Icon = mode.icon
        const styles = accentStyles[mode.accentColor as keyof typeof accentStyles]
        return (
          <Link key={mode.href} href={mode.href} className="block group">
            <div
              className={`rounded-2xl bg-bg-surface border border-border-subtle p-6 transition-colors ${styles.hover}`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center mb-4`}
              >
                <Icon className={`w-6 h-6 ${styles.icon}`} />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                {mode.title}
              </h3>
              <p className="text-sm text-text-secondary">{mode.subtitle}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
