"use client";

import React from 'react';
import { Technology } from '../types';
import { useLanguage } from '../lib/i18n';
import { motion } from 'motion/react';

interface SkillCardProps {
  key?: React.Key;
  tech: Technology;
}

export default function SkillCard({ tech }: SkillCardProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="p-5 rounded-xl border border-stone-200 bg-white dark:border-zinc-900 dark:bg-neutral-900/30 hover:bg-stone-50 dark:hover:bg-neutral-900/50 hover-glow transition-all duration-300 relative group overflow-hidden shadow-sm dark:shadow-none"
    >
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#d97736]/3 blur-2xl group-hover:bg-[#d97736]/6 transition-all duration-500 rounded-full" />

      <div className="flex items-center justify-between mb-3.5">
        <h4 className="text-stone-800 dark:text-white font-display font-medium text-sm tracking-wide group-hover:text-[#d97736] dark:group-hover:text-white transition-colors">
          {tech.name}
        </h4>
        <span className="text-[10px] font-mono text-stone-500 bg-stone-100 border border-stone-200 dark:text-zinc-500 dark:bg-black/40 dark:border-zinc-800/40 px-2 py-0.5 rounded-md">
          {tech.yearsExperience} {t('skills.years')}
        </span>
      </div>

      {/* PROFICIENCY BAR */}
      <div>
        <div className="flex justify-between items-center text-[10px] text-stone-550 dark:text-zinc-500 mb-1.5 font-mono">
          <span>{t('skills.proficiency')}</span>
          <span className="text-[#d97736] font-semibold">{tech.proficiency}%</span>
        </div>
        <div className="w-full h-1.5 bg-stone-100 dark:bg-zinc-950 rounded-full border border-stone-200 dark:border-zinc-900 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${tech.proficiency}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-orange-800/50 via-[#d97736] to-orange-400 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
