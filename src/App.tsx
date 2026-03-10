/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Calendar } from './components/Calendar';
import { EventPanel } from './components/EventPanel';
import { AIAssistant } from './components/AIAssistant';
import { motion, AnimatePresence } from 'motion/react';

import { Tasks } from './components/Tasks';
import { Reminders } from './components/Reminders';
import { Projects } from './components/Projects';
import { Notes } from './components/Notes';
import { Focus } from './components/Focus';
import { Settings } from './components/Settings';

const MainContent = () => {
  const { viewMode } = usePlanner();

  return (
    <main className="flex-1 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-full"
        >
          {viewMode === 'dashboard' && <Dashboard />}
          {viewMode === 'calendar' && <Calendar />}
          {viewMode === 'tasks' && <Tasks />}
          {viewMode === 'reminders' && <Reminders />}
          {viewMode === 'projects' && <Projects />}
          {viewMode === 'notes' && <Notes />}
          {viewMode === 'focus' && <Focus />}
          {viewMode === 'settings' && <Settings />}
        </motion.div>
      </AnimatePresence>
      <EventPanel />
      <AIAssistant />
    </main>
  );
};

export default function App() {
  return (
    <PlannerProvider>
      <div className="flex h-screen w-screen bg-bg-dark overflow-hidden font-sans">
        <Sidebar />
        <MainContent />
      </div>
    </PlannerProvider>
  );
}
