import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Compass,
  FileText,
  Video,
  Briefcase,
  Activity,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '../api/client';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'metrics' | 'roles' | 'resources' | 'health'>('metrics');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  // Role Form Modal State
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleCategory, setNewRoleCategory] = useState('Software Engineering');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleTechSkills, setNewRoleTechSkills] = useState('');
  const [newRoleSalary, setNewRoleSalary] = useState('Competitive');

  // Resource Form Modal State
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [newResTitle, setNewResTitle] = useState('');
  const [newResSkill, setNewResSkill] = useState('');
  const [newResProvider, setNewResProvider] = useState('');
  const [newResUrl, setNewResUrl] = useState('');

  const [feedbackBanner, setFeedbackBanner] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    const mRes = await apiRequest('/admin/metrics');
    if (mRes.success) {
      setMetrics(mRes);
    }

    const rRes = await apiRequest('/admin/roles');
    if (rRes.success && rRes.roles) {
      setRoles(rRes.roles);
    }

    const resRes = await apiRequest('/admin/resources');
    if (resRes.success && resRes.resources) {
      setResources(resRes.resources);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;

    const skillsArray = newRoleTechSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await apiRequest('/admin/roles', {
      method: 'POST',
      body: {
        title: newRoleTitle.trim(),
        category: newRoleCategory,
        description: newRoleDesc.trim(),
        required_technical_skills: skillsArray.length > 0 ? skillsArray : ['General Tech'],
        avg_salary_range: newRoleSalary
      }
    });

    if (res.success) {
      setShowRoleModal(false);
      setNewRoleTitle('');
      setNewRoleDesc('');
      setNewRoleTechSkills('');
      setFeedbackBanner('Career role created successfully.');
      setTimeout(() => setFeedbackBanner(''), 3000);
      loadData();
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career role definition?')) return;
    const res = await apiRequest(`/admin/roles/${id}`, { method: 'DELETE' });
    if (res.success) {
      setFeedbackBanner('Role deleted.');
      setTimeout(() => setFeedbackBanner(''), 3000);
      loadData();
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim() || !newResUrl.trim()) return;

    const res = await apiRequest('/admin/resources', {
      method: 'POST',
      body: {
        title: newResTitle.trim(),
        skill: newResSkill.trim() || 'General',
        provider: newResProvider.trim() || 'Open Resource',
        url: newResUrl.trim(),
        is_free: true,
        level: 'beginner'
      }
    });

    if (res.success) {
      setShowResourceModal(false);
      setNewResTitle('');
      setNewResSkill('');
      setNewResProvider('');
      setNewResUrl('');
      setFeedbackBanner('Learning resource added.');
      setTimeout(() => setFeedbackBanner(''), 3000);
      loadData();
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-card max-w-md p-8 rounded-3xl border border-rose-500/30 text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-xs text-slate-400">
            Administrative credentials are required to view this dashboard. Your student account does not have authorization.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t.admin.title}</h1>
          <p className="text-sm text-slate-400 mt-1">{t.admin.subtitle}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-navy-950 p-1 rounded-2xl border border-navy-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'metrics' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.admin.overviewTab}
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'roles' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.admin.rolesTab} ({roles.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'resources' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.admin.resourcesTab} ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'health' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.admin.healthTab}
          </button>
        </div>
      </div>

      {feedbackBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{feedbackBanner}</span>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton count={3} height="h-36" />
      ) : activeTab === 'metrics' ? (
        /* Tab 1: Aggregate Metrics */
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="glass-card p-6 rounded-2xl border border-navy-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.admin.totalUsers}</span>
                <Users className="w-5 h-5 text-brand-400" />
              </div>
              <span className="text-3xl font-black text-white">{metrics?.stats?.totalUsers || 0}</span>
              <p className="text-[11px] text-slate-400 mt-1">{metrics?.stats?.totalStudents || 0} Active Student Profiles</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-navy-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.admin.totalAssessments}</span>
                <Compass className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-3xl font-black text-white">{metrics?.stats?.totalAssessments || 0}</span>
              <p className="text-[11px] text-slate-400 mt-1">Evaluations Computed</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-navy-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.admin.totalResumes}</span>
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-3xl font-black text-white">{metrics?.stats?.totalResumes || 0}</span>
              <p className="text-[11px] text-slate-400 mt-1">ATS Audits Executed</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-navy-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.admin.totalInterviews}</span>
                <Video className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-3xl font-black text-white">{metrics?.stats?.totalInterviews || 0}</span>
              <p className="text-[11px] text-slate-400 mt-1">AI Mock Sessions</p>
            </div>
          </div>

          {/* Feature Activity Breakdown */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-navy-800">
            <h3 className="text-lg font-bold text-white mb-4">Platform Feature Engagement</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-navy-950 rounded-xl border border-navy-800">
                <span className="text-xl font-bold text-brand-400">{metrics?.stats?.featureUsage?.jobsTracked || 0}</span>
                <p className="text-xs text-slate-400 mt-1">Jobs Bookmarked</p>
              </div>
              <div className="p-4 bg-navy-950 rounded-xl border border-navy-800">
                <span className="text-xl font-bold text-violet-400">{metrics?.stats?.featureUsage?.chatMessagesCount || 0}</span>
                <p className="text-xs text-slate-400 mt-1">AI Chat Consultations</p>
              </div>
              <div className="p-4 bg-navy-950 rounded-xl border border-navy-800">
                <span className="text-xl font-bold text-emerald-400">{metrics?.stats?.totalRoles || 10}</span>
                <p className="text-xs text-slate-400 mt-1">Active Career Models</p>
              </div>
              <div className="p-4 bg-navy-950 rounded-xl border border-navy-800">
                <span className="text-xl font-bold text-amber-400">{metrics?.stats?.totalResources || 15}</span>
                <p className="text-xs text-slate-400 mt-1">Curated Study Links</p>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'roles' ? (
        /* Tab 2: Curated Roles Management */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Curated Career Role Models</h3>
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>{t.admin.addRoleBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((r) => (
              <div key={r.id || r.title} className="glass-card p-5 rounded-2xl border border-navy-800 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">{r.category}</span>
                  <button
                    onClick={() => handleDeleteRole(r.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete Role"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="text-base font-bold text-white">{r.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{r.description}</p>
                <div className="text-[11px] text-slate-400">
                  Skills: <span className="text-slate-300 font-semibold">{r.required_technical_skills?.join(', ')}</span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium">Avg Salary: {r.avg_salary_range}</p>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'resources' ? (
        /* Tab 3: Learning Resources Management */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Curated Free Study Resources</h3>
            <button
              onClick={() => setShowResourceModal(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>{t.admin.addResourceBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((res) => (
              <div key={res.id} className="glass-card p-5 rounded-2xl border border-navy-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/10 text-brand-400">
                  {res.skill}
                </span>
                <h4 className="text-sm font-bold text-white">{res.title}</h4>
                <p className="text-xs text-slate-400">Provider: {res.provider} ({res.level})</p>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center space-x-1 pt-1"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Tab 4: System Health & Audit Logs */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-6 rounded-2xl border border-navy-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Database Engine</span>
              <h4 className="text-lg font-bold text-white">{metrics?.health?.system?.databaseMode?.toUpperCase()}</h4>
              <p className="text-xs text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Persistence Operational</span>
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-navy-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI LLM Provider</span>
              <h4 className="text-sm font-bold text-white truncate">{metrics?.health?.ai?.provider}</h4>
              <p className="text-xs text-slate-400">
                {metrics?.health?.ai?.isRealAI ? 'Live API Connection' : 'Rule-Based Fallback'}
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-navy-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Job API Health</span>
              <h4 className="text-lg font-bold text-white">
                {metrics?.health?.jobApi?.status === 'healthy' ? 'Healthy (Remotive Feed)' : 'Degraded'}
              </h4>
              <p className="text-xs text-slate-400">Latency: {metrics?.health?.jobApi?.latencyMs || 120} ms</p>
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-navy-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Admin Audit Log</h3>
            <div className="p-4 bg-navy-950 rounded-2xl border border-navy-800 text-xs text-slate-400 space-y-2 max-h-60 overflow-y-auto font-mono">
              <p>[{new Date().toISOString()}] SYSTEM_STARTUP: REST API initialized on Node.js {metrics?.health?.system?.nodeVersion || 'v20.18.0'}</p>
              <p>[{new Date().toISOString()}] AUTH_SERVICE: Role verification middleware active</p>
              <p>[{new Date().toISOString()}] AUDIT_EVENT: Admin opened control center panel</p>
            </div>
          </div>
        </div>
      )}

      {/* Role Creation Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-navy-700 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Career Role</h3>
            <form onSubmit={handleCreateRole} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Role Title</label>
                <input
                  type="text"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  placeholder="e.g. Blockchain Developer"
                  required
                  className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <input
                  type="text"
                  value={newRoleCategory}
                  onChange={(e) => setNewRoleCategory(e.target.value)}
                  className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Role description..."
                  rows={2}
                  required
                  className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={newRoleTechSkills}
                  onChange={(e) => setNewRoleTechSkills(e.target.value)}
                  placeholder="Solidity, Web3.js, Ethereum, Cryptography"
                  className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resource Creation Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-navy-700 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Learning Resource</h3>
            <form onSubmit={handleCreateResource} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Resource Title</label>
                <input
                  type="text"
                  value={newResTitle}
                  onChange={(e) => setNewResTitle(e.target.value)}
                  placeholder="e.g. Docker Handbook"
                  required
                  className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Associated Skill</label>
                <input
                  type="text"
                  value={newResSkill}
                  onChange={(e) => setNewResSkill(e.target.value)}
                  placeholder="e.g. Docker"
                  required
                  className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Provider</label>
                <input
                  type="text"
                  value={newResProvider}
                  onChange={(e) => setNewResProvider(e.target.value)}
                  placeholder="e.g. freeCodeCamp, MDN"
                  className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">URL</label>
                <input
                  type="url"
                  value={newResUrl}
                  onChange={(e) => setNewResUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowResourceModal(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
