"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Target, BookOpen, Zap, Wrench, Settings } from "lucide-react"

const modes = [
  {
    href: "/quiz/exam",
    title: "Prüfungssimulation",
    subtitle: "20 Fragen · 30 Min · Alle Kapitel",
    icon: Target,
    gradient: "bg-gradient-blue",
    bgGradientAngle: "135deg",
    accentColor: "blue",
    delay: 0,
  },
  {
    href: "/quiz/chapter",
    title: "Kapitelweises Lernen",
    subtitle: "Gezielt vertiefen · Sofortiges Feedback",
    icon: BookOpen,
    gradient: "bg-gradient-violet",
    bgGradientAngle: "90deg",
    accentColor: "violet",
    delay: 0.1,
  },
  {
    href: "/quiz/blitz",
    title: "Blitzrunde",
    subtitle: "Richtig oder Falsch · 10 Sek. pro Frage",
    icon: Zap,
    gradient: "bg-gradient-cyan",
    bgGradientAngle: "45deg",
    accentColor: "cyan",
    delay: 0.2,
  },
  {
    href: "/quiz/scenario",
    title: "Praxisszenario",
    subtitle: "Fehlersuche · Anlagenanalyse · Normen",
    icon: Wrench,
    gradient: "bg-gradient-orange",
    bgGradientAngle: "180deg",
    accentColor: "amber",
    delay: 0.3,
  },
  {
    href: "/quiz/custom",
    title: "Mein Fachbereich",
    subtitle: "Dein Tätigkeitsbereich · Schwerpunkt + Querfragen",
    icon: Settings,
    gradient: "bg-gradient-green",
    bgGradientAngle: "225deg",
    accentColor: "green",
    delay: 0.4,
  },
]

const accentStyles = {
  blue: {
    hover: "hover:border-blue-500/50",
    shadow: "group-hover:shadow-glow-blue",
  },
  violet: {
    hover: "hover:border-violet-500/50",
    shadow: "group-hover:shadow-glow-primary",
  },
  cyan: {
    hover: "hover:border-cyan-500/50",
    shadow: "group-hover:shadow-glow-cyan",
  },
  amber: {
    hover: "hover:border-amber-500/50",
    shadow: "group-hover:shadow-glow-warning",
  },
  green: {
    hover: "hover:border-green-500/50",
    shadow: "group-hover:shadow-glow-success",
  },
}

export function ModeSelector() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modes.map((mode) => {
        const Icon = mode.icon
        const styles = accentStyles[mode.accentColor as keyof typeof accentStyles]
        return (
          <motion.div
            key={mode.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mode.delay, duration: 0.4 }}
          >
            <Link href={mode.href} className="block group">
              <div
                className={`relative overflow-hidden rounded-2xl bg-bg-surface border border-border-subtle p-6 transition-all duration-300 ${styles.hover} ${styles.shadow} hover:shadow-lg hover:-translate-y-1`}
                style={{
                  backgroundImage: `linear-gradient(${mode.bgGradientAngle}, rgba(255,255,255,0.02) 0%, transparent 50%)`,
                }}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${mode.gradient} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {mode.title}
                </h3>
                <p className="text-sm text-text-secondary">{mode.subtitle}</p>
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.15] group-hover:opacity-25 transition-all duration-300 group-hover:scale-110">
                  <Icon className="w-full h-full" />
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
