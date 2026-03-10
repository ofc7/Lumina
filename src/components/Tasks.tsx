import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckSquare, Plus, Trash2, Filter, Search, MoreVertical } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { PRIORITIES, CATEGORIES } from '../constants';
import { cn } from '../lib/utils';
import { CreateModal } from './CreateModal';

export const Tasks = () => {
  const { tasks, toggleTaskComplete, deleteTask } = usePlanner();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'hepsi' | 'aktif' | 'tamamlandı'>('hepsi');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'aktif') return !t.completed;
    if (filter === 'tamamlandı') return t.completed;
    return true;
  });

  return (
    <div className="p-4 md:p-8 space-y-8 h-full flex flex-col overflow-hidden pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Görevler</h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">Yapılacak işlerini yönet ve takip et.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-brand-primary px-6 py-3 rounded-2xl font-medium text-white shadow-lg shadow-brand-primary/30 hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Yeni Görev
        </button>
      </header>

      <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <div className="glass p-1 rounded-xl flex shrink-0">
          {(['hepsi', 'aktif', 'tamamlandı'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize",
                filter === f 
                  ? "bg-white/10 text-white" 
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "glass p-4 rounded-2xl flex items-center gap-4 group transition-all",
              task.completed && "opacity-60"
            )}
          >
            <button 
              onClick={() => toggleTaskComplete(task.id)}
              className={cn(
                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                task.completed 
                  ? "bg-brand-primary border-brand-primary text-white" 
                  : "border-slate-600 hover:border-brand-primary"
              )}
            >
              {task.completed && <CheckSquare size={14} />}
            </button>
            <div className="flex-1">
              <h3 className={cn("font-semibold text-white", task.completed && "line-through text-slate-500")}>
                {task.title}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className={cn("text-[10px] font-bold uppercase tracking-wider", PRIORITIES.find(p => p.value === task.priority)?.color)}>
                  {task.priority}
                </span>
                <span className="text-[10px] text-slate-500">•</span>
                <span className="text-[10px] text-slate-400 capitalize">{task.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => deleteTask(task.id)}
                className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <button className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-lg transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <CheckSquare size={64} className="opacity-10 mb-4" />
            <p>Görev bulunamadı</p>
          </div>
        )}
      </div>

      <CreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type="task" 
      />
    </div>
  );
};
