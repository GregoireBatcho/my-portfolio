"use client";

import { useState, useEffect } from "react";
import { LanguageProvider, useLanguage } from "./lib/i18n";
import { ThemeProvider } from "./lib/theme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProjectCard from "./components/ProjectCard";
import SkillCard from "./components/SkillCard";
import Timeline from "./components/Timeline";
import ContactForm from "./components/ContactForm";
import AdminPanel from "./components/AdminPanel";

import {
  Project,
  Experience,
  Technology,
  SoftSkill,
  Profile,
  ProjectCategory,
} from "./types";
import {
  Sparkles,
  ArrowRight,
  Github,
  Globe,
  Star,
  Mail,
  MapPin,
  Briefcase,
  Search,
  SlidersHorizontal,
  BookOpen,
  Layers,
  Zap,
  Flame,
  Terminal,
  HelpCircle,
  X,
  ChevronRight,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function BaseApp() {
  const { t, locale } = useLanguage();
  const [currentTab, setCurrentTab] = useState("home");

  // Database dynamic states
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [softSkills, setSoftSkills] = useState<SoftSkill[]>([]);

  // Interactive search & filter states
  const [projectSearch, setProjectSearch] = useState("");
  const [projectCategory, setProjectCategory] = useState<string>("all");

  // Details Modal state (Route simulation)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Load everything from persistent API routers on load
  const refreshData = () => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => {});
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(data))
      .catch(() => {});
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(() => {});
    fetch("/api/technologies")
      .then((r) => r.json())
      .then((data) => setTechnologies(data))
      .catch(() => {});
    fetch("/api/experiences")
      .then((r) => r.json())
      .then((data) => setExperiences(data))
      .catch(() => {});
    fetch("/api/softskills")
      .then((r) => r.json())
      .then((data) => setSoftSkills(data))
      .catch(() => {});
  };

  useEffect(() => {
    refreshData();

    // Listen to URL hash for deep-linked project slugs or secret admin routing
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/projects/")) {
        const slug = hash.replace("#/projects/", "");
        fetch("/api/projects")
          .then((r) => r.json())
          .then((projs: Project[]) => {
            const match = projs.find((p) => p.slug === slug);
            if (match) setSelectedProject(match);
          });
      } else if (hash === "#/admin") {
        setCurrentTab("admin");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Trigger on load

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Backdoor trigger: Listen to global Ctrl + Shift + A to open administrative config securely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setCurrentTab((prev) => (prev === "admin" ? "home" : "admin"));
        window.location.hash =
          window.location.hash === "#/admin" ? "" : "#/admin";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update dynamic page SEO metadata settings
  useEffect(() => {
    fetch("/api/seo")
      .then((r) => r.json())
      .then((seoSettings) => {
        document.title =
          seoSettings?.siteTitle ||
          "Grégoire BATCHO | Full Stack Developer Junior";

        // Update meta tags dynamically
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement("meta");
          metaDesc.setAttribute("name", "description");
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", seoSettings?.metaDescription || "");

        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement("meta");
          metaKeywords.setAttribute("name", "keywords");
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute(
          "content",
          Array.isArray(seoSettings?.keywords)
            ? seoSettings.keywords.join(", ")
            : "",
        );
      })
      .catch(() => {});
  }, [currentTab]);

  const selectProjectWithRoute = (project: Project | null) => {
    setSelectedProject(project);
    if (project) {
      window.location.hash = `#/projects/${project.slug}`;
    } else {
      window.location.hash = "";
    }
  };

  // Filters logic
  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      projectCategory === "all" || p.category === projectCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.technologies.some((t) =>
        t.toLowerCase().includes(projectSearch.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0a09] text-stone-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-[#d97736] selection:text-white antialiased relative transition-colors duration-350">
      {/* Dynamic Background Noise/Lighting Mesh and Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e0_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1c1917_1px,transparent_1px),linear-gradient(to_bottom,#1c1917_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Top golden gradient light spot */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-[#d97736]/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      {/* NAVBAR */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* CONTENT SWITCHER PANEL WITH ANIMATED FADES */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {currentTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="pt-32 pb-24"
            >
              {/* HERO SECTION */}
              <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 md:pt-16 pb-20 relative">
                {/* Decorative glow panel context */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-[#d97736]/5 blur-[90px] rounded-full pointer-events-none" />

                <div className="lg:col-span-7 space-y-8 relative z-10 text-center lg:text-left flex flex-col items-center lg:items-start">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2.5 w-fit bg-white/85 dark:bg-neutral-900/80 border border-stone-200 dark:border-zinc-800 px-4 py-2 rounded-full backdrop-blur shadow"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest text-stone-600 dark:text-zinc-300 uppercase font-bold">
                      {profile?.availability === "available"
                        ? t("common.available")
                        : t("common.busy")}
                    </span>
                  </motion.div>

                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-stone-900 dark:text-white tracking-tight leading-[1.15]">
                      {t("home.heroGreeting")} <br />
                      <span className="bg-gradient-to-r from-[#d97736] via-[#ea580c] to-amber-500 bg-clip-text text-transparent">
                        {t("home.heroSubtitle")}
                      </span>
                    </h2>
                    <p className="text-stone-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
                      {t("home.heroDescription")}
                    </p>
                  </div>

                  {/* Buttons and CV downloads */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
                    <button
                      onClick={() => setCurrentTab("contact")}
                      className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#d97736] to-[#c2410c] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#d97736]/10 hover:shadow-[#d97736]/20 transition-all border border-orange-500/10 flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      {t("common.contactMe")}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <a
                      href="/api/cv/download"
                      className="w-full sm:w-auto px-6 py-3.5 border border-stone-200 dark:border-zinc-800 bg-white/80 dark:bg-neutral-900/30 hover:bg-stone-100 dark:hover:bg-neutral-900/90 text-stone-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-[#d97736]" />
                      {t("common.downloadCV")}
                    </a>
                  </div>
                </div>

                {/* VISUAL COMPONENT LAYOUT: Apple-like glowing window block */}
                <div className="lg:col-span-5 relative z-10 flex justify-center">
                  <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border border-stone-200 dark:border-zinc-800 bg-white/50 dark:bg-neutral-900/30 p-1 hover-glow transition-all duration-500 shadow-lg dark:shadow-none">
                    {/* Glowing background behind picture */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#d97736]/10 to-transparent pointer-events-none" />
                    <img
                      src={
                        profile?.profilePicture ||
                        "https://images.unsplash.com/photo-1519083560753-af0119f7cbe7?auto=format&fit=crop&w=600&h=600&q=80"
                      }
                      alt={profile?.fullname}
                      className="w-full h-full object-cover rounded-2xl border border-stone-100 dark:border-zinc-900"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </section>

              {/* ABOUT BRIEF SEGMENT */}
              <section className="max-w-7xl mx-auto px-6 py-16 border-t border-stone-200 dark:border-zinc-900/60 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  <div className="lg:col-span-4 space-y-3">
                    <span className="text-[10px] items-center gap-1.5 uppercase tracking-widest text-[#d97736] font-mono font-bold flex">
                      <Terminal className="w-3.5 h-3.5" />
                      {t("home.aboutOverview")}
                    </span>
                    <h3 className="text-stone-900 dark:text-white font-display font-medium text-2xl tracking-wider uppercase">
                      {t("home.aboutTitle")}
                    </h3>
                  </div>
                  <div className="lg:col-span-8 space-y-4">
                    <p className="text-stone-700 dark:text-zinc-300 text-sm leading-relaxed">
                      {t("about.philosophyDesc")}
                    </p>
                    <button
                      onClick={() => setCurrentTab("about")}
                      className="text-[#d97736] text-xs font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {t("home.aboutReadMore")}
                      <ChevronRight className="w-3.5 h-3.5 mt-0.5" />
                    </button>
                  </div>
                </div>
              </section>

              {/* SELECTED WORKS SECTION */}
              <section className="max-w-7xl mx-auto px-6 py-20 border-t border-stone-200 dark:border-zinc-900/60 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-[#d97736] font-mono font-bold flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-[#d97736] fill-[#d97736]" />
                      {t("home.creativeShowcase")}
                    </span>
                    <h3 className="text-stone-900 dark:text-white font-display font-bold text-3xl tracking-tight">
                      {t("home.featuredProjectsTitle")}
                    </h3>
                    <p className="text-stone-550 dark:text-zinc-505 text-xs font-sans max-w-sm">
                      {t("home.featuredProjectsSubtitle")}
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentTab("projects")}
                    className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-neutral-950/60 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-neutral-900 text-stone-700 dark:text-zinc-250 hover:text-[#d97736] transition-all flex items-center gap-2 group shadow-sm cursor-pointer self-start md:self-end"
                  >
                    {t("home.viewAllProjects")}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProjects.slice(0, 3).map((proj) => (
                    <ProjectCard
                      key={proj.id}
                      project={proj}
                      categories={categories}
                      onSelect={(p) => selectProjectWithRoute(p)}
                    />
                  ))}
                </div>
              </section>

              {/* TIMELINE EXPERIENCES PREVIEW */}
              <section className="max-w-7xl mx-auto px-6 py-20 border-t border-stone-200 dark:border-zinc-900/60 relative bg-stone-500/5 dark:bg-black/10 rounded-3xl p-8 mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-4 space-y-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#d97736] font-mono font-bold flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {t("home.careerHistory")}
                    </span>
                    <h3 className="text-stone-900 dark:text-white font-display font-bold text-3xl tracking-tight">
                      {t("home.experiencePreview")}
                    </h3>
                    <p className="text-stone-550 dark:text-zinc-500 text-xs leading-relaxed max-w-sm font-sans">
                      {t("home.experienceDesc")}
                    </p>
                    <button
                      onClick={() => setCurrentTab("experience")}
                      className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-neutral-950/60 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-neutral-900 text-stone-750 dark:text-zinc-200 transition-all inline-flex items-center gap-2 group cursor-pointer shadow-sm"
                    >
                      {t("home.examineTimeline")}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="lg:col-span-8">
                    <Timeline experiences={experiences.slice(0, 2)} />
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* =========================================
              TAB VIEW: ABOUT FULL
              ========================================= */}
          {currentTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="pt-36 pb-24 max-w-7xl mx-auto px-6 space-y-16"
            >
              <div className="max-w-3xl space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-[#d97736] font-mono font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  WHO IS GRÉGOIRE BATCHO?
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-stone-900 dark:text-white tracking-tight leading-tight">
                  {t("about.title")}
                </h2>
                <p className="text-stone-600 dark:text-zinc-400 text-xs md:text-sm leading-relaxed max-w-2xl font-sans">
                  {t("about.subtitle")}
                </p>
              </div>

              {/* STATS COUNT GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-stone-200 dark:border-zinc-900/80">
                {[
                  { value: projects.length, label: t("about.statsProjects") },
                  { value: "18+", label: t("about.statsExp") },
                  { value: technologies.length, label: t("about.statsTech") },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-stone-200 bg-white dark:border-zinc-900 dark:bg-neutral-900/20 text-center shadow-sm dark:shadow-none"
                  >
                    <span className="text-3xl font-bold font-display text-stone-900 dark:text-white">
                      {stat.value}
                    </span>
                    <span className="block text-[10px] text-[#d97736] font-mono mt-2 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
                {/* Philosophy and Objectives */}
                <div className="lg:col-span-8 space-y-8">
                  <div className="p-8 rounded-2xl border border-stone-200 bg-white/80 dark:border-zinc-900 dark:bg-neutral-900/10 space-y-4 shadow-sm dark:shadow-none">
                    <h4 className="text-stone-900 dark:text-white font-display font-medium text-lg tracking-wide border-b border-stone-200 dark:border-zinc-900 pb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#d97736]" />
                      {t("about.philosophyTitle")}
                    </h4>
                    <p className="text-stone-600 dark:text-zinc-400 text-xs md:text-sm leading-relaxed font-sans">
                      {t("about.philosophyDesc")}
                    </p>
                  </div>

                  <div className="p-8 rounded-2xl border border-stone-200 bg-white/80 dark:border-zinc-900 dark:bg-neutral-900/10 space-y-4 shadow-sm dark:shadow-none">
                    <h4 className="text-stone-900 dark:text-white font-display font-medium text-lg tracking-wide border-b border-stone-200 dark:border-zinc-900 pb-3 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#d97736]" />
                      {t("about.objectivesTitle")}
                    </h4>
                    <p className="text-stone-600 dark:text-zinc-400 text-xs md:text-sm leading-relaxed font-sans">
                      {t("about.objectivesDesc")}
                    </p>
                  </div>
                </div>

                {/* Hard values and CV side card */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="p-6 rounded-2xl border border-stone-200 bg-white dark:border-zinc-800 dark:bg-[#0c0a09]/80 backdrop-blur luxury-glow space-y-5">
                    <h4 className="text-stone-900 dark:text-white font-display font-semibold text-xs tracking-wider uppercase">
                      {t("about.engineeringRules")}
                    </h4>

                    <ul className="space-y-4 text-xs text-stone-600 dark:text-zinc-400 font-sans">
                      <li className="flex gap-2.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d97736] shrink-0 mt-1.5" />
                        <span>{t("about.valuesDesc1")}</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d97736] shrink-0 mt-1.5" />
                        <span>{t("about.valuesDesc2")}</span>
                      </li>
                    </ul>

                    <div className="h-px bg-stone-200 dark:bg-zinc-900 my-4" />

                    <div className="space-y-1.5 font-mono text-[9px] text-stone-500 dark:text-zinc-500 uppercase tracking-widest">
                      <p>
                        {t("about.fullnameLabel")}: {profile?.fullname}
                      </p>
                      <p>
                        {t("about.locationLabel")}: {profile?.location}
                      </p>
                      <p>
                        {t("about.availabilityLabel")}:{" "}
                        {profile?.availability
                          ? t(`common.${profile.availability}`)
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================
              TAB VIEW: PROJECTS SHOWCASE
              ========================================= */}
          {currentTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="pt-36 pb-24 max-w-7xl mx-auto px-6 space-y-12"
            >
              <div className="max-w-2xl space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-[#d97736] font-mono font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  {t("projects.ourDevelopments")}
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-stone-900 dark:text-white tracking-tight">
                  {t("projects.title")}
                </h2>
                <p className="text-stone-600 dark:text-zinc-500 text-xs md:text-sm font-sans">
                  {t("projects.subtitle")}
                </p>
              </div>

              {/* SEARCH & FILTERS CONTROLLER */}
              <div className="bg-white dark:bg-neutral-900/10 border border-stone-200 dark:border-zinc-900 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm dark:shadow-none">
                <div className="flex bg-stone-100 dark:bg-black/40 border border-stone-200 dark:border-zinc-800 p-1.5 rounded-full flex-wrap gap-1 w-full md:w-auto">
                  {[
                    { id: "all", label: t("projects.filterAll") },
                    ...categories.map((c) => ({
                      id: c.id,
                      label: locale === "fr" ? c.nameFr : c.nameEn,
                    })),
                  ].map((cat) => {
                    const isSelected = projectCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setProjectCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-[11px] font-semibold tracking-wider transition-colors cursor-pointer ${isSelected ? "bg-[#d97736] text-white" : "text-stone-500 dark:text-zinc-400 hover:text-[#d97736] dark:hover:text-white"}`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full md:w-72 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder={t("projects.searchPlaceholder")}
                    className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-zinc-900 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-650 focus:outline-[#d97736] focus:border-[#d97736] transition-colors"
                  />
                </div>
              </div>

              {/* PRODUCTS LIST */}
              {filteredProjects.length === 0 ? (
                <div className="text-center py-20 text-stone-500 dark:text-zinc-500 font-mono text-xs border border-stone-150 dark:border-zinc-900 rounded-2xl bg-white dark:bg-neutral-950/20">
                  {t("projects.noProjects")}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {filteredProjects.map((p) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      categories={categories}
                      onSelect={(proj) => selectProjectWithRoute(proj)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* =========================================
              TAB VIEW: TIMELINE EXPERIENCE
              ========================================= */}
          {currentTab === "experience" && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="pt-36 pb-24 max-w-7xl mx-auto px-6 space-y-12"
            >
              <div className="max-w-xl space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-[#d97736] font-mono font-bold flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  {t("experience.milestones")}
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-stone-900 dark:text-white tracking-tight">
                  {t("experience.title")}
                </h2>
                <p className="text-stone-600 dark:text-zinc-500 text-xs md:text-sm font-sans">
                  {t("experience.subtitle")}
                </p>
              </div>

              <div className="pt-6">
                <Timeline experiences={experiences} />
              </div>
            </motion.div>
          )}

          {/* =========================================
              TAB VIEW: SKILLS BREAKDOWN
              ========================================= */}
          {currentTab === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="pt-36 pb-24 max-w-7xl mx-auto px-6 space-y-12"
            >
              <div className="max-w-xl space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-[#d97736] font-mono font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  {t("skills.strikingCompetencies")}
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-stone-900 dark:text-white tracking-tight">
                  {t("skills.title")}
                </h2>
                <p className="text-stone-600 dark:text-zinc-500 text-xs md:text-sm font-sans">
                  {t("skills.subtitle")}
                </p>
              </div>

              {/* Categorized Skills View */}
              <div className="space-y-12 pt-4">
                {[
                  { id: "frontend", label: t("skills.catFrontend") },
                  { id: "backend", label: t("skills.catBackend") },
                  { id: "database", label: t("skills.catDatabase") },
                  { id: "mobile", label: t("skills.catMobile") },
                  { id: "devops", label: t("skills.catDevops") },
                  { id: "tools", label: t("skills.catTools") },
                ].map((sec) => {
                  const sectionTechs = technologies.filter(
                    (t) => t.category === sec.id,
                  );
                  if (sectionTechs.length === 0) return null;
                  return (
                    <div key={sec.id} className="space-y-4">
                      <h3 className="text-[#d97736] text-[10px] font-mono font-bold uppercase tracking-widest border-b border-stone-200 dark:border-zinc-900 pb-2.5">
                        {sec.label}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sectionTechs.map((tech) => (
                          <SkillCard key={tech.id} tech={tech} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Soft Skills Section */}
              <div className="pt-12 border-t border-stone-200 dark:border-zinc-900/60 space-y-6">
                <h3 className="text-stone-900 dark:text-white font-display font-semibold text-lg uppercase tracking-wider">
                  {t("home.skillsTitle")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {softSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-6 rounded-2xl border border-stone-200 bg-white/80 dark:border-zinc-900 dark:bg-neutral-900/25 space-y-3 hover-glow transition-all shadow-sm dark:shadow-none"
                    >
                      <span className="text-[10px] text-[#d97736] font-mono font-bold uppercase tracking-widest block border-b border-stone-150 dark:border-zinc-950 pb-2.5">
                        {skill.title}
                      </span>
                      <p className="text-stone-600 dark:text-zinc-400 text-xs leading-relaxed font-sans">
                        {skill.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================
              TAB VIEW: CONTACT COMPILER
              ========================================= */}
          {currentTab === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="pt-36 pb-24 max-w-7xl mx-auto px-6 space-y-12"
            >
              <div className="max-w-xl text-center mx-auto space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-[#d97736] font-mono font-bold flex items-center gap-1.5 justify-center">
                  <Mail className="w-3.5 h-3.5" />
                  {t("contact.dispatchPackets")}
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-stone-900 dark:text-white tracking-tight">
                  {t("contact.title")}
                </h2>
                <p className="text-stone-600 dark:text-zinc-550 text-xs md:text-sm font-sans mt-1">
                  {t("contact.subtitle")}
                </p>
              </div>

              <div className="pt-6">
                <ContactForm />
              </div>
            </motion.div>
          )}

          {/* =========================================
              TAB VIEW: ADMIN CONTROLLER PANEL
              ========================================= */}
          {currentTab === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <AdminPanel onUpdate={refreshData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================
          DYNAMIC DETAILED PROJECT ROUTE MODAL
          ========================================= */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 dark:bg-black/90 backdrop-blur-md z-50 overflow-y-auto pt-20 px-6 pb-12 flex justify-center items-start"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-4xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden relative shadow-2xl"
              id="project-detail-modal"
            >
              {/* Top absolute exit cross */}
              <button
                onClick={() => selectProjectWithRoute(null)}
                className="absolute top-6 right-6 p-2 rounded-full border border-stone-200 dark:border-zinc-850 bg-stone-100 dark:bg-[#0c0a09] text-stone-500 dark:text-zinc-400 hover:text-[#d97736] dark:hover:text-white transition-all cursor-pointer z-20 hover:border-[#d97736]"
                aria-label="Exit modal detail"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Dynamic gallery showcase */}
              <div className="relative aspect-[16/9] w-full bg-black/60 border-b border-stone-200 dark:border-zinc-850">
                <img
                  src={
                    selectedProject.images[0] ||
                    "https://picsum.photos/seed/project/1200/675"
                  }
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-95" />

                {/* Visual labels overlay */}
                <div className="absolute bottom-6 left-8 right-8">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#d97736] font-bold">
                    {categories.find((c) => c.id === selectedProject.category)
                      ? locale === "fr"
                        ? categories.find(
                            (c) => c.id === selectedProject.category,
                          )?.nameFr
                        : categories.find(
                            (c) => c.id === selectedProject.category,
                          )?.nameEn
                      : selectedProject.category}
                  </span>
                  <h3 className="text-white font-display font-bold text-2xl md:text-3xl tracking-tight mt-1">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Specifications detail list split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 md:p-10">
                <main className="lg:col-span-8 space-y-6">
                  {/* FULL TEXT DESCRIPTION */}
                  <div>
                    <h4 className="text-stone-500 dark:text-zinc-500 font-mono text-[9px] uppercase tracking-widest border-b border-stone-200 dark:border-zinc-850 pb-2.5 mb-3 font-semibold">
                      Full description and objective overview:
                    </h4>
                    <p className="text-stone-600 dark:text-zinc-300 text-xs md:text-sm leading-relaxed font-sans">
                      {selectedProject.fullDescription}
                    </p>
                  </div>
                </main>

                <aside className="lg:col-span-4 space-y-6 shrink-0 lg:border-l lg:border-stone-200 lg:dark:border-zinc-800 lg:pl-6">
                  {/* TAGS TECH LIST */}
                  <div>
                    <h4 className="text-stone-500 dark:text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-3 font-semibold">
                      Technical Stack used:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-[#d97736]/5 hover:bg-[#d97736]/10 border border-[#d97736]/10 text-[10px] text-[#d97736] font-mono font-bold uppercase transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* DATE AND CALENDAR */}
                  <div>
                    <h4 className="text-stone-500 dark:text-zinc-500 font-mono text-[9px] uppercase tracking-widest block mb-1">
                      Project timeframe:
                    </h4>
                    <p className="text-stone-800 dark:text-white text-xs font-mono">
                      {selectedProject.startDate}{" "}
                      {selectedProject.endDate
                        ? `– ${selectedProject.endDate}`
                        : "– Active"}
                    </p>
                  </div>

                  <div className="h-px bg-stone-200 dark:bg-zinc-800" />

                  {/* BOTTOM ACTION BUTTONS */}
                  <div className="space-y-2.5">
                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 border border-stone-200 dark:border-zinc-800 bg-stone-100 dark:bg-neutral-900/30 hover:bg-stone-200 dark:hover:bg-neutral-900 text-stone-650 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Github className="w-4 h-4 text-[#d97736]" />
                        {t("projects.viewCode")}
                      </a>
                    )}
                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-gradient-to-r from-[#d97736] to-[#c2410c] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Globe className="w-4 h-4" />
                        {t("projects.viewLive")}
                      </a>
                    )}
                  </div>
                </aside>
              </div>

              {/* RELATED PROJECTS SEGMENT */}
              <div className="border-t border-stone-200 dark:border-zinc-800/60 p-8 md:p-10 space-y-6 bg-stone-50 dark:bg-black/10">
                <h4 className="text-stone-900 dark:text-white font-display font-semibold text-sm uppercase tracking-wider">
                  Related Projects:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects
                    .filter((p) => p.id !== selectedProject.id)
                    .slice(0, 2)
                    .map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => selectProjectWithRoute(proj)}
                        className="p-4 rounded-2xl border border-stone-200 dark:border-zinc-800 hover:border-[#d97736]/30 bg-white/80 dark:bg-neutral-900/30 hover:bg-stone-50 dark:hover:bg-neutral-900/50 transition-all flex items-center justify-between cursor-pointer group shadow-sm dark:shadow-none"
                      >
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-[#d97736] font-mono leading-none">
                            {proj.category}
                          </span>
                          <h5 className="text-stone-800 dark:text-white font-display font-medium text-xs mt-1 group-hover:text-[#d97736] transition-colors duration-300">
                            {proj.title}
                          </h5>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400 dark:text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <Footer setCurrentTab={setCurrentTab} profile={profile} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <BaseApp />
      </ThemeProvider>
    </LanguageProvider>
  );
}
