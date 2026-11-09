/* ─── Shared in-memory session store ─── */

export interface CompletedSession {
  sessionId: number;
  studentName: string;
  subject: string;
  time: string;
  rating: number | null;
}

export interface LiveSession {
  sessionId: number;
  studentName: string;
  subject: string;
  time: string;
  meetLink: string;
}

// Reactive listeners
type Listener = () => void;
const listeners: Listener[] = [];

function notify() {
  listeners.forEach(fn => fn());
}

export function subscribeStore(fn: Listener) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

// ── Completed sessions store ──
const completedSessions: CompletedSession[] = [];

export function getCompletedSessions(): CompletedSession[] {
  return completedSessions;
}

export function markSessionComplete(session: Omit<CompletedSession, 'rating'>) {
  const exists = completedSessions.find(s => s.sessionId === session.sessionId);
  if (!exists) {
    completedSessions.push({ ...session, rating: null });
    // remove from live if present
    const liveIdx = liveSessions.findIndex(s => s.sessionId === session.sessionId);
    if (liveIdx !== -1) liveSessions.splice(liveIdx, 1);
    notify();
  }
}

export function submitRating(sessionId: number, rating: number) {
  const session = completedSessions.find(s => s.sessionId === sessionId);
  if (session) {
    session.rating = rating;
    notify();
  }
}

// ── Live sessions store (faculty shared meet link) ──
const liveSessions: LiveSession[] = [];

export function getLiveSessions(): LiveSession[] {
  return liveSessions;
}

export function shareMeetLink(session: Omit<LiveSession, never>) {
  const exists = liveSessions.find(s => s.sessionId === session.sessionId);
  if (exists) {
    exists.meetLink = session.meetLink; // update link if reshared
  } else {
    liveSessions.push({ ...session });
  }
  notify();
}

export function getLiveSessionById(sessionId: number): LiveSession | undefined {
  return liveSessions.find(s => s.sessionId === sessionId);
}
