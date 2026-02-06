import { Question } from "@/types"
import { RawChapterFile } from "./types"
import { parseChapterFile } from "./parser"

import ch01 from "./01-schutzkonzepte.json"
import ch02 from "./02-et-gesetze.json"
import ch03 from "./03-schaltkasten.json"
import ch04 from "./04-halbleitertechnik.json"
import ch05 from "./05-kabel-stecker.json"
import ch06 from "./06-mechanik.json"
import ch07 from "./07-messen-pruefen.json"
import ch08 from "./08-pneumatik.json"
import ch09 from "./09-sps-steuerung.json"
import ch10 from "./10-netzsysteme.json"
import ch11 from "./11-smt.json"
import ch12 from "./12-motoren.json"

const chapters = [
  ch01, ch02, ch03, ch04, ch05, ch06,
  ch07, ch08, ch09, ch10, ch11, ch12,
] as unknown as RawChapterFile[]

export const ALL_QUESTIONS: Question[] = chapters.flatMap(parseChapterFile)

export const CHAPTER_QUESTIONS: Record<number, Question[]> = {}
for (const q of ALL_QUESTIONS) {
  if (!CHAPTER_QUESTIONS[q.chapter_number]) {
    CHAPTER_QUESTIONS[q.chapter_number] = []
  }
  CHAPTER_QUESTIONS[q.chapter_number].push(q)
}

export function getQuestionsByChapter(num: number): Question[] {
  return CHAPTER_QUESTIONS[num] ?? []
}
