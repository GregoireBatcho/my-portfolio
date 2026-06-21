"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '../lib/i18n';
import { useTheme } from '../lib/theme';
import { Menu, X, Code2, Globe, Sparkles, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Navbar({ currentTab, setCurrentTab }: NavbarProps) {
  const { locale, setLocale, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Fetch state for availability indicator
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t('common.about') },
    { id: 'projects', label: t('common.projects') },
    { id: 'experience', label: t('common.experience') },
    { id: 'skills', label: t('common.skills') },
    { id: 'contact', label: t('common.contact') }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 glassmorphism border-b border-stone-200/50 dark:border-zinc-800' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <div 
          onClick={() => setCurrentTab('home')} 
          className="flex items-center gap-2.5 cursor-pointer group"
          id="nav-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#d97736] to-[#7c2d12] flex items-center justify-center border border-[#d97736]/30 shadow-lg shadow-[#d97736]/10 group-hover:scale-105 transition-transform duration-300">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-stone-900 dark:text-white font-display font-bold text-lg tracking-wider group-hover:text-[#d97736] transition-colors duration-300">
              G. BATCHO
            </h1>
            {profile && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${profile.availability === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-[10px] font-mono text-stone-500 dark:text-zinc-400 uppercase tracking-widest">
                  {profile.availability === 'available' ? t('common.available') : t('common.busy')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP NAV ITEMS */}
        <div className="hidden md:flex items-center gap-1.5 bg-stone-100/80 dark:bg-black/40 border border-stone-200 dark:border-zinc-800 p-1.5 rounded-full glassmorphism">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-btn-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`relative px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-colors duration-300 ${isActive ? 'text-[#d97736] dark:text-white' : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-[#d97736]/30 rounded-full shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* DESKTOP CONTROLS */}
        <div className="hidden md:flex items-center gap-4">
          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-stone-50 hover:bg-stone-100 dark:bg-neutral-950 dark:hover:bg-neutral-900 text-stone-600 dark:text-zinc-400 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-violet-700" />}
          </button>

          {/* LOCALE TOGGLE */}
          <div className="flex bg-stone-100 dark:bg-neutral-950 border border-stone-200 dark:border-[#292524] rounded-lg p-0.5" id="locale-selector">
            <button
              onClick={() => setLocale('fr')}
              className={`px-3 py-1.5 rounded-md text-[11px] font-mono font-bold tracking-widest transition-all ${locale === 'fr' ? 'bg-[#d97736] text-white' : 'text-stone-500 hover:text-stone-700 dark:hover:text-zinc-300'}`}
            >
              FR
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`px-3 py-1.5 rounded-md text-[11px] font-mono font-bold tracking-widest transition-all ${locale === 'en' ? 'bg-[#d97736] text-white' : 'text-stone-500 hover:text-stone-700 dark:hover:text-zinc-300'}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setCurrentTab('contact')}
            id="nav-cta-contact"
            className="px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider text-white bg-gradient-to-r from-[#d97736] to-[#c2410c] hover:opacity-90 shadow-md shadow-[#d97736]/10 hover:shadow-[#d97736]/20 transition-all border border-[#ea580c]/20 flex items-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
            {t('common.contactMe')}
          </button>
        </div>

        {/* MOBILE INTERACTIVE Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {/* Theme switcher on mobile */}
          <button
            onClick={toggleTheme}
            className="p-2 border border-stone-200 dark:border-zinc-800 rounded-lg bg-stone-50 dark:bg-neutral-950 text-stone-600 dark:text-zinc-400"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-violet-700" />}
          </button>
          {/* Mobile localized switcher */}
          <button 
            onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
            className="p-2 border border-stone-200 dark:border-[#292524] rounded-lg bg-stone-50 dark:bg-neutral-900 text-stone-600 dark:text-zinc-400"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 border border-stone-200 dark:border-[#292524] rounded-lg bg-stone-100 dark:bg-[#0c0a09] text-stone-900 dark:text-white"
            id="mobile-menu-hamburger"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glassmorphism border-b border-stone-200 dark:border-[#292524]"
            id="mobile-drawer-menu"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`py-2 px-3 rounded-lg text-left text-sm font-medium transition-colors ${currentTab === item.id ? 'bg-[#d97736]/10 text-[#d97736] border-l-2 border-[#d97736]' : 'text-stone-600 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-white'}`}
                >
                  <span className="flex items-center gap-2">
                    {item.label}
                  </span>
                </button>
              ))}
              <div className="h-px bg-stone-200 dark:bg-[#292524] my-2" />
              <button
                onClick={() => {
                  setCurrentTab('contact');
                  setIsOpen(false);
                }}
                className="w-full py-3 bg-[#d97736] text-white font-medium text-xs rounded-xl text-center shadow-lg hover:bg-[#ea580c] transition-colors cursor-pointer"
              >
                {t('common.contactMe')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
