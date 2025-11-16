// src/components/MobileSessionMenu.jsx
// Mobile-only sessions dropdown: shows sessions, New Chat, Reset.

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchSessions, createNewChat, resetSessions } from '../api/client';

export default function MobileSessionMenu() {
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // load sessions on mount + interval
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
      setOpen(false);
      setTimeout(loadSessions, 300);
    } catch (e) {
      console.error('createNewChat failed', e);
    }
  }

  async function handleReset() {
    const ok = window.confirm(
      'Clear all sessions? This cannot be undone.'
    );
    if (!ok) return;
    try {
      await resetSessions();
      setSessions([]);
      navigate('/');
      setOpen(false);
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

  function handleSelectSession(id) {
    navigate(`/chat/${id}`);
    setOpen(false);
  }

  return (
    <div className="relative md:hidden">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-xs"
      >
        <span>Sessions</span>
        <span className="text-[10px] opacity-70">
          ({sessions.length || 0})
        </span>
        <span className="text-[10px]">{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 max-h-80 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-30 flex flex-col">
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
            Sessions
          </div>

          <div className="p-2 flex flex-col gap-2">
            <button
              onClick={handleNewChat}
              className="w-full text-xs flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:to-cyan-600"
            >
              ➕ New Chat
            </button>

            <button
              onClick={handleReset}
              className="w-full text-[11px] flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-red-300/70 text-red-600 dark:text-red-300 bg-red-50/60 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              🗑 Reset Sessions
            </button>
          </div>

          <div className="px-3 pb-1 text-[11px] text-gray-500 dark:text-gray-400">
            Recent
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2 space-y-1">
            {sessions.length === 0 && (
              <div className="px-2 py-2 text-[11px] text-gray-500 dark:text-gray-400">
                No sessions. Create one above.
              </div>
            )}

            {sessions.map((s) => {
              const id = s.id || s.sessionId || s;
              const label = getSessionLabel(s);
              const active = location.pathname.includes(id);

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelectSession(id)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs ${
                    active
                      ? 'bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-100'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="truncate">{label}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">
                    {s.messages || 0} message
                    {s.messages === 1 ? '' : 's'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
