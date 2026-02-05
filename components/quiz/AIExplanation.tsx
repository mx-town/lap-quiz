"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Loader2 } from "lucide-react"

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

  if (explanation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-xl bg-accent-primary/5 border border-accent-primary/20"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-accent-primary" />
          <span className="text-sm font-medium text-accent-primary">KI-Erklärung</span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{explanation}</p>
      </motion.div>
    )
  }

  return (
    <button
      onClick={fetchExplanation}
      disabled={loading}
      className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-primary/10 text-accent-primary text-sm font-medium hover:bg-accent-primary/20 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Erklärung wird generiert...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          KI-Erklärung anfordern
        </>
      )}
      {error && <span className="text-accent-danger ml-2">{error}</span>}
    </button>
  )
}
