import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FolderKanban, Plus, MoreVertical, Trash2, CheckCircle2 } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { cn } from '../lib/utils';
import { CreateModal } from './CreateModal';

export const Projects = () => {
  const { projects, deleteProject, updateProject, addProjectTask, toggleProjectTask } = usePlanner();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-8 space-y-8 h-full flex flex-col overflow-hidden pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Projeler</h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">Büyük hedeflerini parçalara böl ve ilerlemeyi takip et.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full md:w-auto bg-brand-primary px-6 py-3 rounded-2xl font-medium text-white shadow-lg shadow-brand-primary/30 hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Yeni Proje
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-y-auto scrollbar-hide pb-8">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-[2rem] flex flex-col gap-6 group relative overflow-hidden"
          >
            <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl -mr-16 -mt-16", project.color)} />
            
            <div className="flex justify-between items-start relative z-10">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", project.color)}>
                <FolderKanban size={24} />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setActiveMenu(activeMenu === project.id ? null : project.id)}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
                {activeMenu === project.id && (
                  <div className="absolute right-0 mt-2 w-48 glass border border-white/10 rounded-2xl p-2 z-50 shadow-2xl">
                    <button 
                      onClick={() => {
                        updateProject(project.id, { status: project.status === 'aktif' ? 'tamamlandı' : 'aktif' });
                        setActiveMenu(null);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all text-sm"
                    >
                      <CheckCircle2 size={16} />
                      {project.status === 'aktif' ? 'Tamamlandı İşaretle' : 'Aktif Et'}
                    </button>
                    <button 
                      onClick={() => {
                        deleteProject(project.id);
                        setActiveMenu(null);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all text-sm"
                    >
                      <Trash2 size={16} />
                      Sil
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
              <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">İlerleme</span>
                <span className="text-white font-bold">%{project.progress}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  className={cn("h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]", project.color)}
                />
              </div>
            </div>

            {/* Tasks Section */}
            <div className="space-y-3 relative z-10 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Görevler</h4>
                <span className="text-[10px] text-slate-500">
                  {(project.tasks || []).filter(t => t.completed).length}/{(project.tasks || []).length}
                </span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide pr-1">
                {(project.tasks || []).map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => toggleProjectTask(project.id, task.id)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all group/task"
                  >
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all",
                      task.completed ? "bg-emerald-500 border-emerald-500" : "border-white/20 group-hover/task:border-white/40"
                    )}>
                      {task.completed && <CheckCircle2 size={10} className="text-white" />}
                    </div>
                    <span className={cn(
                      "text-sm transition-all",
                      task.completed ? "text-slate-500 line-through" : "text-slate-300"
                    )}>
                      {task.title}
                    </span>
                  </div>
                ))}
                {(!project.tasks || project.tasks.length === 0) && (
                  <p className="text-[10px] text-slate-600 italic text-center py-2">Henüz görev yok</p>
                )}
              </div>
              
              <form 
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const input = form.elements.namedItem('taskTitle') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    addProjectTask(project.id, input.value.trim());
                    input.value = '';
                  }
                }}
                className="flex gap-2 mt-2"
              >
                <input 
                  name="taskTitle"
                  autoComplete="off"
                  placeholder="Yeni görev..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                />
                <button 
                  type="submit"
                  className="p-2 bg-brand-primary/20 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all"
                >
                  <Plus size={14} />
                </button>
              </form>
            </div>

            <div className="flex justify-between items-center pt-2 relative z-10 border-t border-white/5">
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                project.status === 'aktif' ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
              )}>
                {project.status}
              </span>
              <div className="flex -space-x-2">
                {[1, 2].map(i => (
                  <div key={`user-${project.id}-${i}`} className="w-7 h-7 rounded-full border-2 border-bg-dark bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    U{i}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
        
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="glass p-6 rounded-[2rem] border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-brand-primary hover:border-brand-primary/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
            <Plus size={24} />
          </div>
          <span className="font-bold">Yeni Proje Başlat</span>
        </button>
      </div>

      <CreateModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        type="project" 
      />
    </div>
  );
};
