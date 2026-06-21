"use client";

import React from 'react';
import { Project } from '../types';
import { useLanguage } from '../lib/i18n';
import { ArrowUpRight, Github, Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ProjectCardProps {
  key?: React.Key;
  project: Project;
  categories?: any[];
  onSelect: (project: Project) => void;
}

export default function ProjectCard({ project, categories, onSelect }: ProjectCardProps) {
  const { t, locale } = useLanguage();
  
  const matchedCat = categories?.find((c) => c.id === project.category);
  const displayCategory = matchedCat
    ? (locale === 'fr' ? matchedCat.nameFr : matchedCat.nameEn)
    : project.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-2xl border border-stone-200 bg-white/80 dark:border-zinc-800/80 dark:bg-neutral-900/40 hover:bg-stone-50 dark:hover:bg-neutral-900/60 overflow-hidden hover-glow transition-all duration-300 flex flex-col justify-between h-full shadow-sm dark:shadow-none"
    >
      <div>
        {/* IMAGE CONTAINER with glowing overlays */}
        <div className="relative h-48 overflow-hidden bg-black/50 border-b border-stone-200 dark:border-zinc-800/60 cursor-pointer" onClick={() => onSelect(project)}>
          <img
            src={project.images[0] || "https://picsum.photos/seed/project/640/480"}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
          
          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-4 right-4 bg-[#d97736] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/15 shadow-md shadow-orange-500/20">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              {t('common.featured')}
            </div>
          )}
          
          {/* Hover launch icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-4 py-2 bg-[#d97736] text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              Explore Details
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="p-6 cursor-pointer" onClick={() => onSelect(project)}>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#d97736] font-bold">
            {displayCategory}
          </span>
          <h3 className="text-stone-850 dark:text-white font-display font-semibold text-lg tracking-wide mt-2 group-hover:text-[#d97736] transition-colors duration-350">
            {project.title}
          </h3>
          <p className="text-stone-600 dark:text-zinc-400 text-xs leading-relaxed mt-2.5 line-clamp-3">
            {project.shortDescription}
          </p>
        </div>
      </div>

      {/* TECHS & DIRECT LINKS FOOTER */}
      <div className="px-6 pb-6 pt-3 border-t border-stone-200/65 dark:border-[#1c1917]/60">
        {/* Technologies tags list */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-600 dark:bg-zinc-800/60 dark:border-zinc-700/30 text-[10px] dark:text-zinc-300 font-mono"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-zinc-800/40 text-[10px] text-stone-500 dark:text-zinc-500 font-mono">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/60 dark:border-zinc-800/40">
          <button 
            onClick={() => onSelect(project)}
            className="text-stone-850 dark:text-white text-xs font-semibold hover:text-[#d97736] dark:hover:text-[#d97736] transition-colors flex items-center gap-1 cursor-pointer"
          >
            Learn more
          </button>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 px-2 text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                aria-label="GitHub link"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Code</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 px-2 text-stone-500 hover:text-[#d97736] dark:text-zinc-400 dark:hover:text-[#d97736] transition-colors flex items-center gap-1 text-[11px]"
                aria-label="Live link"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Live</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
