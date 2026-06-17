import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.js';
import { Project } from '../types.js';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ExternalLink, X, Tag, Star, ArrowLeft, ArrowUpRight, Grid } from 'lucide-react';

export default function Projects() {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend' | 'fullstack'>('all');

  // Load active project slug from URL search parameter
  const activeSlug = searchParams.get('slug');

  useEffect(() => {
    // Dynamic SEO titles based on active language
    const title = lang === 'fr'
      ? 'Projets & Réalisations | Grégoire BATCHO'
      : 'Projects & Showcase | Grégoire BATCHO';
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', lang === 'fr'
        ? 'Parcourez les applications créées par Grégoire BATCHO. Systèmes full stack, architectures optimisées, et bases de données sécurisées.'
        : 'Browse through standard and bespoke web applications created by Grégoire BATCHO. Full stack environments, clean codings, and API security.'
      );
    }

    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch((err) => console.error('Error fetching projects:', err))
      .finally(() => setLoading(false));
  }, [lang]);

  const selectProject = (slug: string | null) => {
    if (slug) {
      setSearchParams({ slug });
    } else {
      setSearchParams({});
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const activeProject = projects.find((p) => p.slug === activeSlug);

  // Derive "related projects" of the active projection (same category, different slug)
  const relatedProjects = activeProject
    ? projects.filter((p) => p.category === activeProject.category && p.slug !== activeProject.slug).slice(0, 2)
    : [];

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Background radial spotlights */}
      <div className="glow-spot w-[400px] h-[400px] bg-copper-600/5 top-32 left-[-150px]" />
      <div className="glow-spot w-[400px] h-[400px] bg-amber-500/5 bottom-32 right-[-150px]" />

      {/* Headings */}
      <section className="space-y-4 mb-8">
        <div className="flex items-center space-x-2 text-copper-400 text-xs font-mono tracking-widest uppercase">
          <span className="w-3 h-px bg-copper-400" />
          <span>{lang === 'fr' ? 'Travaux & Réalisations' : 'Portfolio Showcase'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
          {t.projectsTitle}
        </h2>
        <p className="text-zinc-500 text-xs sm:text-sm max-w-2xl">
          {t.projectsSubtitle}
        </p>
      </section>

      {/* Category Filter Tabs */}
      <section className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 border-b border-white/5 font-display">
        {[
          { id: 'all', label: t.projectsCategoryAll },
          { id: 'frontend', label: t.projectsCategoryFrontend },
          { id: 'backend', label: t.projectsCategoryBackend },
          { id: 'fullstack', label: t.projectsCategoryFullstack },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-copper-500 text-black shadow-lg shadow-copper-500/15'
                : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </section>

      {/* Dynamic Projects Grid */}
      {loading ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-panel p-4 rounded-3xl animate-pulse space-y-4 border border-white/5 h-[360px] flex flex-col justify-between">
              <div className="bg-zinc-950 h-44 rounded-2xl w-full" />
              <div className="space-y-2 flex-1 pt-3">
                <div className="h-4 bg-zinc-800 rounded w-2/3" />
                <div className="h-3 bg-zinc-800 rounded w-full" />
                <div className="h-3 bg-zinc-800 rounded w-5/6" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-zinc-800 rounded w-12" />
                <div className="h-6 bg-zinc-800 rounded w-16" />
              </div>
            </div>
          ))}
        </section>
      ) : filteredProjects.length === 0 ? (
        <section className="text-center py-12">
          <p className="text-sm font-mono text-zinc-500 italic">
            {lang === 'fr' ? 'Aucun projet trouvé pour cette catégorie.' : 'No projects cataloged under this stack.'}
          </p>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative">
          {filteredProjects.map((p) => (
            <div
              key={p._id || p.slug}
              onClick={() => selectProject(p.slug)}
              className="glass-panel glass-panel-hover rounded-3xl overflow-hidden group border border-white/5 flex flex-col h-[400px] justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-44 overflow-hidden bg-zinc-950 flex items-center justify-center text-xs font-mono text-zinc-600 border-b border-white/5">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                ) : (
                  <span>{t.projectNoImage}</span>
                )}

                {/* Badges container */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-black/80 border border-white/5 font-mono text-[9px] uppercase tracking-wider text-copper-400">
                    {p.category === 'fullstack' ? 'Full Stack' : p.category}
                  </span>
                  {p.isFeatured && (
                    <span className="px-2 py-0.5 rounded bg-copper-500 text-black font-mono text-[9px] uppercase tracking-wider font-bold flex items-center gap-0.5">
                      <Star className="w-2 h-2 fill-black" />
                      <span>{t.projectFeaturedBadge}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-white tracking-tight group-hover:text-copper-400 transition-colors text-base">
                    {p.title}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                    {lang === 'fr' ? p.shortDescriptionFr : p.shortDescriptionEn}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {p.tags?.slice(0, 4).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-zinc-950 border border-white/5 text-zinc-400 text-[9px] font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-[11px] font-mono font-medium text-copper-400 group-hover:text-white transition-colors gap-1 pt-1">
                    <span>{lang === 'fr' ? 'Consulter les détails' : 'Analyze details'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ---------------- PROJECT DETAIL DRAWER DRAWS (Inspired by AppStore Overlay) ---------------- */}
      <AnimatePresence>
        {activeSlug && activeProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#080808]/90 backdrop-blur-md">
            
            {/* Clickable dim background dismiss */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => selectProject(null)} />

            <motion.div
              layoutId={`project-overlay-${activeProject.slug}`}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-3xl bg-[#0e0e0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl font-sans text-sm max-h-[90vh] overflow-y-auto z-10 flex flex-col"
            >
              {/* Header Visual Banner */}
              <div className="relative h-56 sm:h-72 bg-zinc-950 flex items-center justify-center text-zinc-600 border-b border-white/5">
                {activeProject.image ? (
                  <img
                    src={activeProject.image}
                    alt={activeProject.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-mono text-xs">{t.projectNoImage}</span>
                )}

                {/* Sticky Dismiss X button */}
                <button
                  onClick={() => selectProject(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-zinc-950/80 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Back button on bottom banner */}
                <button
                  onClick={() => selectProject(null)}
                  className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/90 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer shadow-md"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'fr' ? 'Retour' : 'Back'}</span>
                </button>
              </div>

              {/* Main Info Body */}
              <div className="p-6 md:p-8 space-y-6 flex-1">
                
                {/* Meta details */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-copper-400 text-[10px] font-mono uppercase tracking-wider bg-copper-500/10 px-2 py-0.5 rounded border border-copper-500/20 font-bold">
                        {activeProject.category === 'fullstack' ? 'Full Stack' : activeProject.category}
                      </span>
                      {activeProject.isFeatured && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-mono border border-copper-400/20 px-2 py-0.5 rounded bg-copper-500/5 text-copper-400">
                          <Star className="w-2.5 h-2.5 fill-copper-400" />
                          <span>{t.projectFeaturedBadge}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                      {activeProject.title}
                    </h3>
                  </div>

                  {/* Actions links buttons */}
                  <div className="flex items-center gap-2">
                    {activeProject.githubUrl && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 hover:border-white/10 font-mono text-xs transition-colors flex items-center gap-1.5 cursor-pointer decoration-transparent"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 px-4 rounded-xl bg-copper-500 hover:bg-copper-400 text-black font-mono text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer decoration-transparent"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Narrative description */}
                <div className="space-y-3">
                  <h4 className="text-white font-display font-medium text-xs tracking-wider uppercase font-mono text-zinc-500">
                    {lang === 'fr' ? 'À propos du système' : 'System Overview'}
                  </h4>
                  <p className="text-zinc-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                    {lang === 'fr' ? activeProject.descriptionFr : activeProject.descriptionEn}
                  </p>
                </div>

                {/* Tech specifications list */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-white font-display font-medium text-xs tracking-wider uppercase font-mono text-zinc-500 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-copper-400" />
                    <span>{lang === 'fr' ? 'Technologies implémentées' : 'Implemented Technologies'}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tags?.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-zinc-950 border border-white/5 text-zinc-300 font-mono text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Related projects widget carousel */}
                {relatedProjects.length > 0 && (
                  <div className="border-t border-white/5 pt-6 mt-6 space-y-4">
                    <h4 className="text-white font-display font-medium text-xs tracking-wider uppercase font-mono text-zinc-500 flex items-center gap-1.5">
                      <Grid className="w-3.5 h-3.5 text-copper-400" />
                      <span>{lang === 'fr' ? 'Projets similaires' : 'Related Architectures'}</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {relatedProjects.map((rp) => (
                        <div
                          key={rp._id || rp.slug}
                          onClick={() => selectProject(rp.slug)}
                          className="p-4 rounded-2xl bg-zinc-950 border border-white/5 hover:border-copper-500/20 cursor-pointer flex gap-3 transition-colors duration-200"
                        >
                          <div className="w-16 h-16 rounded-xl bg-zinc-900 overflow-hidden shrink-0">
                            {rp.image && (
                              <img src={rp.image} alt={rp.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex flex-col justify-center space-y-1 overflow-hidden">
                            <span className="text-white font-medium text-xs truncate font-display">{rp.title}</span>
                            <span className="text-[10px] text-zinc-500 truncate">
                              {lang === 'fr' ? rp.shortDescriptionFr : rp.shortDescriptionEn}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
