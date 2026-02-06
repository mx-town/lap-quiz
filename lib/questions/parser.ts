import { Question } from "@/types"
import { RawChapterFile } from "./types"

const DIFFICULTY_MAP: Record<string, 1 | 2 | 3> = {
  leicht: 1,
  mittel: 2,
  schwer: 3,
}

export function parseChapterFile(raw: RawChapterFile): Question[] {
  const chapterNumber = parseInt(raw.chapter)

  return raw.questions.map((q) => ({
    id: q.id,
    chapter_number: chapterNumber,
    chapter_name: raw.title,
    section: null,
    question_text: q.q,
    question_type: "multiple_choice" as const,
    options: q.options,
    correct_answer: String(q.correct),
    explanation: q.explanation,
    difficulty: DIFFICULTY_MAP[q.difficulty],
    tags: q.tags,
    source: "lexikon" as const,
  }))
}
