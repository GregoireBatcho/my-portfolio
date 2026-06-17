import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.js';
import { Project } from '../types.js';
import { motion } from 'motion/react';
import { ArrowRight, Code, Shield, Flame, Cpu, Briefcase, Zap, Star, Download } from 'lucide-react';

export default function Home() {
  const { lang, t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamic SEO titles based on active language
    const title = lang === 'fr' 
      ? 'Grégoire BATCHO — Développeur Full Stack & Ingénieur Logiciel' 
      : 'Grégoire BATCHO — Full Stack Developer & Software Engineer';
    document.title = title;
    
    // Update meta description dynamically for search indexers
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', lang === 'fr' 
        ? 'Dossier et portfolio de Grégoire BATCHO, ingénieur d’applications web robuste. Spécialités: React, TypeScript, Node.js, Express, et MongoDB.'
        : 'Professional developer portfolio of Grégoire BATCHO. High-performance software engineering covering React, TypeScript, Node.js, security, and Databases.'
      );
    }

    // Fetch projects
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filters down to only featured ones
          const featured = data.filter((p: Project) => p.isFeatured);
          setProjects(featured.slice(0, 3));
        }
      })
      .catch((err) => console.error('Error getting featured projects:', err))
      .finally(() => setLoading(false));

    // Fetch personal profile details
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setProfile(data);
        }
      })
      .catch((err) => console.error('Error fetching profile:', err));
  }, [lang]);

  const coreStrengths = [
    {
      icon: <Code className="w-5 h-5 text-copper-400" />,
      title: t.aboutPh1Title,
      desc: t.aboutPh1Desc,
    },
    {
      icon: <Flame className="w-5 h-5 text-copper-400" />,
      title: t.aboutPh2Title,
      desc: t.aboutPh2Desc,
    },
    {
      icon: <Shield className="w-5 h-5 text-copper-400" />,
      title: t.aboutPh3Title,
      desc: t.aboutPh3Desc,
    },
    {
      icon: <Cpu className="w-5 h-5 text-copper-400" />,
      title: t.aboutPh4Title,
      desc: t.aboutPh4Desc,
    },
  ];

  // Primary languages to list in quick stack grid
  const keyStack = [
    { name: 'TypeScript', rating: '90%', desc: 'Typed safety, interfaces & schemas.' },
    { name: 'React', rating: '95%', desc: 'Functional declarative architectures.' },
    { name: 'Node.js', rating: '85%', desc: 'Scalable Express routers & secure APIs.' },
    { name: 'MongoDB', rating: '80%', desc: 'Robust Mongoose object storage mapping.' },
    { name: 'Tailwind CSS', rating: '95%', desc: 'Pixel-perfect, lightweight, high-speed layout.' },
    { name: 'Docker', rating: '75%', desc: 'Containerized deployment architecture.' },
  ];

  // Determine displayed greetings holding customizable DB options
  const displayTitle = profile ? (lang === 'fr' ? profile.titleFr : profile.titleEn) : t.heroTitle;
  const displaySubtitle = profile ? (lang === 'fr' ? profile.bioFr : profile.bioEn) : t.heroSubtitle;
  const displayBio = profile ? (lang === 'fr' ? profile.aboutBioFr : profile.aboutBioEn) : t.aboutBio;

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-6xl mx-auto overflow-hidden">
      
      {/* Dynamic Glowing Mesh Orbs */}
      <div className="glow-spot w-[450px] h-[450px] bg-copper-600/10 top-[-100px] left-[-150px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="glow-spot w-[450px] h-[450px] bg-amber-500/5 top-[30vh] right-[-100px] animate-pulse" style={{ animationDuration: '12s' }} />

      {/* ----------------- 1. HERO SECTION ----------------- */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center py-10 md:py-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          {/* Availability Flag */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono tracking-wide text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute" />
            <span>{lang === 'fr' ? 'Disponible pour opportunités' : 'Available for opportunities'}</span>
          </div>

          {/* Dynamic Profile Photo Avatar */}
          {profile?.avatarUrl && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8, type: 'spring' }}
              className="relative w-32 h-32 md:w-36 md:h-36 rounded-full mx-auto my-6 overflow-hidden border-2 border-copper-500/20 p-1 bg-zinc-950/40 shadow-xl"
            >
              <img
                src={profile.avatarUrl}
                alt={profile.name || "Grégoire BATCHO"}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full filter saturate-[0.9] hover:saturate-100 transition-all duration-300"
              />
            </motion.div>
          )}

          <p className="text-sm font-mono text-copper-400 tracking-widest uppercase">
            {t.heroGreeting}
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display text-white tracking-tight leading-[1.1] selection:text-black">
            {profile?.name || 'Grégoire BATCHO'}
          </h1>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-display text-zinc-400 font-medium tracking-tight">
            {displayTitle}
          </h2>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed pt-2">
            {displaySubtitle}
          </p>
        </motion.div>

        {/* Buttons / CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto"
        >
          <Link
            to="/projects"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-copper-500 text-black hover:bg-copper-400 font-medium text-sm tracking-wide shadow-lg shadow-copper-500/10 hover:shadow-copper-500/20 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 group decoration-transparent animate-fade-in"
          >
            <span>{t.heroCtaProjects}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Interactive Download CV Button */}
          <a
            href="/api/profile/cv"
            download
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-950/40 border border-white/5 hover:border-copper-500/35 text-white font-medium text-sm tracking-wide backdrop-blur hover:bg-white/5 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 decoration-transparent cursor-pointer"
          >
            <Download className="w-4 h-4 text-copper-400" />
            <span>{lang === 'fr' ? 'Télécharger mon CV' : 'Download Resume'}</span>
          </a>

          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-950/40 border border-white/5 hover:border-copper-500/35 text-white font-medium text-sm tracking-wide backdrop-blur hover:bg-white/5 active:scale-98 transition-all duration-300 flex items-center justify-center gap-1.5 decoration-transparent"
          >
            {t.heroCtaContact}
          </Link>
        </motion.div>
      </section>

      {/* ----------------- 2. ABOUT MINI & CORE PHILOSOPHY ----------------- */}
      <section className="relative z-10 py-16 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start border-t border-white/5">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2 text-copper-400 text-xs font-mono tracking-widest uppercase">
            <span className="w-3 h-px bg-copper-400" />
            <span>{t.aboutTitle}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            {t.aboutPhilosophy}
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {displayBio}
          </p>
          
          <div className="pt-4">
            <Link
              to="/about"
              className="inline-flex items-center text-xs font-mono tracking-tight text-copper-400 hover:text-white transition-colors gap-1.5 hover:underline decoration-transparent"
            >
              <span>{lang === 'fr' ? 'Découvrir ma stack complète' : 'Discover my entire stack'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bento Philosophy items */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coreStrengths.map((philosophy, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between h-44 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-copper-500/5 border border-copper-500/10 flex items-center justify-center">
                {philosophy.icon}
              </div>
              <div className="space-y-1 mt-4">
                <h4 className="text-sm font-semibold font-display text-white">{philosophy.title}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{philosophy.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- 3. FEATURED PROJECTS ----------------- */}
      <section className="relative z-10 py-16 border-t border-white/5 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-copper-400 text-xs font-mono tracking-widest uppercase">
              <span className="w-3 h-px bg-copper-400" />
              <span>{t.projectsTitle}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              {lang === 'fr' ? 'Sélections de Réalisations' : 'Curated Works'}
            </h3>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center text-xs font-mono text-copper-400 hover:text-white transition-colors gap-1 decoration-transparent"
          >
            <span>{lang === 'fr' ? 'Parcourir tous les projets' : 'Browse all projects'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Projects list */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-panel p-4 rounded-2xl animate-pulse space-y-4">
                <div className="bg-zinc-800 h-44 rounded-xl w-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-2/3" />
                  <div className="h-3 bg-zinc-800 rounded w-full" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-sm text-zinc-500 italic text-center py-6">
            {lang === 'fr' ? 'Aucun projet sélectionné.' : 'No featured projects cataloged.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <Link
                key={proj._id || proj.slug}
                to={`/projects`}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden group border border-white/5 flex flex-col h-full hover:-translate-y-1 transition-all duration-300 decoration-transparent"
              >
                <div className="relative h-44 overflow-hidden bg-zinc-900 border-b border-white/5 flex items-center justify-center text-xs font-mono text-zinc-500">
                  {proj.image ? (
                    <img
                      src={proj.image}
                      alt={proj.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span>{t.projectNoImage}</span>
                  )}
                  
                  {/* Category Pin */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-zinc-950/80 border border-white/5 font-mono text-[9px] uppercase tracking-wider text-copper-400">
                    {proj.category === 'fullstack' ? 'Full Stack' : proj.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-semibold text-white group-hover:text-copper-400 transition-colors text-base">
                        {proj.title}
                      </h4>
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-mono border border-copper-400/20 px-1.5 py-0.5 rounded bg-copper-500/5 text-copper-400">
                        <Star className="w-2.5 h-2.5 fill-copper-400" />
                        <span>{t.projectFeaturedBadge}</span>
                      </span>
                    </div>
                    
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                      {lang === 'fr' ? proj.shortDescriptionFr : proj.shortDescriptionEn}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {proj.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-zinc-950 text-zinc-400 text-[10px] font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ----------------- 4. BENTO TECH STACK GRID ----------------- */}
      <section className="relative z-10 py-16 border-t border-white/5 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-copper-400 text-xs font-mono tracking-widest uppercase">
            <span className="w-3 h-px bg-copper-400" />
            <span>{t.techStackTitle}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white animate-fade-in">
            {t.techStackSubtitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {keyStack.map((tech, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-copper-500/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-semibold text-white text-sm">{tech.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-copper-500/10 border border-copper-500/25 text-copper-400">
                  {tech.rating}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- 5. EXPERIENCE & TIMELINE TEASER CTA ----------------- */}
      <section className="relative z-10 py-12 px-6 md:px-12 rounded-3xl border border-white/5 bg-radial from-copper-500/10 via-transparent to-transparent flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden shadow-2xl">
        <div className="glow-spot w-[200px] h-[200px] bg-copper-500/10 -top-12 -right-12" />
        
        <div className="space-y-2 text-left">
          <p className="text-[11px] font-mono text-copper-400 tracking-wider uppercase">
            {lang === 'fr' ? 'Expérience & Parcours' : 'Experience & Track'}
          </p>
          <h4 className="text-lg sm:text-xl font-bold font-display text-white tracking-tight">
            {lang === 'fr' 
              ? 'Prêt à collaborer sur vos initiatives technologiques ?' 
              : 'Equipped to elevate your technical projects?'
            }
          </h4>
          <p className="text-xs text-zinc-400 max-w-xl">
            {lang === 'fr'
              ? 'Découvrez mon parcours académique et professionnel, mes rôles en développement freelance ainsi que les méthodologies apprises.'
              : 'Explore my detailed background, freelance roles, core responsibilities, and industrial workflows learned along the timeline.'
            }
          </p>
        </div>

        <Link
          to="/experience"
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold tracking-wide shadow-xl active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 group shrink-0 decoration-transparent"
        >
          <span>{lang === 'fr' ? 'Voir mon Expérience' : 'Review my Experience'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

    </div>
  );
}
