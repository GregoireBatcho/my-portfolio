import { useLanguage } from '../LanguageContext.js';
import { Github, Linkedin, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FooterPanel() {
  const { lang, t } = useLanguage();

  return (
    <footer className="relative w-full border-t border-white/5 bg-[#0a0a09] py-12 px-6 overflow-hidden mt-auto">
      {/* Background glow node */}
      <div className="glow-spot w-[300px] h-[300px] bg-copper-600/5 -bottom-24 -left-20" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between relative z-10 space-y-6 md:space-y-0 text-sm">
        
        {/* Author signoff and mini message */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-copper-500 flex items-center justify-center font-bold text-black font-display text-xs">
              G
            </div>
            <span className="font-display font-medium text-[#fff] tracking-wide">
              Grégoire BATCHO
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">
            {lang === 'fr' 
              ? 'Concepteur & Développeur d’applications web d’exception.' 
              : 'Architecting elegant, responsive web applications with precision.'
            }
          </p>
        </div>

        {/* Dynamic Social handles */}
        <div className="flex items-center space-x-6">
          <a
            href="https://github.com/DOUTCHO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-[#fff] transition-colors"
            title={lang === 'en' ? "GitHub Profile" : "Profile GitHub"}
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/gregoirebatcho"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-[#0077b5] transition-colors"
            title={lang === 'en' ? "LinkedIn Profile" : "Profile LinkedIn"}
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="mailto:batchogregoire0@gmail.com"
            className="text-zinc-400 hover:text-copper-400 transition-colors"
            title={lang === 'en' ? "Send Email" : "Envoi d'email"}
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        {/* Copyright claims */}
        <div className="flex flex-col md:items-end text-xs text-zinc-505 font-mono space-y-1">
          <div className="flex items-center space-x-2 text-zinc-500">
            <span>&copy; {new Date().getFullYear()}</span>
            <span>&middot;</span>
            <span>{t.footerCredits}</span>
          </div>
          
        </div>

      </div>
    </footer>
  );
}
