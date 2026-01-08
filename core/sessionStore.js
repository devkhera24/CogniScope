// core/sessionStore.js

const STORAGE_KEY = "cogniscope_last_session";

export function saveSessionSummary(summary) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(summary)
    );
  } catch (e) {
    console.error("Failed to save session", e);
  }
}

export function loadLastSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
