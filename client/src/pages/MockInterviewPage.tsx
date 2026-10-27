import React, { useState, useEffect } from 'react';
import {
  Video,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Clock,
  Award,
  Play,
  Loader2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '../api/client';
import { ScoreRing } from '../components/ScoreRing';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const MockInterviewPage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  // Setup options
  const [targetRole, setTargetRole] = useState(user?.preferred_role || 'Software Developer');
  const [category, setCategory] = useState<'technical' | 'hr' | 'behavioral' | 'role-specific'>('technical');
  const [experienceLevel, setExperienceLevel] = useState(user?.experience_level || 'Student / Fresher');

  // Active Session State
  const [session, setSession] = useState<any>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<any>(null);
  const [completedAnswers, setCompletedAnswers] = useState<any[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);

  // History & Voice state
  const [history, setHistory] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [error, setError] = useState('');

  // Check Web Speech API support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await apiRequest('/interviews/history');
    if (res.success && Array.isArray(res.history)) {
      setHistory(res.history);
    }
  };

  const handleStartSession = async () => {
    setError('');
    setEvaluating(true);

    const res = await apiRequest('/interviews/start', {
      method: 'POST',
      body: {
        target_role: targetRole,
        category,
        experience_level: experienceLevel,
        language
      }
    });

    setEvaluating(false);

    if (res.success && res.session) {
      setSession(res.session);
      setCurrentQIndex(0);
      setAnswerText('');
      setCurrentEvaluation(null);
      setCompletedAnswers([]);
      setSessionFinished(false);
    } else {
      setError(res.error || 'Failed to initialize interview session.');
    }
  };

  // Browser Voice Input Handler
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ta' ? 'ta-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAnswerText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) {
      setError('Please provide an answer before submitting for evaluation.');
      return;
    }

    const currentQuestion = session.questions[currentQIndex];
    setEvaluating(true);
    setError('');

    const res = await apiRequest('/interviews/answer', {
      method: 'POST',
      body: {
        session_id: session.id,
        question_index: currentQIndex,
        question_text: currentQuestion.text,
        answer_text: answerText.trim(),
        language
      }
    });

    setEvaluating(false);

    if (res.success && res.evaluation) {
      setCurrentEvaluation(res.evaluation);
      setCompletedAnswers((prev) => [
        ...prev,
        {
          question: currentQuestion.text,
          answer: answerText.trim(),
          evaluation: res.evaluation
        }
      ]);
    } else {
      setError(res.error || 'Failed to evaluate answer.');
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < (session.questions?.length || 5)) {
      setCurrentQIndex((prev) => prev + 1);
      setAnswerText('');
      setCurrentEvaluation(null);
    } else {
      setSessionFinished(true);
      fetchHistory();
    }
  };

  const calculateSessionAverage = () => {
    if (completedAnswers.length === 0) return 0;
    const sum = completedAnswers.reduce((acc, cur) => acc + Number(cur.evaluation?.score || 0), 0);
    return Number((sum / completedAnswers.length).toFixed(1));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold mb-2">
          <Video className="w-3.5 h-3.5" />
          <span>Interactive Interview Practice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{t.interview.title}</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          {t.interview.subtitle}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Configuration Panel (When not in an active interview) */}
      {!session || sessionFinished ? (
        <div className="space-y-8">
          {sessionFinished && (
            <div className="glass-card p-6 sm:p-10 rounded-3xl border border-emerald-500/40 bg-emerald-950/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Session Completed
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">{t.interview.summaryTitle}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Role: {session.target_role} • Category: {session.category}
                  </p>
                </div>

                <div className="bg-navy-950 p-4 rounded-2xl border border-navy-800 flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-3xl font-black text-emerald-400">{calculateSessionAverage()}</span>
                    <span className="text-xs text-slate-400 block">/ 10 Score</span>
                  </div>
                </div>
              </div>

              {/* Answers summary */}
              <div className="space-y-4">
                {completedAnswers.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Q{idx + 1}: {item.question}</span>
                      <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold">
                        {item.evaluation?.score} / 10
                      </span>
                    </div>
                    <p className="text-slate-400"><strong className="text-slate-300">Your Answer:</strong> {item.answer}</p>
                    <p className="text-emerald-300"><strong className="text-emerald-400">Strengths:</strong> {item.evaluation?.strengths}</p>
                    <p className="text-amber-300"><strong className="text-amber-400">Improvement:</strong> {item.evaluation?.improvements}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setSession(null);
                    setSessionFinished(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
                >
                  Configure New Practice Session
                </button>
              </div>
            </div>
          )}

          <div className="glass-card p-6 sm:p-10 rounded-3xl border border-navy-800 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-navy-800 pb-3">
              {t.interview.startTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t.interview.targetRole}
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t.interview.category}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 font-medium"
                >
                  <option value="technical">{t.interview.techCategory}</option>
                  <option value="behavioral">{t.interview.behavioralCategory}</option>
                  <option value="hr">{t.interview.hrCategory}</option>
                  <option value="role-specific">{t.interview.roleSpecificCategory}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t.interview.experienceLevel}
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 font-medium"
                >
                  <option value="Student / Fresher">Student / Fresher</option>
                  <option value="0 - 1 Years">0 - 1 Years Experience</option>
                  <option value="Junior Engineer">Junior Engineer</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleStartSession}
                disabled={evaluating}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-brand-600 hover:from-violet-500 hover:to-brand-500 disabled:opacity-60 text-white font-bold text-sm shadow-xl shadow-violet-600/30 flex items-center space-x-2 transition-all hover:scale-105"
              >
                {evaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing Interview Questions...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>{t.interview.startBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Active Question Interface */
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-navy-800 space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-navy-800 pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.interview.questionNum} {currentQIndex + 1} {t.interview.of} {session.questions?.length || 5}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-semibold">
              {session.category} Category
            </span>
          </div>

          {/* Question Text */}
          <div className="p-6 rounded-2xl bg-navy-950 border border-navy-800">
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              "{session.questions[currentQIndex]?.text}"
            </h3>
            {session.questions[currentQIndex]?.criteria && (
              <p className="text-xs text-slate-400 mt-2 italic">
                Focus Areas: {session.questions[currentQIndex]?.criteria}
              </p>
            )}
          </div>

          {/* Answer Input */}
          {!currentEvaluation ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {t.interview.yourAnswer}
                </label>

                {speechSupported && (
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-navy-800 hover:bg-navy-700 text-slate-300'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-brand-400" />}
                    <span>{isListening ? t.interview.listening : t.interview.voiceInput}</span>
                  </button>
                )}
              </div>

              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder={t.interview.answerPlaceholder}
                rows={5}
                disabled={evaluating}
                className="w-full p-4 bg-navy-950/80 border border-navy-700 rounded-2xl text-white text-sm focus:outline-none focus:border-brand-500 leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={!answerText.trim() || evaluating}
                  className="px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition-all hover:scale-105"
                >
                  {evaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.interview.evaluating}</span>
                    </>
                  ) : (
                    <span>{t.interview.submitAnswer}</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Evaluation Results */
            <div className="space-y-6 pt-2">
              <div className="p-6 rounded-2xl bg-navy-950 border border-navy-800 space-y-4">
                <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Constructive Feedback
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-black text-emerald-400">{currentEvaluation.score}</span>
                    <span className="text-xs text-slate-400">/ 10</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <strong className="text-emerald-400 block mb-0.5">{t.interview.strengths}:</strong>
                    <p className="text-slate-300">{currentEvaluation.strengths}</p>
                  </div>

                  <div>
                    <strong className="text-amber-400 block mb-0.5">{t.interview.improvements}:</strong>
                    <p className="text-slate-300">{currentEvaluation.improvements}</p>
                  </div>

                  {currentEvaluation.model_answer && (
                    <div className="p-3.5 rounded-xl bg-brand-950/30 border border-brand-500/20">
                      <strong className="text-brand-300 block mb-1">{t.interview.modelAnswer}:</strong>
                      <p className="text-slate-300 italic">{currentEvaluation.model_answer}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm flex items-center space-x-2 shadow-lg"
                >
                  <span>
                    {currentQIndex + 1 < (session.questions?.length || 5)
                      ? t.interview.nextQuestion
                      : t.interview.finishSession}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History of sessions */}
      {history.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Mock Practice History ({history.length} Sessions)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {history.map((h) => (
              <div key={h.id} className="p-4 rounded-2xl glass-card border border-navy-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{h.target_role}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                    {h.overall_score || 7.0} / 10
                  </span>
                </div>
                <p className="text-slate-400">{h.category} • {h.status}</p>
                <p className="text-[10px] text-slate-500">{new Date(h.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-500 italic text-center">
        {t.interview.disclaimer}
      </p>
    </div>
  );
};
