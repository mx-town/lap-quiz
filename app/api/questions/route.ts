import { NextRequest, NextResponse } from "next/server"
import { SEED_QUESTIONS } from "@/lib/seed-questions"

// Temporary API route serving seed questions
// Replace with Supabase queries once connected
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const chapter = searchParams.get("chapter")
  const type = searchParams.get("type")
  const limit = parseInt(searchParams.get("limit") || "20")

  let questions = SEED_QUESTIONS.map((q, i) => ({ ...q, id: `api-${i}` }))

  if (chapter) {
    questions = questions.filter((q) => q.chapter_number === parseInt(chapter))
  }

  if (type) {
    questions = questions.filter((q) => q.question_type === type)
  }

  // Shuffle and limit
  questions = questions.sort(() => Math.random() - 0.5).slice(0, limit)

  return NextResponse.json({ questions })
}
