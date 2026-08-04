const SESSIONS_KEY = "artifex_sessions";
const ACTIVE_KEY = "artifex_active_id";
const LOGGED_OUT_KEY = "artifex_logged_out";

function readSessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || {};
  } catch {
    return {};
  }
}

function writeSessions(sessions) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function adoptLegacy() {
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");
  if (token && rawUser) {
    try {
      const user = JSON.parse(rawUser);
      if (user?.id) {
        saveSession(user.id, { token, user, lastUsed: Date.now() });
      }
    } catch {
      // ignore malformed legacy data
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export function getSession(id) {
  return readSessions()[id] || null;
}

export function saveSession(id, session) {
  const sessions = readSessions();
  sessions[id] = { ...session, lastUsed: Date.now() };
  writeSessions(sessions);
}

export function removeSession(id) {
  const sessions = readSessions();
  delete sessions[id];
  writeSessions(sessions);
  if (sessionStorage.getItem(ACTIVE_KEY) === id) {
    sessionStorage.removeItem(ACTIVE_KEY);
  }
}

export function setActiveId(id) {
  if (getSession(id)) {
    sessionStorage.setItem(ACTIVE_KEY, id);
    const s = getSession(id);
    saveSession(id, s);
  }
}

export function clearActive() {
  sessionStorage.removeItem(ACTIVE_KEY);
}

export function markLoggedOut() {
  sessionStorage.setItem(LOGGED_OUT_KEY, "1");
}

export function clearLoggedOut() {
  sessionStorage.removeItem(LOGGED_OUT_KEY);
}

export function isLoggedOut() {
  return sessionStorage.getItem(LOGGED_OUT_KEY) === "1";
}

export function activeSession() {
  adoptLegacy();

  if (isLoggedOut()) {
    return null;
  }

  const raw = sessionStorage.getItem(ACTIVE_KEY);
  if (raw && getSession(raw)) {
    return { id: raw, ...getSession(raw) };
  }
  if (raw) {
    sessionStorage.removeItem(ACTIVE_KEY);
    return null;
  }

  const sessions = readSessions();
  const ids = Object.keys(sessions).sort(
    (a, b) => (sessions[b].lastUsed || 0) - (sessions[a].lastUsed || 0),
  );
  if (ids.length) {
    sessionStorage.setItem(ACTIVE_KEY, ids[0]);
    return { id: ids[0], ...sessions[ids[0]] };
  }
  return null;
}
