// src/components/Sidebar.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchSessions, createNewChat, resetSessions } from '../api/client';

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load sessions initially + poll every 5 seconds
  useEffect(() => {
    loadSessions();
    const id = setInterval(loadSessions, 5000);
    return () => clearInterval(id);
  }, []);

  async function loadSessions() {
    try {
      const data = await fetchSessions();
      setSessions(Array.isArray(data) ? data : data?.data || []);
    } catch (e) {
      console.error('fetchSessions failed', e);
    }
  }

  async function handleNewChat() {
    try {
      const res = await createNewChat();
      const id = res?.id || res?.data?.id;
      if (!id) return;
      navigate(`/chat/${id}`);
      setTimeout(loadSessions, 300);
    } catch (e) {
      console.error('createNewChat failed', e);
    }
  }

  // Reset all sessions via backend
  async function handleReset() {
    const ok = window.confirm(
      'Are you sure you want to clear all sessions? This cannot be undone.'
    );
    if (!ok) return;
    try {
      await resetSessions();
      setSessions([]);
      navigate('/'); // back to landing
    } catch (e) {
      console.error('resetSessions failed', e);
    }
  }

  function getSessionLabel(s) {
    const base =
      s.title ||
      `Session ${String(s.id || s.sessionId || '').slice(0, 6)}` ||
      'Untitled chat';
    const trimmed = base.toString().trim();
    if (!trimmed) return 'Untitled chat';
    return trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed;
  }

  return (
    <aside
            className={`
        hidden md:flex           /* ⬅️ HIDE ON MOBILE, SHOW ON md+ */
        transition-all duration-200
        bg-gradient-to-b from-gray-100 via-emerald-50/40 to-gray-100
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
        border-b md:border-b-0 md:border-r border-gray-200/70 dark:border-gray-800
        flex-col
        ${open ? 'md:w-64' : 'md:w-16'}
        md:h-screen
      `}

    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-700/60 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 dark:from-emerald-900/40 dark:to-cyan-900/30">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow">
            C
          </div>
          {open && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm truncate">
                Chat Sessions
              </span>
              <span className="text-[11px] text-gray-600 dark:text-gray-300">
                {sessions.length || 0} session
                {sessions.length === 1 ? '' : 's'}
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle (md+ only) */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="px-2 py-1 rounded-lg hover:bg-emerald-200/80 dark:hover:bg-emerald-900/60 text-xs md:inline-flex hidden"
        >
          {open ? '◀' : '▶'}
        </button>
      </div>

      {/* New chat + Reset buttons */}
      <div className="px-3 pt-3 space-y-2">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold hover:from-emerald-600 hover:to-cyan-600 active:scale-[0.98] transition shadow"
        >
          <span className="text-base leading-none">＋</span>
          {open && <span>New Chat</span>}
        </button>

        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg border border-red-300/70 text-xs text-red-600 dark:text-red-300 bg-red-50/60 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
        >
          <span>🗑</span>
          {open && <span>Reset Sessions</span>}
        </button>
      </div>

      {/* Section label */}
      {open && (
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <span>Recent</span>
            <span className="h-px flex-1 ml-2 bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      )}

      {/* Sessions list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2 space-y-1">
        {sessions.length === 0 && (
          <div className="px-2 text-xs opacity-70 py-3">
            No sessions yet. Start a new chat.
          </div>
        )}

        {sessions.map((s) => {
          const id = s.id || s.sessionId || s;
          const label = getSessionLabel(s);
          const active = location.pathname.includes(id);

          return (
            <Link key={id} to={`/chat/${id}`}>
              <div
                className={`group flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer text-sm
                  hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40
                  ${
                    active
                      ? 'bg-emerald-100/90 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 shadow-sm'
                      : ''
                  }`}
              >
                <div
                  className={`w-1 h-6 rounded-full ${
                    active
                      ? 'bg-gradient-to-b from-emerald-500 to-cyan-500'
                      : 'bg-gray-400 group-hover:bg-emerald-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm">
                    {open ? label : label.slice(0, 1)}
                  </div>
                  {open && (
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {s.messages || 0} message
                      {s.messages === 1 ? '' : 's'}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer: user info + settings */}
      <div className="border-t border-gray-200/70 dark:border-gray-800 px-3 py-3 bg-white/60 dark:bg-gray-950/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 shadow">
              SR
            </div>
            {open && (
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-tight">
                  Sridhar Reddy
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Free plan · Online
                </span>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
              aria-label="Settings"
              onClick={() => setShowSettingsMenu((prev) => !prev)}
            >
              <span className="text-lg">⚙️</span>
            </button>

            {showSettingsMenu && (
              <div className="absolute right-0 bottom-10 w-40 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg text-xs overflow-hidden z-20">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                  Settings
                </div>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Profile
                </button>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Preferences
                </button>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}



