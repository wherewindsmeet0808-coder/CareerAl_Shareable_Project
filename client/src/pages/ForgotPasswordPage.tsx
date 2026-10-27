import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '../api/client';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    const res = await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: { email: email.trim() }
    });
    setLoading(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || 'Failed to process request.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-card p-8 sm:p-10 rounded-3xl border border-navy-800 shadow-2xl">
        <button
          onClick={() => onNavigate('login')}
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </button>

        <h2 className="text-2xl font-extrabold text-white mb-2">Reset Password</h2>
        <p className="text-xs text-slate-400 mb-6">
          Enter your registered email address and we will dispatch password recovery instructions.
        </p>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Instructions Dispatched</h4>
            <p className="text-xs text-slate-300">
              Check your inbox for <span className="text-brand-300 font-semibold">{email}</span>. Follow the link provided to set a new password.
            </p>
            <button
              onClick={() => onNavigate('reset-password')}
              className="mt-4 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold"
            >
              Enter Reset Code
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
