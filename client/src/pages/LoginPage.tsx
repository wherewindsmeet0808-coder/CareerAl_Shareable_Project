import React, { useState } from 'react';
import { Compass, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      onNavigate('dashboard');
    } else {
      setError(result.error || 'Login failed. Please check credentials.');
    }
  };

  const handleDemoLogin = async (role: 'student' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@aicareer.com');
      setPassword('Admin@2026');
    } else {
      setEmail('priya.sharma@example.edu');
      setPassword('Student@2026');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-card p-8 sm:p-10 rounded-3xl border border-navy-800 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 text-brand-400 mx-auto flex items-center justify-center mb-4">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-2">Log in to access your personalized career roadmap</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                required
                className="w-full pl-11 pr-4 py-3 bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3 bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 text-white font-bold text-sm shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill */}
        <div className="mt-6 pt-6 border-t border-navy-800/80 text-center">
          <p className="text-xs text-slate-400 mb-3">Quick Fill Demo Accounts:</p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('student')}
              className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 border border-navy-700 text-xs text-slate-300 transition-colors"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 border border-navy-700 text-xs text-slate-300 transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-2 ml-1"
          >
            Create account free
          </button>
        </p>
      </div>
    </div>
  );
};
