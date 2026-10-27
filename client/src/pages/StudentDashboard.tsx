import React, { useState, useEffect } from 'react';
import {
  Compass,
  Target,
  Map,
  FileText,
  Video,
  Briefcase,
  Bot,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '../api/client';
import { ScoreRing } from '../components/ScoreRing';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [skillOverview, setSkillOverview] = useState<any>(null);
  const [roadmapStats, setRoadmapStats] = useState<any>(null);
  const [recentResume, setRecentResume] = useState<any>(null);
  const [recentInterview, setRecentInterview] = useState<any>(null);
  const [savedJobsCount, setSavedJobsCount] = useState<number>(0);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);

      // 1. Fetch Latest Recommendations
      const recsRes = await apiRequest('/assessments/latest');
      if (recsRes.success && recsRes.recommendations) {
        setRecommendations(recsRes.recommendations.slice(0, 3));
      }

      // 2. Fetch Skill Gap Summary for user's target role
      const targetRole = user?.preferred_role || 'Software Developer';
      const skillRes = await apiRequest(`/skill-gap/analysis?role=${encodeURIComponent(targetRole)}`);
      if (skillRes.success && skillRes.overview) {
        setSkillOverview({
          ...skillRes.overview,
          targetRole: skillRes.target_role,
          matchScore: skillRes.match_score
        });
      }

      // 3. Fetch Roadmap Progress
      const roadmapRes = await apiRequest(`/roadmaps?role=${encodeURIComponent(targetRole)}`);
      if (roadmapRes.success && roadmapRes.stats) {
        setRoadmapStats(roadmapRes.stats);
      }

      // 4. Fetch Recent Resume Analysis
      const resumeRes = await apiRequest('/resume/history');
      if (resumeRes.success && resumeRes.history?.length > 0) {
        setRecentResume(resumeRes.history[0]);
      }

      // 5. Fetch Recent Mock Interview
      const interviewRes = await apiRequest('/interviews/history');
      if (interviewRes.success && interviewRes.history?.length > 0) {
        setRecentInterview(interviewRes.history[0]);
      }

      // 6. Fetch Saved Jobs Count
      const jobsRes = await apiRequest('/jobs/saved');
      if (jobsRes.success && Array.isArray(jobsRes.saved)) {
        setSavedJobsCount(jobsRes.saved.length);
      }

      setLoading(false);
    }

    loadDashboardData();
  }, [user]);

  // Compute profile completion percentage based on filled profile fields
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let score = 30; // base account
    if (user.degree) score += 15;
    if (user.skills && user.skills.length >= 3) score += 20;
    if (user.interests && user.interests.length >= 1) score += 15;
    if (user.preferred_role) score += 10;
    if (user.preferred_location) score += 10;
    return Math.min(100, score);
  };

  const profilePercent = calculateProfileCompletion();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="h-12 bg-navy-900 rounded-xl w-1/3 animate-pulse"></div>
        <LoadingSkeleton count={3} height="h-44" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Header Greeting & Profile Completion Bar */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-navy-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              {t.dashboard.greeting} {user?.full_name}! 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Target Role: <span className="text-brand-300 font-semibold">{user?.preferred_role || 'Software Developer'}</span> • {user?.degree || 'Undergraduate'}
            </p>
          </div>

          {/* Profile Completion Meter */}
          <div className="w-full md:w-72 bg-navy-950/80 p-4 rounded-2xl border border-navy-800">
            <div className="flex items-center justify-between text-xs mb-2 font-medium">
              <span className="text-slate-300">{t.dashboard.profileCompletion}</span>
              <span className="text-brand-400 font-bold">{profilePercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-navy-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-violet-600 rounded-full transition-all duration-700"
                style={{ width: `${profilePercent}%` }}
              ></div>
            </div>
            {profilePercent < 100 && (
              <button
                onClick={() => onNavigate('profile')}
                className="mt-2.5 text-[11px] text-brand-400 hover:text-brand-300 flex items-center font-semibold"
              >
                <span>Edit Profile to reach 100%</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Skill Readiness */}
        <div
          onClick={() => onNavigate('skill-gap')}
          className="glass-card p-5 rounded-2xl border border-navy-800 glass-card-hover cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role Readiness</span>
            <Target className="w-5 h-5 text-brand-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {skillOverview?.readiness_percentage !== undefined ? `${skillOverview.readiness_percentage}%` : '50%'}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {skillOverview?.completed_count || 0} of {skillOverview?.total_required || 8} skills verified
          </p>
        </div>

        {/* Metric 2: Roadmap Completion */}
        <div
          onClick={() => onNavigate('roadmap')}
          className="glass-card p-5 rounded-2xl border border-navy-800 glass-card-hover cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Roadmap Steps</span>
            <Map className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {roadmapStats?.completionPercentage || 0}%
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {roadmapStats?.completedItems || 0} of {roadmapStats?.totalItems || 18} tasks finished
          </p>
        </div>

        {/* Metric 3: Resume ATS Score */}
        <div
          onClick={() => onNavigate('resume')}
          className="glass-card p-5 rounded-2xl border border-navy-800 glass-card-hover cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ATS Score</span>
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {recentResume?.ats_score ? `${recentResume.ats_score}%` : 'Not Tested'}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {recentResume ? 'Last evaluated recently' : 'Upload resume for ATS audit'}
          </p>
        </div>

        {/* Metric 4: Saved Jobs & Applications */}
        <div
          onClick={() => onNavigate('jobs')}
          className="glass-card p-5 rounded-2xl border border-navy-800 glass-card-hover cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracked Jobs</span>
            <Briefcase className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {savedJobsCount}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active vacancies in tracker
          </p>
        </div>
      </div>

      {/* 3. Top Career Recommendations & Match Scores */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Compass className="w-5 h-5 text-brand-400" />
              <span>{t.dashboard.topRecommendations}</span>
            </h2>
            <p className="text-xs text-slate-400">Dynamic matches based on your verified skills and academic trajectory</p>
          </div>
          <button
            onClick={() => onNavigate('assessment')}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1"
          >
            <span>Retake Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, idx) => (
              <div
                key={rec.id || idx}
                className="glass-card p-6 rounded-2xl border border-navy-800 flex flex-col justify-between glass-card-hover relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-navy-800 text-slate-300 border border-navy-700">
                      {rec.category || 'Engineering'}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-brand-400">{rec.match_percentage}%</span>
                      <span className="block text-[10px] text-slate-400">Match</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{rec.role_title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {rec.suitability_reason || rec.description}
                  </p>

                  {/* Matching skills tags */}
                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-semibold text-slate-300 block">Matching Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(rec.matching_skills || []).slice(0, 3).map((sk: string, i: number) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-navy-800 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('roadmap')}
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1"
                  >
                    <span>View Roadmap</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('jobs')}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Find Jobs
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Compass}
            title="No Career Assessments Yet"
            description="Take our 2-minute career assessment questionnaire to generate dynamic matching scores and custom roadmaps."
            actionText="Start Career Assessment"
            onAction={() => onNavigate('assessment')}
          />
        )}
      </div>

      {/* 4. Two-Column Row: Skill Gap Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Skill Gap Summary Box */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border border-navy-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Target className="w-5 h-5 text-brand-400" />
                <span>Skill Readiness for {user?.preferred_role || 'Software Developer'}</span>
              </h3>
              <p className="text-xs text-slate-400">Track and master the exact skills companies require</p>
            </div>
            <button
              onClick={() => onNavigate('skill-gap')}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300"
            >
              Manage Skills →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800">
              <span className="text-2xl font-bold text-emerald-400">{skillOverview?.completed_count || 0}</span>
              <p className="text-xs text-slate-400 mt-1">Mastered</p>
            </div>
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800">
              <span className="text-2xl font-bold text-brand-400">{skillOverview?.in_progress_count || 0}</span>
              <p className="text-xs text-slate-400 mt-1">In Progress</p>
            </div>
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800">
              <span className="text-2xl font-bold text-amber-400">{skillOverview?.missing_count || 5}</span>
              <p className="text-xs text-slate-400 mt-1">To Learn</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-brand-950/40 border border-brand-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-brand-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-white">Recommended Next Step:</p>
                <p className="text-slate-400">Work through Phase 2 Core Technical modules on your roadmap.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('roadmap')}
              className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shrink-0"
            >
              Resume
            </button>
          </div>
        </div>

        {/* Right: Quick Launch Hub */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-navy-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">{t.dashboard.quickActions}</h3>
            <p className="text-xs text-slate-400 mb-6">Jump directly to your daily practice and guidance modules</p>

            <div className="space-y-3">
              <button
                onClick={() => onNavigate('resume')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-navy-950/80 hover:bg-navy-800 border border-navy-800 text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-brand-300">Resume ATS Analyzer</p>
                    <p className="text-[11px] text-slate-400">Score & optimize your 1-page CV</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('interview')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-navy-950/80 hover:bg-navy-800 border border-navy-800 text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Video className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-brand-300">Mock Interview Practice</p>
                    <p className="text-[11px] text-slate-400">Practice questions with voice input</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('chatbot')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-navy-950/80 hover:bg-navy-800 border border-navy-800 text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Bot className="w-5 h-5 text-brand-400" />
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-brand-300">AI Career Coach</p>
                    <p className="text-[11px] text-slate-400">Bilingual guidance in English & தமிழ்</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('jobs')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-navy-950/80 hover:bg-navy-800 border border-navy-800 text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-brand-300">Live Jobs & Applications</p>
                    <p className="text-[11px] text-slate-400">Explore and track fresher openings</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
