export interface RawChapterFile {
  chapter: string
  title: string
  description: string
  questionCount: number
  questions: RawQuestion[]
}

export interface RawQuestion {
  id: string
  q: string
  options: string[]
  correct: number
  explanation: string
  difficulty: "leicht" | "mittel" | "schwer"
  tags: string[]
}
