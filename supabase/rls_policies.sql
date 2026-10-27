-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. PROFILES POLICIES
CREATE POLICY "Users can read their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Prevent normal users from altering their role to 'admin'
CREATE POLICY "Users can update their own profile (except role)"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin())
  );

-- 3. CAREER ROLES & LEARNING RESOURCES (Public read, admin write)
CREATE POLICY "Anyone authenticated can view career roles"
  ON public.career_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify career roles"
  ON public.career_roles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Anyone authenticated can view learning resources"
  ON public.learning_resources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify learning resources"
  ON public.learning_resources FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. CAREER ASSESSMENTS & RECOMMENDATIONS
CREATE POLICY "Users own their career assessments"
  ON public.career_assessments FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their career recommendations"
  ON public.career_recommendations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. SKILL PROGRESS
CREATE POLICY "Users own their skill progress"
  ON public.skill_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. LEARNING ROADMAPS & PROGRESS
CREATE POLICY "Users own their roadmaps"
  ON public.learning_roadmaps FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their roadmap progress"
  ON public.roadmap_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. RESUME ANALYSES
CREATE POLICY "Users own their resume analyses"
  ON public.resume_analyses FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 8. CHAT SESSIONS & MESSAGES
CREATE POLICY "Users own their chat sessions"
  ON public.chat_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their chat messages"
  ON public.chat_messages FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 9. MOCK INTERVIEWS
CREATE POLICY "Users own their mock interview sessions"
  ON public.mock_interview_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their interview answers"
  ON public.interview_answers FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 10. SAVED JOBS
CREATE POLICY "Users own their saved jobs"
  ON public.saved_jobs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 11. ADMIN AUDIT LOGS
CREATE POLICY "Only admins can view audit logs"
  ON public.admin_audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Only admins can insert audit logs"
  ON public.admin_audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());
