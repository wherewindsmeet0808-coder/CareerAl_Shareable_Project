import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { supabaseClient, supabaseAdminClient } from './supabase.js';
import { CURATED_ROLES, CURATED_RESOURCES } from '../data/curatedCareers.js';
import { seedDemoAccounts } from './seedDemoData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const LOCAL_DB_FILE = path.join(DATA_DIR, 'app_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default database structure
const DEFAULT_STORE = {
  profiles: [],
  career_roles: [...CURATED_ROLES],
  learning_resources: [...CURATED_RESOURCES.map((r, idx) => ({ id: `res-${idx + 1}`, ...r }))],
  career_assessments: [],
  career_recommendations: [],
  skill_progress: [],
  learning_roadmaps: [],
  roadmap_progress: [],
  resume_analyses: [],
  chat_sessions: [],
  chat_messages: [],
  mock_interview_sessions: [],
  interview_answers: [],
  saved_jobs: [],
  admin_audit_logs: []
};

// In-memory cache + persistent file sync
let localStore = null;

function loadLocalStore() {
  if (localStore) return localStore;
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const data = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
      localStore = JSON.parse(data);
      // Ensure all collections exist
      for (const key of Object.keys(DEFAULT_STORE)) {
        if (!localStore[key]) localStore[key] = DEFAULT_STORE[key];
      }
    } else {
      localStore = JSON.parse(JSON.stringify(DEFAULT_STORE));
    }
    // Seed default demo accounts and data if missing
    seedDemoAccounts(localStore);
    saveLocalStore();
  } catch (err) {
    console.error('Error loading local store, initializing default:', err.message);
    localStore = JSON.parse(JSON.stringify(DEFAULT_STORE));
    seedDemoAccounts(localStore);
    saveLocalStore();
  }
  return localStore;
}

