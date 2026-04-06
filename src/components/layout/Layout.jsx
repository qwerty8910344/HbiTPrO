import React from 'react';
import BottomNav from './BottomNav';

const Layout = ({ children, currentView, setView }) => {
  return (
    <div className="flex justify-center min-h-screen bg-[var(--bg-main)]">
      {/* Mobile-first centered app container */}
      <div className="app-container w-full max-w-[430px] min-h-screen relative overflow-x-hidden flex flex-col">
        
        {/* Animated Main Content Area */}
        <main className="flex-1 content-area p-5">
          <div className="max-w-full mx-auto pb-24">
            {children}
          </div>
        </main>

        {/* Global Floating Navigation */}
        <BottomNav currentView={currentView} setView={setView} />
      </div>
    </div>
  );
};

export default Layout;
