"use client";

import React, { useState } from 'react';
import { useLanguage } from '../lib/i18n';
import { Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus('error');
      setErrorMessage(t('contact.fillFields'));
      return;
    }

    setLoading(true);
    setStatus('idle');
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || t('contact.serverRejected'));
      }
    } catch (_) {
      setStatus('error');
      setErrorMessage(t('contact.dbConnectFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 dark:bg-emerald-900/5 text-center flex flex-col items-center gap-4 hover-glow"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 " />
          </div>
          <h4 className="text-stone-850 dark:text-white font-display font-semibold text-lg">
            {t('contact.successTitle')}
          </h4>
          <p className="text-stone-600 dark:text-zinc-400 text-xs max-w-md leading-relaxed">
            {t('contact.successMsg')}
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-4 px-4 py-2 border border-stone-200 dark:border-zinc-800 rounded-lg text-[11px] font-mono hover:bg-stone-50 dark:hover:bg-neutral-900 text-stone-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            {t('contact.sendAnother')}
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-2xl border border-stone-200 bg-white/80 dark:border-zinc-800 dark:bg-neutral-900/20 luxury-glow space-y-6 shadow-sm dark:shadow-none transition-colors">
          {status === 'error' && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-900/5 text-red-500 dark:text-red-400 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage || t('contact.errorMsg')}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-stone-500 dark:text-zinc-400 text-[10px] uppercase font-mono tracking-wider mb-2 font-bold select-none">
                {t('contact.nameLabel')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Grégoire BATCHO"
                className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-600 focus:outline-none focus:border-[#d97736]"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-stone-500 dark:text-zinc-400 text-[10px] uppercase font-mono tracking-wider mb-2 font-bold select-none">
                {t('contact.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@domain.com"
                className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-600 focus:outline-none focus:border-[#d97736]"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-stone-500 dark:text-zinc-400 text-[10px] uppercase font-mono tracking-wider mb-2 font-bold select-none">
              {t('contact.subjectLabel')}
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Full-stack contract or junior partnership..."
              className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-600 focus:outline-none focus:border-[#d97736]"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-stone-500 dark:text-zinc-400 text-[10px] uppercase font-mono tracking-wider mb-2 font-bold select-none">
              {t('contact.messageLabel')}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="Hi Grégoire, we are looking for a junior full stack developer in Paris..."
              className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-600 focus:outline-none focus:border-[#d97736] resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            id="contact-submit-btn"
            className="w-full bg-gradient-to-r from-[#d97736] to-[#c2410c] hover:opacity-95 text-white py-4 px-6 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all shadow-lg shadow-[#d97736]/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                {t('contact.submittingBtn')}
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                {t('contact.submitBtn')}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
