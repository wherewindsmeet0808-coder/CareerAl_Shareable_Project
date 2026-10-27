import React, { useState } from 'react';
import { Compass, User, Mail, Lock, GraduationCap, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const { language } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [degree, setDegree] = useState('B.Tech / B.E. Computer Science');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password entry.');
      return;
    }

    setLoading(true);
    const result = await register({
      full_name: fullName.trim(),
      email: email.trim(),
      password,
      confirm_password: confirmPassword,
      education_level: educationLevel,
      degree,
      preferred_language: language
    });
    setLoading(false);

    if (result.success) {
      onNavigate('dashboard');
    } else {
      setError(result.error || 'Failed to register account.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-card p-8 sm:p-10 rounded-3xl border border-navy-800 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white mx-auto flex items-center justify-center mb-4 shadow-lg shadow-brand-500/20">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Create Free Account</h2>
          <p className="text-sm text-slate-400 mt-2">Start your personalized AI career guidance roadmap</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Priya Sharma"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya.sharma@example.edu"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Education
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Diploma">Diploma / Polytechnic</option>
                <option value="Recent Graduate">Recent Graduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Specialization
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="B.Tech / B.E. Computer Science">Computer Science</option>
                <option value="Information Technology">Information Tech</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="BCA / MCA">BCA / MCA</option>
                <option value="Electronics & Communication">ECE Engineering</option>
                <option value="Other STEM Degree">Other Discipline</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Sign Up Free</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-2 ml-1"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};
