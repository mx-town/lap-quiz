export type QuestionType = "multiple_choice" | "true_false" | "fill_blank" | "scenario"

export type QuizMode = "exam" | "chapter" | "blitz" | "scenario" | "custom"

export type Difficulty = 1 | 2 | 3

export type QuestionSource = "lexikon" | "docx" | "manual" | "ai_generated" | "smt_document"

export interface Question {
  id: string
  chapter_number: number
  chapter_name: string
  section: string | null
  question_text: string
  question_type: QuestionType
  options: string[] | null
  correct_answer: string
  explanation: string | null
  difficulty: Difficulty
  tags: string[]
  source: QuestionSource
}

export interface UserProgress {
  id: string
  user_id: string
  question_id: string
  answered_correctly: boolean
  answer_given: string
  time_taken_seconds: number
  session_mode: QuizMode
  answered_at: string
}

export interface QuizSession {
  id: string
  user_id: string
  mode: QuizMode
  chapter_filter: number | null
  total_questions: number
  correct_answers: number
  score_percent: number
  duration_seconds: number
  started_at: string
  finished_at: string | null
}

export interface CustomProfile {
  id: string
  user_id: string
  profile_name: string
  preset_profile: string | null
  focus_chapters: number[]
  focus_weight: number
  excluded_chapters: number[]
  difficulty_filter: "easy" | "medium" | "hard" | "mixed"
  question_count: number
  time_limit_minutes: number | null
  extra_tags: string[]
  is_default: boolean
}

export interface QuizState {
  questions: Question[]
  currentIndex: number
  answers: Map<string, string>
  correctCount: number
  startedAt: Date
  mode: QuizMode
  isFinished: boolean
}

export interface QuizResult {
  totalQuestions: number
  correctAnswers: number
  scorePercent: number
  durationSeconds: number
  byChapter: Record<number, { total: number; correct: number }>
  mode: QuizMode
  chapterNumber?: number
  bestStreak?: number
}

export const CHAPTERS = [
  { number: 1, name: "Schutzkonzepte", icon: "Shield" },
  { number: 2, name: "ET Gesetze", icon: "Zap" },
  { number: 3, name: "Schaltkasten", icon: "Box" },
  { number: 4, name: "Halbleitertechnik", icon: "Cpu" },
  { number: 5, name: "Kabel/Leitungen/Stecker", icon: "Cable" },
  { number: 6, name: "Mechanische Bearbeitung", icon: "Wrench" },
  { number: 7, name: "Mechanisches Messen/Prüfen", icon: "Ruler" },
  { number: 8, name: "Pneumatik", icon: "Wind" },
  { number: 9, name: "Regelungs-/Steuerungstechnik/SPS", icon: "Settings" },
  { number: 10, name: "Netzsysteme", icon: "Network" },
  { number: 11, name: "SMT-Fertigung", icon: "CircuitBoard" },
  { number: 12, name: "Elektrische Motoren", icon: "Motor" },
] as const

export const PRESET_PROFILES = [
  {
    id: "schaltschrankbau",
    name: "Schaltschrankbau / Elektroinstallation",
    focusChapters: [3, 5, 10],
    extraTags: [],
    description: "Verdrahtung, LS/FI, Kabelquerschnitte, Netzsysteme",
  },
  {
    id: "sps",
    name: "SPS-Programmierung / Automatisierung",
    focusChapters: [9, 3, 4],
    extraTags: [],
    description: "KOP/FUP/AWL, Sensorik, Schützsteuerung",
  },
  {
    id: "instandhaltung",
    name: "Instandhaltung / Service",
    focusChapters: [1, 2, 3, 10],
    extraTags: [],
    description: "Fehlersuche, Sicherheitsregeln, Messtechnik",
  },
  {
    id: "smt",
    name: "SMT-Fertigung / Elektronikproduktion",
    focusChapters: [11, 4, 7],
    extraTags: ["IPC", "Reflow", "MSD"],
    description: "Reflow, Lötpaste, AOI/SPI, IPC-Klassen",
  },
  {
    id: "robotik",
    name: "Robotik / Handhabungstechnik",
    focusChapters: [9, 8, 4],
    extraTags: [],
    description: "SPS-Anbindung, Pneumatik, Sensorik",
  },
  {
    id: "gebaeudetechnik",
    name: "Gebäudetechnik / Haustechnik",
    focusChapters: [10, 1, 5, 3],
    extraTags: [],
    description: "Netzsysteme, Schutzkonzepte, Kabelverlegung",
  },
  {
    id: "brandschutz",
    name: "Brandschutztechnik",
    focusChapters: [1, 10, 5, 3],
    extraTags: ["Brandschutz", "TRVB", "CPR"],
    description: "Kabelklassifizierung, Funktionserhalt, TRVB",
  },
  {
    id: "pneumatik",
    name: "Pneumatik / Hydraulik",
    focusChapters: [8, 6, 7],
    extraTags: [],
    description: "Ventile, Zylinder, Schaltpläne",
  },
  {
    id: "fertigung",
    name: "Fertigung / Mechanik",
    focusChapters: [6, 7, 5],
    extraTags: [],
    description: "Bohren, Drehen, Fräsen, Toleranzen",
  },
] as const
