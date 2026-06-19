import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useLanguage } from '../LanguageContext.js';
import { Mail, MapPin, Send, CheckCircle, AlertTriangle, Github, Linkedin, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Contact() {
  const { lang, t } = useLanguage();

  useEffect(() => {
    const title = lang === 'fr'
      ? 'Contactez Grégoire BATCHO | Recrutement & Freelance'
      : 'Contact Grégoire BATCHO | Opportunities & Recruitment';
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', lang === 'fr'
        ? 'Entrez en relation avec Grégoire BATCHO. Formulaire disponible pour toutes opportunités de recrutement ou projets de développement freelance.'
        : 'Initiate interaction with Grégoire BATCHO. Simple contact form is fully active for work opportunities, custom contract programs, or freelance projects.'
      );
    }
  }, [lang]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [mailDetails, setMailDetails] = useState<{
    status: string;
    error: any;
    debug: any;
  } | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setStatus('idle');
    setMailDetails(null);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMailDetails({
          status: data.emailStatus,
          error: data.emailError,
          debug: data.debugInfo
        });
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Error dispatching message:', err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Background spotlights */}
      <div className="glow-spot w-[350px] h-[350px] bg-copper-600/5 top-20 left-[-150px]" />
      <div className="glow-spot w-[350px] h-[350px] bg-amber-500/5 bottom-12 right-[-100px]" />

      {/* Title block */}
      <section className="space-y-4 mb-12">
        <div className="flex items-center space-x-2 text-copper-400 text-xs font-mono tracking-widest uppercase">
          <span className="w-3 h-px bg-copper-400" />
          <span>{lang === 'fr' ? 'Échanges & Recrutement' : 'Get in Touch'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
          {t.contactTitle}
        </h2>
        <p className="text-zinc-500 text-xs sm:text-sm max-w-xl">
          {t.contactSubtitle}
        </p>
      </section>

      {/* Form and info split container */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start relative z-10">
        
        {/* Left column: Direct Channels */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl">
            <h3 className="font-display font-semibold text-white text-base">
              {t.contactInfoDetails}
            </h3>

            <div className="space-y-4 text-xs font-mono">
              {/* Location */}
              <div className="flex items-start space-x-3 text-zinc-400">
                <MapPin className="w-4 h-4 text-copper-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-zinc-500 block uppercase text-[9px] tracking-wider">{t.contactInfoLocation}</span>
                  <span className="text-zinc-300 font-semibold">{t.contactInfoAbidjan}</span>
                </div>
              </div>

              {/* Email address */}
              <div className="flex items-start space-x-3 text-zinc-400">
                <Mail className="w-4 h-4 text-copper-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-zinc-500 block uppercase text-[9px] tracking-wider">Direct Mail</span>
                  <a href="mailto:batchogregoire0@gmail.com" className="text-copper-400 hover:underline inline-flex items-center gap-1">
                    <span>batchogregoire0@gmail.com</span>
                    <ExternalLink className="w-3 h-3 text-copper-500/50" />
                  </a>
                </div>
              </div>
            </div>

            {/* Social Grid */}
            <div className="pt-4 border-t border-white/5 flex gap-2">
              <a
                href="https://github.com/DOUTCHO"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2 font-mono text-xs decoration-transparent"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/gregoirebatcho"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2 font-mono text-xs decoration-transparent"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
                <span>LinkedIn</span>
              </a>
            </div>

          </div>

          
        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">{t.contactFormName}</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-950 border border-white/5 focus:border-copper-500 focus:shadow-sm focus:shadow-copper-500/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none transition-all duration-300"
                  placeholder="Jean Dupont"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">{t.contactFormEmail}</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-950 border border-white/5 focus:border-copper-500 focus:shadow-sm focus:shadow-copper-500/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none transition-all duration-300"
                  placeholder="jean.dupont@company.com"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">{t.contactFormSubject}</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-950 border border-white/5 focus:border-copper-500 focus:shadow-sm focus:shadow-copper-500/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none transition-all duration-300"
                placeholder={lang === 'fr' ? 'Sujet du message' : 'Topic description'}
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">{t.contactFormMessage}</label>
              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-950 border border-white/5 focus:border-copper-500 focus:shadow-sm focus:shadow-copper-500/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none transition-all duration-300 resize-none leading-relaxed"
                placeholder={lang === 'fr' ? 'Saisissez votre demande...' : 'Write details here...'}
              />
            </div>

            {/* Submit status boxes */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{t.contactFormSuccess}</p>
                      <p className="text-[10px] opacity-80 mt-1">
                        {lang === 'fr' 
                          ? "✓ Votre message a bien été enregistré avec succès en base de données et s'affiche sur votre espace administrateur."
                          : "✓ Your message has been saved successfully in the database and is visible on your private admin panel."}
                      </p>
                    </div>
                  </div>

                  {/* Integrated Resend Diagnostics Panel */}
                  {/* . */}

                  {mailDetails && mailDetails.status === 'sent' && (
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{lang === 'fr' ? 'Email de notification transmis avec succès via Resend !' : 'Notification email successfully dispatched via Resend !'}</span>
                    </div>
                  )}
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{t.contactFormError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.email || !formData.message}
              className="w-full py-3.5 rounded-xl font-medium tracking-wide text-xs sm:text-sm bg-copper-500 hover:bg-copper-400 disabled:opacity-40 disabled:hover:bg-copper-500 text-black shadow-lg shadow-copper-500/15 cursor-pointer disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Send className={`w-3.5 h-3.5 ${loading ? 'animate-bounce' : ''}`} />
              <span>{loading ? t.contactFormSending : t.contactFormSubmit}</span>
            </button>

          </form>
        </div>

      </section>

    </div>
  );
}
