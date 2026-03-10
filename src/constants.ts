import { Category, Priority } from "./types";

export const CATEGORIES: { value: Category; label: string; color: string; bg: string }[] = [
  { value: 'iş', label: 'İş', color: 'text-blue-400', bg: 'bg-blue-400/20' },
  { value: 'toplantı', label: 'Toplantı', color: 'text-purple-400', bg: 'bg-purple-400/20' },
  { value: 'kişisel', label: 'Kişisel', color: 'text-green-400', bg: 'bg-green-400/20' },
  { value: 'eğitim', label: 'Eğitim', color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
  { value: 'sağlık', label: 'Sağlık', color: 'text-red-400', bg: 'bg-red-400/20' },
];

export const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'düşük', label: 'Düşük', color: 'text-slate-400' },
  { value: 'orta', label: 'Orta', color: 'text-orange-400' },
  { value: 'yüksek', label: 'Yüksek', color: 'text-red-500' },
];

export const INITIAL_EVENTS: any[] = [];
export const INITIAL_TASKS: any[] = [];
export const INITIAL_REMINDERS: any[] = [];
