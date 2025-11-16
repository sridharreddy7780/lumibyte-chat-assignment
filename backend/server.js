// backend/server.js
// Express server that exposes mock ChatGPT-style APIs.

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const {
  createNewSession,
  resetAllSessions,
  getSessionsList,
  getSession,
  addUserMessage,
  addAssistantMessage,
  setTitleIfEmpty,
} = require('./mockData');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

/**
 * GET /api/sessions
 * Returns list of sessions (id, title, createdAt, messages count)
 */
app.get('/api/sessions', (req, res) => {
  try {
    const sessions = getSessionsList().map((s) => ({
      id: s.id,
      title: s.title,
      createdAt: s.createdAt,
      messages: s.history.length,
    }));
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

/**
 * DELETE /api/sessions
 * Clears all sessions (used by Reset button)
 */
app.delete('/api/sessions', (req, res) => {
  try {
    resetAllSessions();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset sessions' });
  }
});

/**
 * GET /api/new-chat
 * Creates a new session and returns its id and title
 */
app.get('/api/new-chat', (req, res) => {
  try {
    const session = createNewSession();
    res.json({ id: session.id, title: session.title });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

/**
 * GET /api/session/:id
 * Returns full session object including history
 */
app.get('/api/session/:id', (req, res) => {
  try {
    const session = getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

/**
 * POST /api/chat/:id
 * Body: { question: "..." }
 * Adds user message then returns mock assistant message with table
 */
app.post('/api/chat/:id', (req, res) => {
  try {
    const sessionId = req.params.id;
    const { question } = req.body || {};
    if (!question || !question.toString().trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Add user message
    const user = addUserMessage(sessionId, question);
    if (!user) return res.status(404).json({ error: 'Session not found' });

    // Set nicer title from first question if needed
    setTitleIfEmpty(sessionId, question);

    // Simple mock logic for tabular data
    const lower = question.toLowerCase();
    let table;
    let assistantText;

    if (lower.includes('sales') || lower.includes('revenue')) {
      table = {
        columns: ['Month', 'Revenue', 'Growth%'],
        rows: [
          ['Jan', '12,000', '5%'],
          ['Feb', '15,000', '25%'],
          ['Mar', '18,000', '20%'],
        ],
      };
      assistantText = `Mock monthly sales summary for your query: "${question}"`;
    } else if (lower.includes('users') || lower.includes('active')) {
      table = {
        columns: ['Platform', 'Active Users', 'Change%'],
        rows: [
          ['Web', '8,400', '2%'],
          ['iOS', '3,200', '10%'],
          ['Android', '5,600', '-1%'],
        ],
      };
      assistantText = `Mock active users summary for: "${question}"`;
    } else {
      table = {
        columns: ['Item', 'Value', 'Notes'],
        rows: [
          ['Metric A', Math.floor(Math.random() * 10000).toString(), 'auto-generated'],
          ['Metric B', Math.floor(Math.random() * 10000).toString(), 'auto-generated'],
        ],
      };
      assistantText = `Mock answer for: "${question}". (Default structured response)`;
    }

    const assistant = addAssistantMessage(sessionId, assistantText, table);
    return res.json(assistant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

/**
 * POST /api/feedback/:sessionId/:messageIndex
 * Body: { feedback: 'like'|'dislike' }
 * Attach feedback to assistant message at given index
 */
app.post('/api/feedback/:sessionId/:messageIndex', (req, res) => {
  try {
    const { sessionId, messageIndex } = req.params;
    const { feedback } = req.body || {};
    const idx = parseInt(messageIndex, 10);

    if (!feedback || (feedback !== 'like' && feedback !== 'dislike')) {
      return res
        .status(400)
        .json({ error: 'Valid feedback required (like or dislike)' });
    }

    const session = getSession(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (Number.isNaN(idx) || idx < 0 || idx >= session.history.length) {
      return res.status(400).json({ error: 'Invalid message index' });
    }

    session.history[idx].feedback = feedback;
    return res.json({ ok: true, historyItem: session.history[idx] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to attach feedback' });
  }
});

// Simple health check
app.get('/', (req, res) => res.json({ ok: true, msg: 'backend alive' }));

// Error logging
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason, p) => {
  console.error('UNHANDLED REJECTION at promise', p, 'reason:', reason);
});

// Start server
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Mock API server running on port ${PORT}`);
});
