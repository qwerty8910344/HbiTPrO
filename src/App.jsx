import React, { useState, useEffect } from 'react'
import Layout from './components/layout/Layout'
import TodayView from './views/Today'
import ReportsView from './views/Reports'
import TrackingView from './views/Tracking'
import GroupsView from './views/Groups'
import FocusView from './views/Focus'
import MotivationView from './views/Motivation'
import SettingsView from './views/Settings'
import AuthView from './views/Auth'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'

function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState('today');

  useEffect(() => {
    // Initial fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderView = () => {
    switch (view) {
      case 'today':
        return <TodayView />;
      case 'reports':
        return <ReportsView />;
      case 'stats':
        return <TrackingView />;
      case 'groups':
        return <GroupsView />;
      case 'focus':
        return <FocusView />;
      case 'motivation':
        return <MotivationView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <TodayView />;
    }
  };

  // Enforce authentication wrapper
  if (!session) {
    return (
      <div className="flex justify-center min-h-screen bg-[#0B0F0C]">
        <div className="app-container w-full max-w-[430px] min-h-screen relative overflow-x-hidden flex flex-col pt-10">
          <AuthView />
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={view} setView={setView}>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}

export default App
