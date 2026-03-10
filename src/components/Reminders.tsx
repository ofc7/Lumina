import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Plus, Trash2, Clock, Calendar } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

export const Reminders = () => {
  const { reminders, deleteReminder, addReminder } = usePlanner();
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addReminder({
      title: newTitle,
      time: new Date().toISOString(),
      repeat: 'yok'
    });
    setNewTitle('');
  };

  return (
    <div className="p-4 md:p-8 space-y-8 h-full flex flex-col overflow-hidden pb-24 md:pb-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Hatırlatıcılar</h1>
        <p className="text-slate-400 mt-2 text-sm md:text-base">Önemli anları asla kaçırma.</p>
      </header>

      <form onSubmit={handleAdd} className="relative">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Hızlı hatırlatıcı ekle..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-16 text-white focus:outline-none focus:border-brand-primary transition-colors"
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-primary p-2 rounded-xl text-white shadow-lg shadow-brand-primary/30 hover:brightness-110 transition-all"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4">
        {reminders.length > 0 ? reminders.map((reminder) => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-5 rounded-3xl flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">{reminder.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {format(parseISO(reminder.time), 'HH:mm')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {format(parseISO(reminder.time), 'dd MMM', { locale: tr })}
                  </span>
                  <span className="capitalize px-2 py-0.5 bg-white/5 rounded-full">
                    {reminder.repeat}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => deleteReminder(reminder.id)}
              className="p-3 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={20} />
            </button>
          </motion.div>
        )) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <Bell size={64} className="opacity-10 mb-4" />
            <p>Hatırlatıcı bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
};
