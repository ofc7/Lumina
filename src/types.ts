export type Priority = 'düşük' | 'orta' | 'yüksek';
export type Category = 'iş' | 'toplantı' | 'kişisel' | 'eğitim' | 'sağlık';
export type ViewMode = 'dashboard' | 'calendar' | 'tasks' | 'reminders' | 'projects' | 'notes' | 'focus' | 'settings';
export type CalendarMode = 'gün' | 'hafta' | 'ay';

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  color: string;
  category: Category;
  location?: string;
  attendees?: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  priority: Priority;
  category: Category;
  completed: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  time: string; // ISO string
  repeat: 'yok' | 'günlük' | 'haftalık' | 'aylık';
  notified: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  color?: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'aktif' | 'tamamlandı' | 'beklemede';
  color: string;
  tasks: ProjectTask[];
}

export interface PlannerState {
  events: Event[];
  tasks: Task[];
  reminders: Reminder[];
  notes: Note[];
  projects: Project[];
  viewMode: ViewMode;
  calendarMode: CalendarMode;
  selectedDate: string; // ISO string
  searchQuery: string;
  isSidebarOpen: boolean;
  selectedEventId: string | null;
  selectedTaskId: string | null;
}
