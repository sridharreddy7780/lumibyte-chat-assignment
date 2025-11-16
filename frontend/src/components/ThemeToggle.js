// src/components/ThemeToggle.jsx
import React from 'react';

export default function ThemeToggle({ theme, setTheme }) {
  function toggle() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 text-xs sm:text-sm px-3 py-1.5 rounded-full border border-emerald-400/60 bg-emerald-50/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-100 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
    >
      <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
      <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
}
