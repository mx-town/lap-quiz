"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
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

  // Loading skeleton
  if (loading) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-accent-primary/5 border border-accent-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Loader2 className="w-4 h-4 text-accent-primary animate-spin" />
          <span className="text-sm font-medium text-accent-primary">Erklärung wird generiert...</span>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-accent-danger/5 border border-accent-danger/20">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-accent-danger" />
          <span className="text-sm font-medium text-accent-danger">Fehler</span>
        </div>
        <p className="text-sm text-text-secondary mb-3">{error}</p>
        <button
          onClick={fetchExplanation}
          className="text-sm text-accent-primary hover:underline"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }

  // Explanation loaded
  if (explanation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-xl bg-accent-primary/5 border border-accent-primary/20 shadow-md shadow-accent-primary/10"
      >
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-accent-success" />
          <Sparkles className="w-4 h-4 text-accent-primary" />
          <span className="text-sm font-medium text-accent-primary">KI-Erklärung</span>
        </div>
        <p className="text-base text-text-secondary leading-relaxed">{explanation}</p>
      </motion.div>
    )
  }

  // Default button state
  return (
    <button
      onClick={fetchExplanation}
      className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-primary/10 text-accent-primary text-sm font-medium hover:bg-accent-primary/20 hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
    >
      <Sparkles className="w-4 h-4" />
      KI-Erklärung anfordern
    </button>
  )
}
