// src/api/client.js
// Small helper client for all backend API calls.

const API_BASE = process.env.REACT_APP_API || 'http://localhost:4000';
console.log('API_BASE >>>', API_BASE);

// Generic request wrapper
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
  
}

// Fetch sessions for sidebar
export async function fetchSessions() {
  return request('/api/sessions');
}

// Create new chat session
export async function createNewChat() {
  return request('/api/new-chat');
}

// Reset all sessions (used by Reset button)
export async function resetSessions() {
  return request('/api/sessions', { method: 'DELETE' });
}

// Fetch full session (with history)
export async function fetchSession(sessionId) {
  return request(`/api/session/${sessionId}`);
}

// Ask a question in given session
export async function askQuestion(sessionId, question) {
  return request(`/api/chat/${sessionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
}

// Send like/dislike feedback
export async function sendFeedback(sessionId, messageIndex, feedback) {
  return request(`/api/feedback/${sessionId}/${messageIndex}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feedback }),
  });
}
