import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlignLeft, Plus, Search, Trash2, Edit3, Calendar, Clock, ChevronLeft } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

export const Notes = () => {
  const { notes, addNote, updateNote, deleteNote } = usePlanner();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const handleCreate = () => {
    const newId = addNote({ title: 'Yeni Not', content: '' });
    setSelectedNoteId(newId);
    setIsEditing(true);
    setEditTitle('Yeni Not');
    setEditContent('');
  };

  const handleSave = () => {
    if (selectedNoteId) {
      updateNote(selectedNoteId, { title: editTitle, content: editContent });
      setIsEditing(false);
    }
  };

  const startEdit = (note: any) => {
    setSelectedNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  return (
    <div className="flex h-full overflow-hidden pb-24 md:pb-0">
      {/* Sidebar - Note List */}
      <div className={cn(
        "w-full md:w-80 border-r border-white/5 flex flex-col",
        selectedNoteId && "hidden md:flex"
      )}>
        <div className="p-4 md:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Notlar</h1>
            <button 
              onClick={handleCreate}
              className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl hover:bg-brand-primary/20 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Notlarda ara..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-6 space-y-2">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => {
                setSelectedNoteId(note.id);
                setIsEditing(false);
              }}
              className={cn(
                "w-full p-4 rounded-2xl text-left transition-all group",
                selectedNoteId === note.id ? "glass bg-white/10" : "hover:bg-white/5"
              )}
            >
              <h3 className={cn("font-bold text-sm mb-1 truncate", selectedNoteId === note.id ? "text-white" : "text-slate-300")}>
                {note.title || 'Başlıksız Not'}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-2">{note.content || 'İçerik yok...'}</p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-600 font-medium">
                  {format(parseISO(note.updatedAt), 'dd MMM', { locale: tr })}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-400 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className={cn(
        "flex-1 bg-white/[0.02] relative",
        !selectedNoteId && "hidden md:block"
      )}>
        <AnimatePresence mode="wait">
          {selectedNoteId ? (
            <motion.div
              key={selectedNoteId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex flex-col p-6 md:p-12 max-w-4xl mx-auto"
            >
              {/* Mobile Back Button */}
              <button 
                onClick={() => setSelectedNoteId(null)}
                className="md:hidden flex items-center gap-2 text-slate-400 mb-6 hover:text-white transition-colors"
              >
                <ChevronLeft size={20} />
                <span>Notlara Dön</span>
              </button>

              {isEditing ? (
                <div className="h-full flex flex-col space-y-6 md:space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <input 
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-2xl md:text-4xl font-bold bg-transparent border-none focus:outline-none text-white w-full"
                      placeholder="Başlık..."
                    />
                    <button 
                      onClick={handleSave}
                      className="w-full md:w-auto bg-brand-primary px-6 py-2 rounded-xl text-white font-bold shadow-lg shadow-brand-primary/20"
                    >
                      Kaydet
                    </button>
                  </div>
                  <textarea 
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-300 text-base md:text-lg leading-relaxed resize-none"
                    placeholder="Yazmaya başla..."
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col space-y-6 md:space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{selectedNote?.title}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs md:text-sm">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {format(parseISO(selectedNote!.updatedAt), 'dd MMMM yyyy', { locale: tr })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {format(parseISO(selectedNote!.updatedAt), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => startEdit(selectedNote)}
                      className="p-2 md:p-3 glass rounded-2xl text-slate-400 hover:text-brand-primary transition-all"
                    >
                      <Edit3 size={24} />
                    </button>
                  </div>
                  <div className="flex-1 text-slate-300 text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                    {selectedNote?.content || <span className="text-slate-600 italic">Bu not henüz boş...</span>}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <AlignLeft size={80} className="opacity-5 mb-6" />
              <p className="text-xl font-medium opacity-20">Görüntülemek için bir not seçin</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
