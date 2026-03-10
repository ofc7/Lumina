import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, Bot, User, Search, Brain, Loader2 } from 'lucide-react';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { usePlanner } from '../context/PlannerContext';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'search' | 'thinking';
}

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Merhaba! Ben Lumina AI. Programını planlamana, etkinliklerini aramana veya görevlerini düzenlemene yardımcı olabilirim. Bugün sana nasıl yardımcı olabilirim?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { events, tasks } = usePlanner();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      // Determine if we need thinking mode or search grounding
      const needsThinking = input.toLowerCase().includes('plan') || input.toLowerCase().includes('düzenle') || input.toLowerCase().includes('organize') || input.length > 50;
      const needsSearch = input.toLowerCase().includes('ara') || input.toLowerCase().includes('bul') || input.toLowerCase().includes('nedir');

      let responseText = "";

      if (needsThinking) {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: `Mevcut Bağlam:
Etkinlikler: ${JSON.stringify(events)}
Görevler: ${JSON.stringify(tasks)}

Kullanıcı İsteği: ${input}`,
          config: {
            systemInstruction: "Sen profesyonel bir planlama asistanısın. Kullanıcıya sağlanan etkinlik ve görev bağlamını kullanarak hayatını organize etmesine yardımcı ol. Kısa ama yardımcı ol. Biçimlendirme için markdown kullan. Türkçe cevap ver.",
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
          },
        });
        responseText = response.text || "Üzgünüm, bu isteği işleyemedim.";
      } else {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: input,
          config: {
            systemInstruction: "Sen bir takvim uygulaması için yardımcı bir asistansın. Kullanıcının sorusuna kısa ve öz cevap ver. Türkçe cevap ver.",
            tools: needsSearch ? [{ googleSearch: {} }] : []
          },
        });
        responseText = response.text || "Üzgünüm, bu isteği işleyemedim.";
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: responseText,
        type: needsThinking ? 'thinking' : (needsSearch ? 'search' : undefined)
      }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error while processing your request. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-brand-primary/40 hover:scale-110 transition-transform z-40 group"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-0 md:bottom-24 right-0 md:right-8 w-full md:w-[400px] h-full md:h-[600px] glass md:rounded-3xl z-50 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center text-brand-primary">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Lumina AI</h3>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <div key={i} className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center",
                    msg.role === 'user' ? "bg-slate-700" : "bg-brand-primary/20 text-brand-primary"
                  )}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm",
                    msg.role === 'user' ? "bg-brand-primary text-white" : "bg-white/5 text-slate-200"
                  )}>
                    {msg.type && (
                      <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold uppercase tracking-wider opacity-50">
                        {msg.type === 'thinking' ? <Brain size={12} /> : <Search size={12} />}
                        {msg.type}
                      </div>
                    )}
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/20 text-brand-primary flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-brand-primary" />
                    <span className="text-sm text-slate-400">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Lumina anything..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
