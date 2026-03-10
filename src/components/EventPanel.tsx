import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, MapPin, Users, AlignLeft, Trash2, Edit3, Check } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { CATEGORIES } from '../constants';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

export const EventPanel = () => {
  const { selectedEventId, setSelectedEventId, events, deleteEvent } = usePlanner();
  const event = events.find(e => e.id === selectedEventId);

  if (!selectedEventId) return null;

  return (
    <AnimatePresence>
      {selectedEventId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEventId(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full md:max-w-md glass z-[60] p-6 md:p-8 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            {event ? (
              <>
                <div className="flex justify-between items-start mb-8">
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
                    CATEGORIES.find(c => c.value === event.category)?.bg,
                    CATEGORIES.find(c => c.value === event.category)?.color
                  )}>
                    {event.category}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                      <Edit3 size={20} />
                    </button>
                    <button 
                      onClick={() => deleteEvent(event.id)}
                      className="p-2 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button 
                      onClick={() => setSelectedEventId(null)}
                      className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-8 overflow-y-auto scrollbar-hide flex-1">
                  <div>
                    <h2 className="text-3xl font-bold text-white leading-tight mb-2">
                      {event.title}
                    </h2>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={16} />
                      <span className="text-sm font-medium capitalize">
                        {format(parseISO(event.date), 'EEEE, d MMMM', { locale: tr })} • {event.startTime} - {event.endTime}
                      </span>
                    </div>
                  </div>

                  {event.description && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-500">
                        <AlignLeft size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Açıklama</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Konum</span>
                      </div>
                      <p className="text-slate-300 text-sm">
                        {event.location || 'Konum belirtilmedi'}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Users size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Katılımcılar</span>
                      </div>
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-dark bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                            U{i}
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-bg-dark bg-brand-primary flex items-center justify-center text-[10px] font-bold">
                          +2
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5">
                    <button className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl text-slate-300 font-medium transition-all flex items-center justify-center gap-2">
                      <Check size={18} />
                      Tamamlandı Olarak İşaretle
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <p>Event not found</p>
                <button 
                  onClick={() => setSelectedEventId(null)}
                  className="mt-4 text-brand-primary hover:underline"
                >
                  Close Panel
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
