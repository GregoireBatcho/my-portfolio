"use client";

import { useLanguage } from '../lib/i18n';
import { Github, Linkedin, Twitter, Mail, Heart, Cpu } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  profile?: any;
}

export default function Footer({ setCurrentTab, profile }: FooterProps) {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-50 dark:bg-black border-t border-stone-200 dark:border-[#292524] py-16 px-6 relative overflow-hidden transition-colors">
      {/* Background soft copper ambient light */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#d97736]/5 blur-[70px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="w-8 h-8 rounded-lg bg-[#d97736]/10 flex items-center justify-center border border-[#d97736]/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4 text-[#d97736]" />
            </div>
            <span className="text-stone-800 dark:text-white font-display font-medium text-sm tracking-wider uppercase">
              {profile?.fullname || "Grégoire BATCHO"}
            </span>
          </div>
          <p className="text-stone-600 dark:text-zinc-500 text-xs mt-3 max-w-sm">
            {t('common.footerSubtitle')}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <button onClick={() => setCurrentTab('home')} className="text-xs text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer">{t('common.about')}</button>
          <button onClick={() => setCurrentTab('projects')} className="text-xs text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer">{t('common.projects')}</button>
          <button onClick={() => setCurrentTab('experience')} className="text-xs text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer">{t('common.experience')}</button>
          <button onClick={() => setCurrentTab('skills')} className="text-xs text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer">{t('common.skills')}</button>
          <button onClick={() => setCurrentTab('contact')} className="text-xs text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer">{t('common.contact')}</button>
        </div>

        {/* Social Network Links */}
        <div className="flex items-center gap-4">
          <a
            href={profile?.socials?.github || "https://github.com/gregoire-batcho"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg border border-stone-200 dark:border-[#292524] bg-white dark:bg-neutral-900 flex items-center justify-center text-stone-600 dark:text-zinc-400 hover:text-[#d97736] hover:border-[#d97736]/30 transition-all cursor-pointer"
            aria-label="GitHub Link"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={profile?.socials?.linkedin || "https://linkedin.com/in/gregoire-batcho"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg border border-stone-200 dark:border-[#292524] bg-white dark:bg-neutral-900 flex items-center justify-center text-stone-600 dark:text-zinc-400 hover:text-[#d97736] hover:border-[#d97736]/30 transition-all cursor-pointer"
            aria-label="LinkedIn Link"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={profile?.socials?.twitter || "https://twitter.com/gregoire_batcho"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg border border-stone-200 dark:border-[#292524] bg-white dark:bg-neutral-900 flex items-center justify-center text-stone-600 dark:text-zinc-400 hover:text-[#d97736] hover:border-[#d97736]/30 transition-all cursor-pointer"
            aria-label="Twitter Link"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={profile?.socials?.email ? `mailto:${profile.socials.email}` : "mailto:batchogregoire81@gmail.com"}
            className="w-9 h-9 rounded-lg border border-stone-200 dark:border-[#292524] bg-white dark:bg-neutral-900 flex items-center justify-center text-stone-600 dark:text-zinc-400 hover:text-[#d97736] hover:border-[#d97736]/30 transition-all cursor-pointer"
            aria-label="Email Link"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-200 dark:border-[#1c1917] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative z-10 text-[11px] text-stone-500 dark:text-zinc-600 font-mono">
        <p>© {year} {profile?.fullname || "Grégoire BATCHO"}. {t('common.rights')}</p>
        <p className="flex items-center gap-1.5 justify-center">
          {t('common.engineeredWith')} <Heart className="w-3 h-3 text-[#d97736] fill-[#d97736]" /> using Next.js & MongoDB Atlas.
        </p>
      </div>
    </footer>
  );
}

