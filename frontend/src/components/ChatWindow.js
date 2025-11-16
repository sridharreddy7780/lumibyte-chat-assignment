// src/components/ChatWindow.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSession, askQuestion, sendFeedback } from '../api/client';
import ChatInput from './ChatInput';
import TableResponse from './TableResponse';
import AnswerFeedback from './AnswerFeedback';

export default function ChatWindow() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!sessionId) {
      setSession(null);
      return;
    }
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function loadSession() {
    setLoading(true);
    try {
      const data = await fetchSession(sessionId);
      const s = data?.data || data || null;
      setSession(s);
    } catch (e) {
      console.error('fetchSession', e);
      setSession(null);
    } finally {
      setLoading(false);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }),
        80
      );
    }
  }

  async function onSend(question) {
    if (!question || !sessionId) return;
    setLoading(true);
    try {
      await askQuestion(sessionId, question);
      await loadSession();
    } catch (e) {
      console.error('askQuestion', e);
      setLoading(false);
    }
  }

  async function onFeedback(index, feedback) {
    try {
      await sendFeedback(sessionId, index, feedback);
      await loadSession();
    } catch (e) {
      console.error('feedback', e);
    }
  }

  if (!sessionId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="max-w-md text-center px-4">
          <h2 className="text-xl font-semibold mb-2">
            Start a new chat to begin
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Use the <b>New Chat</b> button on the left panel to create a
            session and start asking questions.
          </p>
        </div>
      </div>
    );
  }

  if (loading && !session) {
    return <div className="p-6 text-sm">Loading session...</div>;
  }

  return (
    // ⬇️ h-full so this fills <main> height on mobile & desktop
    <div className="h-full flex flex-col min-h-0 bg-gradient-to-b from-gray-50/60 dark:from-gray-950 to-gray-100 dark:to-gray-900">
      <div className="flex-1 min-h-0 max-w-4xl mx-auto w-full px-2 sm:px-4 py-3 sm:py-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-1">
          <div>
            <div className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white text-xs font-bold shadow-sm">
                AI
              </span>
              <span className="truncate">
                {session?.title || 'Chat Session'}
              </span>
            </div>
            <div className="text-xs sm:text-sm opacity-70 mt-1">
              {session?.createdAt
                ? `Started at ${new Date(session.createdAt).toLocaleString()}`
                : 'Session details'}
            </div>
          </div>
          <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
            Session ID:{' '}
            <span className="font-mono">
              {session?.id || sessionId?.slice(0, 8)}
            </span>
          </div>
        </div>

        {/* Chat card */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 shadow-sm overflow-hidden flex flex-col">
            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-4">
              {(session?.history || []).length === 0 && (
                <div className="h-full flex items-center justify-center text-center text-sm text-gray-500 dark:text-gray-400 px-4">
                  Ask something like{' '}
                  <span className="font-medium mx-1">
                    &quot;Show sample sales report&quot;
                  </span>{' '}
                  or{' '}
                  <span className="font-medium mx-1">
                    &quot;Active users by platform&quot;
                  </span>
                  to see a tabular response.
                </div>
              )}

              {(session?.history || []).map((m, i) => {
                const isUser = m.role === 'user';
                const bubbleBase =
                  'inline-flex flex-col max-w-[88%] sm:max-w-[70%] px-3 py-2.5 rounded-2xl text-sm shadow-sm';

                const timeLabel = m.timestamp
                  ? new Date(m.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : null;

                return (
                  <div
                    key={i}
                    className={`flex ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={
                        bubbleBase +
                        ' ' +
                        (isUser
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-bl-sm')
                      }
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold bg-black/5 dark:bg-white/10">
                            {isUser ? 'You' : 'AI'}
                          </div>
                          <span className="text-[11px] opacity-80">
                            {isUser ? 'You' : 'Assistant'}
                          </span>
                        </div>
                        {timeLabel && (
                          <span className="text-[10px] opacity-70">
                            {timeLabel}
                          </span>
                        )}
                      </div>

                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {m.text || m.answer || m.response || ''}
                      </div>

                      {!isUser && m.table && (
                        <div className="mt-3">
                          <TableResponse table={m.table} />
                        </div>
                      )}

                      {!isUser && (
                        <div className="mt-2">
                          <AnswerFeedback
                            feedback={m.feedback}
                            onFeedback={(fb) => onFeedback(i, fb)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-2 sm:p-3 bg-gray-50/80 dark:bg-gray-900/80">
              <ChatInput onSend={onSend} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
