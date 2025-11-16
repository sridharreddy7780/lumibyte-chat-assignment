// src/components/ChatInput.jsx
import React, { useState } from 'react';

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }

  return (
    <form onSubmit={submit} className="flex gap-2 items-center">
      <div className="flex-1 flex items-center px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about sales, users, revenue, or any metrics..."
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold disabled:opacity-60 hover:from-emerald-600 hover:to-cyan-600 active:scale-[0.98] transition shadow-sm"
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}

