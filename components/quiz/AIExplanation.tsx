"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/Skeleton"

interface AIExplanationProps {
  questionId: string
  questionText: string
  userAnswer: string
  correctAnswer: string
}

export function AIExplanation({
  questionId,
  questionText,
  userAnswer,
  correctAnswer,
}: AIExplanationProps) {
  const [explanation, setExplanation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExplanation = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          questionText,
          userAnswer,
          correctAnswer,
        }),
      })
      if (!res.ok) throw new Error("Fehler beim Laden der Erklärung")
      const data = await res.json()
      setExplanation(data.explanation)
    } catch (err) {
      setError("KI-Erklärung konnte nicht geladen werden.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-4 p-4 border border-border-subtle bg-bg-secondary">
        <div className="flex items-center gap-2 mb-3">
          <Loader2 className="w-4 h-4 text-text-muted animate-spin" />
          <span className="text-[12px] font-mono uppercase tracking-widest text-text-muted">Generiere...</span>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-4 p-4 border-l-4 border-accent-danger bg-accent-danger/5">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="w-4 h-4 text-accent-danger" />
          <span className="text-sm font-medium text-accent-danger">Fehler</span>
        </div>
        <p className="text-sm text-text-secondary mb-2">{error}</p>
        <button
          onClick={fetchExplanation}
          className="text-[13px] text-text-primary hover:text-accent-primary underline underline-offset-2"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }

  if (explanation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 border border-border-subtle bg-bg-secondary"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent-primary" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">KI-Erklärung</span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{explanation}</p>
      </motion.div>
    )
  }

  return (
    <button
      onClick={fetchExplanation}
      className="mt-4 flex items-center gap-2 px-4 py-2.5 border border-border-subtle text-text-secondary text-[13px] font-medium hover:border-text-primary hover:text-text-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface uppercase tracking-wider"
    >
      <Sparkles className="w-4 h-4" />
      KI-Erklärung
    </button>
  )
}
