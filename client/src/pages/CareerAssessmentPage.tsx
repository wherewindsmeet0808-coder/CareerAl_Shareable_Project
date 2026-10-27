import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code,
  Briefcase,
  ExternalLink,
  ChevronDown,
  Info,
  Loader2,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '../api/client';
import { ScoreRing } from '../components/ScoreRing';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const TECH_SKILLS_OPTIONS = [
  'JavaScript (ES6+)', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'C++',
  'Data Structures', 'Algorithms', 'Git', 'REST APIs', 'Docker', 'AWS / Azure / GCP',
  'Tailwind CSS', 'Figma', 'HTML5', 'PostgreSQL', 'MongoDB', 'Machine Learning',
  'Pandas', 'PyTorch', 'Linux CLI', 'Testing (Playwright/Jest)'
];

const SOFT_SKILLS_OPTIONS = [
  'Problem Solving', 'Team Collaboration', 'Debugging Persistence', 'Clear Communication',
  'User Empathy', 'Analytical Thinking', 'Storytelling with Data', 'Critical Thinking',
  'Attention to Detail', 'Stakeholder Management', 'Vigilance & Security Awareness'
];

const INTERESTS_OPTIONS = [
  'Software Engineering', 'Artificial Intelligence & ML', 'Data Analytics',
  'Full Stack Web Development', 'Cloud Infrastructure & DevOps', 'Cybersecurity Defense',
  'Product & UI/UX Design', 'Quality Assurance & Automation'
];

interface CareerAssessmentPageProps {
  onNavigate: (page: string) => void;
}

