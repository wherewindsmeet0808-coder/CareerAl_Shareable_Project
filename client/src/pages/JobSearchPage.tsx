import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Building,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  Filter,
  Clock,
  Sparkles,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '../api/client';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const JobSearchPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'listings' | 'tracker'>('listings');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('all');
  const [experience, setExperience] = useState('all');
  const [jobType, setJobType] = useState('all');

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [externalLinks, setExternalLinks] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      query,
      location,
      work_mode: workMode,
      experience,
      job_type: jobType
    });

    const res = await apiRequest(`/jobs/search?${params.toString()}`);
    setLoading(false);

    if (res.success && res.data) {
      setJobs(res.data.results || []);
      setExternalLinks(res.data.externalSearchLinks || []);
      setLastUpdated(res.data.lastUpdated || '');
    }
  };

  const fetchSavedJobs = async () => {
    const res = await apiRequest('/jobs/saved');
    if (res.success && Array.isArray(res.saved)) {
      setSavedJobs(res.saved);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, [workMode, experience, jobType]);

  const handleBookmarkJob = async (job: any) => {
    const res = await apiRequest('/jobs/save', {
      method: 'POST',
      body: {
        job_id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        work_mode: job.work_mode,
        apply_url: job.apply_url,
        skills: job.required_skills,
        status: 'bookmarked'
      }
    });

    if (res.success) {
      setActionSuccess(`Saved "${job.title}" to your tracker!`);
      setTimeout(() => setActionSuccess(''), 3000);
      fetchSavedJobs();
    }
  };

  const handleUpdateStatus = async (
    jobId: string,
    newStatus: 'bookmarked' | 'applied' | 'interviewing' | 'offered' | 'rejected',
    notes?: string
  ) => {
    const job = savedJobs.find((j) => j.job_id === jobId || j.id === jobId);
    if (!job) return;

    await apiRequest('/jobs/save', {
      method: 'POST',
      body: {
        job_id: job.job_id,
        title: job.title,
        company: job.company,
        location: job.location,
        work_mode: job.work_mode,
        apply_url: job.apply_url,
        skills: job.skills,
        status: newStatus,
        notes: notes !== undefined ? notes : job.notes,
        applied_date: newStatus === 'applied' ? new Date().toISOString().split('T')[0] : job.applied_date
      }
    });

    fetchSavedJobs();
  };

  const handleDeleteSaved = async (jobId: string) => {
    await apiRequest(`/jobs/save/${jobId}`, { method: 'DELETE' });
    fetchSavedJobs();
  };

  const isJobSaved = (jobId: string) => savedJobs.some((j) => j.job_id === jobId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Live Job & Internship Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t.jobs.title}</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">{t.jobs.subtitle}</p>
        </div>

        {/* Top Tabs */}
        <div className="flex bg-navy-950 p-1.5 rounded-2xl border border-navy-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'listings' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.jobs.liveListingsTab} ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'tracker' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.jobs.trackerTab} ({savedJobs.length})
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Content by Tab */}
      {activeTab === 'listings' ? (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="glass-card p-6 rounded-3xl border border-navy-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.jobs.searchPlaceholder}
                  onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t.jobs.locationPlaceholder}
                  onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                  className="w-full px-3 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-brand-500"
                />
                <button
                  onClick={fetchJobs}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shrink-0 shadow-md"
                >
                  {t.jobs.searchBtn}
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-navy-800/60 text-xs">
              <span className="text-slate-400 font-semibold mr-1 flex items-center">
                <Filter className="w-3.5 h-3.5 mr-1" /> Filters:
              </span>

              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-navy-950 border border-navy-800 text-slate-300 text-xs"
              >
                <option value="all">{t.jobs.allWorkModes}</option>
                <option value="remote">{t.jobs.remoteOnly}</option>
                <option value="hybrid">{t.jobs.hybridOnly}</option>
                <option value="onsite">{t.jobs.onsiteOnly}</option>
              </select>

              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-navy-950 border border-navy-800 text-slate-300 text-xs"
              >
                <option value="all">{t.jobs.allExperience}</option>
                <option value="entry">{t.jobs.fresherOnly}</option>
                <option value="internship">{t.jobs.internshipsOnly}</option>
              </select>
            </div>
          </div>

          {/* External Search Shortcuts Card */}
          {externalLinks.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-950/20 border border-brand-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {t.jobs.externalSearchTitle}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pre-configured external search queries for fresher openings on trusted job networks
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {externalLinks.map((ext, idx) => (
                  <a
                    key={idx}
                    href={ext.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold border border-navy-700 transition-colors"
                  >
                    <span>{ext.platform}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Job Listings List */}
          {loading ? (
            <LoadingSkeleton count={4} height="h-32" />
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const saved = isJobSaved(job.id);
                return (
                  <div
                    key={job.id}
                    className="glass-card p-5 sm:p-6 rounded-2xl border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card-hover"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            job.is_live_api
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {job.is_live_api ? t.jobs.liveBadge : t.jobs.verifiedBadge}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center space-x-1">
                          <Building className="w-3 h-3 text-slate-500" />
                          <span>{job.company}</span>
                        </span>
                        <span className="text-xs text-slate-400 flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{job.location}</span>
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {job.posted_date}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white hover:text-brand-300 transition-colors">
                        {job.title}
                      </h3>

                      {job.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">{job.description}</p>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(job.required_skills || []).map((sk: string, i: number) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-navy-950 text-slate-300 border border-navy-800">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-navy-800">
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md"
                      >
                        <span>{t.jobs.applyNow}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleBookmarkJob(job)}
                        disabled={saved}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 border transition-colors ${
                          saved
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-navy-800 hover:bg-navy-700 border-navy-700 text-slate-300'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                        <span>{saved ? t.jobs.saved : t.jobs.saveJob}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Application Tracker Tab */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <h3 className="text-lg font-bold text-white">Application Pipeline & Tracker</h3>
            <span className="text-xs text-slate-400">{savedJobs.length} Tracked Positions</span>
          </div>

          {savedJobs.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-3xl border border-navy-800 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No Saved Jobs in Tracker</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Bookmark interesting job openings or internships from the "Available Opportunities" tab to track their application status here.
              </p>
              <button
                onClick={() => setActiveTab('listings')}
                className="mt-2 px-5 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
              >
                Browse Available Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="glass-card p-6 rounded-2xl border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-lg">
                    <span className="text-xs text-slate-400 font-semibold">{job.company} • {job.location}</span>
                    <h4 className="text-base font-bold text-white">{job.title}</h4>

                    {job.applied_date && (
                      <p className="text-[11px] text-slate-400">
                        Applied On: <strong className="text-slate-300">{job.applied_date}</strong>
                      </p>
                    )}

                    <input
                      type="text"
                      defaultValue={job.notes || ''}
                      placeholder="Add personal interview note or HR contact..."
                      onBlur={(e) => handleUpdateStatus(job.job_id, job.status, e.target.value)}
                      className="w-full px-3 py-1.5 bg-navy-950 border border-navy-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  {/* Status Dropdown & Actions */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <select
                      value={job.status}
                      onChange={(e) => handleUpdateStatus(job.job_id, e.target.value as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border focus:outline-none ${
                        job.status === 'offered'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : job.status === 'interviewing'
                          ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                          : job.status === 'applied'
                          ? 'bg-brand-500/20 border-brand-500 text-brand-300'
                          : job.status === 'rejected'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-navy-950 border-navy-700 text-slate-300'
                      }`}
                    >
                      <option value="bookmarked">Bookmarked</option>
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offered">Offered 🎉</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300"
                      title="Open Application Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDeleteSaved(job.id)}
                      className="text-xs text-slate-500 hover:text-rose-400 p-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
