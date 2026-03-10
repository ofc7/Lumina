import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Coffee, Brain, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';

export const Focus = () => {
  const [duration, setDuration] = useState(25); // in minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(duration * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, duration]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? duration * 60 : 5 * 60);
  };

  const changeDuration = (mins: number) => {
    const validMins = Math.max(1, Math.min(120, mins));
    setDuration(validMins);
    if (!isActive) {
      setTimeLeft(validMins * 60);
      setMode('focus');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      changeDuration(val);
    } else if (e.target.value === '') {
      setDuration(0);
      setTimeLeft(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus' 
    ? (duration > 0 ? ((duration * 60 - timeLeft) / (duration * 60)) * 100 : 0)
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden pb-24 md:pb-8">
      {/* Growing Tree Animation */}
      <div className="absolute bottom-20 md:bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 md:w-96 md:h-96 pointer-events-none z-0 opacity-60">
        <motion.div
          animate={{ 
            scale: 0.8 + (progress / 100) * 0.4,
          }}
          className="flex items-end justify-center h-full"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Trunk */}
            <motion.path
              d="M50 100 L50 70"
              fill="none"
              stroke="#5d4037"
              strokeWidth={2 + (progress / 100) * 4}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: Math.min(1, progress / 10) }}
            />
            
            {/* Branches */}
            {progress > 20 && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: (progress - 20) / 30 }}
                d="M50 75 L35 60 M50 70 L65 55"
                fill="none"
                stroke="#5d4037"
                strokeWidth={1 + (progress / 100) * 2}
                strokeLinecap="round"
              />
            )}
            
            {progress > 50 && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: (progress - 50) / 30 }}
                d="M35 60 L25 50 M65 55 L75 45 M50 70 L50 40"
                fill="none"
                stroke="#5d4037"
                strokeWidth={1 + (progress / 100) * 1.5}
                strokeLinecap="round"
              />
            )}

            {/* Leaves - Sapling Stage */}
            <AnimatePresence>
              {progress > 10 && (
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  cx="50" cy="70" r="4"
                  fill="#4ade80"
                />
              )}
              
              {/* Mid Stage Leaves */}
              {progress > 40 && (
                <>
                  <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx="35" cy="60" r="6" fill="#22c55e" />
                  <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx="65" cy="55" r="6" fill="#22c55e" />
                </>
              )}

              {/* Late Stage Leaves (Tree Canopy) */}
              {progress > 70 && (
                <>
                  <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx="25" cy="50" r="8" fill="#16a34a" />
                  <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx="75" cy="45" r="8" fill="#16a34a" />
                  <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx="50" cy="40" r="10" fill="#15803d" />
                  <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx="40" cy="35" r="7" fill="#16a34a" />
                  <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx="60" cy="35" r="7" fill="#16a34a" />
                </>
              )}

              {/* Full Bloom (Flowers/Fruit) */}
              {progress >= 95 && (
                <>
                  <motion.circle initial={{ scale: 0 }} animate={{ scale: 1.2 }} cx="30" cy="45" r="2" fill="#f87171" className="animate-pulse" />
                  <motion.circle initial={{ scale: 0 }} animate={{ scale: 1.2 }} cx="70" cy="40" r="2" fill="#f87171" className="animate-pulse" />
                  <motion.circle initial={{ scale: 0 }} animate={{ scale: 1.2 }} cx="50" cy="30" r="2" fill="#f87171" className="animate-pulse" />
                </>
              )}
            </AnimatePresence>
          </svg>
        </motion.div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className={cn(
            "absolute -top-24 -left-24 w-64 md:w-96 h-64 md:h-96 rounded-full blur-[80px] md:blur-[100px]",
            mode === 'focus' ? "bg-brand-primary" : "bg-emerald-500"
          )}
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className={cn(
            "absolute -bottom-24 -right-24 w-64 md:w-96 h-64 md:h-96 rounded-full blur-[80px] md:blur-[100px]",
            mode === 'focus' ? "bg-brand-secondary" : "bg-blue-500"
          )}
        />
      </div>

      <div className="max-w-xl w-full text-center space-y-6 md:space-y-8 relative z-10 flex flex-col items-center">
        {/* Compact Timer Header */}
        <div className="md:absolute md:top-0 md:right-0 p-4 md:p-6 flex flex-col items-center md:items-end gap-3 md:gap-4">
          <div className="relative flex items-center justify-center">
            {/* Smaller Progress Ring */}
            <svg className="w-24 h-24 md:w-32 md:h-32 -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-white/5"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 60}
                animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - progress / 100) }}
                transition={{ duration: 1, ease: 'linear' }}
                className={mode === 'focus' ? "text-brand-primary" : "text-emerald-500"}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl md:text-2xl font-black text-white tracking-tighter tabular-nums">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={toggleTimer}
              disabled={duration === 0}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                isActive 
                  ? "bg-slate-800 shadow-none" 
                  : (mode === 'focus' ? "bg-brand-primary shadow-brand-primary/40" : "bg-emerald-500 shadow-emerald-500/40")
              )}
            >
              {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            <button 
              onClick={resetTimer}
              className="w-10 h-10 glass rounded-xl text-slate-400 hover:text-white transition-all flex items-center justify-center"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "inline-flex items-center gap-2 px-4 md:px-6 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm tracking-widest uppercase",
              mode === 'focus' ? "bg-brand-primary/10 text-brand-primary" : "bg-emerald-500/10 text-emerald-400"
            )}
          >
            {mode === 'focus' ? <Brain size={16} /> : <Coffee size={16} />}
            {mode === 'focus' ? 'Odaklanma Zamanı' : 'Mola Zamanı'}
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {mode === 'focus' ? 'Derin çalışmaya hazır mısın?' : 'Biraz dinlenmeyi hak ettin.'}
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xs md:max-w-sm mx-auto">
            Ağacın büyümesi için odaklanmaya devam et. Her saniye doğaya bir katkı!
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 pt-4 md:pt-8 w-full max-w-sm">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => changeDuration(mins)}
                className={cn(
                  "px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold transition-all",
                  duration === mins 
                    ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-105 md:scale-110" 
                    : "glass text-slate-400 hover:text-white"
                )}
              >
                {mins} dk
              </button>
            ))}
          </div>
          
          <div className="w-full space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Özel Süre (Dakika)</label>
            <div className="relative">
              <input 
                type="number"
                min="1"
                max="120"
                value={duration || ''}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-center text-white font-bold focus:outline-none focus:border-brand-primary transition-colors"
                placeholder="Süre girin..."
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">dk</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-md pt-8 md:pt-12">
          <div className="glass p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/5">
            <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Seans</p>
            <p className="text-lg md:text-xl font-bold text-white">#1</p>
          </div>
          <div className="glass p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/5">
            <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Bugün</p>
            <p className="text-lg md:text-xl font-bold text-white">2.5s</p>
          </div>
          <div className="glass p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/5">
            <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Hedef</p>
            <p className="text-lg md:text-xl font-bold text-white">4s</p>
          </div>
        </div>
      </div>
    </div>
  );
};
