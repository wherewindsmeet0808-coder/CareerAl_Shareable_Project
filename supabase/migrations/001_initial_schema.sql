-- ==========================================================
-- AI CAREER GUIDANCE DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  education_level TEXT,
  degree TEXT,
  specialization TEXT,
  graduation_year INTEGER,
  skills JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  experience_level TEXT DEFAULT 'Student / Fresher',
  preferred_role TEXT,
  preferred_location TEXT,
  preferred_work_mode TEXT DEFAULT 'remote' CHECK (preferred_work_mode IN ('onsite', 'hybrid', 'remote')),
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'ta')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CURATED CAREER ROLES
CREATE TABLE IF NOT EXISTS public.career_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  required_technical_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  required_soft_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  suitable_degrees JSONB NOT NULL DEFAULT '[]'::jsonb,
  beginner_projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  market_demand TEXT DEFAULT 'High',
  avg_salary_range TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LEARNING RESOURCES
CREATE TABLE IF NOT EXISTS public.learning_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  skill TEXT NOT NULL,
  provider TEXT NOT NULL,
  url TEXT NOT NULL,
  is_free BOOLEAN DEFAULT TRUE,
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CAREER ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.career_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  education TEXT NOT NULL,
  technical_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  soft_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  interests JSONB NOT NULL DEFAULT '[]'::jsonb,
  experience_level TEXT NOT NULL,
  projects_and_certifications TEXT,
  preferred_work_mode TEXT,
  career_goals TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CAREER RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS public.career_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES public.career_assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.career_roles(id) ON DELETE SET NULL,
  role_title TEXT NOT NULL,
  match_percentage INTEGER NOT NULL CHECK (match_percentage >= 0 AND match_percentage <= 100),
  matching_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  suitability_reason TEXT NOT NULL,
  suggested_resources JSONB DEFAULT '[]'::jsonb,
  beginner_projects JSONB DEFAULT '[]'::jsonb,
  job_search_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SKILL PROGRESS
CREATE TABLE IF NOT EXISTS public.skill_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  category TEXT DEFAULT 'technical' CHECK (category IN ('technical', 'soft')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  estimated_duration TEXT,
  learning_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_role_skill_unique UNIQUE (user_id, target_role, skill_name)
);

-- 7. LEARNING ROADMAPS & ROADMAP PROGRESS
CREATE TABLE IF NOT EXISTS public.learning_roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  phases JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_target_role_unique UNIQUE (user_id, target_role)
);

CREATE TABLE IF NOT EXISTS public.roadmap_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID NOT NULL REFERENCES public.learning_roadmaps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  phase_index INTEGER NOT NULL,
  item_key TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_roadmap_item_unique UNIQUE (user_id, roadmap_id, item_key)
);

-- 8. RESUME ANALYSES
CREATE TABLE IF NOT EXISTS public.resume_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  target_role TEXT,
  ats_score INTEGER NOT NULL CHECK (ats_score >= 0 AND ats_score <= 100),
  summary TEXT NOT NULL,
  detected_skills JSONB DEFAULT '[]'::jsonb,
  education_experience_summary TEXT,
  project_highlights JSONB DEFAULT '[]'::jsonb,
  keywords_found JSONB DEFAULT '[]'::jsonb,
  keywords_missing JSONB DEFAULT '[]'::jsonb,
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  actionable_improvements JSONB DEFAULT '[]'::jsonb,
  ats_feedback JSONB DEFAULT '{}'::jsonb,
  suggested_roles JSONB DEFAULT '[]'::jsonb,
  improved_outline JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CHAT SESSIONS & CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Career Advisory Conversation',
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ta')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MOCK INTERVIEW SESSIONS & ANSWERS
CREATE TABLE IF NOT EXISTS public.mock_interview_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'hr', 'behavioral', 'role-specific')),
  questions JSONB NOT NULL,
  overall_score NUMERIC(3,1),
  overall_feedback TEXT,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interview_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.mock_interview_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  score NUMERIC(3,1) NOT NULL,
  strengths TEXT,
  improvements TEXT,
  model_answer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SAVED JOBS & JOB APPLICATION TRACKING
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  work_mode TEXT,
  apply_url TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'bookmarked' CHECK (status IN ('bookmarked', 'applied', 'interviewing', 'offered', 'rejected')),
  notes TEXT,
  applied_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_job_unique UNIQUE (user_id, job_id)
);

-- 12. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_assessments_user ON public.career_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON public.career_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_progress_user ON public.skill_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user ON public.learning_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user ON public.resume_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user ON public.mock_interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON public.saved_jobs(user_id);
