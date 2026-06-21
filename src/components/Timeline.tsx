"use client";

import { Experience } from '../types';
import { useLanguage } from '../lib/i18n';
import { Calendar, Building, Briefcase, Server } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineProps {
  experiences: Experience[];
}

export default function Timeline({ experiences }: TimelineProps) {
  const { t } = useLanguage();

  return (
    <div className="relative border-l border-stone-200 dark:border-[#292524] ml-4 md:ml-8 pl-8 md:pl-12 space-y-12">
      {experiences.map((exp, index) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative group"
        >
          {/* Animated Glowing node circle */}
          <span className="absolute -left-[45px] md:-left-[61px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-neutral-950 border-2 border-stone-300 dark:border-zinc-800 flex items-center justify-center group-hover:border-[#d97736] transition-all duration-300 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-zinc-600 group-hover:bg-[#d97736] transition-all duration-300" />
          </span>

          <div className="p-6 md:p-8 rounded-2xl border border-stone-200 bg-white/80 dark:border-zinc-800/80 dark:bg-neutral-900/40 hover:bg-stone-50/90 dark:hover:bg-neutral-900/50 hover-glow transition-all duration-300 luxury-glow shadow-sm dark:shadow-none">
            {/* Meta headers */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-stone-850 dark:text-white font-display font-semibold text-lg hover:text-[#d97736] dark:hover:text-[#d97736] transition-colors flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#d97736]" />
                  {exp.role}
                </h4>
                <div className="flex items-center gap-2 text-stone-500 dark:text-zinc-500 text-xs mt-1.5 font-sans">
                  <Building className="w-3.5 h-3.5" />
                  <span className="text-stone-700 dark:text-zinc-300 font-medium">{exp.company}</span>
                </div>
              </div>

              {/* Time Span */}
              <div className="flex items-center gap-1.5 text-stone-600 dark:text-zinc-400 bg-stone-100 dark:bg-neutral-950 border border-stone-200 dark:border-zinc-900/80 px-3 py-1.5 rounded-full text-[10px] font-mono leading-none w-fit self-start shadow-sm dark:shadow-none">
                <Calendar className="w-3 h-3 text-[#d97736]" />
                <span>
                  {exp.startDate} – {exp.endDate || t('experience.present')}
                </span>
              </div>
            </div>

            {/* Description details */}
            <p className="text-stone-600 dark:text-zinc-400 text-xs leading-relaxed max-w-4xl">
              {exp.description}
            </p>

            {/* Technologies acquisition tags */}
            {exp.technologies && exp.technologies.length > 0 && (
              <div className="mt-5 pt-4 border-t border-stone-200 dark:border-zinc-900/40 flex flex-wrap items-center gap-2">
                <Server className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500 mr-1" />
                {exp.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md bg-[#d97736]/5 hover:bg-[#d97736]/10 border border-[#d97736]/10 text-[9px] text-[#d97736] font-mono font-bold uppercase transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
