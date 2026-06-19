import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.js';
import { Menu, X, Globe, Terminal, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { lang, setLang, theme, toggleTheme, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: t.navHome, path: '/' },
    { name: t.navAbout, path: '/about' },
    { name: t.navProjects, path: '/projects' },
    { name: t.navExperience, path: '/experience' },
    { name: t.navContact, path: '/contact' },
  ];

  const toggleLanguage = () => {
    setLang(lang === 'fr' ? 'en' : 'fr');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 px-4 py-3 md:px-8 md:py-4 transition-all duration-300">
        <div className="max-w-6xl mx-auto glass-panel rounded-2xl px-4 py-3 md:px-6 flex items-center justify-between border border-white/5 shadow-xl shadow-black/30">
          
          {/* Logo Branding */}
          <Link to="/" className="flex items-center space-x-2 w-max group decoration-transparent">
            <div className="w-8 h-8 rounded-lg bg-copper-500 flex items-center justify-center font-bold text-black font-display text-base shadow-lg shadow-copper-500/20 group-hover:scale-105 transition-transform duration-300">
              G
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-white font-display group-hover:text-copper-400 transition-colors duration-200">
                Grégoire BATCHO
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#a1a1aa] uppercase">
                {lang === 'fr' ? 'Développeur Full Stack' : 'Full Stack Developer'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all duration-300 decoration-transparent ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeNavBackground"
                    className="absolute inset-0 bg-white/5 rounded-xl border border-white/5 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Practical utility: Language Switch & Admin Access Button */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-copper-500/35 transition-all duration-300 flex items-center justify-center cursor-pointer"
              title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-copper-600 animate-pulse" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
              )}
            </button>

            {/* Language toggle with subtle hover effect */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-xl text-[11px] font-mono font-medium tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-copper-500/35 transition-all duration-300 flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3 h-3 text-copper-400" />
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

          </div>

          {/* Mobile responsive triggers */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-400 hover:text-white bg-white/5 border border-white/5"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-copper-500" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg text-zinc-400 hover:text-white bg-white/5 border border-white/5"
            >
              <span className="text-[10px] font-mono font-bold leading-none">{lang === 'fr' ? 'EN' : 'FR'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white bg-white/5 border border-white/5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-30 pt-24 px-4 pb-6 bg-[#0c0c0b]/98 backdrop-blur-2xl md:hidden overflow-y-auto flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-2 mb-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#71717a] ml-4">
                  Navigation Menu
                </p>
              </div>
              <div className="flex flex-col space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.path}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-md font-medium tracking-wide transition-colors decoration-transparent ${
                        isActive(item.path)
                          ? 'text-white bg-white/5 font-semibold text-copper-400'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-white/5 pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    toggleLanguage();
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 rounded-xl bg-white/5 text-zinc-300 font-mono text-center hover:text-white flex items-center justify-center gap-2 border border-white/5"
                >
                  <Globe className="w-3.5 h-3.5 text-copper-400" />
                  {lang === 'fr' ? 'English (EN)' : 'Français (FR)'}
                </button>

              </div>

              <p className="text-center text-[10px] font-mono text-zinc-500">
                Grégoire BATCHO &copy; 2026. All rights reserved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
