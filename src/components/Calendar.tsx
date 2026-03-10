import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO,
  eachDayOfInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { CATEGORIES } from '../constants';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { CreateModal } from './CreateModal';

import { tr } from 'date-fns/locale';

export const Calendar = () => {
  const { 
    events, 
    calendarMode, 
    setCalendarMode, 
    selectedDate, 
    setSelectedDate,
    setSelectedEventId
  } = usePlanner();
  
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-start">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: tr })}
          </h2>
          <div className="flex items-center glass p-1 rounded-xl">
            <button 
              onClick={prevMonth}
              className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:sm font-medium text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
            >
              Bugün
            </button>
            <button 
              onClick={nextMonth}
              className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="glass p-1 rounded-xl flex shrink-0">
            {(['gün', 'hafta', 'ay'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setCalendarMode(mode)}
                className={cn(
                  "px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-lg transition-all capitalize",
                  calendarMode === mode 
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
          <button className="glass p-2.5 md:p-3 rounded-xl text-slate-400 hover:text-white transition-colors shrink-0">
            <Filter size={18} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-primary px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium text-white shadow-lg shadow-brand-primary/30 hover:brightness-110 transition-all flex items-center gap-2 text-xs md:text-sm shrink-0"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Etkinlik Ekle</span>
            <span className="sm:hidden">Ekle</span>
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    return (
      <div className="grid grid-cols-7 mb-2 md:mb-4">
        {days.map((day, index) => (
          <div key={index} className="text-center text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      const weekKey = `week-${day.getTime()}`;
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = day;
        const dayEvents = events.filter(e => isSameDay(parseISO(e.date), cloneDay));

        days.push(
          <div
            key={day.toISOString()}
            className={cn(
              "min-h-[80px] md:min-h-[140px] p-1 md:p-2 border-r border-b border-white/5 relative group transition-colors hover:bg-white/[0.02]",
              !isSameMonth(day, monthStart) ? "opacity-30" : "opacity-100",
              isSameDay(day, new Date()) && "bg-brand-primary/5"
            )}
            onClick={() => setSelectedDate(cloneDay.toISOString())}
          >
            <div className="flex justify-between items-start mb-1 md:mb-2">
              <span className={cn(
                "text-xs md:text-sm font-medium w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full transition-colors",
                isSameDay(day, new Date()) ? "bg-brand-primary text-white" : "text-slate-400 group-hover:text-slate-200"
              )}>
                {formattedDate}
              </span>
              <button className="opacity-0 group-hover:opacity-100 p-0.5 md:p-1 text-slate-500 hover:text-brand-primary transition-all">
                <Plus size={12} />
              </button>
            </div>
            <div className="space-y-0.5 md:space-y-1">
              {dayEvents.slice(0, 3).map(event => (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEventId(event.id);
                  }}
                  className={cn(
                    "text-[8px] md:text-[10px] p-0.5 md:p-1.5 rounded-md truncate cursor-pointer transition-all hover:brightness-125",
                    CATEGORIES.find(c => c.value === event.category)?.bg,
                    CATEGORIES.find(c => c.value === event.category)?.color
                  )}
                >
                  <span className="hidden md:inline font-bold mr-1">{event.startTime}</span>
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-[8px] md:text-[10px] text-slate-500 pl-0.5 md:pl-1 font-medium">
                  + {dayEvents.length - 3}
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={weekKey}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="glass rounded-2xl md:rounded-3xl overflow-hidden border-white/10">{rows}</div>;
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col overflow-hidden pb-24 md:pb-8">
      {renderHeader()}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {calendarMode === 'ay' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderDays()}
            {renderCells()}
          </motion.div>
        )}
        {calendarMode !== 'ay' && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <CalendarIcon size={64} className="mb-4 opacity-20" />
            <p className="text-xl font-medium capitalize">{calendarMode} görünümü yakında eklenecek</p>
            <button 
              onClick={() => setCalendarMode('ay')}
              className="mt-4 text-brand-primary hover:underline"
            >
              Ay görünümüne dön
            </button>
          </div>
        )}
      </div>
      <CreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type="event" 
      />
    </div>
  );
};
