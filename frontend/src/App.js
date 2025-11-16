// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MainWindow from './components/MainWindow';
import TopBar from './components/TopBar';

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row h-screen">
        {/* Sidebar: only visible on md+ (Sidebar itself handles hiding) */}
        <Sidebar />

        {/* Main area */}
        <div className="flex flex-col flex-1 min-h-0">
          <TopBar theme={theme} setTheme={setTheme} />
          <main className="flex-1 min-h-0">
            <Routes>
              <Route path="/" element={<MainWindow />} />
              <Route path="/chat/:sessionId" element={<ChatWindow />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
