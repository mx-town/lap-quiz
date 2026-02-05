"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Question } from "@/types"
import { cn } from "@/lib/utils"
import { AIExplanation } from "./AIExplanation"

interface QuestionCardProps {
  question: Question
  index: number
  total: number
  onAnswer: (answer: string) => void
  showFeedback?: boolean
  isFocus?: boolean
}

export function QuestionCard({
  question,
  index,
  total,
  onAnswer,
  showFeedback = false,
  isFocus,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [fillAnswer, setFillAnswer] = useState("")

  const isCorrect =
    submitted &&
    (() => {
      if (question.question_type === "fill_blank") {
        const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, " ").replace(/,/g, ".").trim()
        return normalize(fillAnswer) === normalize(question.correct_answer)
      }
      if (question.question_type === "scenario") {
        const correctIndices = question.correct_answer.split(",").map((s) => s.trim())
        return selected !== null && correctIndices.includes(selected)
      }
      return selected === question.correct_answer
    })()

  const handleSubmit = () => {
    if (submitted) return
    const answer = question.question_type === "fill_blank" ? fillAnswer : selected
    if (answer === null || answer === undefined) return
    setSubmitted(true)
    onAnswer(String(answer))
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-text-muted">
            Frage {index + 1} von {total}
          </span>
          <div className="flex items-center gap-2">
            {isFocus !== undefined && (
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  isFocus
                    ? "bg-accent-primary/20 text-accent-primary"
                    : "bg-bg-tertiary text-text-muted"
                )}
              >
                {isFocus ? "SCHWERPUNKT" : "QUERFRAGE"}
              </span>
            )}
            <span className="text-xs px-2 py-1 rounded-full bg-bg-tertiary text-text-muted">
              Kap. {question.chapter_number}
            </span>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold text-text-primary mb-6 leading-relaxed">
          {question.question_text}
        </h2>

        {/* Answer area */}
        {question.question_type === "multiple_choice" && question.options && (
          <div className="space-y-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => !submitted && setSelected(String(i))}
                disabled={submitted}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  submitted && String(i) === question.correct_answer
                    ? "border-accent-success bg-accent-success/10 text-accent-success"
                    : submitted && String(i) === selected && String(i) !== question.correct_answer
                    ? "border-accent-danger bg-accent-danger/10 text-accent-danger"
                    : selected === String(i)
                    ? "border-accent-primary bg-accent-primary/10 text-text-primary"
                    : "border-border-subtle hover:border-border-panel text-text-secondary"
                )}
              >
                <span className="font-mono text-sm mr-3 opacity-50">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </button>
            ))}
          </div>
        )}

        {question.question_type === "true_false" && (
          <div className="flex gap-4">
            {["true", "false"].map((val) => (
              <button
                key={val}
                onClick={() => !submitted && setSelected(val)}
                disabled={submitted}
                className={cn(
                  "flex-1 p-4 rounded-xl border text-center font-medium transition-all",
                  submitted && val === question.correct_answer
                    ? "border-accent-success bg-accent-success/10 text-accent-success"
                    : submitted && val === selected && val !== question.correct_answer
                    ? "border-accent-danger bg-accent-danger/10 text-accent-danger"
                    : selected === val
                    ? "border-accent-primary bg-accent-primary/10 text-text-primary"
                    : "border-border-subtle hover:border-border-panel text-text-secondary"
                )}
              >
                {val === "true" ? "Richtig" : "Falsch"}
              </button>
            ))}
          </div>
        )}

        {question.question_type === "fill_blank" && (
          <div>
            <input
              type="text"
              value={fillAnswer}
              onChange={(e) => !submitted && setFillAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              disabled={submitted}
              placeholder="Antwort eingeben..."
              className={cn(
                "w-full p-4 rounded-xl border bg-bg-tertiary text-text-primary placeholder-text-muted transition-all outline-none",
                submitted && isCorrect
                  ? "border-accent-success"
                  : submitted && !isCorrect
                  ? "border-accent-danger"
                  : "border-border-subtle focus:border-accent-primary"
              )}
            />
            {submitted && !isCorrect && (
              <p className="mt-2 text-sm text-accent-success">
                Richtige Antwort: {question.correct_answer}
              </p>
            )}
          </div>
        )}

        {question.question_type === "scenario" && question.options && (
          <div className="space-y-3">
            <p className="text-sm text-text-muted mb-4">
              Wähle die richtige(n) Maßnahme(n):
            </p>
            {question.options.map((option, i) => {
              const correctIndices = question.correct_answer.split(",").map((s) => s.trim())
              return (
                <button
                  key={i}
                  onClick={() => !submitted && setSelected(String(i))}
                  disabled={submitted}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    submitted && correctIndices.includes(String(i))
                      ? "border-accent-success bg-accent-success/10 text-accent-success"
                      : submitted && String(i) === selected && !correctIndices.includes(String(i))
                      ? "border-accent-danger bg-accent-danger/10 text-accent-danger"
                      : selected === String(i)
                      ? "border-accent-primary bg-accent-primary/10 text-text-primary"
                      : "border-border-subtle hover:border-border-panel text-text-secondary"
                  )}
                >
                  {option}
                </button>
              )
            })}
          </div>
        )}

        {/* Submit button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={
              (question.question_type === "fill_blank" ? !fillAnswer : selected === null)
            }
            className="mt-6 w-full py-3 rounded-xl bg-accent-primary text-white font-medium transition-all hover:bg-accent-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Antwort bestätigen
          </button>
        )}

        {/* Feedback */}
        {submitted && showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-6 p-4 rounded-xl",
              isCorrect ? "bg-accent-success/10" : "bg-accent-danger/10"
            )}
          >
            <p className={cn("font-medium mb-2", isCorrect ? "text-accent-success" : "text-accent-danger")}>
              {isCorrect ? "Richtig!" : "Leider falsch"}
            </p>
            {question.explanation && (
              <p className="text-sm text-text-secondary">{question.explanation}</p>
            )}
          </motion.div>
        )}

        {/* AI Explanation */}
        {submitted && !isCorrect && showFeedback && (
          <AIExplanation
            questionId={question.id}
            questionText={question.question_text}
            userAnswer={
              question.question_type === "fill_blank"
                ? fillAnswer
                : selected !== null && question.options
                ? question.options[parseInt(selected)]
                : ""
            }
            correctAnswer={
              question.options
                ? question.options[parseInt(question.correct_answer)] || question.correct_answer
                : question.correct_answer
            }
          />
        )}
      </div>
    </motion.div>
  )
}
