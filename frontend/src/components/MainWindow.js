// src/components/MainWindow.jsx
import { useNavigate } from 'react-router-dom';
import { createNewChat } from '../api/client';

export default function MainWindow() {
  const navigate = useNavigate();

  async function handleStartNewChat() {
    try {
      const res = await createNewChat();
      const id = res?.id || res?.data?.id;
      if (id) {
        navigate(`/chat/${id}`);
      }
    } catch (e) {
      console.error('createNewChat from landing failed', e);
    }
  }

  return (
    // ⬇️ was flex-1, now h-full so it uses all available height
    <div className="h-full flex items-end justify-center px-4 pb-6 sm:pb-10 bg-gradient-to-b from-gray-50 via-emerald-50/50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50">
            ChatGPT-style Analytics Assistant
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Ask about <b>sales</b>, <b>users</b>, or any generic metrics and get
            mock <b>structured tabular responses</b> from a Node.js backend —
            built with React, TailwindCSS, and Express.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 text-left">
          <div className="rounded-xl border border-emerald-200/70 dark:border-emerald-800 bg-white/80 dark:bg-gray-900/80 p-3 text-xs sm:text-sm shadow-sm">
            <div className="text-emerald-500 text-[11px] uppercase tracking-wide mb-1">
              Sales
            </div>
            <div className="font-medium">
              &quot;Show sample sales for last 3 months&quot;
            </div>
          </div>
          <div className="rounded-xl border border-cyan-200/70 dark:border-cyan-800 bg-white/80 dark:bg-gray-900/80 p-3 text-xs sm:text-sm shadow-sm">
            <div className="text-cyan-500 text-[11px] uppercase tracking-wide mb-1">
              Users
            </div>
            <div className="font-medium">
              &quot;Active users by platform&quot;
            </div>
          </div>
          <div className="rounded-xl border border-purple-200/70 dark:border-purple-800 bg-white/80 dark:bg-gray-900/80 p-3 text-xs sm:text-sm shadow-sm">
            <div className="text-purple-500 text-[11px] uppercase tracking-wide mb-1">
              Metrics
            </div>
            <div className="font-medium">
              &quot;Give me some default metrics&quot;
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={handleStartNewChat}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm sm:text-base font-semibold hover:from-emerald-600 hover:to-cyan-600 active:scale-[0.98] transition shadow-md"
          >
            ➕ Start New Chat
          </button>

          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Or select an existing session from the left panel
          </span>
        </div>
      </div>
    </div>
  );
}
