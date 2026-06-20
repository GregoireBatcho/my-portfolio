import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext.js';
import { motion } from 'motion/react';
import { Code, Server, Wrench, Cpu, CheckCircle } from 'lucide-react';

export default function About() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend' | 'tools'>('frontend');
  const [profile, setProfile] = useState<any>(null);
  const [dbTechs, setDbTechs] = useState<any[]>([]);

  useEffect(() => {
    // Dynamic SEO titles based on active language
    document.title = t.aboutSeoTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t.aboutSeoDesc);
    }

    // Fetch profile
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setProfile(data);
      })
      .catch((err) => console.error('Error fetching profile in About:', err));

    // Fetch technologies list
    fetch('/api/technologies')
      .then((res) => res.json())
      .then((data) => {
         if (Array.isArray(data)) setDbTechs(data);
      })
      .catch((err) => console.error('Error fetching technologies in About:', err));
  }, [lang]);

  const staticCategories = {
    frontend: [
      { name: 'React 18 / 19', level: 'Expert', desc: 'Hooks, Suspense, custom context engines.' },
      { name: 'TypeScript', level: 'Expert', desc: 'Interface engineering, strict typing setups.' },
      { name: 'Tailwind CSS v4', level: 'Expert', desc: 'Highly optimized utilities, custom global theme layers.' },
      { name: 'Next.js Router / Vite', level: 'Avancé', desc: 'SPA architectures, modern lazy chunk-loading.' },
      { name: 'Motion / Framer', level: 'Conducteur', desc: 'Physical layout springs, smooth page-interleaving.' },
    ],
    backend: [
      { name: 'Node.js / Express', level: 'Expert', desc: 'Microservice routers, secure OAuth pipelines.' },
      { name: 'MongoDB / Mongoose', level: 'Avancé', desc: 'Robust document modeling, nested aggregate queries.' },
      { name: 'PostgreSQL / SQL', level: 'Avancé', desc: 'Structured relational layouts, join indexings.' },
      { name: 'REST & GraphQL APIs', level: 'Avancé', desc: 'Predictable interfaces, payload compression filters.' },
      { name: 'JWT Auth & NextAuth', level: 'Expert', desc: 'Cookie tokens, cryptographically signed cookies.' },
    ],
    tools: [
      { name: 'Git & GitHub Workflows', level: 'Expert', desc: 'Agile branches, branch protections, pull requests.' },
      { name: 'Docker Containers', level: 'Avancé', desc: 'Environment isolations, custom Dockerfile builds.' },
      { name: 'Cloud Run / Vercel', level: 'Avancé', desc: 'Continuous integration, scale-to-zero container routing.' },
      { name: 'Figma Designer', level: 'Intermédiaire', desc: 'Component auto-layouts, dark-theme visual mockups.' },
      { name: 'Drizzle / Prisma', level: 'Avancé', desc: 'ORM database migrations, schema synchronization.' },
    ],
  };

  // Convert level 0-100 to label
  const getLevelLabel = (level: number) => {
    if (level >= 90) return t.aboutLevelExpert;
    if (level >= 80) return t.aboutLevelAdvanced;
    if (level >= 65) return t.aboutLevelIntermediate;
    return t.aboutLevelFamiliar;
  };

  const technicalCategories = {
    frontend: dbTechs.length > 0
      ? dbTechs.filter(t => t.category === 'frontend').map(t => ({ name: t.name, level: getLevelLabel(t.level), desc: t.icon || 'Modern Web Engineering' }))
      : staticCategories.frontend,
    backend: dbTechs.length > 0
      ? dbTechs.filter(t => t.category === 'backend' || t.category === 'database').map(t => ({ name: t.name, level: getLevelLabel(t.level), desc: t.icon || 'Database/Service engineering' }))
      : staticCategories.backend,
    tools: dbTechs.length > 0
      ? dbTechs.filter(t => t.category === 'tools').map(t => ({ name: t.name, level: getLevelLabel(t.level), desc: t.icon || 'Ops & Automation systems' }))
      : staticCategories.tools,
  };

  const highLights = [
    {
      title: t.aboutHl1Title,
      desc: t.aboutHl1Desc
    },
    {
      title: t.aboutHl2Title,
      desc: t.aboutHl2Desc
    },
    {
      title: t.aboutHl3Title,
      desc: t.aboutHl3Desc
    }
  ];

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Visual background glows */}
      <div className="glow-spot w-[350px] h-[350px] bg-copper-500/5 top-20 right-[-100px] pointer-events-none" />
      <div className="glow-spot w-[350px] h-[350px] bg-copper-600/5 bottom-20 left-[-100px] pointer-events-none" />

      {/* Head section */}
      <section className="space-y-4 mb-12">
        <div className="flex items-center space-x-2 text-copper-400 text-xs font-mono tracking-widest uppercase">
          <span className="w-3 h-px bg-copper-400" />
          <span>{t.aboutIdentityVision}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white">
          {t.aboutTitle}
        </h2>
      </section>

      {/* Intro Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-16 relative z-10 text-sm">
        {/* Biography Column */}
        <div className="md:col-span-2 space-y-6">
          <p className="text-zinc-300 leading-relaxed text-base">
            {profile 
              ? (lang === 'fr' ? (profile.bioFr || profile.bioEn) : (profile.bioEn || profile.bioFr))
              : t.aboutBioFallback
            }
          </p>

          <p className="text-zinc-400 leading-relaxed">
            {profile
              ? (lang === 'fr' ? (profile.aboutBioFr || profile.aboutBioEn) : (profile.aboutBioEn || profile.aboutBioFr))
              : t.aboutBioNarrativeFallback
            }
          </p>

          <div className="border-l-2 border-copper-500 pl-4 py-1 italic text-zinc-300 font-display">
            {t.aboutQuote}
          </div>
        </div>

        {/* Highlight Stats Bento */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-white/5">
            <h4 className="font-display font-medium text-white tracking-wide text-xs uppercase font-mono text-copper-400">
              {t.aboutQuickStatsTitle}
            </h4>
            <div className="space-y-3 font-mono text-xs font-medium">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">{t.aboutRoleLabel}</span>
                <span className="text-zinc-300 font-semibold">{profile ? (lang === 'fr' ? (profile.titleFr || profile.titleEn) : (profile.titleEn || profile.titleFr)) : t.aboutJuniorRoleFallback}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">{t.aboutBaseLabel}</span>
                <span className="text-zinc-300 font-semibold">{lang === 'fr' ? "Abidjan, Côte d'Ivoire" : "Abidjan, Côte d'Ivoire"}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">{t.aboutStatusLabel}</span>
                <span className="text-zinc-300 font-semibold">{t.aboutStatusValue}</span>
              </div>
              {profile?.phone && (
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500">Tel</span>
                  <span className="text-zinc-300 font-semibold">{profile.phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500">Email</span>
                <a href={`mailto:${profile?.email || 'batchogregoire0@gmail.com'}`} className="text-copper-400 hover:underline">
                  {profile?.email?.split('@')[0] || 'batchogregoire0'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Highlights / Checklist */}
      <section className="mb-16 border-t border-white/5 pt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {highLights.map((hl, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-copper-500 shrink-0" />
              <h4 className="font-display font-semibold text-white text-sm tracking-tight">{hl.title}</h4>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              {hl.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Interactive Tech Stack Area */}
      <section className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 md:p-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
              {t.techStackTitle}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {t.aboutInteractiveTip}
            </p>
          </div>

          {/* Filtering Tab Group */}
          <div className="flex bg-zinc-900 p-1.5 rounded-xl border border-white/5 self-start shrink-0 font-display">
            <button
              onClick={() => setActiveTab('frontend')}
              className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                activeTab === 'frontend'
                  ? 'bg-copper-500 text-black shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Frontend
            </button>
            <button
              onClick={() => setActiveTab('backend')}
              className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                activeTab === 'backend'
                  ? 'bg-copper-500 text-black shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Backend / DB
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                activeTab === 'tools'
                  ? 'bg-copper-500 text-black shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tools / Ops
            </button>
          </div>
        </div>

        {/* Group list with micro charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicalCategories[activeTab].map((item, i) => (
            <div
              key={i}
              className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm font-display">{item.name}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-900 text-copper-400 font-bold border border-white/5">
                  {item.level}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
