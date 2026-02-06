import { createClient } from "@/lib/supabase-client"
import { Question, QuizMode, CustomProfile } from "@/types"
import { shuffleArray } from "@/lib/utils"

export async function fetchQuestions(
  mode: QuizMode,
  options?: {
    chapterFilter?: number
    count?: number
    profile?: CustomProfile
  }
): Promise<Question[]> {
  const supabase = createClient()
  const count = options?.count || 20

  if (mode === "chapter" && options?.chapterFilter) {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .eq("chapter_number", options.chapterFilter)
      .order("section")
    return data || []
  }

  if (mode === "blitz") {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .in("question_type", ["true_false", "multiple_choice"])
      .limit(count * 2)
    return shuffleArray(data || []).slice(0, count)
  }

  if (mode === "scenario") {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .eq("question_type", "scenario")
      .limit(count)
    return shuffleArray(data || [])
  }

  if (mode === "custom" && options?.profile) {
    return fetchCustomQuestions(options.profile)
  }

  // exam mode: weighted random from all chapters
  const { data: allQuestions } = await supabase
    .from("questions")
    .select("*")
  
  if (!allQuestions) return []
  return shuffleArray(allQuestions).slice(0, count)
}

async function fetchCustomQuestions(profile: CustomProfile): Promise<Question[]> {
  const supabase = createClient()
  const total = profile.question_count
  const focusCount = Math.round(total * (profile.focus_weight / 100))
  const crossCount = total - focusCount

  // Fetch focus questions
  let focusQuery = supabase
    .from("questions")
    .select("*")
    .in("chapter_number", profile.focus_chapters)

  if (profile.difficulty_filter !== "mixed") {
    const diffMap = { easy: 1, medium: 2, hard: 3 }
    focusQuery = focusQuery.eq("difficulty", diffMap[profile.difficulty_filter])
  }

  const { data: focusData } = await focusQuery

  // Fetch cross questions (remaining chapters)
  const allChapters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const crossChapters = allChapters.filter(
    (c) => !profile.focus_chapters.includes(c) && !profile.excluded_chapters.includes(c)
  )

  const { data: crossData } = await supabase
    .from("questions")
    .select("*")
    .in("chapter_number", crossChapters)

  const focusQuestions = shuffleArray(focusData || []).slice(0, focusCount)
  const crossQuestions = shuffleArray(crossData || []).slice(0, crossCount)

  // Tag questions for UI
  const tagged = [
    ...focusQuestions.map((q) => ({ ...q, _isFocus: true })),
    ...crossQuestions.map((q) => ({ ...q, _isFocus: false })),
  ]

  return shuffleArray(tagged)
}

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
  if (question.question_type === "scenario") {
    // Scenario: correct_answer can be comma-separated indices
    const correctIndices = question.correct_answer.split(",").map((s) => s.trim())
    return correctIndices.includes(answer)
  }
  return false
}
