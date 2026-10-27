import React, { useState, useEffect } from 'react';
import {
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Save,
  ArrowRight,
  TrendingUp,
  Sliders,
  Sparkles,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '../api/client';
import { ScoreRing } from '../components/ScoreRing';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const SkillGapPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const { t } = useLanguage();

  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(user?.preferred_role || 'Software Developer');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'technical' | 'soft'>('technical');

  const [analysisData, setAnalysisData] = useState<any>(null);
  const [updatingSkill, setUpdatingSkill] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string>('');

  const fetchAnalysis = async (role: string) => {
    setLoading(true);
    const res = await apiRequest(`/skill-gap/analysis?role=${encodeURIComponent(role)}`);
    setLoading(false);

    if (res.success) {
      setAnalysisData(res);
      if (res.available_roles) {
        setAvailableRoles(res.available_roles);
      }
    }
  };

  useEffect(() => {
    fetchAnalysis(selectedRole);
  }, [selectedRole]);

  const handleStatusChange = async (
    skillName: string,
    newStatus: 'not_started' | 'in_progress' | 'completed',
    category: 'technical' | 'soft'
  ) => {
    setUpdatingSkill(skillName);
    const progressPercent = newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? 50 : 0;

    const res = await apiRequest('/skill-gap/progress', {
      method: 'POST',
      body: {
        target_role: selectedRole,
        skill_name: skillName,
        category,
        status: newStatus,
        progress_percent: progressPercent
      }
    });

    setUpdatingSkill(null);

    if (res.success) {
      setSuccessBanner(`Saved progress for "${skillName}"!`);
      setTimeout(() => setSuccessBanner(''), 3000);
      // Refresh local analysis and profile
      fetchAnalysis(selectedRole);
      refreshProfile();
    }
  };

  const handleSliderChange = async (
    skillName: string,
    progressPercent: number,
    category: 'technical' | 'soft'
  ) => {
    const newStatus = progressPercent === 100 ? 'completed' : progressPercent > 0 ? 'in_progress' : 'not_started';

    await apiRequest('/skill-gap/progress', {
      method: 'POST',
      body: {
        target_role: selectedRole,
        skill_name: skillName,
        category,
        status: newStatus,
        progress_percent: progressPercent
      }
    });

    fetchAnalysis(selectedRole);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Target Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-card p-6 sm:p-8 rounded-3xl border border-navy-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Real-Time Skill Gap Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t.skillGap.title}</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            {t.skillGap.subtitle}
          </p>
        </div>

        {/* Target Role Selector */}
        <div className="w-full md:w-72">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            {t.skillGap.selectRole}
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-3 bg-navy-950/90 border border-navy-700 rounded-xl text-white text-sm font-semibold focus:outline-none focus:border-brand-500"
          >
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton count={3} height="h-44" />
      ) : analysisData ? (
        <div className="space-y-8">
          {/* Readiness Dashboard Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-card p-6 rounded-2xl border border-navy-800 flex items-center justify-between sm:col-span-1">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Match Score</span>
                <span className="text-3xl font-black text-white mt-1 block">
                  {analysisData.match_score}%
                </span>
                <span className="text-[11px] text-emerald-400 mt-1 block">Dynamic Calculation</span>
              </div>
              <ScoreRing score={analysisData.match_score} size={65} strokeWidth={6} label="" />
            </div>

            <div className="glass-card p-6 rounded-2xl border border-navy-800 text-center sm:col-span-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Mastered</span>
              <span className="text-3xl font-black text-emerald-400 mt-1 block">
                {analysisData.overview?.completed_count}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Skills Verified</span>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-navy-800 text-center sm:col-span-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">In Progress</span>
              <span className="text-3xl font-black text-brand-400 mt-1 block">
                {analysisData.overview?.in_progress_count}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Active Learning</span>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-navy-800 text-center sm:col-span-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">To Master</span>
              <span className="text-3xl font-black text-amber-400 mt-1 block">
                {analysisData.overview?.missing_count}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Remaining Gaps</span>
            </div>
          </div>

          {/* Visual Skill Comparison Chart (Current Level vs Role Benchmark) */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-navy-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Benchmark Comparison Chart</span>
                </div>
                <h2 className="text-lg font-bold text-white">Your Proficiency vs Industry Target Benchmark</h2>
                <p className="text-xs text-slate-400">
                  Visual comparison showing your current assessed mastery against the target proficiency expected for {selectedRole}.
                </p>
              </div>

              <div className="flex items-center space-x-4 text-xs shrink-0">
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-sm bg-brand-500"></div>
                  <span className="text-slate-300">Your Current Level</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-sm bg-indigo-400/40 border border-indigo-400"></div>
                  <span className="text-slate-300">Target Benchmark</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {analysisData.technical_skills?.slice(0, 6).map((skill: any) => {
                const targetPercent = skill.priority === 'high' ? 90 : skill.priority === 'medium' ? 75 : 60;
                const userPercent = skill.progress_percent || (skill.status === 'completed' ? 100 : skill.status === 'in_progress' ? 50 : 0);
                const gap = Math.max(0, targetPercent - userPercent);

                return (
                  <div key={skill.skill_name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{skill.skill_name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">Current: <span className="font-bold text-brand-300">{userPercent}%</span></span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-400">Target: <span className="font-bold text-indigo-300">{targetPercent}%</span></span>
                        {gap === 0 ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 ml-2">Met Target</span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 ml-2">-{gap}% Gap</span>
                        )}
                      </div>
                    </div>

                    {/* Dual Comparative Progress Bar */}
                    <div className="relative w-full h-3 bg-navy-950 rounded-full overflow-hidden border border-navy-800">
                      {/* Target Benchmark Range Indicator */}
                      <div
                        className="absolute top-0 bottom-0 bg-indigo-500/20 border-r-2 border-indigo-400"
                        style={{ width: `${targetPercent}%` }}
                      ></div>
                      {/* User's Current Level */}
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          userPercent >= targetPercent
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-gradient-to-r from-brand-600 to-indigo-500'
                        }`}
                        style={{ width: `${userPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabs: Technical vs Soft Skills */}
          <div className="flex space-x-2 border-b border-navy-800 pb-2">
            <button
              onClick={() => setActiveTab('technical')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'technical'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              Technical Skills ({analysisData.technical_skills?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('soft')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'soft'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              Soft Skills ({analysisData.soft_skills?.length || 0})
            </button>
          </div>

          {/* Skills Cards List */}
          <div className="space-y-4">
            {(activeTab === 'technical' ? analysisData.technical_skills : analysisData.soft_skills).map(
              (skill: any, idx: number) => {
                const isCompleted = skill.status === 'completed' || skill.progress_percent === 100;
                const isInProgress = skill.status === 'in_progress';

                return (
                  <div
                    key={skill.skill_name || idx}
                    className="glass-card p-5 sm:p-6 rounded-2xl border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 max-w-lg">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            skill.priority === 'high'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : skill.priority === 'medium'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {skill.priority} priority
                        </span>
                        <span className="text-xs text-slate-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{skill.estimated_duration}</span>
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                        <span>{skill.skill_name}</span>
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />}
                      </h3>

                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-slate-400">Curated Link:</span>
                        <a
                          href={skill.learning_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center space-x-1"
                        >
                          <span>{skill.provider || 'Tutorial Guide'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Progress Control & Status Toggles */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                      {/* Slider */}
                      <div className="w-full sm:w-36 space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Mastery:</span>
                          <span className="font-bold text-white">{skill.progress_percent}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="10"
                          value={skill.progress_percent}
                          onChange={(e) =>
                            handleSliderChange(skill.skill_name, Number(e.target.value), skill.category)
                          }
                          className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-brand-500"
                        />
                      </div>

                      {/* Status Toggle Buttons */}
                      <div className="flex rounded-xl bg-navy-950 p-1 border border-navy-800 text-xs">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(skill.skill_name, 'not_started', skill.category)}
                          className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                            skill.status === 'not_started'
                              ? 'bg-navy-800 text-slate-200 font-bold'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          Not Started
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(skill.skill_name, 'in_progress', skill.category)}
                          className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                            isInProgress
                              ? 'bg-brand-600 text-white font-bold'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(skill.skill_name, 'completed', skill.category)}
                          className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                            isCompleted
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          Completed
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <p className="text-xs text-slate-500 italic text-center">
            {t.skillGap.disclaimer}
          </p>
        </div>
      ) : null}
    </div>
  );
};
