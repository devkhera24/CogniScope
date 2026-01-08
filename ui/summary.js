// ui/summary.js

import { loadLastSession } from "../core/sessionStore.js";

export function renderSessionSummary() {
  const summary = loadLastSession();
  const summaryEl = document.getElementById("session-summary");
  
  if (!summary) {
    if (summaryEl) summaryEl.style.opacity = "0.5";
    return;
  }
  
  if (summaryEl) summaryEl.style.opacity = "1";

  const durationMin = Math.round(summary.durationMs / 60000);

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setVal("summary-duration", `${durationMin} min`);
  setVal("summary-focus", summary.focusRatio.toFixed(3));
  setVal("summary-focused", `${Math.round(summary.timeInState.FOCUSED / 1000)}s`);
  setVal("summary-distracted", `${Math.round(summary.timeInState.DISTRACTED / 1000)}s`);
  setVal("summary-idle", `${Math.round(summary.timeInState.IDLE / 1000)}s`);
}

export function clearSummaryUI() {
  const ids = [
    "summary-duration", "summary-focus", "summary-focused", 
    "summary-distracted", "summary-idle"
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "—";
  });
}
