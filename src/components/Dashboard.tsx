import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Plus,
  MoreVertical
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { format, isToday, isFuture, parseISO } from 'date-fns';
import { CATEGORIES, PRIORITIES } from '../constants';
import { cn } from '../lib/utils';
import { CreateModal } from './CreateModal';

const StatCard = ({ label, value, icon: Icon, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="glass p-6 rounded-3xl flex items-center gap-4 group hover:scale-[1.02] transition-transform text-left w-full"
  >
    <div className={cn("p-4 rounded-2xl", color)}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </button>
);

export const Dashboard = () => {
  const { events, tasks, setViewMode, toggleTaskComplete } = usePlanner();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'event' | 'task'>('event');

  const todayEvents = events.filter(e => isToday(parseISO(e.date)));
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasksCount = tasks.filter(t => t.completed).length;

  const openModal = (type: 'event' | 'task') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 h-full overflow-y-auto scrollbar-hide pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Tekrar hoş geldin, <span className="text-brand-primary">Kullanıcı</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Bugün için {todayEvents.length} etkinliğin ve {pendingTasks.length} görevin var.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button 
            onClick={() => setViewMode('calendar')}
            className="flex-1 md:flex-none glass px-4 md:px-6 py-3 rounded-2xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <CalendarIcon size={18} />
            Takvim
          </button>
          <button 
            onClick={() => openModal('event')}
            className="flex-1 md:flex-none bg-brand-primary px-4 md:px-6 py-3 rounded-2xl font-medium text-white shadow-lg shadow-brand-primary/30 hover:brightness-110 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={18} />
            Yeni Etkinlik
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Bugünkü Etkinlikler" 
          value={todayEvents.length} 
          icon={CalendarIcon} 
          color="bg-blue-500/20 text-blue-400" 
          onClick={() => setViewMode('calendar')}
        />
        <StatCard 
          label="Bekleyen Görevler" 
          value={pendingTasks.length} 
          icon={Clock} 
          color="bg-orange-500/20 text-orange-400" 
          onClick={() => setViewMode('tasks')}
        />
        <StatCard 
          label="Tamamlananlar" 
          value={completedTasksCount} 
          icon={CheckCircle2} 
          color="bg-emerald-500/20 text-emerald-400" 
          onClick={() => setViewMode('tasks')}
        />
        <StatCard 
          label="Verimlilik" 
          value={tasks.length > 0 ? `%${Math.round((completedTasksCount / tasks.length) * 100)}` : '%0'} 
          icon={TrendingUp} 
          color="bg-purple-500/20 text-purple-400" 
          onClick={() => setViewMode('projects')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Bugünkü Program</h2>
            <button 
              onClick={() => setViewMode('calendar')}
              className="text-brand-primary text-sm font-medium hover:underline"
            >
              Hepsini gör
            </button>
          </div>
          
          <div className="space-y-4">
            {todayEvents.length > 0 ? todayEvents.map(event => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setViewMode('calendar')}
                className="glass p-4 md:p-5 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={cn("w-1 h-10 md:w-1.5 md:h-12 rounded-full", CATEGORIES.find(c => c.value === event.category)?.bg.replace('/20', ''))} />
                  <div>
                    <h3 className="font-semibold text-white text-sm md:text-base">{event.title}</h3>
                    <p className="text-slate-400 text-xs md:text-sm">{event.startTime} - {event.endTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <span className={cn("hidden sm:inline-block px-3 py-1 rounded-full text-xs font-medium", CATEGORIES.find(c => c.value === event.category)?.bg, CATEGORIES.find(c => c.value === event.category)?.color)}>
                    {event.category}
                  </span>
                  <button className="p-2 text-slate-500 hover:text-white transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="glass p-8 md:p-12 rounded-3xl flex flex-col items-center justify-center text-slate-500 border-dashed">
                <CalendarIcon size={48} className="mb-4 opacity-20" />
                <p className="text-sm md:text-base">Bugün için planlanmış etkinlik yok</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Hızlı Görevler</h2>
          <div className="glass p-6 rounded-3xl space-y-4">
            {pendingTasks.slice(0, 5).map(task => (
              <div 
                key={task.id} 
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => setViewMode('tasks')}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskComplete(task.id);
                  }}
                  className="w-5 h-5 rounded-md border border-slate-600 flex items-center justify-center hover:border-brand-primary transition-colors"
                >
                  <div className="w-2.5 h-2.5 rounded-sm bg-brand-primary opacity-0 group-hover:opacity-20" />
                </button>
                <span className="text-slate-300 text-sm flex-1 truncate">{task.title}</span>
                <span className={cn("text-[10px] font-bold uppercase tracking-wider", PRIORITIES.find(p => p.value === task.priority)?.color)}>
                  {task.priority}
                </span>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">Her şey tamam!</p>
            )}
            <button 
              onClick={() => openModal('task')}
              className="w-full mt-4 p-3 rounded-xl border border-white/5 text-slate-400 text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Görev Ekle
            </button>
          </div>
        </div>
      </div>

      <CreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={modalType} 
      />
    </div>
  );
};