function saveLocalStore() {
  try {
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(localStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local store:', err.message);
  }
}

// Check if Supabase is active
export const isSupabaseConfigured = () => Boolean(supabaseClient);

export const db = {
  // Mode flag for UI/API status inspection
  getMode() {
    return isSupabaseConfigured() ? 'supabase' : 'local-persistent';
  },

  // --------------------------------------------------------------------------
  // PROFILES
  // --------------------------------------------------------------------------
  async getProfileById(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) return data;
    }
    const store = loadLocalStore();
    return store.profiles.find((p) => p.id === userId) || null;
  },

  async getProfileByEmail(email) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();
      if (!error && data) return data;
    }
    const store = loadLocalStore();
    return store.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async createProfile(profileData) {
    const newProfile = {
      id: profileData.id || uuidv4(),
      email: profileData.email.toLowerCase(),
      full_name: profileData.full_name || 'Student',
      role: profileData.role || 'student',
      education_level: profileData.education_level || 'Undergraduate',
      degree: profileData.degree || 'B.Tech / B.E. in Computer Science',
      specialization: profileData.specialization || '',
      graduation_year: profileData.graduation_year || 2026,
      skills: profileData.skills || [],
      interests: profileData.interests || [],
      experience_level: profileData.experience_level || 'Student / Fresher',
      preferred_role: profileData.preferred_role || 'Software Developer',
      preferred_location: profileData.preferred_location || 'Anywhere / Remote',
      preferred_work_mode: profileData.preferred_work_mode || 'remote',
      preferred_language: profileData.preferred_language || 'en',
      password_hash: profileData.password_hash || null, // Stored locally only if not using Supabase Auth
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabaseClient.from('profiles').insert([newProfile]);
        if (!error) return newProfile;
      } catch (e) {
        console.warn('Supabase profile insert fallback:', e.message);
      }
    }

    const store = loadLocalStore();
    store.profiles.push(newProfile);
    saveLocalStore();
    return newProfile;
  },

  async updateProfile(userId, updates) {
    updates.updated_at = new Date().toISOString();
    // Prevent unprivileged elevation to admin
    if (updates.role && updates.role !== 'admin') {
      delete updates.role;
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseClient
          .from('profiles')
          .update(updates)
          .eq('id', userId)
          .select()
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase profile update fallback:', e.message);
      }
    }

    const store = loadLocalStore();
    const idx = store.profiles.findIndex((p) => p.id === userId);
    if (idx !== -1) {
      store.profiles[idx] = { ...store.profiles[idx], ...updates };
      saveLocalStore();
      return store.profiles[idx];
    }
    return null;
  },

  async deleteAccount(userId) {
    if (isSupabaseConfigured()) {
      try {
        await supabaseClient.from('profiles').delete().eq('id', userId);
      } catch (e) {
        console.warn('Supabase profile deletion fallback:', e.message);
      }
    }
    const store = loadLocalStore();
    store.profiles = store.profiles.filter((p) => p.id !== userId);
    store.career_assessments = store.career_assessments.filter((a) => a.user_id !== userId);
    store.career_recommendations = store.career_recommendations.filter((r) => r.user_id !== userId);
    store.skill_progress = store.skill_progress.filter((s) => s.user_id !== userId);
    store.learning_roadmaps = store.learning_roadmaps.filter((l) => l.user_id !== userId);
    store.roadmap_progress = store.roadmap_progress.filter((rp) => rp.user_id !== userId);
    store.resume_analyses = store.resume_analyses.filter((ra) => ra.user_id !== userId);
    store.chat_sessions = store.chat_sessions.filter((cs) => cs.user_id !== userId);
    store.mock_interview_sessions = store.mock_interview_sessions.filter((m) => m.user_id !== userId);
    store.saved_jobs = store.saved_jobs.filter((j) => j.user_id !== userId);
    saveLocalStore();
    return true;
  },

  // --------------------------------------------------------------------------
  // CAREER ASSESSMENTS & RECOMMENDATIONS
  // --------------------------------------------------------------------------
  async createAssessment(assessmentData) {
    const record = {
      id: uuidv4(),
      user_id: assessmentData.user_id,
      education: assessmentData.education,
      technical_skills: assessmentData.technical_skills || [],
      soft_skills: assessmentData.soft_skills || [],
      interests: assessmentData.interests || [],
      experience_level: assessmentData.experience_level,
      projects_and_certifications: assessmentData.projects_and_certifications || '',
      preferred_work_mode: assessmentData.preferred_work_mode || 'remote',
      career_goals: assessmentData.career_goals || '',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseClient.from('career_assessments').insert([record]).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase assessment insert fallback:', e.message);
      }
    }

    const store = loadLocalStore();
    store.career_assessments.push(record);
    saveLocalStore();
    return record;
  },

  async getLatestAssessment(userId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseClient
          .from('career_assessments')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (!error && data) return data;
      } catch (e) {}
    }
    const store = loadLocalStore();
    const userAssessments = store.career_assessments
      .filter((a) => a.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return userAssessments[0] || null;
  },

  async saveRecommendations(assessmentId, userId, recommendations) {
    const formatted = recommendations.map((r) => ({
      id: uuidv4(),
      assessment_id: assessmentId,
      user_id: userId,
      role_id: r.role_id || null,
      role_title: r.role_title,
      match_percentage: r.match_percentage,
      matching_skills: r.matching_skills || [],
      missing_skills: r.missing_skills || [],
      suitability_reason: r.suitability_reason || '',
      suggested_resources: r.suggested_resources || [],
      beginner_projects: r.beginner_projects || [],
      job_search_links: r.job_search_links || {},
      created_at: new Date().toISOString()
    }));

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseClient.from('career_recommendations').insert(formatted).select();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase save recommendations fallback:', e.message);
      }
    }

    const store = loadLocalStore();
    store.career_recommendations.push(...formatted);
    saveLocalStore();
    return formatted;
  },

  async getRecommendationsByUserId(userId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseClient
          .from('career_recommendations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {}
    }
    const store = loadLocalStore();
    return store.career_recommendations
      .filter((r) => r.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // --------------------------------------------------------------------------
  // SKILL PROGRESS
  // --------------------------------------------------------------------------
  async getSkillProgress(userId, targetRole) {
    if (isSupabaseConfigured()) {
      try {
        let query = supabaseClient.from('skill_progress').select('*').eq('user_id', userId);
        if (targetRole) query = query.eq('target_role', targetRole);
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (e) {}
    }
    const store = loadLocalStore();
    return store.skill_progress.filter((s) => s.user_id === userId && (!targetRole || s.target_role === targetRole));
  },

  async upsertSkillProgress(userId, targetRole, skillData) {
    const updatedRecord = {
      user_id: userId,
      target_role: targetRole,
      skill_name: skillData.skill_name,
      category: skillData.category || 'technical',
      priority: skillData.priority || 'medium',
      status: skillData.status || 'not_started',
      progress_percent: skillData.progress_percent || 0,
      estimated_duration: skillData.estimated_duration || '2-3 weeks',
      learning_url: skillData.learning_url || '',
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseClient
          .from('skill_progress')
          .upsert(updatedRecord, { onConflict: 'user_id, target_role, skill_name' })
          .select()
          .single();
        if (!error && data) return data;
      } catch (e) {}
    }

    const store = loadLocalStore();
    const idx = store.skill_progress.findIndex(
      (s) => s.user_id === userId && s.target_role === targetRole && s.skill_name.toLowerCase() === skillData.skill_name.toLowerCase()
    );

    if (idx !== -1) {
      store.skill_progress[idx] = { ...store.skill_progress[idx], ...updatedRecord };
    } else {
      updatedRecord.id = uuidv4();
      store.skill_progress.push(updatedRecord);
    }
    saveLocalStore();
    return updatedRecord;
  },

  // --------------------------------------------------------------------------
  // LEARNING ROADMAPS & PROGRESS
  // --------------------------------------------------------------------------
  async getLearningRoadmap(userId, targetRole) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseClient
          .from('learning_roadmaps')
          .select('*')
          .eq('user_id', userId)
          .eq('target_role', targetRole)
          .single();
        if (!error && data) return data;
      } catch (e) {}
    }
    const store = loadLocalStore();
    return store.learning_roadmaps.find((r) => r.user_id === userId && r.target_role === targetRole) || null;
  },

  async saveLearningRoadmap(userId, targetRole, phases) {
    const record = {
      id: uuidv4(),
      user_id: userId,
      target_role: targetRole,
      phases,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseClient
          .from('learning_roadmaps')
          .upsert(record, { onConflict: 'user_id, target_role' })
          .select()
          .single();
        if (!error && data) return data;
      } catch (e) {}
    }

    const store = loadLocalStore();
    const idx = store.learning_roadmaps.findIndex((r) => r.user_id === userId && r.target_role === targetRole);
    if (idx !== -1) {
      store.learning_roadmaps[idx] = { ...store.learning_roadmaps[idx], phases, updated_at: new Date().toISOString() };
    } else {
      store.learning_roadmaps.push(record);
    }
    saveLocalStore();
    return record;
  },

  async updateRoadmapItemStatus(userId, roadmapId, phaseIndex, itemKey, completed) {
    const progressRecord = {
      roadmap_id: roadmapId,
      user_id: userId,
      phase_index: phaseIndex,
      item_key: itemKey,
      completed,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        await supabaseClient.from('roadmap_progress').upsert(progressRecord, { onConflict: 'user_id, roadmap_id, item_key' });
      } catch (e) {}
    }

    const store = loadLocalStore();
    const idx = store.roadmap_progress.findIndex(
      (p) => p.user_id === userId && p.roadmap_id === roadmapId && p.item_key === itemKey
    );
    if (idx !== -1) {
      store.roadmap_progress[idx].completed = completed;
      store.roadmap_progress[idx].updated_at = new Date().toISOString();
    } else {
      progressRecord.id = uuidv4();
      store.roadmap_progress.push(progressRecord);
    }
    saveLocalStore();
    return progressRecord;
  },

  async getRoadmapProgress(userId, roadmapId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseClient
          .from('roadmap_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('roadmap_id', roadmapId);
        if (!error && data) return data;
      } catch (e) {}
    }
    const store = loadLocalStore();
    return store.roadmap_progress.filter((p) => p.user_id === userId && p.roadmap_id === roadmapId);
  },

  // --------------------------------------------------------------------------
  // RESUME ANALYSES
  // --------------------------------------------------------------------------
  async saveResumeAnalysis(analysisData) {
    const record = {
      id: uuidv4(),
      user_id: analysisData.user_id,
      file_name: analysisData.file_name,
      target_role: analysisData.target_role || 'General Tech',
      ats_score: analysisData.ats_score,
      summary: analysisData.summary,
      detected_skills: analysisData.detected_skills || [],
      education_experience_summary: analysisData.education_experience_summary || '',
      project_highlights: analysisData.project_highlights || [],
      keywords_found: analysisData.keywords_found || [],
      keywords_missing: analysisData.keywords_missing || [],
      strengths: analysisData.strengths || [],
      weaknesses: analysisData.weaknesses || [],
      actionable_improvements: analysisData.actionable_improvements || [],
      ats_feedback: analysisData.ats_feedback || {},
      suggested_roles: analysisData.suggested_roles || [],
      improved_outline: analysisData.improved_outline || {},
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseClient.from('resume_analyses').insert([record]).select().single();
        if (!error && data) return data;
      } catch (e) {}
    }

    const store = loadLocalStore();
    store.resume_analyses.push(record);
    saveLocalStore();
    return record;
  },

  async getResumeAnalyses(userId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseClient
          .from('resume_analyses')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {}
    }
    const store = loadLocalStore();
    return store.resume_analyses
      .filter((r) => r.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async deleteResumeAnalysis(userId, analysisId) {
    if (isSupabaseConfigured()) {
      try {
        await supabaseClient.from('resume_analyses').delete().eq('id', analysisId).eq('user_id', userId);
      } catch (e) {}
    }
    const store = loadLocalStore();
    store.resume_analyses = store.resume_analyses.filter((r) => !(r.id === analysisId && r.user_id === userId));
    saveLocalStore();
    return true;
  },

  // --------------------------------------------------------------------------
  // CHAT SESSIONS & MESSAGES
  // --------------------------------------------------------------------------
  async getOrCreateChatSession(userId, language = 'en') {
    const store = loadLocalStore();
    let session = store.chat_sessions.find((s) => s.user_id === userId && s.language === language);
    if (!session) {
      session = {
        id: uuidv4(),
        user_id: userId,
        title: 'Career Advisory Conversation',
        language,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      store.chat_sessions.push(session);
      saveLocalStore();
    }
    return session;
  },

  async getChatMessages(sessionId, userId) {
    const store = loadLocalStore();
    return store.chat_messages
      .filter((m) => m.session_id === sessionId && m.user_id === userId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },

  async addChatMessage(sessionId, userId, role, content) {
    const message = {
      id: uuidv4(),
      session_id: sessionId,
      user_id: userId,
      role,
      content,
      created_at: new Date().toISOString()
    };
    const store = loadLocalStore();
    store.chat_messages.push(message);
    saveLocalStore();
    return message;
  },

  async clearChatMessages(sessionId, userId) {
    const store = loadLocalStore();
    store.chat_messages = store.chat_messages.filter((m) => !(m.session_id === sessionId && m.user_id === userId));
    saveLocalStore();
    return true;
  },

  // --------------------------------------------------------------------------
  // MOCK INTERVIEW SESSIONS & ANSWERS
  // --------------------------------------------------------------------------
  async createInterviewSession(data) {
    const session = {
      id: uuidv4(),
      user_id: data.user_id,
      target_role: data.target_role,
      experience_level: data.experience_level,
      category: data.category,
      questions: data.questions,
      overall_score: 0,
      overall_feedback: '',
      status: 'in_progress',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const store = loadLocalStore();
    store.mock_interview_sessions.push(session);
    saveLocalStore();
    return session;
  },

  async getInterviewSession(sessionId, userId) {
    const store = loadLocalStore();
    return store.mock_interview_sessions.find((s) => s.id === sessionId && s.user_id === userId) || null;
  },

  async saveInterviewAnswer(answerData) {
    const answer = {
      id: uuidv4(),
      session_id: answerData.session_id,
      user_id: answerData.user_id,
      question_index: answerData.question_index,
      question_text: answerData.question_text,
      answer_text: answerData.answer_text,
      score: answerData.score,
      strengths: answerData.strengths,
      improvements: answerData.improvements,
      model_answer: answerData.model_answer,
      created_at: new Date().toISOString()
    };
    const store = loadLocalStore();
    store.interview_answers.push(answer);

    // Update overall session score if completed
    const sessionAnswers = store.interview_answers.filter((a) => a.session_id === answerData.session_id);
    const session = store.mock_interview_sessions.find((s) => s.id === answerData.session_id);
    if (session) {
      const avg = sessionAnswers.reduce((acc, cur) => acc + Number(cur.score), 0) / sessionAnswers.length;
      session.overall_score = Number(avg.toFixed(1));
      if (sessionAnswers.length >= (session.questions?.length || 5)) {
        session.status = 'completed';
      }
      session.updated_at = new Date().toISOString();
    }
    saveLocalStore();
    return answer;
  },

  async getInterviewHistory(userId) {
    const store = loadLocalStore();
    return store.mock_interview_sessions
      .filter((s) => s.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // --------------------------------------------------------------------------
  // SAVED JOBS & JOB APPLICATION TRACKER
  // --------------------------------------------------------------------------
  async getSavedJobs(userId) {
    const store = loadLocalStore();
    return store.saved_jobs
      .filter((j) => j.user_id === userId)
      .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
  },

  async saveOrUpdateJob(userId, jobData) {
    const store = loadLocalStore();
    const existingIdx = store.saved_jobs.findIndex((j) => j.user_id === userId && j.job_id === jobData.job_id);

    const record = {
      id: existingIdx !== -1 ? store.saved_jobs[existingIdx].id : uuidv4(),
      user_id: userId,
      job_id: jobData.job_id,
      title: jobData.title,
      company: jobData.company,
      location: jobData.location || 'Remote',
      work_mode: jobData.work_mode || 'Remote',
      apply_url: jobData.apply_url,
      skills: jobData.skills || [],
      status: jobData.status || (existingIdx !== -1 ? store.saved_jobs[existingIdx].status : 'bookmarked'),
      notes: jobData.notes || (existingIdx !== -1 ? store.saved_jobs[existingIdx].notes : ''),
      applied_date: jobData.applied_date || (existingIdx !== -1 ? store.saved_jobs[existingIdx].applied_date : null),
      created_at: existingIdx !== -1 ? store.saved_jobs[existingIdx].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (existingIdx !== -1) {
      store.saved_jobs[existingIdx] = record;
    } else {
      store.saved_jobs.push(record);
    }
    saveLocalStore();
    return record;
  },

  async deleteSavedJob(userId, jobId) {
    const store = loadLocalStore();
    store.saved_jobs = store.saved_jobs.filter((j) => !(j.user_id === userId && (j.id === jobId || j.job_id === jobId)));
    saveLocalStore();
    return true;
  },

  // --------------------------------------------------------------------------
  // CURATED CAREER ROLES & RESOURCES (Admin & Public read)
  // --------------------------------------------------------------------------
  async getCuratedRoles() {
    const store = loadLocalStore();
    return store.career_roles;
  },

  async upsertCuratedRole(roleData) {
    const store = loadLocalStore();
    const idx = store.career_roles.findIndex((r) => r.title.toLowerCase() === roleData.title.toLowerCase());
    if (idx !== -1) {
      store.career_roles[idx] = { ...store.career_roles[idx], ...roleData };
      saveLocalStore();
      return store.career_roles[idx];
    }
    const newRole = { id: uuidv4(), ...roleData, created_at: new Date().toISOString() };
    store.career_roles.push(newRole);
    saveLocalStore();
    return newRole;
  },

  async deleteCuratedRole(roleId) {
    const store = loadLocalStore();
    store.career_roles = store.career_roles.filter((r) => r.id !== roleId);
    saveLocalStore();
    return true;
  },

  async getLearningResources(skill) {
    const store = loadLocalStore();
    if (!skill) return store.learning_resources;
    return store.learning_resources.filter((r) => r.skill.toLowerCase().includes(skill.toLowerCase()));
  },

  async upsertLearningResource(resData) {
    const store = loadLocalStore();
    const newRes = { id: resData.id || uuidv4(), ...resData, created_at: new Date().toISOString() };
    store.learning_resources.push(newRes);
    saveLocalStore();
    return newRes;
  },

  // --------------------------------------------------------------------------
  // ADMIN AGGREGATE METRICS & AUDIT LOGS
  // --------------------------------------------------------------------------
  async getAdminStats() {
    const store = loadLocalStore();
    const totalUsers = store.profiles.length;
    const totalStudents = store.profiles.filter((p) => p.role === 'student').length;
    const totalAssessments = store.career_assessments.length;
    const totalResumes = store.resume_analyses.length;
    const totalInterviews = store.mock_interview_sessions.length;
    const totalSavedJobs = store.saved_jobs.length;
    const totalApplications = store.saved_jobs.filter((j) => j.status === 'applied').length;
    const totalRoles = store.career_roles.length;
    const totalResources = store.learning_resources.length;

    // Feature usage summary
    const featureUsage = {
      assessmentsTaken: totalAssessments,
      resumesAnalyzed: totalResumes,
      interviewsCompleted: store.mock_interview_sessions.filter((i) => i.status === 'completed').length,
      jobsTracked: totalSavedJobs,
      chatMessagesCount: store.chat_messages.length
    };

    return {
      totalUsers,
      totalStudents,
      totalAssessments,
      totalResumes,
      totalInterviews,
      totalSavedJobs,
      totalApplications,
      totalRoles,
      totalResources,
      featureUsage
    };
  },

  async logAdminAction(adminId, action, targetType, details = {}) {
    const log = {
      id: uuidv4(),
      admin_id: adminId,
      action,
      target_type: targetType,
      details,
      created_at: new Date().toISOString()
    };
    const store = loadLocalStore();
    store.admin_audit_logs.push(log);
    saveLocalStore();
    return log;
  },

  async getAdminAuditLogs(limit = 50) {
    const store = loadLocalStore();
    return store.admin_audit_logs
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  }
};
