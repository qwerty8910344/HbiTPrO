import React, { useState } from 'react'
import Layout from './components/layout/Layout'
import TodayView from './views/Today'
import ReportsView from './views/Reports'
import TrackingView from './views/Tracking'
import GroupsView from './views/Groups'
import FocusView from './views/Focus'
import MotivationView from './views/Motivation'
import SettingsView from './views/Settings'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [view, setView] = useState('today');

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
