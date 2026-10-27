import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Globe,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface ProfileSettingsPageProps {
  onNavigate?: (page: string) => void;
}

const COMMON_SKILLS_CATALOG = [
  'JavaScript (ES6+)', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'C++',
  'Data Structures', 'Algorithms', 'Git', 'REST APIs', 'Docker', 'AWS / Azure / GCP',
  'Tailwind CSS', 'Figma', 'HTML5', 'PostgreSQL', 'MongoDB', 'Machine Learning',
  'Pandas', 'PyTorch', 'Linux CLI', 'Testing (Playwright/Jest)', 'Agile / Scrum'
];

const COMMON_INTERESTS = [
  'Software Engineering', 'Artificial Intelligence', 'Web Development',
  'Data Science & Analytics', 'Cloud Architecture & DevOps', 'Cybersecurity',
  'UI/UX Product Design', 'Mobile App Development', 'Open Source Contribution'
];

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ onNavigate }) => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [educationLevel, setEducationLevel] = useState(user?.education_level || 'Undergraduate');
  const [degree, setDegree] = useState(user?.degree || 'B.Tech / B.E. in Computer Science');
  const [specialization, setSpecialization] = useState(user?.specialization || 'Computer Science');
  const [graduationYear, setGraduationYear] = useState<number>(user?.graduation_year || 2026);
  const [experienceLevel, setExperienceLevel] = useState(user?.experience_level || 'Student / Fresher');
  const [preferredRole, setPreferredRole] = useState(user?.preferred_role || 'Software Developer');
  const [preferredLocation, setPreferredLocation] = useState(user?.preferred_location || 'India / Remote');
  const [preferredWorkMode, setPreferredWorkMode] = useState<'onsite' | 'hybrid' | 'remote'>(
    user?.preferred_work_mode || 'remote'
  );
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'ta'>(
    (user?.preferred_language as 'en' | 'ta') || language
  );

  const [skills, setSkills] = useState<string[]>(user?.skills || ['JavaScript', 'Python', 'SQL']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [interests, setInterests] = useState<string[]>(
    user?.interests || ['Software Engineering', 'Artificial Intelligence']
  );
  const [newInterestInput, setNewInterestInput] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Account Deletion State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = async () => {
    if (deleteConfirmationInput !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm.');
      return;
    }
    setIsDeleting(true);
    setDeleteError('');
    const res = await deleteAccount();
    setIsDeleting(false);
    if (res.success) {
      if (onNavigate) {
        onNavigate('login');
      } else {
        window.location.reload();
      }
    } else {
      setDeleteError(res.error || 'Failed to delete account');
    }
  };

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter((i) => i !== interestToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setError('');

    const res = await updateProfile({
      full_name: fullName.trim(),
      education_level: educationLevel,
      degree,
      specialization,
      graduation_year: Number(graduationYear),
      skills,
      interests,
      experience_level: experienceLevel,
      preferred_role: preferredRole,
      preferred_location: preferredLocation,
      preferred_work_mode: preferredWorkMode,
      preferred_language: preferredLanguage
    });

    setSaving(false);

    if (res.success) {
      setSuccessMessage('Your profile and preferences have been updated successfully!');
      if (preferredLanguage !== language) {
        setLanguage(preferredLanguage);
      }
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setError(res.error || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
          <User className="w-8 h-8 text-brand-400" />
          <span>Student Profile & Preferences</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Keep your academic qualifications and skill inventory current to receive the most accurate career guidance.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-navy-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-navy-800 pb-3">
            <User className="w-5 h-5 text-brand-400" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 bg-navy-950/40 border border-navy-800 rounded-xl text-slate-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Education & Graduation */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-navy-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-navy-800 pb-3">
            <GraduationCap className="w-5 h-5 text-brand-400" />
            <span>Education & Academic Background</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Education Level
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="Undergraduate">Undergraduate (B.Tech/BE/BCA/BSc)</option>
                <option value="Postgraduate">Postgraduate (M.Tech/MCA/MSc)</option>
                <option value="Diploma">Diploma / Polytechnic</option>
                <option value="Recent Graduate">Recent Graduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Degree & Branch
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full px-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Graduation Year
              </label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              >
                {[2024, 2025, 2026, 2027, 2028, 2029].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr} {yr === 2026 ? '(Current Batch)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Skills Inventory */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-navy-800 space-y-6">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span>Technical Skills Inventory ({skills.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Click to add/remove</span>
          </div>

          {/* Active Skills Badges */}
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-300 border border-brand-500/30 text-xs font-semibold"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Add custom skill input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Type custom skill (e.g. Next.js, Redis, Tailwind)..."
              className="flex-1 px-4 py-2 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(newSkillInput);
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleAddSkill(newSkillInput)}
              className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Recommended Common Skills to Pick */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Quick Add Popular Tech Skills:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SKILLS_CATALOG.filter((s) => !skills.includes(s)).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="px-2.5 py-1 rounded-lg bg-navy-950 hover:bg-navy-800 text-slate-400 hover:text-slate-200 text-xs border border-navy-800 transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Career Preferences */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-navy-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-navy-800 pb-3">
            <Briefcase className="w-5 h-5 text-brand-400" />
            <span>Target Role & Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Preferred Job Role
              </label>
              <select
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                className="w-full px-3 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="Software Developer">Software Developer</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Web Developer">Web Developer</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                <option value="Cloud Engineer">Cloud Engineer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="QA Engineer">QA Engineer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Work Mode Preference
              </label>
              <select
                value={preferredWorkMode}
                onChange={(e) => setPreferredWorkMode(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="remote">Remote (Work from home)</option>
                <option value="hybrid">Hybrid (Flexible)</option>
                <option value="onsite">Onsite (In office)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Preferred Location
              </label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. Chennai, Bangalore, Remote"
                className="w-full px-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Preferred Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold text-sm shadow-xl shadow-brand-600/30 flex items-center space-x-2 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Settings'}</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Account Deletion (GDPR / Privacy Compliance) */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-rose-900/40 bg-rose-950/10 space-y-4">
        <div className="flex items-center space-x-3 text-rose-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <h2 className="text-lg font-bold text-white">Danger Zone: Delete Account & Data</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Permanently delete your profile and all associated data, including your career assessments,
          skill gap progress, customized learning roadmaps, resume analyses, mock interview evaluations,
          and saved job applications. This action is irreversible.
        </p>
        <div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition-all inline-flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete My Account & Personal Data</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-rose-500/50 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Are you absolutely sure?</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              All your assessments, resume records, interview feedback, and application tracking data
              will be permanently erased immediately.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Type <span className="font-mono text-rose-400 font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                placeholder="DELETE"
                className="w-full px-4 py-2.5 bg-navy-950 border border-rose-500/40 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-rose-400"
              />
              {deleteError && (
                <p className="text-xs text-rose-400 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{deleteError}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationInput('');
                  setDeleteError('');
                }}
                className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting || deleteConfirmationInput !== 'DELETE'}
                onClick={handleDeleteAccount}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
