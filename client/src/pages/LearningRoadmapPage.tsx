import React, { useState, useEffect } from 'react';
import {
  Map,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  Code,
  Clock,
  Sparkles,
  ArrowRight,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '../api/client';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const LearningRoadmapPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [targetRole, setTargetRole] = useState(user?.preferred_role || 'Software Developer');
  const [roadmapId, setRoadmapId] = useState<string>('');
  const [phases, setPhases] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState<any>({ totalItems: 0, completedItems: 0, completionPercentage: 0 });
  const [expandedPhase, setExpandedPhase] = useState<number>(1);

  const fetchRoadmap = async (role: string) => {
    setLoading(true);
    const res = await apiRequest(`/roadmaps?role=${encodeURIComponent(role)}`);
    setLoading(false);

    if (res.success) {
      setRoadmapId(res.roadmapId);
      setPhases(res.phases || []);
      setProgress(res.progress || {});
      setStats(res.stats || { totalItems: 0, completedItems: 0, completionPercentage: 0 });
    }
  };

  useEffect(() => {
    fetchRoadmap(targetRole);
  }, [targetRole]);

  const handleToggleItem = async (phaseIndex: number, itemKey: string) => {
    const currentVal = Boolean(progress[itemKey]);
    const newVal = !currentVal;

    // Optimistic update
    const updatedProgress = { ...progress, [itemKey]: newVal };
    setProgress(updatedProgress);

    // Recalculate stats locally
    let comp = 0;
    Object.values(updatedProgress).forEach((v) => {
      if (v) comp++;
    });
    const total = stats.totalItems || 18;
    setStats({
      totalItems: total,
      completedItems: comp,
      completionPercentage: Math.round((comp / total) * 100)
    });

    // Save to database
    await apiRequest('/roadmaps/toggle-item', {
      method: 'POST',
      body: {
        roadmapId,
        phaseIndex,
        itemKey,
        completed: newVal
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Overall Progress Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-navy-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-2">
              <Map className="w-3.5 h-3.5" />
              <span>Personalized Mastery Blueprint</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              {targetRole} Learning Roadmap
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {t.roadmap.subtitle}
            </p>
          </div>

          <div className="flex items-center space-x-6 sm:self-center shrink-0">
            <button
              onClick={() => window.print()}
              className="print:hidden px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 text-xs font-semibold flex items-center space-x-2 transition-all hover:scale-105 shadow-md"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4 text-brand-400" />
              <span>Export PDF / Print</span>
            </button>
            <div className="text-right">
              <span className="text-4xl font-black text-brand-400">{stats.completionPercentage}%</span>
              <span className="block text-xs text-slate-400">Total Progress</span>
            </div>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>{stats.completedItems} of {stats.totalItems} steps completed</span>
            <span>{stats.completionPercentage === 100 ? '🎉 Ready to Apply!' : `${100 - stats.completionPercentage}% remaining`}</span>
          </div>
          <div className="w-full h-3 bg-navy-950 rounded-full overflow-hidden p-0.5 border border-navy-800">
            <div
              className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-600 rounded-full transition-all duration-700"
              style={{ width: `${stats.completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} height="h-36" />
      ) : (
        <div className="space-y-6">
          {phases.map((phase) => {
            const isExpanded = expandedPhase === phase.phase;
            const phaseItems = phase.checklist || [];
            const phaseCompletedCount = phaseItems.filter((i: any) => progress[i.key]).length;
            const isPhaseAllDone = phaseItems.length > 0 && phaseCompletedCount === phaseItems.length;

            return (
              <div
                key={phase.phase}
                className={`glass-card rounded-3xl border transition-all overflow-hidden ${
                  isPhaseAllDone
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : isExpanded
                    ? 'border-brand-500/40 shadow-xl shadow-brand-500/5'
                    : 'border-navy-800'
                }`}
              >
                {/* Collapsible Phase Header */}
                <div
                  onClick={() => setExpandedPhase(isExpanded ? 0 : phase.phase)}
                  className="p-6 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isPhaseAllDone
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-navy-800 text-brand-300 border border-navy-700'
                      }`}
                    >
                      {isPhaseAllDone ? <CheckCircle2 className="w-5 h-5" /> : `0${phase.phase}`}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{phase.duration}</span>
                        </span>
                        {isPhaseAllDone && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                            Phase Completed
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mt-0.5">{phase.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="hidden sm:inline-block text-xs font-semibold text-slate-400">
                      {phaseCompletedCount}/{phaseItems.length} Checklist Tasks
                    </span>
                    <button className="p-1 rounded-lg text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-navy-800/80 space-y-6">
                    {/* Objective */}
                    <div className="p-4 rounded-2xl bg-navy-950/60 border border-navy-800 text-xs">
                      <strong className="text-brand-300 block mb-1">Learning Objective:</strong>
                      <p className="text-slate-300 leading-relaxed">{phase.objective}</p>
                    </div>

                    {/* Topics to Study */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center space-x-1.5">
                        <BookOpen className="w-4 h-4 text-violet-400" />
                        <span>Core Topics to Master:</span>
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                        {phase.topics?.map((topic: string, tIdx: number) => (
                          <li key={tIdx} className="p-2.5 rounded-xl bg-navy-950 border border-navy-800/80 flex items-start space-x-2">
                            <span className="text-brand-400 font-bold">•</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Project Blueprint */}
                    {phase.project && (
                      <div className="p-4 rounded-2xl bg-brand-950/20 border border-brand-500/20">
                        <div className="flex items-center space-x-2 mb-1">
                          <Code className="w-4 h-4 text-brand-400" />
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            Phase Milestone Project: {phase.project.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{phase.project.description}</p>
                      </div>
                    )}

                    {/* Interactive Completion Checklist */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Interactive Completion Checklist (Click to mark done):</span>
                      </h4>
                      <div className="space-y-2">
                        {phaseItems.map((item: any) => {
                          const isDone = Boolean(progress[item.key]);
                          return (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => handleToggleItem(phase.phase, item.key)}
                              className={`w-full flex items-center space-x-3 p-3 rounded-xl border text-left transition-colors ${
                                isDone
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                  : 'bg-navy-950 border-navy-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                              )}
                              <span className={`text-xs font-medium ${isDone ? 'line-through opacity-80' : ''}`}>
                                {item.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Verified Learning Links */}
                    {phase.resources && phase.resources.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Credible Free Study Resources:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.resources.map((res: any, rIdx: number) => (
                            <a
                              key={rIdx}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs border border-navy-700 transition-colors"
                            >
                              <span>{res.name}</span>
                              <span className="text-[10px] text-brand-400">({res.provider})</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
