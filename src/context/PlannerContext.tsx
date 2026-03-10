import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  PlannerState, Event, Task, Reminder, ViewMode, CalendarMode, Category, Note, Project 
} from '../types';
import { format, startOfToday } from 'date-fns';

interface PlannerContextType extends PlannerState {
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setViewMode: (mode: ViewMode) => void;
  setCalendarMode: (mode: CalendarMode) => void;
  setSelectedDate: (date: string) => void;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  setSelectedEventId: (id: string | null) => void;
  setSelectedTaskId: (id: string | null) => void;
  addEvent: (event: Omit<Event, 'id'>, id?: string) => string;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'completed'>, id?: string) => string;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'notified'>, id?: string) => string;
  deleteReminder: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>, id?: string) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'tasks'>, id?: string) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addProjectTask: (projectId: string, title: string) => void;
  toggleProjectTask: (projectId: string, taskId: string) => void;
  settings: {
    darkMode: boolean;
    notifications: boolean;
    soundEffects: boolean;
    autoSave: boolean;
    language: string;
    sync: boolean;
  };
  updateSettings: (updates: Partial<PlannerContextType['settings']>) => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('lumina_events');
    if (saved) return JSON.parse(saved);
    
    // Sample Events
    const today = new Date();
    return [
      {
        id: '1',
        title: 'Sabah Senkronizasyonu',
        description: 'Günlük ekip toplantısı',
        date: today.toISOString(),
        startTime: '09:30',
        endTime: '10:00',
        color: 'text-purple-400',
        category: 'toplantı'
      },
      {
        id: '2',
        title: 'Lumina Tasarım Süreci',
        description: 'UI/UX iyileştirmeleri üzerine çalışma',
        date: today.toISOString(),
        startTime: '13:00',
        endTime: '15:30',
        color: 'text-blue-400',
        category: 'iş'
      }
    ];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('lumina_tasks');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 't1',
        title: 'Dashboard tasarımını bitir',
        priority: 'yüksek',
        category: 'iş',
        completed: false,
        dueDate: new Date().toISOString()
      },
      {
        id: 't2',
        title: 'PR\'ları incele',
        priority: 'orta',
        category: 'iş',
        completed: true,
        dueDate: new Date().toISOString()
      }
    ];
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('lumina_reminders');
    return saved ? JSON.parse(saved) : [
      { id: 'r1', title: 'Su içmeyi unutma', time: new Date().toISOString(), repeat: 'günlük', notified: false }
    ];
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('lumina_notes');
    return saved ? JSON.parse(saved) : [
      { id: 'n1', title: 'Fikirler', content: 'Yeni uygulama fikirleri buraya...', updatedAt: new Date().toISOString() }
    ];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error('Error loading projects:', e);
    }

    return [
      { 
        id: 'p1', 
        name: 'Lumina App', 
        description: 'Modern takvim uygulaması', 
        progress: 65, 
        status: 'aktif', 
        color: 'bg-brand-primary',
        tasks: [
          { id: 'pt1', title: 'UI Tasarımı', completed: true },
          { id: 'pt2', title: 'Context API Kurulumu', completed: true },
          { id: 'pt3', title: 'Odaklanma Sayfası', completed: false }
        ]
      }
    ];
  });

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('ay');
  const [selectedDate, setSelectedDate] = useState<string>(startOfToday().toISOString());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('lumina_settings');
    return saved ? JSON.parse(saved) : {
      darkMode: true,
      notifications: true,
      soundEffects: true,
      autoSave: true,
      language: 'Türkçe',
      sync: true
    };
  });

  useEffect(() => {
    localStorage.setItem('lumina_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('lumina_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('lumina_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('lumina_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('lumina_projects', JSON.stringify(projects));
  }, [projects]);

  const generateId = () => {
    try {
      return crypto.randomUUID();
    } catch (e) {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
  };

  const addEvent = useCallback((eventData: Omit<Event, 'id'>, id?: string) => {
    const newEvent: Event = {
      ...eventData,
      id: id || generateId(),
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent.id;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    if (selectedEventId === id) setSelectedEventId(null);
  }, [selectedEventId]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'completed'>, id?: string) => {
    const newTask: Task = {
      ...taskData,
      id: id || generateId(),
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
    return newTask.id;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
  }, [selectedTaskId]);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const addReminder = useCallback((data: Omit<Reminder, 'id' | 'notified'>, id?: string) => {
    const newReminder: Reminder = { ...data, id: id || generateId(), notified: false };
    setReminders(prev => [...prev, newReminder]);
    return newReminder.id;
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const addNote = useCallback((data: Omit<Note, 'id' | 'updatedAt'>, id?: string) => {
    const newNote: Note = { ...data, id: id || generateId(), updatedAt: new Date().toISOString() };
    setNotes(prev => [...prev, newNote]);
    return newNote.id;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const addProject = useCallback((data: Omit<Project, 'id' | 'tasks'>, id?: string) => {
    const newProject: Project = { ...data, id: id || generateId(), tasks: [], progress: 0 };
    setProjects(prev => [...prev, newProject]);
    return newProject.id;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const addProjectTask = useCallback((projectId: string, title: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const currentTasks = Array.isArray(p.tasks) ? p.tasks : [];
        const newTasks = [...currentTasks, { id: generateId(), title, completed: false }];
        const completedCount = newTasks.filter(t => t.completed).length;
        const progress = newTasks.length > 0 ? Math.round((completedCount / newTasks.length) * 100) : 0;
        return { ...p, tasks: newTasks, progress };
      }
      return p;
    }));
  }, []);

  const toggleProjectTask = useCallback((projectId: string, taskId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const currentTasks = Array.isArray(p.tasks) ? p.tasks : [];
        const newTasks = currentTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        const completedCount = newTasks.filter(t => t.completed).length;
        const progress = newTasks.length > 0 ? Math.round((completedCount / newTasks.length) * 100) : 0;
        return { ...p, tasks: newTasks, progress };
      }
      return p;
    }));
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const value: PlannerContextType = {
    events,
    tasks,
    reminders,
    notes,
    projects,
    viewMode,
    calendarMode,
    selectedDate,
    searchQuery,
    isSidebarOpen,
    selectedEventId,
    selectedTaskId,
    setEvents,
    setTasks,
    setReminders,
    setNotes,
    setProjects,
    setViewMode,
    setCalendarMode,
    setSelectedDate,
    setSearchQuery,
    toggleSidebar,
    setSelectedEventId,
    setSelectedTaskId,
    addEvent,
    updateEvent,
    deleteEvent,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addReminder,
    deleteReminder,
    addNote,
    updateNote,
    deleteNote,
    addProject,
    updateProject,
    deleteProject,
    addProjectTask,
    toggleProjectTask,
    settings,
    updateSettings,
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
