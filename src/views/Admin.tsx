import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useLanguage } from '../LanguageContext.js';
import { Project, ContactMessage } from '../types.js';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Terminal, Loader2, LogOut, Plus, Trash2, Edit3, 
  Mail, MailOpen, Calendar, Star, FolderGit, Check, Tag, Info, ShieldCheck,
  Briefcase, Wrench, FileText, Upload, Download, Globe, GraduationCap
} from 'lucide-react';

export default function Admin() {
  const { lang, t } = { lang: 'fr', t: useLanguage().t }; // Standard dictionary fallback
  const appLanguageContext = useLanguage();

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('portfolio-admin-token'));
  const [passcode, setPasscode] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard workspace states
  const [activeTab, setActiveTab] = useState<'projects' | 'experiences' | 'technologies' | 'profile' | 'messages'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({
    name: '',
    email: '',
    phone: '',
    titleEn: '',
    titleFr: '',
    bioEn: '',
    bioFr: '',
    aboutBioEn: '',
    aboutBioFr: '',
    avatarUrl: '',
    cvName: '',
  });
  const [loadingData, setLoadingData] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  // Project Forms states
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    slug: '',
    shortDescriptionFr: '',
    shortDescriptionEn: '',
    descriptionFr: '',
    descriptionEn: '',
    image: '',
    githubUrl: '',
    liveUrl: '',
    tags: '',
    category: 'fullstack' as 'frontend' | 'backend' | 'fullstack',
    isFeatured: false,
    order: 0
  });

  // Experience Forms states
  const [experienceFormOpen, setExperienceFormOpen] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [experienceFormData, setExperienceFormData] = useState({
    periodEn: '',
    periodFr: '',
    roleEn: '',
    roleFr: '',
    company: '',
    descriptionEn: '',
    descriptionFr: '',
    skills: '',
    type: 'work' as 'work' | 'education',
    order: 0
  });

  // Technology Forms states
  const [techFormOpen, setTechFormOpen] = useState(false);
  const [editingTechId, setEditingTechId] = useState<string | null>(null);
  const [techFormData, setTechFormData] = useState({
    name: '',
    category: 'frontend' as 'frontend' | 'backend' | 'tools' | 'database',
    icon: '',
    level: 80,
    order: 0
  });

  useEffect(() => {
    document.title = lang === 'fr' ? 'Console d’Administration — Grégoire BATCHO' : 'Admin Workspace Console — Grégoire BATCHO';
    if (token) {
      loadDashboardContent();
    }
  }, [token, lang]);

  const loadDashboardContent = async () => {
    setLoadingData(true);
    try {
      // Load all dynamic components in parallel from back-end REST APIs
      const [projRes, msgRes, expRes, techRes, profRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/contacts', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/experiences'),
        fetch('/api/technologies'),
        fetch('/api/profile')
      ]);

      if (projRes.ok) {
        const pData = await projRes.json();
        if (Array.isArray(pData)) setProjects(pData);
      }

      if (msgRes.ok) {
        const mData = await msgRes.json();
        if (Array.isArray(mData)) setMessages(mData);
      } else if (msgRes.status === 403 || msgRes.status === 401) {
        // Token session expired
        handleLogout();
        return;
      }

      if (expRes.ok) {
        const eData = await expRes.json();
        if (Array.isArray(eData)) setExperiences(eData);
      }

      if (techRes.ok) {
        const tData = await techRes.json();
        if (Array.isArray(tData)) setTechnologies(tData);
      }

      if (profRes.ok) {
        const prData = await profRes.json();
        if (prData && !prData.error) setProfile(prData);
      }
    } catch (err) {
      console.error('Error loading admin values:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ passcode })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('portfolio-admin-token', data.token);
        setToken(data.token);
        setPasscode('');
      } else {
        const errorData = await res.json();
        setLoginError(errorData.error || 'Access Denied.');
      }
    } catch (err) {
      setLoginError('Server connection issue. Try again later.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio-admin-token');
    setToken(null);
    setProjects([]);
    setMessages([]);
    setExperiences([]);
    setTechnologies([]);
  };

  // Contacts operations
  const markMessageAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, isRead: true } : msg))
        );
      }
    } catch (err) {
      console.error('Failed toggling read state:', err);
    }
  };

  // Projects operations
  const openNewProjectForm = () => {
    setEditingProjectId(null);
    setProjectFormData({
      title: '',
      slug: '',
      shortDescriptionFr: '',
      shortDescriptionEn: '',
      descriptionFr: '',
      descriptionEn: '',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      githubUrl: '',
      liveUrl: '',
      tags: '',
      category: 'fullstack',
      isFeatured: false,
      order: projects.length + 1
    });
    setProjectFormOpen(true);
  };

  const openEditProjectForm = (project: Project) => {
    setEditingProjectId(project._id || project.slug);
    setProjectFormData({
      title: project.title,
      slug: project.slug,
      shortDescriptionFr: project.shortDescriptionFr,
      shortDescriptionEn: project.shortDescriptionEn,
      descriptionFr: project.descriptionFr,
      descriptionEn: project.descriptionEn,
      image: project.image,
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      tags: project.tags?.join(', ') || '',
      category: project.category,
      isFeatured: !!project.isFeatured,
      order: project.order
    });
    setProjectFormOpen(true);
  };

  const handleProjectSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectFormData.title || !projectFormData.slug) return;

    const payload = {
      ...projectFormData,
      tags: projectFormData.tags.split(',').map((t) => t.trim()).filter(Boolean)
    };

    const url = editingProjectId 
      ? `/api/projects/${editingProjectId}` 
      : '/api/projects';
    const method = editingProjectId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setProjectFormOpen(false);
        loadDashboardContent();
      } else {
        const err = await res.json();
        alert(`Error saving alterations: ${err.error || 'Check fields.'}`);
      }
    } catch (error) {
      console.error('Failed submitting changes:', error);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm(appLanguageContext.t.adminProjectDeleteWarning)) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        loadDashboardContent();
      }
    } catch (err) {
      console.error('Failed deleting project:', err);
    }
  };

  // --- EXPERIENCES CRUD OPERATIONAL HANDLERS ---
  const openNewExperienceForm = () => {
    setEditingExperienceId(null);
    setExperienceFormData({
      periodEn: '',
      periodFr: '',
      roleEn: '',
      roleFr: '',
      company: '',
      descriptionEn: '',
      descriptionFr: '',
      skills: '',
      type: 'work',
      order: experiences.length + 1
    });
    setExperienceFormOpen(true);
  };

  const openEditExperienceForm = (exp: any) => {
    setEditingExperienceId(exp._id);
    setExperienceFormData({
      periodEn: exp.periodEn,
      periodFr: exp.periodFr,
      roleEn: exp.roleEn,
      roleFr: exp.roleFr,
      company: exp.company,
      descriptionEn: exp.descriptionEn,
      descriptionFr: exp.descriptionFr,
      skills: Array.isArray(exp.skills) ? exp.skills.join(', ') : exp.skills || '',
      type: exp.type || 'work',
      order: exp.order || 0
    });
    setExperienceFormOpen(true);
  };

  const handleExperienceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...experienceFormData,
      skills: experienceFormData.skills.split(',').map(s => s.trim()).filter(Boolean)
    };
    const url = editingExperienceId ? `/api/experiences/${editingExperienceId}` : '/api/experiences';
    const method = editingExperienceId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setExperienceFormOpen(false);
        loadDashboardContent();
      } else {
        const err = await res.json();
        alert(`Error saving experience: ${err.error || 'Failed'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteExperience = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet jalon d’expérience ?')) return;
    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) loadDashboardContent();
    } catch (err) {
      console.error(err);
    }
  };

  // --- TECHNOLOGIES CRUD OPERATIONAL HANDLERS ---
  const openNewTechForm = () => {
    setEditingTechId(null);
    setTechFormData({
      name: '',
      category: 'frontend',
      icon: '',
      level: 80,
      order: technologies.length + 1
    });
    setTechFormOpen(true);
  };

  const openEditTechForm = (tech: any) => {
    setEditingTechId(tech._id);
    setTechFormData({
      name: tech.name,
      category: tech.category || 'frontend',
      icon: tech.icon || '',
      level: tech.level || 80,
      order: tech.order || 0
    });
    setTechFormOpen(true);
  };

  const handleTechSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingTechId ? `/api/technologies/${editingTechId}` : '/api/technologies';
    const method = editingTechId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(techFormData)
      });
      if (res.ok) {
        setTechFormOpen(false);
        loadDashboardContent();
      } else {
        const err = await res.json();
        alert(`Error saving technology: ${err.error || 'Failed'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTech = async (id: string) => {
    if (!confirm('Voulez-vous supprimer cette technologie ?')) return;
    try {
      const res = await fetch(`/api/technologies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) loadDashboardContent();
    } catch (err) {
      console.error(err);
    }
  };

  // --- SYSTEM PROFILE & CV FILE UPLOADER ENCODING ---
  const handleCvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1] || base64String;
      setProfile((prev: any) => ({
        ...prev,
        cvName: file.name,
        cvData: base64Data
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        alert(appLanguageContext.lang === 'fr' ? 'Informations personnelles et CV sauvegardés avec succès !' : 'Profile details and resume updated successfully!');
        loadDashboardContent();
      } else {
        const err = await res.json();
        alert(`Error state: ${err.error || 'Failed to sync modifications.'}`);
      }
    } catch (err) {
      console.error('Failed profile sync:', err);
    } finally {
      setProfileSaving(false);
    }
  };

  // Derived unread counters
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Background visual spotlight */}
      <div className="glow-spot w-[350px] h-[350px] bg-copper-600/5 top-24 left-10" />

      {/* ---------------- 1. SECURITY PASSCODE GATE ---------------- */}
      <AnimatePresence>
        {!token && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-md mx-auto relative z-10 pt-12"
          >
            <form onSubmit={handleLogin} className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-copper-500/10 border border-copper-500/30 flex items-center justify-center mx-auto shadow-md">
                  <Lock className="w-5 h-5 text-copper-400" />
                </div>
                <h2 className="text-xl font-bold font-display text-white tracking-tight">
                  {appLanguageContext.t.adminLoginTitle}
                </h2>
                <p className="text-xs text-zinc-500">
                  {appLanguageContext.lang === 'fr' 
                    ? 'Cette section sécurisée gère les entrées de projets et la boîte de réception.' 
                    : 'This secure view handles project details insertions and contact messages.'}
                </p>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <label className="text-zinc-500 uppercase tracking-wider block">
                  {appLanguageContext.t.adminLoginPasscode}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-zinc-950 border border-white/5 focus:border-copper-500 focus:shadow-sm focus:shadow-copper-500/10 rounded-xl text-white focus:outline-none transition-all duration-300 text-sm"
                    placeholder="••••••••••••••••"
                  />
                  <Terminal className="absolute right-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                </div>
                {loginError && (
                  <p className="text-rose-400 text-[11px] pt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {loginError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-copper-500 hover:bg-copper-400 disabled:opacity-40 text-black text-xs font-semibold tracking-wider uppercase rounded-xl shadow-lg shadow-copper-500/15 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loginLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <span>{appLanguageContext.t.adminLoginBtn}</span>
                )}
              </button>

              <p className="text-center text-[10px] text-zinc-600">
                {appLanguageContext.lang === 'fr'
                  ? 'Entrez par exemple la clé d’administration présente dans vos variables d’environnement.'
                  : 'Refer to ADMIN_PASSCODE defined inside your environment configurations.'
                }
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- 2. ACTIVE LOGGED-IN ADMINISTRATOR CONSOLE ---------------- */}
      {token && (
        <div className="space-y-8 relative z-10 text-sm">
          
          {/* Top Info line */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-copper-500" />
                <h2 className="text-xl font-bold font-display text-white tracking-tight">
                  {appLanguageContext.t.adminWelcome}
                </h2>
              </div>
              <p className="text-xs text-zinc-500">
                {appLanguageContext.lang === 'fr'
                  ? 'Gérez vos projets et suivez vos messages clients.'
                  : 'Store new systems and check inbox messages.'
                }
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 transition-colors cursor-pointer text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{appLanguageContext.t.adminLogout}</span>
            </button>
          </div>

          {/* Nav Tab togglers & Counters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex bg-zinc-950 p-1 rounded-xl border border-white/5 font-display overflow-x-auto max-w-full space-x-1">
              <button
                onClick={() => { setActiveTab('projects'); setProjectFormOpen(false); }}
                className={`px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-copper-500 text-black font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {appLanguageContext.t.adminTabProjects} ({projects.length})
              </button>
              <button
                onClick={() => { setActiveTab('experiences'); setExperienceFormOpen(false); }}
                className={`px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'experiences'
                    ? 'bg-copper-500 text-black font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {lang === 'fr' ? 'Expériences & Parcours' : 'Experiences & Milestones'} ({experiences.length})
              </button>
              <button
                onClick={() => { setActiveTab('technologies'); setTechFormOpen(false); }}
                className={`px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'technologies'
                    ? 'bg-copper-500 text-black font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {lang === 'fr' ? 'Technologies' : 'Stack & Techs'} ({technologies.length})
              </button>
              <button
                onClick={() => { setActiveTab('profile'); }}
                className={`px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-copper-500 text-black font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {lang === 'fr' ? 'Infos Persos & CV' : 'Profile & Resume'}
              </button>
              <button
                onClick={() => { setActiveTab('messages'); }}
                className={`px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'messages'
                    ? 'bg-copper-500 text-black font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {appLanguageContext.t.adminTabMessages} ({unreadMessagesCount})
              </button>
            </div>

            {activeTab === 'projects' && !projectFormOpen && (
              <button
                onClick={openNewProjectForm}
                className="px-4 py-2.5 rounded-xl bg-copper-500 hover:bg-copper-400 text-black font-medium text-xs tracking-wide shadow-lg shadow-copper-500/10 cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{appLanguageContext.t.adminProjectAdd}</span>
              </button>
            )}

            {activeTab === 'experiences' && !experienceFormOpen && (
              <button
                onClick={openNewExperienceForm}
                className="px-4 py-2.5 rounded-xl bg-copper-500 hover:bg-copper-400 text-black font-medium text-xs tracking-wide shadow-lg shadow-copper-500/10 cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{lang === 'fr' ? 'Ajouter une expérience' : 'Add Experience'}</span>
              </button>
            )}

            {activeTab === 'technologies' && !techFormOpen && (
              <button
                onClick={openNewTechForm}
                className="px-4 py-2.5 rounded-xl bg-copper-500 hover:bg-copper-400 text-black font-medium text-xs tracking-wide shadow-lg shadow-copper-500/10 cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{lang === 'fr' ? 'Ajouter une technologie' : 'Add Tech'}</span>
              </button>
            )}
          </div>

          {/* Loader status */}
          {loadingData && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-copper-500" />
            </div>
          )}

          {/* Form Overlay Modal or Content panels */}
          {!loadingData && (
            <div>
              {/* TAB PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {/* Dynamic Form toggler */}
                  {projectFormOpen && (
                    <form onSubmit={handleProjectSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h3 className="font-display font-semibold text-white text-base">
                          {editingProjectId ? appLanguageContext.t.adminProjectEdit : appLanguageContext.t.adminProjectAdd}
                        </h3>
                        <div className="text-[10px] font-mono select-none px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-white/5">
                          {editingProjectId ? 'EDITING ATOM' : 'PRODUCING ATOM'}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">{appLanguageContext.t.adminProjectTitle}</label>
                          <input
                            type="text"
                            required
                            value={projectFormData.title}
                            onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs sm:text-sm focus:outline-none"
                            placeholder="Aura Whiteboard"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">{appLanguageContext.t.adminProjectSlug}</label>
                          <input
                            type="text"
                            required
                            value={projectFormData.slug}
                            onChange={(e) => setProjectFormData({ ...projectFormData, slug: e.target.value })}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs sm:text-sm focus:outline-none"
                            placeholder="aura-whiteboard"
                          />
                        </div>
                      </div>

                      {/* Brief descriptions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">{appLanguageContext.t.adminProjectShortFr}</label>
                          <input
                            type="text"
                            required
                            value={projectFormData.shortDescriptionFr}
                            onChange={(e) => setProjectFormData({ ...projectFormData, shortDescriptionFr: e.target.value })}
                            className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                            placeholder="Outil de dessin collaboratif temps réel."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">{appLanguageContext.t.adminProjectShortEn}</label>
                          <input
                            type="text"
                            required
                            value={projectFormData.shortDescriptionEn}
                            onChange={(e) => setProjectFormData({ ...projectFormData, shortDescriptionEn: e.target.value })}
                            className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                            placeholder="Realtime visual board workspace."
                          />
                        </div>
                      </div>

                      {/* Detailed narratives */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">{appLanguageContext.t.adminProjectDescFr}</label>
                          <textarea
                            rows={3}
                            required
                            value={projectFormData.descriptionFr}
                            onChange={(e) => setProjectFormData({ ...projectFormData, descriptionFr: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none resize-none"
                            placeholder="Une description complète d’architecture sur-mesure..."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">{appLanguageContext.t.adminProjectDescEn}</label>
                          <textarea
                            rows={3}
                            required
                            value={projectFormData.descriptionEn}
                            onChange={(e) => setProjectFormData({ ...projectFormData, descriptionEn: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none resize-none"
                            placeholder="A descriptive system overview detailing full scale routines..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">{appLanguageContext.t.adminProjectImage}</label>
                          <input
                            type="text"
                            value={projectFormData.image}
                            onChange={(e) => setProjectFormData({ ...projectFormData, image: e.target.value })}
                            className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                            placeholder="https://images.unsplash.com/photo-..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">{appLanguageContext.t.adminProjectTags}</label>
                          <input
                            type="text"
                            value={projectFormData.tags}
                            onChange={(e) => setProjectFormData({ ...projectFormData, tags: e.target.value })}
                            className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                            placeholder="React, Express, WebSockets, Node"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">{appLanguageContext.t.adminProjectGithub}</label>
                          <input
                            type="text"
                            value={projectFormData.githubUrl}
                            onChange={(e) => setProjectFormData({ ...projectFormData, githubUrl: e.target.value })}
                            className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                            placeholder="https://github.com/..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">{appLanguageContext.t.adminProjectLive}</label>
                          <input
                            type="text"
                            value={projectFormData.liveUrl}
                            onChange={(e) => setProjectFormData({ ...projectFormData, liveUrl: e.target.value })}
                            className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                            placeholder="https://..."
                          />
                        </div>

                        <div className="space-y-1 col-span-1">
                          <label className="text-xs font-mono text-zinc-500">{appLanguageContext.t.adminProjectCategory}</label>
                          <select
                            value={projectFormData.category}
                            onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value as any })}
                            className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 text-zinc-300 rounded-xl text-xs focus:outline-none focus:border-copper-500"
                          >
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="fullstack">Full Stack</option>
                          </select>
                        </div>
                      </div>

                      {/* Display Settings */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-zinc-950/60 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="isFeatured"
                            checked={projectFormData.isFeatured}
                            onChange={(e) => setProjectFormData({ ...projectFormData, isFeatured: e.target.checked })}
                            className="w-4 h-4 rounded text-copper-500 accent-copper-500 bg-zinc-950 border-white/5 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                          <label htmlFor="isFeatured" className="text-xs font-display text-zinc-300 select-none cursor-pointer">
                            {appLanguageContext.t.adminProjectFeatured}
                          </label>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <label className="text-xs font-mono text-zinc-500">{appLanguageContext.t.adminProjectOrder}</label>
                          <input
                            type="number"
                            value={projectFormData.order}
                            onChange={(e) => setProjectFormData({ ...projectFormData, order: Number(e.target.value) })}
                            className="w-20 px-3 py-1 bg-zinc-950 border border-white/5 text-center text-xs text-white rounded-lg focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Submit controls */}
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => setProjectFormOpen(false)}
                          className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer text-xs"
                        >
                          {appLanguageContext.t.adminProjectCancel}
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-copper-500 hover:bg-copper-400 text-black font-semibold text-xs shadow-lg shadow-copper-500/10 cursor-pointer"
                        >
                          {appLanguageContext.t.adminProjectSave}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Desktop projects tables lists */}
                  {!projectFormOpen && (
                    <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-xl">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse font-sans text-xs">
                          <thead>
                            <tr className="bg-zinc-950/80 text-zinc-500 border-b border-white/5 font-mono uppercase text-[10px] tracking-wider">
                              <th className="p-4 pl-6">Visual</th>
                              <th className="p-4">Project / Slug</th>
                              <th className="p-4">Category</th>
                              <th className="p-4 font-mono text-right pr-6">Controls</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {projects.map((p) => (
                              <tr key={p._id || p.slug} className="hover:bg-white/1">
                                <td className="p-4 pl-6">
                                  <div className="w-12 h-12 rounded bg-zinc-900 overflow-hidden border border-white/5 flex items-center justify-center text-[10px]">
                                    {p.image ? (
                                      <img src={p.image} alt={p.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                    ) : (
                                      <span>N/A</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="space-y-0.5">
                                    <div className="font-semibold text-white flex items-center gap-1.5 font-display text-sm">
                                      <span>{p.title}</span>
                                      {p.isFeatured && (
                                        <Star className="w-3 h-3 text-copper-400 fill-copper-400" />
                                      )}
                                    </div>
                                    <div className="font-mono text-[10px] text-zinc-500">{p.slug}</div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/5 text-[10px] font-mono text-zinc-400 uppercase">
                                    {p.category}
                                  </span>
                                </td>
                                <td className="p-4 text-right pr-6 space-x-1.5 whitespace-nowrap">
                                  <button
                                    onClick={() => openEditProjectForm(p)}
                                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 hover:text-white cursor-pointer inline-flex items-center"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteProject(p._id || p.slug)}
                                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 cursor-pointer inline-flex items-center"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB EXPERIENCES CORNER */}
              {activeTab === 'experiences' && (
                <div className="space-y-6">
                  {experienceFormOpen && (
                    <form onSubmit={handleExperienceSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h3 className="font-display font-semibold text-white text-base">
                          {editingExperienceId ? 'Modifier l’expérience' : 'Ajouter une expérience ou diplôme'}
                        </h3>
                        <div className="text-[10px] font-mono select-none px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-white/5">
                          {editingExperienceId ? 'MILESTONE REVISION' : 'MILESTONE INCEPTION'}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">Rôle / Diplôme (FR)</label>
                          <input
                            type="text"
                            required
                            value={experienceFormData.roleFr}
                            onChange={(e) => setExperienceFormData({ ...experienceFormData, roleFr: e.target.value })}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs sm:text-sm focus:outline-none"
                            placeholder="Développeur Full Stack"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">Role / Degree (EN)</label>
                          <input
                            type="text"
                            required
                            value={experienceFormData.roleEn}
                            onChange={(e) => setExperienceFormData({ ...experienceFormData, roleEn: e.target.value })}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs sm:text-sm focus:outline-none"
                            placeholder="Full Stack Developer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">Entreprise / Université</label>
                          <input
                            type="text"
                            required
                            value={experienceFormData.company}
                            onChange={(e) => setExperienceFormData({ ...experienceFormData, company: e.target.value })}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                            placeholder="Sorbonne / Freelance"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">Période (FR)</label>
                          <input
                            type="text"
                            required
                            value={experienceFormData.periodFr}
                            onChange={(e) => setExperienceFormData({ ...experienceFormData, periodFr: e.target.value })}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                            placeholder="2025 - Présent"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">Period (EN)</label>
                          <input
                            type="text"
                            required
                            value={experienceFormData.periodEn}
                            onChange={(e) => setExperienceFormData({ ...experienceFormData, periodEn: e.target.value })}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                            placeholder="2025 - Present"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">Description (FR)</label>
                          <textarea
                            rows={3}
                            required
                            value={experienceFormData.descriptionFr}
                            onChange={(e) => setExperienceFormData({ ...experienceFormData, descriptionFr: e.target.value })}
                            className="w-full p-3 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none resize-none"
                            placeholder="Conception d’architectures logicielles et d’applications..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">Description (EN)</label>
                          <textarea
                            rows={3}
                            required
                            value={experienceFormData.descriptionEn}
                            onChange={(e) => setExperienceFormData({ ...experienceFormData, descriptionEn: e.target.value })}
                            className="w-full p-3 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none resize-none"
                            placeholder="Architecting backend services and interactive layouts..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-mono text-zinc-500">Compétences (séparer par des virgules)</label>
                          <input
                            type="text"
                            value={experienceFormData.skills}
                            onChange={(e) => setExperienceFormData({ ...experienceFormData, skills: e.target.value })}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                            placeholder="TypeScript, React, Node.js"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">Type de jalon</label>
                          <select
                            value={experienceFormData.type}
                            onChange={(e) => setExperienceFormData({ ...experienceFormData, type: e.target.value as any })}
                            className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 text-zinc-300 rounded-xl text-xs focus:outline-none focus:border-copper-500 font-sans"
                          >
                            <option value="work">Professionnel (Work)</option>
                            <option value="education">Académique (Education)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => setExperienceFormOpen(false)}
                          className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer text-xs"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-copper-500 hover:bg-copper-400 text-black font-semibold text-xs shadow-lg shadow-copper-500/10 cursor-pointer"
                        >
                          Sauvegarder
                        </button>
                      </div>
                    </form>
                  )}

                  {!experienceFormOpen && (
                    <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-xl">
                      {experiences.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 italic">
                          Aucun parcours enregistré. Cliquez sur "Ajouter une expérience" pour débuter.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-zinc-950/80 text-zinc-500 border-b border-white/5 font-mono uppercase text-[10px] tracking-wider">
                                <th className="p-4 pl-6">Période</th>
                                <th className="p-4">Rôle & Compagnie</th>
                                <th className="p-4">Type</th>
                                <th className="p-4 text-right pr-6">Contrôles</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {experiences.map((exp) => (
                                <tr key={exp._id} className="hover:bg-white/1">
                                  <td className="p-4 pl-6 font-mono text-copper-400 whitespace-nowrap">
                                    {exp.periodFr}
                                  </td>
                                  <td className="p-4">
                                    <div className="space-y-0.5">
                                      <div className="font-semibold text-white font-display text-sm">{exp.roleFr}</div>
                                      <div className="text-zinc-400 text-xs">{exp.company}</div>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded bg-zinc-950 border border-white/5 text-[9px] font-mono ${
                                      exp.type === 'work' ? 'text-copper-400' : 'text-amber-400'
                                    }`}>
                                      {exp.type === 'work' ? 'WORK' : 'EDU'}
                                    </span>
                                  </td>
                                  <td className="p-4 text-right pr-6 space-x-1.5 whitespace-nowrap">
                                    <button
                                      onClick={() => openEditExperienceForm(exp)}
                                      className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 hover:text-white cursor-pointer inline-flex"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => deleteExperience(exp._id)}
                                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 cursor-pointer inline-flex"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB TECHNOLOGIES CORNER */}
              {activeTab === 'technologies' && (
                <div className="space-y-6">
                  {techFormOpen && (
                    <form onSubmit={handleTechSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h3 className="font-display font-semibold text-white text-base">
                          {editingTechId ? 'Modifier la technologie' : 'Ajouter une technologie/outil'}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">Nom (ex: React 19)</label>
                          <input
                            type="text"
                            required
                            value={techFormData.name}
                            onChange={(e) => setTechFormData({ ...techFormData, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs sm:text-sm focus:outline-none"
                            placeholder="TypeScript"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">Catégorie</label>
                          <select
                            value={techFormData.category}
                            onChange={(e) => setTechFormData({ ...techFormData, category: e.target.value as any })}
                            className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 text-zinc-300 rounded-xl text-xs focus:outline-none focus:border-copper-500"
                          >
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="tools">Outillage (Tools)</option>
                            <option value="database">Base de données (Database)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">Niveau de maîtrise (0 à 100 %)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            required
                            value={techFormData.level}
                            onChange={(e) => setTechFormData({ ...techFormData, level: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                            placeholder="85"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-zinc-500">Icône (Nom CSS ou Lucide)</label>
                          <input
                            type="text"
                            value={techFormData.icon}
                            onChange={(e) => setTechFormData({ ...techFormData, icon: e.target.value })}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                            placeholder="React, Database, Terminal"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => setTechFormOpen(false)}
                          className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer text-xs"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-copper-500 hover:bg-copper-400 text-black font-semibold text-xs shadow-lg shadow-copper-500/10 cursor-pointer"
                        >
                          Sauvegarder
                        </button>
                      </div>
                    </form>
                  )}

                  {!techFormOpen && (
                    <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-xl">
                      {technologies.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 italic">
                          Aucune technologie cataloguée. Créez-en une maintenant !
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-zinc-950/80 text-zinc-500 border-b border-white/5 font-mono uppercase text-[10px] tracking-wider">
                                <th className="p-4 pl-6 font-mono">Nom</th>
                                <th className="p-4 font-mono">Catégorie</th>
                                <th className="p-4 font-mono text-center">Niveau</th>
                                <th className="p-4 font-mono text-right pr-6">Contrôles</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {technologies.map((tech) => (
                                <tr key={tech._id} className="hover:bg-white/1">
                                  <td className="p-4 pl-6 font-semibold text-white font-display text-sm">
                                    {tech.name}
                                  </td>
                                  <td className="p-4 font-mono uppercase text-[10px] text-zinc-400">
                                    {tech.category}
                                  </td>
                                  <td className="p-4 text-center">
                                    <div className="inline-flex items-center gap-1.5">
                                      <span className="font-mono text-copper-400 font-bold">{tech.level}%</span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-right pr-6 space-x-1.5 whitespace-nowrap">
                                    <button
                                      onClick={() => openEditTechForm(tech)}
                                      className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 hover:text-white cursor-pointer inline-flex"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => deleteTech(tech._id)}
                                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 cursor-pointer inline-flex"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB PROFILE & CV CORNER */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="font-display font-semibold text-white text-base">
                      Informations personnelles & Téléchargement du CV
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Mettez à jour vos coordonnées principales, vos biographies bilingues et remplacez votre curriculum vitæ à la volée.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-500">Nom Complet d’affichage</label>
                      <input
                        type="text"
                        required
                        value={profile.name || ''}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-500">Photo de Profil (Avatar URL)</label>
                      <input
                        type="text"
                        required
                        value={profile.avatarUrl || ''}
                        onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                        className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-500">Adresse Email publique</label>
                      <input
                        type="email"
                        required
                        value={profile.email || ''}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-500">Numéro de Téléphone</label>
                      <input
                        type="text"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-500">Titre Professionnel (FR)</label>
                      <input
                        type="text"
                        required
                        value={profile.titleFr || ''}
                        onChange={(e) => setProfile({ ...profile, titleFr: e.target.value })}
                        className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-500">Professional Title (EN)</label>
                      <input
                        type="text"
                        required
                        value={profile.titleEn || ''}
                        onChange={(e) => setProfile({ ...profile, titleEn: e.target.value })}
                        className="w-full px-4 py-2.5 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-500">Accroche Hero (FR)</label>
                      <textarea
                        rows={2}
                        required
                        value={profile.bioFr || ''}
                        onChange={(e) => setProfile({ ...profile, bioFr: e.target.value })}
                        className="w-full p-3 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs resize-none focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-500">Hero Hook (EN)</label>
                      <textarea
                        rows={2}
                        required
                        value={profile.bioEn || ''}
                        onChange={(e) => setProfile({ ...profile, bioEn: e.target.value })}
                        className="w-full p-3 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs resize-none focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-500">Biographie "À propos" (FR)</label>
                      <textarea
                        rows={4}
                        required
                        value={profile.aboutBioFr || ''}
                        onChange={(e) => setProfile({ ...profile, aboutBioFr: e.target.value })}
                        className="w-full p-3 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs resize-none focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-500">About Bio Narrative (EN)</label>
                      <textarea
                        rows={4}
                        required
                        value={profile.aboutBioEn || ''}
                        onChange={(e) => setProfile({ ...profile, aboutBioEn: e.target.value })}
                        className="w-full p-3 bg-zinc-950 border border-white/5 focus:border-copper-500 text-white rounded-xl text-xs resize-none focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-zinc-950/60 p-5 rounded-2xl border border-white/5 space-y-3">
                    <h4 className="font-display font-medium text-xs text-white flex items-center gap-1.5 uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-copper-400" />
                      <span>Fichier du CV (.pdf de préférence)</span>
                    </h4>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        {profile.cvName ? (
                          <div className="text-xs text-emerald-400 font-mono font-medium flex items-center gap-1">
                            <span>✓ CV Actuel :</span>
                            <span className="underline select-all">{profile.cvName}</span>
                          </div>
                        ) : (
                          <div className="text-xs text-zinc-600 font-mono">Aucun CV n'est téléversé actuellement.</div>
                        )}
                        <p className="text-[10px] text-zinc-500">
                          Uploadez une nouvelle version pour remplacer instantanément le fichier téléchargeable.
                        </p>
                      </div>

                      <div className="relative shrink-0">
                        <input
                          type="file"
                          id="admin-cv-upload"
                          accept=".pdf,application/pdf"
                          onChange={handleCvChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor="admin-cv-upload"
                          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 hover:text-white rounded-lg text-xs font-mono cursor-pointer flex items-center gap-1.5 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choisir un fichier</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-white/5">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-6 py-2.5 rounded-xl bg-copper-500 hover:bg-copper-400 disabled:opacity-45 text-black font-semibold text-xs shadow-lg shadow-copper-500/15 cursor-pointer flex items-center gap-1.5"
                    >
                      {profileSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                      ) : (
                        <>
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>Sauvegarder les modifications du Profil</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB CONTACTS MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="glass-panel p-12 rounded-3xl text-center text-zinc-500 italic">
                      No contact requests cataloged in database yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`glass-panel p-5 rounded-2xl border flex flex-col justify-between hover:border-copper-500/10 transition-colors shadow-lg ${
                            msg.isRead 
                              ? 'border-white/5 opacity-80' 
                              : 'border-copper-500/20 hover:border-copper-500/30'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/5 pb-3">
                            <div className="space-y-1">
                              {/* Sender Details */}
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white text-base font-display">{msg.name}</span>
                                {!msg.isRead && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-mono border border-copper-400/20 px-1.5 py-0.5 rounded bg-copper-500/5 text-copper-400 font-bold leading-none animate-pulse">
                                    New message
                                  </span>
                                )}
                              </div>
                              <a href={`mailto:${msg.email}`} className="text-xs text-copper-400 hover:underline inline-flex items-center gap-1 font-mono">
                                <span>{msg.email}</span>
                              </a>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center">
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-white/5">
                                <Calendar className="w-3 h-3 text-zinc-600" />
                                <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A'}</span>
                              </span>

                              {!msg.isRead && (
                                <button
                                  onClick={() => markMessageAsRead(msg._id!)}
                                  className="p-1 px-3.5 rounded-xl bg-copper-500 hover:bg-copper-400 text-black text-xs font-semibold cursor-pointer flex items-center gap-1 animate-shimmer"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>{appLanguageContext.t.adminMsgMarkRead}</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Message core values */}
                          <div className="pt-3.5 space-y-2">
                            <h4 className="font-semibold text-zinc-300 font-sans text-sm">{msg.subject}</h4>
                            <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap selection:bg-copper-500/30">
                              {msg.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
