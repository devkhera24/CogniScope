// ui/summary.js

import { loadLastSession } from "../core/sessionStore.js";

export function renderSessionSummary() {
  const summary = loadLastSession();
  if (!summary) return;

  const container = document.querySelector(".summary-placeholder");
  if (!container) return;

  const minutes = Math.round(summary.durationMs / 60000);

  container.innerHTML = `
    <div>
      <p><strong>Last Session</strong></p>
      <p>Previous session duration: ${minutes} min</p>
      <p>Focus Ratio: ${summary.focusRatio.toFixed(2)}</p>
      <p>Focused: ${Math.round(summary.timeInState.FOCUSED / 1000)} s</p>
      <p>Distracted: ${Math.round(summary.timeInState.DISTRACTED / 1000)} s</p>
      <p>Idle: ${Math.round(summary.timeInState.IDLE / 1000)} s</p>
    </div>
  `;
}
