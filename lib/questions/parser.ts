import { Question } from "@/types"
import { RawChapterFile } from "./types"

const DIFFICULTY_MAP: Record<string, 1 | 2 | 3> = {
  leicht: 1,
  mittel: 2,
  schwer: 3,
}

/** Seeded PRNG (mulberry32) for deterministic shuffling */
function seededRng(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Hash string to a 32-bit seed */
function hashSeed(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return h
}

/** Deterministic shuffle using question id as seed — ensures correct answer isn't always at the same index */
function shuffleOptions(options: string[], correctIndex: number, seed: string): { options: string[]; correctIndex: number } {
  const rng = seededRng(hashSeed(seed))
  const indices = options.map((_, i) => i)
  // Fisher-Yates with seeded PRNG
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  const shuffled = indices.map((i) => options[i])
  const newCorrectIndex = indices.indexOf(correctIndex)
  return { options: shuffled, correctIndex: newCorrectIndex }
}

export function parseChapterFile(raw: RawChapterFile): Question[] {
  const chapterNumber = parseInt(raw.chapter)

  return raw.questions.map((q) => {
    const { options, correctIndex } = shuffleOptions(q.options, q.correct, q.id)
    return {
      id: q.id,
      chapter_number: chapterNumber,
      chapter_name: raw.title,
      section: null,
      question_text: q.q,
      question_type: "multiple_choice" as const,
      options,
      correct_answer: String(correctIndex),
      explanation: q.explanation,
      difficulty: DIFFICULTY_MAP[q.difficulty],
      tags: q.tags,
      source: "lexikon" as const,
    }
  })
}
