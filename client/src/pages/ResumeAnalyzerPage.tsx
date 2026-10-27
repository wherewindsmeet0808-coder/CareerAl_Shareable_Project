import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Trash2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Loader2,
  Layers,
  FileCheck,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '../api/client';
import { ScoreRing } from '../components/ScoreRing';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const ResumeAnalyzerPage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState(user?.preferred_role || 'Software Developer');
  const [analyzing, setAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchHistory = async () => {
    const res = await apiRequest('/resume/history');
    if (res.success && Array.isArray(res.history)) {
      setHistory(res.history);
      if (res.history.length > 0 && !currentAnalysis) {
        setCurrentAnalysis(res.history[0]);
      }
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setError('');
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx'].includes(ext || '')) {
      setError('Unsupported file type. Please upload a PDF (.pdf) or Word (.docx) document.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }
    setFile(selectedFile);
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      setError('Please choose a file to analyze.');
      return;
    }

    setAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('target_role', targetRole);
    formData.append('language', language);

    const res = await apiRequest('/resume/upload', {
      method: 'POST',
      body: formData,
      isFormData: true
    });

    setAnalyzing(false);

    if (res.success && res.analysis) {
      setCurrentAnalysis(res.analysis);
      setFile(null);
      fetchHistory();
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else {
      setError(res.error || 'Failed to parse and analyze resume.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume analysis record?')) return;
    const res = await apiRequest(`/resume/${id}`, { method: 'DELETE' });
    if (res.success) {
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(null);
      }
      fetchHistory();
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>ATS Optimization Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{t.resume.title}</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          {t.resume.subtitle}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-navy-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              {t.resume.targetRoleLabel}
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 font-medium"
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
        </div>

        {/* Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileSelect(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            file
              ? 'border-brand-500 bg-brand-500/10'
              : 'border-navy-700 hover:border-brand-500 hover:bg-navy-900/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-navy-700 text-brand-400 mx-auto flex items-center justify-center mb-4 shadow-inner">
            {file ? <FileCheck className="w-8 h-8 text-emerald-400" /> : <Upload className="w-8 h-8" />}
          </div>

          {file ? (
            <div>
              <p className="text-base font-bold text-white">{file.name}</p>
              <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB • Ready for AI evaluation</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold text-white">{t.resume.uploadPrompt}</p>
              <p className="text-xs text-slate-400 mt-1">{t.resume.fileSupport}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Private in-memory parsing. Resumes are never made publicly accessible.</span>
          </div>

          <button
            type="button"
            onClick={handleUploadAndAnalyze}
            disabled={!file || analyzing}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-105"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running ATS Audit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.resume.analyzeBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {currentAnalysis && (
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-navy-800 space-y-8">
          {/* Header & Overall ATS Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-navy-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  Target: {currentAnalysis.target_role || targetRole}
                </span>
                <span className="text-xs text-slate-400">File: {currentAnalysis.file_name}</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-2">ATS Compatibility Report</h2>
            </div>

            <div className="flex items-center space-x-4 bg-navy-950 p-4 rounded-2xl border border-navy-800 shrink-0">
              <ScoreRing score={currentAnalysis.ats_score} size={80} strokeWidth={7} label="ATS Score" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-white">
                  {currentAnalysis.ats_score >= 80 ? 'Strong Match' : currentAnalysis.ats_score >= 60 ? 'Moderate Match' : 'Needs Optimization'}
                </p>
                <p className="text-[11px] text-slate-400">Industry Screening Heuristic</p>
                <button
                  type="button"
                  onClick={() => handleDelete(currentAnalysis.id)}
                  className="text-rose-400 hover:text-rose-300 text-[11px] flex items-center space-x-1 pt-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete Analysis</span>
                </button>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-navy-950/80 border border-navy-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              {t.resume.summaryTitle}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{currentAnalysis.summary}</p>
          </div>

          {/* Keywords Found vs Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.resume.keywordsFound} ({(currentAnalysis.keywords_found || []).length})</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(currentAnalysis.keywords_found || []).map((k: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800">
              <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{t.resume.keywordsMissing} ({(currentAnalysis.keywords_missing || []).length})</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(currentAnalysis.keywords_missing || []).map((k: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                {t.resume.strengths}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {(currentAnalysis.strengths || []).map((str: string, i: number) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                {t.resume.weaknesses}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {(currentAnalysis.weaknesses || []).map((w: string, i: number) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>{t.resume.actionableTitle}</span>
            </h4>
            <div className="space-y-2">
              {(currentAnalysis.actionable_improvements || []).map((act: string, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-xs text-slate-300 flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-brand-600/20 text-brand-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Bullet Rewrites */}
          {currentAnalysis.improved_outline?.sample_bullet_rewrites && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                {t.resume.bulletRewrites} (Google XYZ Impact Format):
              </h4>
              <div className="space-y-3">
                {currentAnalysis.improved_outline.sample_bullet_rewrites.map((rw: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-2 text-xs">
                    <div className="text-rose-400">
                      <span className="font-bold">Original: </span>
                      <span className="line-through">{rw.original}</span>
                    </div>
                    <div className="text-emerald-300 flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-emerald-400">Optimized Rewrite: </span>
                        <span>{rw.improved}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(rw.improved, i)}
                        className="px-2 py-1 rounded bg-navy-800 hover:bg-navy-700 text-slate-300 shrink-0 text-[10px] flex items-center space-x-1"
                      >
                        {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === i ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-500 italic text-center pt-4 border-t border-navy-800">
            {t.resume.disclaimer}
          </p>
        </div>
      )}

      {/* History List */}
      {history.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Previous Resume Analyses ({history.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {history.map((h) => (
              <div
                key={h.id}
                onClick={() => {
                  setCurrentAnalysis(h);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  currentAnalysis?.id === h.id
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'glass-card border-navy-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-white">{h.file_name}</p>
                  <p className="text-xs text-slate-400">
                    {h.target_role} • Score: <strong className="text-brand-400">{h.ats_score}%</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(h.id);
                  }}
                  className="text-slate-500 hover:text-rose-400 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