export const CareerAssessmentPage: React.FC<CareerAssessmentPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [education, setEducation] = useState(user?.degree || 'B.Tech / B.E. in Computer Science');
  const [experienceLevel, setExperienceLevel] = useState(user?.experience_level || 'Student / Fresher');
  const [selectedTechSkills, setSelectedTechSkills] = useState<string[]>(
    user?.skills || ['JavaScript (ES6+)', 'Python', 'Data Structures']
  );
  const [selectedSoftSkills, setSelectedSoftSkills] = useState<string[]>(['Problem Solving', 'Team Collaboration']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests || ['Software Engineering', 'Artificial Intelligence & ML']
  );
  const [projectsCertifications, setProjectsCertifications] = useState('');
  const [workMode, setWorkMode] = useState<'onsite' | 'hybrid' | 'remote'>(user?.preferred_work_mode || 'remote');
  const [careerGoals, setCareerGoals] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activeScoreModal, setActiveScoreModal] = useState<any>(null);
  const [error, setError] = useState('');

  // Check if existing recommendations already exist
  useEffect(() => {
    async function loadExisting() {
      const res = await apiRequest('/assessments/latest');
      if (res.success && res.recommendations && res.recommendations.length > 0) {
        setRecommendations(res.recommendations);
      }
    }
    loadExisting();
  }, []);

  const toggleTechSkill = (skill: string) => {
    if (selectedTechSkills.includes(skill)) {
      setSelectedTechSkills(selectedTechSkills.filter((s) => s !== skill));
    } else {
      setSelectedTechSkills([...selectedTechSkills, skill]);
    }
  };

  const toggleSoftSkill = (skill: string) => {
    if (selectedSoftSkills.includes(skill)) {
      setSelectedSoftSkills(selectedSoftSkills.filter((s) => s !== skill));
    } else {
      setSelectedSoftSkills([...selectedSoftSkills, skill]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmitAssessment = async () => {
    if (selectedTechSkills.length === 0) {
      setError('Please select at least 1 technical skill you are familiar with.');
      return;
    }

    setSubmitting(true);
    setError('');

    const res = await apiRequest('/assessments/submit', {
      method: 'POST',
      body: {
        education,
        technical_skills: selectedTechSkills,
        soft_skills: selectedSoftSkills,
        interests: selectedInterests,
        experience_level: experienceLevel,
        projects_and_certifications: projectsCertifications,
        preferred_work_mode: workMode,
        career_goals: careerGoals
      }
    });

    setSubmitting(false);

    if (res.success && res.recommendations) {
      setRecommendations(res.recommendations);
      // Scroll to recommendations
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError(res.error || 'Failed to generate recommendations.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Career Assessment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          {t.assessment.title}
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          {t.assessment.subtitle}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Assessment Form Wizard */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-navy-800 space-y-8">
        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-6 border-b border-navy-800">
          {[
            { num: 1, label: 'Education' },
            { num: 2, label: 'Tech Skills' },
            { num: 3, label: 'Soft Skills' },
            { num: 4, label: 'Preferences' }
          ].map((item) => (
            <button
              key={item.num}
              onClick={() => setStep(item.num)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                step === item.num
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-navy-950 text-slate-400 hover:text-white'
              }`}
            >
              Step {item.num}: {item.label}
            </button>
          ))}
        </div>

        {/* Step 1: Education & Degree */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Academic Qualifications & Level</h3>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Degree & Specialization
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. B.Tech in Computer Science and Engineering"
                className="w-full px-4 py-3 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Current Experience Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Student / Fresher', '0 - 1 Years Experience', 'Career Switcher'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperienceLevel(lvl)}
                    className={`p-3.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                      experienceLevel === lvl
                        ? 'border-brand-500 bg-brand-500/15 text-white'
                        : 'border-navy-700 bg-navy-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center space-x-1.5"
              >
                <span>Next: Technical Skills</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Technical Skills */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Select Your Technical Competencies</h3>
              <span className="text-xs text-brand-400 font-semibold">{selectedTechSkills.length} selected</span>
            </div>
            <p className="text-xs text-slate-400">
              Select all programming languages, libraries, tools, and paradigms you have studied or used in projects.
            </p>

            <div className="flex flex-wrap gap-2">
              {TECH_SKILLS_OPTIONS.map((skill) => {
                const isSelected = selectedTechSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleTechSkill(skill)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/30'
                        : 'bg-navy-950 border-navy-800 text-slate-400 hover:text-slate-200 hover:border-navy-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {skill}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center space-x-1.5"
              >
                <span>Next: Soft Skills & Interests</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Soft Skills & Interests */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Soft Skills & Domain Interests</h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Core Strengths & Soft Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {SOFT_SKILLS_OPTIONS.map((skill) => {
                  const isSelected = selectedSoftSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSoftSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-violet-600 text-white border-violet-500'
                          : 'bg-navy-950 border-navy-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Areas of Technical Interest
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS_OPTIONS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-brand-600 text-white border-brand-500'
                          : 'bg-navy-950 border-navy-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center space-x-1.5"
              >
                <span>Next: Goals & Work Mode</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Projects, Work Mode & Submit */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Projects, Goals & Work Mode</h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Preferred Work Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'remote', label: 'Remote Only' },
                  { id: 'hybrid', label: 'Hybrid' },
                  { id: 'onsite', label: 'Onsite / Office' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setWorkMode(mode.id as any)}
                    className={`py-3 px-2 rounded-xl border text-xs font-semibold transition-all text-center ${
                      workMode === mode.id
                        ? 'border-brand-500 bg-brand-500/15 text-white'
                        : 'border-navy-700 bg-navy-950/60 text-slate-400'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Notable Projects or Certifications (Optional)
              </label>
              <textarea
                value={projectsCertifications}
                onChange={(e) => setProjectsCertifications(e.target.value)}
                placeholder="e.g. Developed a full-stack bookstore with React and Node.js; finished Python certificate on Coursera..."
                rows={2}
                className="w-full px-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Career Ambition or Target Company (Optional)
              </label>
              <input
                type="text"
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                placeholder="e.g. Aiming for an AI Engineer or Backend Developer fresher position..."
                className="w-full px-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmitAssessment}
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 disabled:opacity-60 text-white font-bold text-sm shadow-xl shadow-brand-600/30 flex items-center space-x-2 transition-all hover:scale-105"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Calculating Match Scores...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Career Recommendations</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations Results Section */}
      {recommendations.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-brand-400" />
                <span>{t.assessment.resultsTitle}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Calculated dynamically from your submitted academic background and technical inventory
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold self-start sm:self-auto">
              {recommendations.length} Roles Evaluated
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {recommendations.map((rec) => (
              <div
                key={rec.role_id || rec.role_title}
                className="glass-card p-6 sm:p-8 rounded-3xl border border-navy-800 space-y-6 relative overflow-hidden"
              >
                {/* Top Role Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-navy-800 text-brand-300 border border-navy-700">
                        {rec.category}
                      </span>
                      <span className="text-xs text-slate-400">Market Demand: <strong className="text-emerald-400">{rec.market_demand || 'High'}</strong></span>
                    </div>
                    <h3 className="text-2xl font-black text-white mt-1">{rec.role_title}</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">{rec.description}</p>
                  </div>

                  {/* Match Score Gauge */}
                  <div className="flex items-center space-x-4 bg-navy-950/80 p-3 rounded-2xl border border-navy-800 shrink-0">
                    <ScoreRing score={rec.match_percentage} size={70} strokeWidth={6} label="Match" />
                    {rec.score_breakdown && (
                      <button
                        type="button"
                        onClick={() => setActiveScoreModal(rec)}
                        className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-1"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Why this score?</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Suitability Rationale */}
                <div className="p-4 rounded-2xl bg-brand-950/30 border border-brand-500/20 text-xs text-slate-200 leading-relaxed">
                  <strong className="text-brand-300 block mb-1">Career Guidance Rationale:</strong>
                  {rec.suitability_reason}
                </div>

                {/* Skills Comparison: Matching vs Missing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Matching */}
                  <div className="p-4 rounded-2xl bg-navy-950/60 border border-navy-800">
                    <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.assessment.matchingSkills} ({(rec.matching_skills || []).length})</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(rec.matching_skills || []).length > 0 ? (
                        rec.matching_skills.map((s: string, idx: number) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">Foundational preparation suggested</span>
                      )}
                    </div>
                  </div>

                  {/* Missing */}
                  <div className="p-4 rounded-2xl bg-navy-950/60 border border-navy-800">
                    <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{t.assessment.missingSkills} ({(rec.missing_skills || []).length})</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(rec.missing_skills || []).map((s: string, idx: number) => (
                        <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Beginner Projects */}
                {rec.beginner_projects && rec.beginner_projects.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center space-x-2">
                      <Code className="w-4 h-4 text-brand-400" />
                      <span>Recommended Beginner Projects to Prove Competence:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {rec.beginner_projects.map((proj: any, pIdx: number) => (
                        <div key={pIdx} className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 text-xs">
                          <p className="font-bold text-white mb-1">{proj.title}</p>
                          <p className="text-slate-400 text-[11px] leading-relaxed">{proj.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Learning Resources */}
                {rec.suggested_resources && rec.suggested_resources.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-violet-400" />
                      <span>Suggested Free Learning Resources:</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.suggested_resources.map((res: any, rIdx: number) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs border border-navy-700 transition-colors"
                        >
                          <span>{res.title}</span>
                          <span className="text-[10px] text-brand-400 font-medium">({res.provider})</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* External Job Searches */}
                {rec.job_search_links && (
                  <div className="pt-4 border-t border-navy-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">External Job Searches:</span>
                      <a
                        href={rec.job_search_links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 text-[#70B5F9] text-xs font-semibold flex items-center space-x-1"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={rec.job_search_links.indeed}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded bg-[#2164f3]/20 hover:bg-[#2164f3]/30 text-[#8cb0f9] text-xs font-semibold flex items-center space-x-1"
                      >
                        <span>Indeed</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={rec.job_search_links.naukri}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded bg-[#4a90e2]/20 hover:bg-[#4a90e2]/30 text-[#9bc6f9] text-xs font-semibold flex items-center space-x-1"
                      >
                        <span>Naukri</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onNavigate('roadmap')}
                        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
                      >
                        View Learning Roadmap →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transparent Match Score Modal */}
      {activeScoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-navy-700 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Info className="w-5 h-5 text-brand-400" />
                <span>Score Calculation Breakdown</span>
              </h3>
              <button
                onClick={() => setActiveScoreModal(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              For role: <strong className="text-white">{activeScoreModal.role_title}</strong> (Total Match: {activeScoreModal.match_percentage}%)
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-navy-950 rounded-xl">
                <span>Technical Skills Match (45% weight):</span>
                <strong className="text-brand-400">
                  {activeScoreModal.score_breakdown?.technical_skills?.score} / 45 pts
                </strong>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-navy-950 rounded-xl">
                <span>Soft Skills & Interests (25% weight):</span>
                <strong className="text-violet-400">
                  {activeScoreModal.score_breakdown?.soft_skills_and_interests?.score} / 25 pts
                </strong>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-navy-950 rounded-xl">
                <span>Academic Degree Relevance (15% weight):</span>
                <strong className="text-emerald-400">
                  {activeScoreModal.score_breakdown?.education_alignment?.score} / 15 pts
                </strong>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-navy-950 rounded-xl">
                <span>Experience Level Alignment (15% weight):</span>
                <strong className="text-amber-400">
                  {activeScoreModal.score_breakdown?.experience_suitability?.score} / 15 pts
                </strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic bg-navy-900/50 p-3 rounded-xl border border-navy-800">
              {activeScoreModal.score_breakdown?.methodology_notice}
            </p>

            <button
              onClick={() => setActiveScoreModal(null)}
              className="w-full py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
