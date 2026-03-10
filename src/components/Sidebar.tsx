import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Bell, 
  FolderKanban, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  AlignLeft,
  Clock,
  X
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { ViewMode } from '../types';
import { cn } from '../lib/utils';

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  collapsed 
}: { 
  icon: any; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  collapsed: boolean;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full p-3 rounded-xl transition-all duration-200 group relative",
      active 
        ? "bg-brand-primary/20 text-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.2)]" 
        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
    )}
  >
    <Icon size={20} className={cn("shrink-0", active && "animate-pulse")} />
    {!collapsed && (
      <motion.span 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="ml-3 font-medium text-sm"
      >
        {label}
      </motion.span>
    )}
    {collapsed && (
      <div className="absolute left-14 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    )}
  </button>
);

export const Sidebar = () => {
  const { viewMode, setViewMode, isSidebarOpen, toggleSidebar } = usePlanner();

  const menuItems: { id: ViewMode; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    { id: 'calendar', label: 'Takvim', icon: CalendarIcon },
    { id: 'tasks', label: 'Görevler', icon: CheckSquare },
    { id: 'reminders', label: 'Hatırlatıcılar', icon: Bell },
    { id: 'projects', label: 'Projeler', icon: FolderKanban },
    { id: 'notes', label: 'Notlar', icon: AlignLeft },
    { id: 'focus', label: 'Odaklanma', icon: Clock },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 240 : 80 }}
        className="glass h-screen hidden md:flex flex-col z-40 relative"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg shadow-brand-primary/30">
                  <span className="font-bold text-white">L</span>
                </div>
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Lumina
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-small"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center mx-auto shadow-lg shadow-brand-primary/30"
              >
                <span className="font-bold text-white">L</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 px-3 space-y-2 mt-4">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={viewMode === item.id}
              onClick={() => setViewMode(item.id)}
              collapsed={!isSidebarOpen}
            />
          ))}
        </div>

        <div className="p-4">
          <button
            onClick={toggleSidebar}
            className="w-full p-2 rounded-lg hover:bg-white/5 text-slate-400 flex items-center justify-center transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass z-50 px-4 py-2 flex justify-around items-center border-t border-white/10">
        {menuItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setViewMode(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
              viewMode === item.id ? "text-brand-primary" : "text-slate-400"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
        <button
          onClick={toggleSidebar}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl text-slate-400"
          )}
        >
          <AlignLeft size={20} />
          <span className="text-[10px] font-medium">Menü</span>
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-64 glass p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                    <span className="font-bold text-white">L</span>
                  </div>
                  <span className="font-bold text-xl text-white">Lumina</span>
                </div>
                <button onClick={toggleSidebar} className="text-slate-400">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setViewMode(item.id);
                      toggleSidebar();
                    }}
                    className={cn(
                      "flex items-center w-full p-3 rounded-xl transition-all",
                      viewMode === item.id 
                        ? "bg-brand-primary/20 text-brand-primary" 
                        : "text-slate-400 hover:bg-white/5"
                    )}
                  >
                    <item.icon size={20} className="shrink-0" />
                    <span className="ml-3 font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
