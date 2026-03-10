import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, Tag, AlignLeft, Check } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { CATEGORIES, PRIORITIES } from '../constants';
import { Category, Priority } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export const CreateModal = ({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: 'event' | 'task' | 'note' | 'project' }) => {
  const { addEvent, addTask, addNote, addProject, selectedDate } = usePlanner();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('iş');
  const [priority, setPriority] = useState<Priority>('orta');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (type === 'event') {
      addEvent({
        title,
        description,
        category,
        date: selectedDate,
        startTime,
        endTime,
        color: CATEGORIES.find(c => c.value === category)?.color || 'text-blue-400',
      });
    } else if (type === 'task') {
      addTask({
        title,
        description,
        category,
        priority,
        dueDate: selectedDate,
      });
    } else if (type === 'note') {
      addNote({
        title,
        content: description,
      });
    } else if (type === 'project') {
      addProject({
        name: title,
        description,
        progress: 0,
        status: 'aktif',
        color: 'bg-brand-primary',
      });
    }

    // Reset and close
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] md:w-full max-w-lg glass z-[110] rounded-3xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto scrollbar-hide"
          >
            <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-white/5 sticky top-0 z-10 backdrop-blur-md">
              <h3 className="text-lg md:text-xl font-bold text-white">
                Yeni {type === 'event' ? 'Etkinlik' : type === 'task' ? 'Görev' : type === 'note' ? 'Not' : 'Proje'} Oluştur
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 md:space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Başlık</label>
                <input
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`${type === 'event' ? 'Etkinlik' : type === 'task' ? 'Görev' : type === 'note' ? 'Not' : 'Proje'} adı nedir?`}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>

              {(type === 'event' || type === 'task') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-primary transition-colors appearance-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  {type === 'task' ? (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Öncelik</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-primary transition-colors appearance-none"
                      >
                        {PRIORITIES.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tarih</label>
                      <div className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-slate-400 flex items-center gap-2">
                        <CalendarIcon size={16} />
                        {format(new Date(selectedDate), 'dd MMM yyyy', { locale: tr })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {type === 'event' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Başlangıç Saati</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bitiş Saati</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Açıklama</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detay ekleyin..."
                  rows={3}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-primary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary p-4 rounded-2xl text-white font-bold shadow-lg shadow-brand-primary/30 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Check size={20} />
                {type === 'event' ? 'Etkinlik' : type === 'task' ? 'Görev' : type === 'note' ? 'Not' : 'Proje'} Oluştur
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
