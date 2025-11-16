// src/components/TopBar.jsx
import ThemeToggle from './ThemeToggle';
import MobileSessionMenu from './MobileSessionMenu';

export default function TopBar({ theme, setTheme }) {
  return (
    <header className="h-12 border-b border-emerald-300/40 dark:border-emerald-500/40 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 backdrop-blur flex items-center justify-between px-3 sm:px-4 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white text-xs font-bold shadow">
          AI
        </span>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-semibold">
            ChatGPT-style Assignment
          </span>
          <span className="hidden sm:inline text-[11px] text-gray-500 dark:text-gray-400">
            React · Tailwind · Node.js (Mock API)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Mobile: sessions dropdown */}
        <MobileSessionMenu />
        {/* Theme toggle (all devices) */}
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
}
