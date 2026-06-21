import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../lib/i18n';
import { Sparkles, Send, Bot, RefreshCw, UserCheck2, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export default function GeminiAgent() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add default initial greeting on load
    setMessages([
      {
        id: 'init',
        role: 'model',
        text: t('gemini.intro'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [t]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(1).map(m => ({ role: m.role, text: m.text }))
        })
      });

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: `mod-${Date.now()}`,
        role: 'model',
        text: data.reply || "I am currently syncing. Try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, modelMsg]);
    } catch (_) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: "My apologies! I failed to sync with the Gemini engine. Please drop a brief line to Grégoire at batchogregoire81@gmail.com!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto rounded-2xl border border-[#d97736]/20 bg-neutral-900/10 hover:border-[#d97736]/30 transition-colors backdrop-blur-md overflow-hidden flex flex-col h-[550px] shadow-lg shadow-[#d97736]/3"
      id="gemini-assistant"
    >
      {/* HEADER SECTION */}
      <div className="px-6 py-4 border-b border-zinc-800/80 bg-neutral-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#d97736]/15 flex items-center justify-center border border-[#d97736]/20">
            <Sparkles className="w-4 h-4 text-[#d97736] animate-pulse" />
          </div>
          <div>
            <h4 className="text-white font-display font-medium text-xs tracking-wider uppercase flex items-center gap-2">
              {t('gemini.title')}
              <span className="text-[9px] font-mono font-bold uppercase bg-[#d97736] text-white px-2 py-0.5 rounded-full shadow">
                gemini 3.5
              </span>
            </h4>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
              Online • Real-Time Resume Agent
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-zinc-500" />
        </div>
      </div>

      {/* CHAT MESSAGES VIEWER */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-neutral-950/20">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center border ${isUser ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-[#d97736]/10 border-[#d97736]/20 text-[#d97736]'}`}>
                  {isUser ? <UserCheck2 className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div>
                  <div className={`px-4 py-3 rounded-2xl text-[12.5px] leading-relaxed shadow-md ${isUser ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tr-none' : 'bg-[#d97736]/5 border border-[#d97736]/10 text-zinc-100 rounded-tl-none'}`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  <span className="block text-[9px] font-mono text-zinc-600 mt-1 pl-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-full bg-[#d97736]/10 border border-[#d97736]/20 text-[#d97736] flex items-center justify-center animate-spin">
                <RefreshCw className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                AI Grégoire is analyzing code repositories...
              </span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* CHAT INPUT FORM */}
      <form onSubmit={handleSend} className="p-4 border-t border-zinc-800 bg-neutral-950/60 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('gemini.placeholder')}
          className="flex-1 bg-neutral-950/80 border border-zinc-900 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#d97736]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 rounded-xl bg-[#d97736] hover:bg-[#c2410c] text-white transition-colors disabled:opacity-45 cursor-pointer shadow-md shadow-[#d97736]/10"
          aria-label="Send message to AI assistant"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
}
