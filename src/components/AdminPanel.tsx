import React, { useState, useEffect } from 'react';
import { useLanguage } from '../lib/i18n';
import { 
  Lock, LayoutDashboard, UserCheck2, Rocket, Briefcase, Settings2, Code, Mail, Trash2, 
  CheckCircle, Plus, Edit2, Check, X, ShieldAlert, LogOut, ChevronRight, RefreshCw, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Experience, Technology, SoftSkill, ContactMessage, Profile, SEOSettings } from '../types';

export default function AdminPanel() {
  const { t } = useLanguage();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('gregoire-admin-token'));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'profile' | 'projects' | 'tech' | 'exp' | 'messages' | 'seo'>('stats');

  // Database lists
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [seo, setSeo] = useState<SEOSettings | null>(null);

  // Forms editing states
  const [editingTech, setEditingTech] = useState<Partial<Technology> | null>(null);
  const [editingProj, setEditingProj] = useState<Partial<Project> | null>(null);
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editingSeo, setEditingSeo] = useState<SEOSettings | null>(null);

  const [uiFeedback, setUiFeedback] = useState({ type: 'success', text: '' });
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  useEffect(() => {
    if (profile) {
      setUploadedFileName(profile.cvFileName || '');
    }
  }, [profile]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadCVFile(file);
  };

  const uploadCVFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      showFeedback('Please upload only PDF files.', 'error');
      return;
    }
    setFileUploading(true);
    try {
      const formData = new FormData();
      formData.append('cvFile', file);

      const res = await fetch('/api/cv/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        showFeedback(t('common.success'), 'success');
        setUploadedFileName(file.name);
        fetchAdminData();
      } else {
        const err = await res.json();
        showFeedback(err.error || 'Upload failed.', 'error');
      }
    } catch (err) {
      showFeedback('Upload endpoint communication failed.', 'error');
    } finally {
      setFileUploading(false);
    }
  };

  // Load all server states on tab activation or mount if authenticated
  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token, activeSubTab]);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setUiFeedback({ type, text });
    setTimeout(() => setUiFeedback({ type: 'success', text: '' }), 4000);
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const pRes = await fetch('/api/profile');
      const projRes = await fetch('/api/projects');
      const techRes = await fetch('/api/technologies');
      const expRes = await fetch('/api/experiences');
      const seoRes = await fetch('/api/seo');

      if (pRes.ok) setProfile(await pRes.json());
      if (projRes.ok) setProjects(await projRes.json());
      if (techRes.ok) setTechnologies(await techRes.json());
      if (expRes.ok) setExperiences(await expRes.json());
      if (seoRes.ok) setSeo(await seoRes.json());

      // Fetch private messages
      const headers = { 'Authorization': `Bearer ${token}` };
      const mRes = await fetch('/api/messages', { headers });
      if (mRes.ok) setMessages(await mRes.json());
    } catch (_) {
      showFeedback('Failed to synchronize database state.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('gregoire-admin-token', data.token);
        setToken(data.token);
        showFeedback('Authenticated correctly as administrator.');
      } else {
        setLoginError(data.error || 'Password verification rejected.');
      }
    } catch (_) {
      setLoginError('Could not contact authentication services.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (_) {}
    localStorage.removeItem('gregoire-admin-token');
    setToken(null);
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingProfile)
      });
      if (response.ok) {
        showFeedback(t('common.success'));
        fetchAdminData();
        setEditingProfile(null);
      }
    } catch (_) {
      showFeedback('Profile update rejected.', 'error');
    }
  };

  // SEO settings Save
  const handleSaveSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeo) return;
    try {
      const response = await fetch('/api/seo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editingSeo,
          keywords: typeof editingSeo.keywords === 'string' 
            ? (editingSeo.keywords as string).split(',').map((k: string) => k.trim()) 
            : editingSeo.keywords
        })
      });
      if (response.ok) {
        showFeedback(t('common.success'));
        fetchAdminData();
        setEditingSeo(null);
      }
    } catch (_) {
      showFeedback('SEO updates rejected.', 'error');
    }
  };

  // Tech actions
  const handleSaveTech = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTech) return;
    try {
      const isNew = !editingTech.id;
      const url = isNew ? '/api/technologies' : `/api/technologies/${editingTech.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingTech)
      });

      if (response.ok) {
        showFeedback(t('common.success'));
        setEditingTech(null);
        fetchAdminData();
      }
    } catch (_) {
      showFeedback('Technology CRUD operation failed.', 'error');
    }
  };

  const handleDeleteTech = async (id: string) => {
    if (!confirm('Confirm removal of this technology catalog?')) return;
    try {
      const response = await fetch(`/api/technologies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showFeedback('Technology row removed catalog successfully.');
        fetchAdminData();
      }
    } catch (_) {
      showFeedback('Technology deletion failed.', 'error');
    }
  };

  // Project actions
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj) return;
    try {
      const isNew = !editingProj.id;
      const url = isNew ? '/api/projects' : `/api/projects/${editingProj.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const formattedProj = {
        ...editingProj,
        technologies: typeof editingProj.technologies === 'string'
          ? (editingProj.technologies as string).split(',').map((t: string) => t.trim())
          : editingProj.technologies,
        images: typeof editingProj.images === 'string'
          ? (editingProj.images as string).split(',').map((i: string) => i.trim())
          : editingProj.images
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedProj)
      });

      if (response.ok) {
        showFeedback(t('common.success'));
        setEditingProj(null);
        fetchAdminData();
      }
    } catch (_) {
      showFeedback('Project creation/update process failed.', 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this project?')) return;
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showFeedback('Project deleted successfully.');
        fetchAdminData();
      }
    } catch (_) {
      showFeedback('Project deletion failed.', 'error');
    }
  };

  // Experience actions
  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    try {
      const isNew = !editingExp.id;
      const url = isNew ? '/api/experiences' : `/api/experiences/${editingExp.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const formattedExp = {
        ...editingExp,
        technologies: typeof editingExp.technologies === 'string'
          ? (editingExp.technologies as string).split(',').map((t: string) => t.trim())
          : editingExp.technologies
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedExp)
      });

      if (response.ok) {
        showFeedback(t('common.success'));
        setEditingExp(null);
        fetchAdminData();
      }
    } catch (_) {
      showFeedback('Experience transaction aborted.', 'error');
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!confirm('Confirm experience removal?')) return;
    try {
      const response = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showFeedback('Experience row removed successfully.');
        fetchAdminData();
      }
    } catch (_) {
      showFeedback('Error purging experience row.', 'error');
    }
  };

  // Message actions
  const handleMarkRead = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showFeedback('Message marked as read.');
        fetchAdminData();
      }
    } catch (_) {}
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Purge this message row from persistent database?')) return;
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showFeedback('Message row successfully deleted.');
        fetchAdminData();
      }
    } catch (_) {}
  };


  // ==========================================
  // VIEW: AUTHENTICATION LOCK SCREEN
  // ==========================================
  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 md:p-10 border border-zinc-800 bg-neutral-900/30 rounded-2xl luxury-glow relative overflow-hidden"
          id="admin-auth-panel"
        >
          {/* Decorative glowing gradient circle */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#d97736]/5 blur-3xl rounded-full" />

          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#d97736]/10 border border-[#d97736]/20 flex items-center justify-center text-[#d97736]">
              <Lock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-stone-900 dark:text-white font-display font-semibold text-base md:text-lg uppercase tracking-wider">
                {t('admin.loginTitle')}
              </h3>
              <p className="text-stone-500 dark:text-zinc-400 text-xs mt-1.5 leading-relaxed">
                {t('admin.loginSub')}
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="p-3.5 rounded-lg border border-red-500/10 bg-red-950/5 text-red-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label htmlFor="password-field" className="block text-stone-500 dark:text-zinc-400 text-[10px] uppercase font-mono tracking-widest mb-2 font-bold">
                {t('admin.passwordLabel')}
              </label>
              <input
                type="password"
                id="password-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-700/80 focus:outline-none focus:border-[#d97736]/85"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#d97736] to-[#c2410c] text-white py-3 px-6 rounded-xl text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-95 shadow-md shadow-[#d97736]/5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : t('admin.decryptBtn')}
            </button>
            
            <p className="text-center text-[10px] font-mono text-zinc-600 mt-4 leading-relaxed">
              Default Preview Mode Password: <span className="text-[#d97736] font-semibold bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900">gregoire2026</span>
            </p>
          </form>
        </motion.div>
      </div>
    );
  }

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  // ==========================================
  // VIEW: PRIMARY ADMIN CONTROLLERS
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative min-h-[90vh]">
      {/* Dynamic top UI Notification banner */}
      <AnimatePresence>
        {uiFeedback.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg border text-xs font-medium flex items-center gap-2.5 ${uiFeedback.type === 'error' ? 'bg-red-950/90 border-red-500/20 text-red-300' : 'bg-zinc-900/90 border-[#d97736]/20 text-[#d97736]'}`}
          >
            {uiFeedback.type === 'success' ? <Check className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            <span>{uiFeedback.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR NAVIGATION CONTROL */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-neutral-900/30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#d97736]/15 flex items-center justify-center border border-[#d97736]/20 text-[#d97736]">
                <UserCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-stone-900 dark:text-white text-xs font-semibold tracking-wider font-display uppercase">{t('admin.sidebarTitle')}</h4>
                <span className="text-[10px] font-mono text-stone-500 dark:text-zinc-505 uppercase tracking-widest block">{t('admin.sidebarRole')}</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 hover:text-red-750 dark:hover:text-red-300 transition-colors cursor-pointer border border-red-500/20"
              title={t('admin.logoutTooltip')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-neutral-900/20 space-y-1 shadow-sm">
            {[
              { id: 'stats', label: t('admin.menuOverview'), icon: LayoutDashboard },
              { id: 'profile', label: t('admin.menuBiography'), icon: UserCheck2 },
              { id: 'projects', label: t('admin.menuProjects'), icon: Rocket },
              { id: 'tech', label: t('admin.menuTechnologies'), icon: Code },
              { id: 'exp', label: t('admin.menuTimeline'), icon: Briefcase },
              { id: 'messages', label: t('admin.menuInbox'), icon: Mail, badge: unreadCount },
              { id: 'seo', label: t('admin.menuSEO'), icon: Settings2 }
            ].map((subTab) => {
              const isActive = activeSubTab === subTab.id;
              return (
                <button
                  key={subTab.id}
                  onClick={() => {
                    setActiveSubTab(subTab.id as any);
                    // Dismiss editors
                    setEditingExp(null);
                    setEditingProj(null);
                    setEditingTech(null);
                    setEditingProfile(null);
                    setEditingSeo(null);
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-between transition-colors cursor-pointer ${isActive ? 'bg-[#d97736] text-white shadow-md shadow-[#d97736]/10' : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400 hover:bg-stone-50 dark:hover:bg-neutral-900/60 dark:hover:text-white'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <subTab.icon className="w-4 h-4 shrink-0" />
                    <span>{subTab.label}</span>
                  </span>
                  {subTab.badge && subTab.badge > 0 ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${isActive ? 'bg-white text-black' : 'bg-red-500 text-white'}`}>
                      {subTab.badge}
                    </span>
                  ) : (
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-0.5 text-white' : 'text-stone-400 dark:text-zinc-650'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ADMIN DETAILS CONTAINER PANEL */}
        <main className="flex-1 min-w-0">
          <div className="p-8 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white/90 dark:bg-[#0c0a09]/50 backdrop-blur-md min-h-[550px] relative shadow-sm">
            {loading && !editingProj && !editingTech && !editingExp && (
              <div className="absolute inset-0 bg-white/40 dark:bg-black/40 flex items-center justify-center z-20 rounded-2xl">
                <RefreshCw className="w-6 h-6 text-[#d97736] animate-spin" />
              </div>
            )}

            {/* =========================================
                TAB VIEW: STATS OVERVIEW
                ========================================= */}
            {activeSubTab === 'stats' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <LayoutDashboard className="w-5 h-5 text-[#d97736]" />
                  <h3 className="text-stone-900 dark:text-white font-display font-semibold text-lg tracking-wider">
                    {t('admin.statsTitle')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: t('admin.statsProjects'), value: projects.length, icon: Rocket, label: t('admin.statsProjectsSub') },
                    { title: t('admin.statsTechs'), value: technologies.length, icon: Code, label: t('admin.statsTechsSub') },
                    { title: t('admin.statsExperiences'), value: experiences.length, icon: Briefcase, label: t('admin.statsExperiencesSub') },
                    { title: t('admin.statsPending'), value: unreadCount, icon: Mail, label: t('admin.statsPendingSub'), alert: unreadCount > 0 }
                  ].map((card, i) => (
                    <div key={i} className={`p-6 rounded-xl border ${card.alert ? 'border-red-500/20 bg-red-950/5' : 'border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-neutral-900/20'} luxury-glow flex flex-col justify-between h-36 shadow-sm`}>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 dark:text-zinc-500 text-[10px] font-mono uppercase tracking-widest">{card.title}</span>
                        <card.icon className={`w-4 h-4 ${card.alert ? 'text-red-500 animate-pulse' : 'text-[#d97736]'}`} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold font-display text-stone-900 dark:text-white mt-1">{card.value}</h4>
                        <p className="text-[10px] text-stone-500 dark:text-zinc-400 font-mono mt-1">{card.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Database Synchronization Integrity check panel */}
                <div className="p-6 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/40 dark:bg-neutral-900/20 mt-8 shadow-sm">
                  <h4 className="text-stone-900 dark:text-white text-xs font-semibold font-display tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#d97736]" />
                    {t('admin.integrityTitle')}
                  </h4>
                  <p className="text-stone-605 dark:text-zinc-400 text-xs leading-relaxed max-w-2xl font-sans">
                    {t('admin.integrityDesc')}
                  </p>
                </div>
              </div>
            )}

            {/* =========================================
                TAB VIEW: PROFILE EDITOR
                ========================================= */}
            {activeSubTab === 'profile' && profile && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 border-b border-stone-200 dark:border-zinc-850 pb-4">
                  <h3 className="text-stone-900 dark:text-white font-display font-semibold text-lg uppercase tracking-wider flex items-center gap-2">
                    <UserCheck2 className="w-5 h-5 text-[#d97736]" />
                    {t('admin.bioTitle')}
                  </h3>
                  {!editingProfile && (
                    <button
                      onClick={() => setEditingProfile({ ...profile })}
                      className="px-4 py-2 bg-stone-100 dark:bg-zinc-800 hover:bg-[#d97736] hover:text-white dark:hover:bg-zinc-700 text-stone-700 dark:text-white rounded-lg text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200 dark:border-zinc-700"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      {t('admin.editBtn')}
                    </button>
                  )}
                </div>

                {!editingProfile ? (
                  <div className="space-y-6 text-xs text-stone-700 dark:text-zinc-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 dark:bg-neutral-900/10 p-5 rounded-2xl border border-stone-200 dark:border-zinc-900 shadow-xs">
                      <div>
                        <span className="text-stone-400 dark:text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-1">Full Display Name</span>
                        <p className="text-stone-900 dark:text-white text-sm font-semibold">{profile.fullname}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 dark:text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-1">Current Job Title</span>
                        <p className="text-stone-900 dark:text-white text-sm font-semibold">{profile.title}</p>
                      </div>
                      <div className="mt-2">
                        <span className="text-stone-400 dark:text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-1">Geographic Location</span>
                        <p className="text-stone-900 dark:text-white text-sm font-semibold">{profile.location}</p>
                      </div>
                      <div className="mt-2">
                        <span className="text-stone-400 dark:text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-1">Recruitment Availability</span>
                        <p className="text-stone-900 dark:text-white text-sm font-semibold capitalize">{profile.availability}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-500 dark:text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-2">{t('admin.bioSummary')}</span>
                      <p className="bg-stone-50 dark:bg-neutral-950 p-5 rounded-xl border border-stone-200 dark:border-zinc-900 text-stone-800 dark:text-zinc-350 leading-relaxed font-sans text-xs shadow-sm">
                        {profile.biography}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-stone-500 dark:text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-1">{t('admin.bioGithub')}</span>
                        <p className="text-stone-700 dark:text-zinc-300 font-mono truncate">{profile.socials.github}</p>
                      </div>
                      <div>
                        <span className="text-stone-500 dark:text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-1">{t('admin.bioLinkedin')}</span>
                        <p className="text-stone-700 dark:text-zinc-300 font-mono truncate">{profile.socials.linkedin}</p>
                      </div>
                      <div className="mt-2">
                        <span className="text-stone-500 dark:text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-1">{t('admin.bioPicture')}</span>
                        <div className="flex items-center gap-3 mt-1 bg-stone-50 dark:bg-zinc-950/40 p-2.5 rounded-lg border border-stone-200 dark:border-zinc-900 shadow-sm">
                          {profile.profilePicture && (
                            <img src={profile.profilePicture} alt="Avatar profile" className="w-10 h-10 rounded-lg object-cover border border-stone-200 dark:border-zinc-800" />
                          )}
                          <p className="text-stone-700 dark:text-zinc-300 font-mono truncate text-[11px] flex-1">{profile.profilePicture}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-stone-500 dark:text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-1">
                          {t('admin.bioCv')}
                        </span>
                        <div className="flex flex-col gap-2 mt-1 bg-stone-50 dark:bg-zinc-950/40 p-3 rounded-lg border border-stone-200 dark:border-zinc-900 min-h-[62px] shadow-sm">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[#d97736] font-mono truncate text-xs font-semibold flex-1">
                              {profile.cvUrl ? (
                                <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1.5">
                                  {profile.cvFileName || profile.cvUrl}
                                </a>
                              ) : (
                                t('admin.noCv')
                              )}
                            </p>
                            {profile.cvUrl && (
                              <a
                                href="/api/cv/download"
                                className="px-2.5 py-1 bg-stone-200 dark:bg-zinc-850 hover:bg-stone-300 dark:hover:bg-zinc-800 text-stone-750 dark:text-zinc-200 rounded text-[10px] font-mono font-bold tracking-wider uppercase border border-stone-300 dark:border-zinc-700"
                              >
                                Download
                              </a>
                            )}
                          </div>

                          <div className="mt-2 pt-2 border-t border-stone-200 dark:border-zinc-900/60 flex items-center gap-2">
                            <label className="cursor-pointer text-[10px] font-mono font-bold bg-[#d97736] hover:bg-[#c2410c] text-white px-3 py-1.5 rounded transition-all flex items-center gap-1 shrink-0 shadow-sm">
                              <span>{fileUploading ? t('admin.savingFeedback') : t('admin.bioCvUpload')}</span>
                              <input 
                                type="file" 
                                accept="application/pdf" 
                                onChange={handleFileChange} 
                                className="hidden" 
                                disabled={fileUploading}
                              />
                            </label>
                            {uploadedFileName && (
                              <span className="text-[10px] font-mono text-stone-500 dark:text-zinc-400 truncate max-w-[180px]">
                                {uploadedFileName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-500 dark:text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Fullname</label>
                        <input
                          type="text"
                          value={editingProfile.fullname}
                          onChange={(e) => setEditingProfile({ ...editingProfile, fullname: e.target.value })}
                          className="w-full bg-white dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-700 focus:outline-none focus:border-[#d97736]/75"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 dark:text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Job Title</label>
                        <input
                          type="text"
                          value={editingProfile.title}
                          onChange={(e) => setEditingProfile({ ...editingProfile, title: e.target.value })}
                          className="w-full bg-white dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-700 focus:outline-none focus:border-[#d97736]/75"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-500 dark:text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Location</label>
                        <input
                          type="text"
                          value={editingProfile.location}
                          onChange={(e) => setEditingProfile({ ...editingProfile, location: e.target.value })}
                          className="w-full bg-white dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-700 focus:outline-none focus:border-[#d97736]/75"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 dark:text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Availability</label>
                        <select
                          value={editingProfile.availability}
                          onChange={(e) => setEditingProfile({ ...editingProfile, availability: e.target.value as any })}
                          className="w-full bg-white dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-stone-850 dark:text-zinc-300 focus:outline-none focus:border-[#d97736]/75 cursor-pointer"
                        >
                          <option value="available">Available for Work</option>
                          <option value="busy">Busy / Engaged</option>
                          <option value="rest">On Sabbatical</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-500 dark:text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Biography</label>
                      <textarea
                        value={editingProfile.biography}
                        onChange={(e) => setEditingProfile({ ...editingProfile, biography: e.target.value })}
                        rows={6}
                        className="w-full bg-white dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-lg p-3.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-700 focus:outline-none focus:border-[#d97736]/75 resize-none leading-relaxed"
                      />
                    </div>

                    <h4 className="text-stone-900 dark:text-white text-xs font-semibold font-display tracking-wider border-b border-stone-200 dark:border-zinc-900 pb-2.5 pt-3 uppercase">Social links, profile picture & resume file</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-500 dark:text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">{t('admin.bioGithub')}</label>
                        <input
                          type="text"
                          value={editingProfile.socials.github}
                          onChange={(e) => setEditingProfile({ 
                            ...editingProfile, 
                            socials: { ...editingProfile.socials, github: e.target.value } 
                          })}
                          className="w-full bg-white dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#d97736]/75"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 dark:text-zinc-505 text-[10px] uppercase font-mono tracking-widest mb-1">{t('admin.bioLinkedin')}</label>
                        <input
                          type="text"
                          value={editingProfile.socials.linkedin}
                          onChange={(e) => setEditingProfile({ 
                            ...editingProfile, 
                            socials: { ...editingProfile.socials, linkedin: e.target.value } 
                          })}
                          className="w-full bg-white dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#d97736]/75"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 dark:text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">{t('admin.bioPicture')}</label>
                        <input
                          type="text"
                          value={editingProfile.profilePicture}
                          onChange={(e) => setEditingProfile({ 
                            ...editingProfile, 
                            profilePicture: e.target.value
                          })}
                          className="w-full bg-white dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#d97736]/75"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 dark:text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">CV Direct Access URI</label>
                        <input
                          type="text"
                          value={editingProfile.cvUrl || ''}
                          onChange={(e) => setEditingProfile({ 
                            ...editingProfile, 
                            cvUrl: e.target.value
                          })}
                          className="w-full bg-white dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#d97736]/75"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3.5 pt-4 border-t border-stone-200 dark:border-zinc-900">
                      <button
                        type="button"
                        onClick={() => setEditingProfile(null)}
                        className="px-4 py-2 border border-stone-200 dark:border-zinc-800 rounded-lg text-xs font-semibold tracking-wider text-stone-500 dark:text-zinc-400 hover:bg-stone-50 dark:hover:bg-zinc-900"
                      >
                        {t('admin.cancelBtn')}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#d97736] hover:bg-[#c2410c] text-white font-semibold text-xs rounded-lg tracking-wider shadow-sm cursor-pointer"
                      >
                        {t('admin.saveBtn')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* =========================================
                TAB VIEW: PROJECTS CRUD
                ========================================= */}
            {activeSubTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-850 pb-4">
                  <h3 className="text-white font-display font-semibold text-lg uppercase tracking-wider flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-[#d97736]" />
                    Projects CRUD Manager
                  </h3>
                  {!editingProj && (
                    <button
                      onClick={() => setEditingProj({
                        title: '', slug: '', shortDescription: '', fullDescription: '',
                        images: [''], technologies: [''], category: 'web', featured: false,
                        githubUrl: '', liveUrl: '', startDate: new Date().toISOString().substring(0, 10)
                      })}
                      className="px-4 py-2 bg-[#d97736] hover:bg-[#c2410c] text-white rounded-lg text-xs font-bold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      {t('common.add')}
                    </button>
                  )}
                </div>

                {!editingProj ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs text-zinc-300">
                      <thead>
                        <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-widest text-[9px] font-mono select-none">
                          <th className="py-3 px-4">Title</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Featured</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-950/40">
                        {projects.map((proj) => (
                          <tr key={proj.id} className="hover:bg-neutral-900/40 transition-colors">
                            <td className="py-4 px-4 font-semibold text-white">{proj.title}</td>
                            <td className="py-4 px-4 font-mono capitalize text-zinc-400">{proj.category}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold leading-none ${proj.featured ? 'bg-[#d97736]/10 text-[#d97736] border border-[#d97736]/20' : 'bg-zinc-900 text-zinc-500'}`}>
                                {proj.featured ? 'Featured' : 'Standard'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right space-x-2">
                              <button
                                onClick={() => setEditingProj({ 
                                  ...proj,
                                  technologies: proj.technologies.join(', ') as any,
                                  images: proj.images.join(', ') as any
                                })}
                                className="p-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md font-semibold font-mono text-[10px] transition-all cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProject(proj.id)}
                                className="p-1 px-2 text-red-500 bg-red-950/10 hover:bg-red-950/20 rounded-md font-mono text-[10px] transition-all cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Project Title</label>
                        <input
                          type="text"
                          value={editingProj.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                            setEditingProj({ ...editingProj, title: val, slug });
                          }}
                          placeholder="e.g. Nova Platform"
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Dynamic Safe Slug</label>
                        <input
                          type="text"
                          value={editingProj.slug}
                          onChange={(e) => setEditingProj({ ...editingProj, slug: e.target.value })}
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-[#d97736]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Project Category</label>
                        <select
                          value={editingProj.category}
                          onChange={(e) => setEditingProj({ ...editingProj, category: e.target.value as any })}
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-[#d97736]"
                        >
                          <option value="web">Web App</option>
                          <option value="mobile">Mobile Application</option>
                          <option value="saas">SaaS Solution</option>
                          <option value="opensource">Open Source System</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Start Date</label>
                        <input
                          type="date"
                          value={editingProj.startDate}
                          onChange={(e) => setEditingProj({ ...editingProj, startDate: e.target.value })}
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Featured Flag</label>
                        <select
                          value={editingProj.featured ? 'true' : 'false'}
                          onChange={(e) => setEditingProj({ ...editingProj, featured: e.target.value === 'true' })}
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-[#d97736]"
                        >
                          <option value="false">Standard / Default</option>
                          <option value="true">Featured Product</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Short Preview Statement</label>
                      <input
                        type="text"
                        value={editingProj.shortDescription}
                        onChange={(e) => setEditingProj({ ...editingProj, shortDescription: e.target.value })}
                        placeholder="Luxurious suite featuring real-time insights..."
                        className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Complex Complete Description</label>
                      <textarea
                        value={editingProj.fullDescription}
                        onChange={(e) => setEditingProj({ ...editingProj, fullDescription: e.target.value })}
                        rows={4}
                        placeholder="Detailed technical overview and challenges resolved..."
                        className="w-full bg-neutral-950 border border-zinc-800 rounded-lg p-3 text-xs text-white focus:outline-[#d97736] resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Project Images (Comma lists of URLs)</label>
                      <input
                        type="text"
                        value={editingProj.images as any}
                        onChange={(e) => setEditingProj({ ...editingProj, images: e.target.value as any })}
                        placeholder="e.g. https://image1.png, https://image2.jpg"
                        className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Technologies tags (Comma lists of names)</label>
                      <input
                        type="text"
                        value={editingProj.technologies as any}
                        onChange={(e) => setEditingProj({ ...editingProj, technologies: e.target.value as any })}
                        placeholder="e.g. React, Node.js, Express, MongoDB, D3"
                        className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">GitHub Repo URL</label>
                        <input
                          type="url"
                          value={editingProj.githubUrl}
                          onChange={(e) => setEditingProj({ ...editingProj, githubUrl: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Live Applications Deploy URL</label>
                        <input
                          type="url"
                          value={editingProj.liveUrl}
                          onChange={(e) => setEditingProj({ ...editingProj, liveUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3.5 pt-4 border-t border-zinc-900">
                      <button
                        type="button"
                        onClick={() => setEditingProj(null)}
                        className="px-4 py-2 border border-zinc-800 rounded-lg text-xs font-semibold tracking-wider text-zinc-400 hover:bg-zinc-900"
                      >
                        {t('common.cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#d97736] hover:bg-[#c2410c] text-white font-semibold text-xs rounded-lg tracking-wider"
                      >
                        {t('common.save')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* =========================================
                TAB VIEW: TECHNOLOGIES CRUD
                ========================================= */}
            {activeSubTab === 'tech' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-850 pb-4">
                  <h3 className="text-white font-display font-semibold text-lg uppercase tracking-wider flex items-center gap-2">
                    <Code className="w-5 h-5 text-[#d97736]" />
                    Technologies Core Master List
                  </h3>
                  {!editingTech && (
                    <button
                      onClick={() => setEditingTech({ name: '', proficiency: 80, yearsExperience: 1, category: 'frontend' })}
                      className="px-4 py-2 bg-[#d97736] hover:bg-[#c2410c] text-white rounded-lg text-xs font-bold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      {t('common.add')}
                    </button>
                  )}
                </div>

                {!editingTech ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs text-zinc-300">
                      <thead>
                        <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-widest text-[9px] font-mono select-none">
                          <th className="py-2.5 px-4 animate-slide-up">Tech Name</th>
                          <th className="py-2.5 px-4">Category</th>
                          <th className="py-2.5 px-4">Proficiency</th>
                          <th className="py-2.5 px-4">Experience (Years)</th>
                          <th className="py-2.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-950/40">
                        {technologies.map((tech) => (
                          <tr key={tech.id} className="hover:bg-neutral-900/40 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-white">{tech.name}</td>
                            <td className="py-3.5 px-4 font-mono capitalize text-[#d97736]">{tech.category}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold font-mono text-xs">{tech.proficiency}%</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono">{tech.yearsExperience} yrs</td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => setEditingTech(tech)}
                                className="p-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md font-semibold font-mono text-[10px] cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTech(tech.id)}
                                className="p-1 px-2 text-red-400 bg-red-950/10 hover:bg-red-950/20 rounded-md font-mono text-[10px] cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <form onSubmit={handleSaveTech} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up">
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Technology Name</label>
                        <input
                          type="text"
                          value={editingTech.name}
                          onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })}
                          placeholder="e.g. Next.js 15"
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-[10px] uppercase font-mono tracking-widest mb-1">Taxonomy Category</label>
                        <select
                          value={editingTech.category}
                          onChange={(e) => setEditingTech({ ...editingTech, category: e.target.value as any })}
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-[#d97736]"
                        >
                          <option value="frontend">Frontend Stack</option>
                          <option value="backend">Backend Logic</option>
                          <option value="database">Database Core</option>
                          <option value="mobile">Mobile Deploy</option>
                          <option value="devops">DevOps pipelines</option>
                          <option value="tools">Utility tools</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Proficiency Rate (0-100%)</label>
                        <input
                          type="number"
                          min="10"
                          max="100"
                          value={editingTech.proficiency}
                          onChange={(e) => setEditingTech({ ...editingTech, proficiency: Number(e.target.value) })}
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Total Years Experience</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={editingTech.yearsExperience}
                          onChange={(e) => setEditingTech({ ...editingTech, yearsExperience: Number(e.target.value) })}
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3.5 pt-4 border-t border-zinc-900">
                      <button
                        type="button"
                        onClick={() => setEditingTech(null)}
                        className="px-4 py-2 border border-zinc-800 rounded-lg text-xs font-semibold tracking-wider text-zinc-400 hover:bg-zinc-900"
                      >
                        {t('common.cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#d97736] hover:bg-[#c2410c] text-white font-semibold text-xs rounded-lg tracking-wider"
                      >
                        {t('common.save')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* =========================================
                TAB VIEW: EXPERIENCES CRUD
                ========================================= */}
            {activeSubTab === 'exp' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-850 pb-4">
                  <h3 className="text-white font-display font-semibold text-lg uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#d97736]" />
                    Timeline Experience Records
                  </h3>
                  {!editingExp && (
                    <button
                      onClick={() => setEditingExp({
                        company: '', role: '', description: '', technologies: [''],
                        startDate: new Date().toISOString().substring(0, 7)
                      })}
                      className="px-4 py-2 bg-[#d97736] hover:bg-[#c2410c] text-white rounded-lg text-xs font-bold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      {t('common.add')}
                    </button>
                  )}
                </div>

                {!editingExp ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs text-zinc-300">
                      <thead>
                        <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-widest text-[9px] font-mono select-none">
                          <th className="py-2.5 px-4 animate-slide-up col-span-2">Company / Role</th>
                          <th className="py-2.5 px-4">Start Block</th>
                          <th className="py-2.5 px-4">End Block</th>
                          <th className="py-2.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-950/40">
                        {experiences.map((exp) => (
                          <tr key={exp.id} className="hover:bg-neutral-900/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-white block">{exp.company}</span>
                              <span className="text-zinc-500 text-[10px] font-mono leading-none mt-1">{exp.role}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono">{exp.startDate}</td>
                            <td className="py-3.5 px-4 font-mono">{exp.endDate || 'Active'}</td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => setEditingExp({
                                  ...exp,
                                  technologies: exp.technologies.join(', ') as any
                                })}
                                className="p-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md font-semibold font-mono text-[10px] cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteExp(exp.id)}
                                className="p-1 px-2 text-red-400 bg-red-950/10 hover:bg-red-950/20 rounded-md font-mono text-[10px] cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <form onSubmit={handleSaveExp} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up">
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Company Entity</label>
                        <input
                          type="text"
                          value={editingExp.company}
                          onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                          placeholder="e.g. Acme Labs"
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Engineering Role</label>
                        <input
                          type="text"
                          value={editingExp.role}
                          onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                          placeholder="e.g. Junior Systems Lead"
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Start Month/Year</label>
                        <input
                          type="text"
                          value={editingExp.startDate}
                          onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                          placeholder="e.g. Jun 2025"
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">End Month/Year (Leave empty if active)</label>
                        <input
                          type="text"
                          value={editingExp.endDate || ''}
                          onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value || undefined })}
                          placeholder="e.g. Dec 2025"
                          className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Description Accomplishments</label>
                      <textarea
                        value={editingExp.description}
                        onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                        rows={4}
                        placeholder="Detail responsibility and tech challenges resolved..."
                        className="w-full bg-neutral-950 border border-zinc-800 rounded-lg p-3 text-xs text-white focus:outline-[#d97736] resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Technologies tags context (Comma lists)</label>
                      <input
                        type="text"
                        value={editingExp.technologies as any}
                        onChange={(e) => setEditingExp({ ...editingExp, technologies: e.target.value as any })}
                        placeholder="e.g. React, Node.js, Express, Docker"
                        className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-[#d97736]"
                      />
                    </div>

                    <div className="flex justify-end gap-3.5 pt-4 border-t border-zinc-900">
                      <button
                        type="button"
                        onClick={() => setEditingExp(null)}
                        className="px-4 py-2 border border-zinc-800 rounded-lg text-xs font-semibold tracking-wider text-zinc-400 hover:bg-zinc-900"
                      >
                        {t('common.cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#d97736] hover:bg-[#c2410c] text-white font-semibold text-xs rounded-lg tracking-wider"
                      >
                        {t('common.save')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* =========================================
                TAB VIEW: MESSAGE INBOX (Inbox messages count, unread/read CRUD)
                ========================================= */}
            {activeSubTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-850 pb-4">
                  <h3 className="text-white font-display font-semibold text-lg uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#d97736]" />
                    Recruiter Request Inbox
                  </h3>
                  <span className="px-3 py-1 bg-red-950/20 text-red-400 text-[10px] font-mono font-bold uppercase rounded-full border border-red-500/10">
                    {unreadCount} UNREAD INCOMING
                  </span>
                </div>

                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-zinc-600 font-mono text-xs border border-zinc-900 rounded-xl bg-neutral-950/20">
                      Inbox database store is currently empty.
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-6 rounded-xl border relative transition-all ${msg.status === 'unread' ? 'border-[#d97736]/30 bg-[#d97736]/3' : 'border-zinc-850 bg-neutral-950/10 hover-glow'}`}
                      >
                        {msg.status === 'unread' && (
                          <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#d97736] animate-ping" />
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 select-none">
                          <div>
                            <span className="text-white text-xs font-bold">{msg.name}</span>
                            <span className="text-zinc-500 text-[10px] font-mono ml-2">({msg.email})</span>
                          </div>
                          <span className="text-zinc-600 font-mono text-[9px]">{new Date(msg.createdAt).toLocaleString()}</span>
                        </div>

                        <p className="text-zinc-400 text-[10.5px] uppercase font-mono tracking-widest mt-1 mb-2 font-bold">
                          SUJET: {msg.subject}
                        </p>
                        <p className="text-zinc-300 text-xs leading-relaxed bg-[#0c0a09]/40 p-4 rounded-lg border border-zinc-950/80 whitespace-pre-line font-sans">
                          {msg.message}
                        </p>

                        <div className="flex justify-end gap-3.5 mt-4 pt-3 border-t border-zinc-950/40">
                          {msg.status === 'unread' && (
                            <button
                              onClick={() => handleMarkRead(msg.id)}
                              className="px-3 py-1.5 rounded bg-[#d97736]/10 text-[#d97736] text-[10px] font-semibold border border-[#d97736]/15 flex items-center gap-1 hover:bg-[#d97736]/20 transition-all cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="px-3 py-1.5 rounded bg-red-950/10 text-red-400 text-[10px] font-semibold border border-red-500/10 flex items-center gap-1 hover:bg-red-950/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* =========================================
                TAB VIEW: SEO ADJUSTMENT
                ========================================= */}
            {activeSubTab === 'seo' && seo && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-850 pb-4">
                  <h3 className="text-white font-display font-semibold text-lg uppercase tracking-wider flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-[#d97736]" />
                    Enterprise-Grade SEO Parameters
                  </h3>
                  {!editingSeo && (
                    <button
                      onClick={() => setEditingSeo({
                        siteTitle: seo.siteTitle,
                        metaDescription: seo.metaDescription,
                        keywords: (Array.isArray(seo.keywords) ? seo.keywords.join(', ') : seo.keywords) as any,
                        ogImage: seo.ogImage
                      })}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Configure SEO meta
                    </button>
                  )}
                </div>

                {!editingSeo ? (
                  <div className="space-y-5 text-xs text-zinc-300">
                    <div className="bg-neutral-900/10 p-5 rounded-2xl border border-zinc-900 space-y-4">
                      <div>
                        <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-1">Default Site Document Title</span>
                        <p className="text-white text-sm font-semibold">{seo.siteTitle}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-1">Global Meta Description</span>
                        <p className="text-zinc-300 font-sans leading-relaxed">{seo.metaDescription}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-1">Site Search Tags / Keywords</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {seo.keywords.map((kw, i) => (
                            <span key={i} className="px-2.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 font-mono">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveSEO} className="space-y-5">
                    <div>
                      <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Site Title Tag</label>
                      <input
                        type="text"
                        value={editingSeo.siteTitle}
                        onChange={(e) => setEditingSeo({ ...editingSeo, siteTitle: e.target.value })}
                        className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-[#d97736]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1">Meta Description</label>
                      <textarea
                        value={editingSeo.metaDescription}
                        onChange={(e) => setEditingSeo({ ...editingSeo, metaDescription: e.target.value })}
                        rows={4}
                        className="w-full bg-neutral-950 border border-zinc-800 rounded-lg p-3.5 text-xs text-white focus:outline-[#d97736] resize-none leading-relaxed"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 text-[10px] uppercase font-mono tracking-widest mb-1">Keywords Tags (Comma list)</label>
                      <input
                        type="text"
                        value={editingSeo.keywords as any}
                        onChange={(e) => setEditingSeo({ ...editingSeo, keywords: e.target.value as any })}
                        placeholder="e.g. Grégoire Batcho, Full Stack Developer, Paris"
                        className="w-full bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-[#d97736]"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-3.5 pt-4 border-t border-zinc-900">
                      <button
                        type="button"
                        onClick={() => setEditingSeo(null)}
                        className="px-4 py-2 border border-zinc-800 rounded-lg text-xs font-semibold tracking-wider text-zinc-400 hover:bg-zinc-900"
                      >
                        {t('common.cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#d97736] hover:bg-[#c2410c] text-white font-semibold text-xs rounded-lg tracking-wider"
                      >
                        {t('common.save')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
