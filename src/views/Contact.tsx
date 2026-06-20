import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useLanguage } from '../LanguageContext.js';
import { Mail, MapPin, Send, CheckCircle, AlertTriangle, Github, Linkedin, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Contact() {
  const { lang, t } = useLanguage();

  useEffect(() => {
    document.title = t.contactSeoTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t.contactSeoDesc);
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
          <span>{t.contactEchangesLabel}</span>
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
                  <span className="text-zinc-300 font-semibold">{t.contactInfoParis}</span>
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
                href="https://github.com/batchogregoire"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2 font-mono text-xs decoration-transparent"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/gregoirebatcho"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2 font-mono text-xs decoration-transparent"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
                <span>LinkedIn</span>
              </a>
            </div>

          </div>

          {/* Quick statement block */}
          <div className="p-5 rounded-2xl bg-copper-500/5 border border-copper-500/10 text-xs text-zinc-400 leading-relaxed">
            {t.contactResendTip}
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
                placeholder={t.contactSubjectPlaceholder}
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
                placeholder={t.contactMessagePlaceholder}
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
                        {t.contactFormSuccessDetails}
                      </p>
                    </div>
                  </div>

                  {/* Integrated Resend Diagnostics Panel */}
                  {mailDetails && mailDetails.status !== 'sent' && (
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-300 space-y-2">
                      <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>
                          {t.contactResendNoticeTitle}
                        </span>
                      </div>
                      
                      <p className="leading-relaxed text-[11px] text-zinc-400">
                        {mailDetails.status === 'simulated' ? (
                          t.contactResendSimulated
                        ) : (
                          <>
                            {t.contactResendError}
                            <br />
                            <span className="font-mono bg-black/40 text-rose-400 px-1 py-0.5 rounded text-[10px] mt-1.5 block select-all break-all">
                              Err: {JSON.stringify(mailDetails.error || "Unknown Failure")}
                            </span>
                          </>
                        )}
                      </p>

                      <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-white/5 space-y-1 text-[10px] text-zinc-500">
                        <div className="font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Troubleshooting info:</div>
                        <div>• <strong>Recipient</strong>: <span className="underline">{mailDetails.debug?.recipient || 'unset'}</span></div>
                        <div>• <strong>Sender</strong>: <code>{mailDetails.debug?.usingOnboardingSender ? 'onboarding@resend.dev' : 'Custom domain'}</code></div>
                        <div className="mt-1 leading-normal text-zinc-600">
                          {mailDetails.debug?.usingOnboardingSender ? (
                            t.contactResendTipOnboarding
                          ) : (
                            t.contactResendTipCustom
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {mailDetails && mailDetails.status === 'sent' && (
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{t.contactResendSent}</span>
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
