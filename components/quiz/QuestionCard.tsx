"use client"

import { useState } from "react"
import { Question } from "@/types"
import { cn } from "@/lib/utils"
import { normalize } from "@/lib/quiz-engine"

interface QuestionCardProps {
  question: Question
  index: number
  total: number
  onAnswer: (answer: string) => void
  showFeedback?: boolean
  isFocus?: boolean
  onNext?: () => void
}

function getOptionStyle(
  isSubmitted: boolean,
  isCorrect: boolean,
  isSelected: boolean,
  optionIndex: string,
  correctAnswer: string
): string {
  if (isSubmitted && optionIndex === correctAnswer) {
    return "border-accent-success bg-accent-success/5 text-accent-success border-l-4"
  }
  if (isSubmitted && isSelected && optionIndex !== correctAnswer) {
    return "border-accent-danger bg-accent-danger/5 text-accent-danger border-l-4"
  }
  if (isSelected) {
    return "border-text-primary bg-bg-tertiary text-text-primary border-l-4"
  }
  return "border-border-subtle hover:border-text-muted text-text-secondary"
}

function getInputStyle(isSubmitted: boolean, isCorrect: boolean): string {
  if (isSubmitted && isCorrect) {
    return "border-accent-success"
  }
  if (isSubmitted && !isCorrect) {
    return "border-accent-danger"
  }
  return "border-border-subtle focus:border-text-primary"
}

export function QuestionCard({
  question,
  index,
  total,
  onAnswer,
  showFeedback = false,
  isFocus,
  onNext,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [fillAnswer, setFillAnswer] = useState("")

  const isCorrect =
    submitted &&
    (() => {
      if (question.question_type === "fill_blank") {
        return normalize(fillAnswer) === normalize(question.correct_answer)
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
    <div
      className={cn(
        "w-full max-w-2xl mx-auto",
        submitted && !isCorrect && "animate-shake"
      )}
    >
      <div className="bg-bg-surface border border-border-subtle p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-[11px] font-mono text-text-muted uppercase tracking-widest">
            Frage {index + 1} / {total}
          </span>
          <div className="flex items-center gap-2">
            {isFocus !== undefined && (
              <span
                className={cn(
                  "text-[10px] uppercase tracking-widest font-medium px-2 py-1",
                  isFocus
                    ? "bg-accent-primary/10 text-accent-primary"
                    : "bg-bg-tertiary text-text-muted"
                )}
              >
                {isFocus ? "Schwerpunkt" : "Querfrage"}
              </span>
            )}
            <span className="text-[10px] uppercase tracking-widest font-mono text-text-muted bg-bg-tertiary px-2 py-1">
              Kap. {question.chapter_number}
            </span>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-lg font-semibold text-text-primary mb-8 leading-relaxed tracking-tight">
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
                  "w-full text-left p-4 border-2 transition-all text-[14px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface",
                  getOptionStyle(submitted, isCorrect, selected === String(i), String(i), question.correct_answer)
                )}
              >
                <span className="font-mono text-[12px] mr-3 text-text-muted">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </button>
            ))}
          </div>
        )}

        {question.question_type === "true_false" && (
          <div className="flex gap-3">
            {["true", "false"].map((val) => (
              <button
                key={val}
                onClick={() => !submitted && setSelected(val)}
                disabled={submitted}
                className={cn(
                  "flex-1 p-4 border-2 text-center font-medium transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface",
                  getOptionStyle(submitted, isCorrect, selected === val, val, question.correct_answer)
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
                "w-full p-4 border-2 bg-bg-tertiary text-text-primary placeholder-text-muted transition-all outline-none",
                "focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface",
                getInputStyle(submitted, isCorrect)
              )}
            />
            {submitted && !isCorrect && (
              <p className="mt-2 text-sm text-text-secondary">
                Richtige Antwort: {question.correct_answer}
              </p>
            )}
          </div>
        )}

        {/* Submit button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={
              (question.question_type === "fill_blank" ? !fillAnswer : selected === null)
            }
            className="mt-8 w-full py-3.5 bg-text-primary text-bg-primary font-medium transition-all hover:bg-accent-primary disabled:opacity-20 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface uppercase tracking-wider text-[13px]"
          >
            Bestätigen
          </button>
        )}

        {/* Next button */}
        {submitted && onNext && (
          <button
            onClick={onNext}
            className="mt-4 w-full py-3 bg-bg-tertiary text-white font-medium transition-all hover:bg-border-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface uppercase tracking-wider text-[13px]"
          >
            Weiter
          </button>
        )}

        {/* Feedback */}
        {submitted && showFeedback && (
          <div
            className={cn(
              "mt-6 p-4 border-l-4",
              isCorrect ? "border-accent-success bg-accent-success/5" : "border-accent-danger bg-accent-danger/5"
            )}
          >
            <p className={cn("font-semibold text-sm mb-1", isCorrect ? "text-accent-success" : "text-accent-danger")}>
              {isCorrect ? "Richtig" : "Falsch"}
            </p>
            {question.explanation && (
              <p className="text-sm text-text-secondary leading-relaxed">{question.explanation}</p>
            )}
          </div>
        )}


        
      </div>
    </div>
  )
}
