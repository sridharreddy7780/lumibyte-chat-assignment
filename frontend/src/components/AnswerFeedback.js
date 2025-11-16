// src/components/AnswerFeedback.jsx
import React from 'react';

export default function AnswerFeedback({ feedback, onFeedback }) {
  function handleClick(type) {
    if (!onFeedback) return;
    onFeedback(feedback === type ? null : type);
  }

  return (
    <div className="flex gap-2 mt-2 text-[11px]">
      <button
        type="button"
        onClick={() => handleClick('like')}
        className={`flex items-center gap-1 px-2 py-1 rounded-md border ${
          feedback === 'like'
            ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        👍 <span>Like</span>
      </button>
      <button
        type="button"
        onClick={() => handleClick('dislike')}
        className={`flex items-center gap-1 px-2 py-1 rounded-md border ${
          feedback === 'dislike'
            ? 'bg-red-100 border-red-500 text-red-700'
            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        👎 <span>Dislike</span>
      </button>
    </div>
  );
}
