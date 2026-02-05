-- LAP Quiz App - Database Schema
-- Run this in the Supabase SQL Editor

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_number INTEGER NOT NULL CHECK (chapter_number BETWEEN 1 AND 11),
  chapter_name TEXT NOT NULL,
  section TEXT,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank', 'scenario')),
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 3),
  tags TEXT[] DEFAULT '{}',
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User progress
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answered_correctly BOOLEAN NOT NULL,
  answer_given TEXT,
  time_taken_seconds INTEGER,
  session_mode TEXT NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz sessions
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL,
  chapter_filter INTEGER,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score_percent NUMERIC(5,2),
  duration_seconds INTEGER,
  started_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ
);

-- AI explanations cache
CREATE TABLE IF NOT EXISTS ai_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Custom profiles
CREATE TABLE IF NOT EXISTS user_custom_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_name TEXT NOT NULL DEFAULT 'Mein Profil',
  preset_profile TEXT,
  focus_chapters INTEGER[] NOT NULL,
  focus_weight INTEGER NOT NULL DEFAULT 60 CHECK (focus_weight BETWEEN 50 AND 80),
  excluded_chapters INTEGER[] DEFAULT '{}',
  difficulty_filter TEXT DEFAULT 'mixed' CHECK (difficulty_filter IN ('easy', 'medium', 'hard', 'mixed')),
  question_count INTEGER DEFAULT 20,
  time_limit_minutes INTEGER,
  extra_tags TEXT[] DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are public" ON questions FOR SELECT USING (true);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own sessions" ON quiz_sessions FOR ALL USING (auth.uid() = user_id);

ALTER TABLE ai_explanations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI explanations are public" ON ai_explanations FOR SELECT USING (true);
CREATE POLICY "Insert AI explanations" ON ai_explanations FOR INSERT WITH CHECK (true);

ALTER TABLE user_custom_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profiles" ON user_custom_profiles FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_questions_chapter ON questions(chapter_number);
CREATE INDEX idx_questions_type ON questions(question_type);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_question ON user_progress(question_id);
CREATE INDEX idx_sessions_user ON quiz_sessions(user_id);
CREATE INDEX idx_profiles_user ON user_custom_profiles(user_id);
