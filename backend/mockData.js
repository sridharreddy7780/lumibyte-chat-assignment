// backend/mockData.js
// Simple in-memory + JSON-file storage for chat sessions (no real DB).

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'sessions.json');

let sessions = {};

// Load sessions from JSON file
function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      sessions = JSON.parse(raw) || {};
    } else {
      sessions = {};
    }
  } catch (err) {
    console.error('Failed to load sessions.json:', err);
    sessions = {};
  }
}

// Save sessions to JSON file
function save() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(sessions, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save sessions.json:', err);
  }
}

// Create new session
function createNewSession() {
  const id = uuidv4();
  const title = `Session ${id.slice(0, 8)}`;
  const session = {
    id,
    title,
    createdAt: new Date().toISOString(),
    history: [],
  };
  sessions[id] = session;
  save();
  return session;
}

// Reset all sessions (used by Reset button in UI)
function resetAllSessions() {
  sessions = {};
  save();
}

// Return list of sessions sorted by newest first
function getSessionsList() {
  return Object.values(sessions).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

// Get one session by id
function getSession(id) {
  return sessions[id] || null;
}

// Add user message
function addUserMessage(sessionId, text) {
  const session = sessions[sessionId];
  if (!session) return null;
  const msg = {
    role: 'user',
    text: text.toString(),
    timestamp: new Date().toISOString(),
  };
  session.history.push(msg);
  save();
  return msg;
}

// Add assistant message
function addAssistantMessage(sessionId, text, table = null) {
  const session = sessions[sessionId];
  if (!session) return null;
  const msg = {
    role: 'assistant',
    text: text.toString(),
    table,
    timestamp: new Date().toISOString(),
    feedback: null,
  };
  session.history.push(msg);
  save();
  return msg;
}

// Set prettier title based on first user question
function setTitleIfEmpty(sessionId, titleText) {
  const session = sessions[sessionId];
  if (!session) return;
  if (session.title && session.title.startsWith('Session ')) {
    const title = titleText
      .split(/\s+/)
      .slice(0, 6)
      .join(' ')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .trim();
    if (title) {
      session.title = title.length > 30 ? `${title.slice(0, 30)}...` : title;
      save();
    }
  }
}

// Initial load
load();

module.exports = {
  createNewSession,
  resetAllSessions,
  getSessionsList,
  getSession,
  addUserMessage,
  addAssistantMessage,
  setTitleIfEmpty,
  sessions,
};
