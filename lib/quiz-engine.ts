import { Question } from "@/types"

export function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").replace(/,/g, ".").trim()
}

export function checkAnswer(question: Question, answer: string): boolean {
  if (question.question_type === "multiple_choice") {
    return answer === question.correct_answer
  }
  if (question.question_type === "true_false") {
    return answer.toLowerCase() === question.correct_answer.toLowerCase()
  }
  if (question.question_type === "fill_blank") {
    return normalize(answer) === normalize(question.correct_answer)
  }
  return false
}
