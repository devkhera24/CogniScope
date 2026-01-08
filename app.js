import { initEventCollector } from "./core/eventCollector.js";
import { pushEvent, startBufferProcessor } from "./core/eventBuffer.js";
import { analyzeEventBatch } from "./core/analyzer.js";
import { inferState } from "./core/stateEngine.js";

import { updateStateBadge } from "./ui/stateBadge.js";
import { updateMetrics } from "./ui/gauges.js";
import { saveSessionSummary, clearSession } from "./core/sessionStore.js";
import { renderSessionSummary } from "./ui/summary.js";
import { addTimelineEvent } from "./ui/timeline.js";

const stateDurations = {
  FOCUSED: 0,
  DISTRACTED: 0,
  IDLE: 0
};

/* =========================
   Session Tracking
   ========================= */

let sessionStart = Date.now();

let lastState = "IDLE";
let lastStateChange = Date.now();

let lastInteractionTime = Date.now();

/* =========================
   Event Collection
   ========================= */

console.log("CogniScope initialized");

initEventCollector((event) => {
  lastInteractionTime = Date.now();
  pushEvent(event);
});

/* =========================
   Main Processing Pipeline
   ========================= */

/**
 * Updates durations for the current state up to the current moment
 */
function updateDurations() {
  const now = Date.now();
  const delta = now - lastStateChange;
  if (delta > 0) {
    stateDurations[lastState] += delta;
    lastStateChange = now;
  }
}

function transitionState(newState) {
  if (newState === lastState) return;
  updateDurations();
  lastState = newState;
}

startBufferProcessor((eventBatch) => {
  const metrics = analyzeEventBatch(eventBatch);
  if (!metrics) return;

  const state = inferState(metrics);
  
  // Sync durations and transition
  transitionState(state);
  updateDurations();

  const now = Date.now();
  const totalTime = now - sessionStart;
  const focusRatio = totalTime > 0 ? stateDurations.FOCUSED / totalTime : 0;

  updateStateBadge(state);
  updateMetrics({
    ...metrics,
    focusRatio
  });
});

/* =========================
   Idle Watchdog (Critical)
   ========================= */

const IDLE_THRESHOLD = 3000; // ms

setInterval(() => {
  const now = Date.now();
  const timeSinceLastInteraction = now - lastInteractionTime;

  // If no interaction for threshold duration
  if (timeSinceLastInteraction >= IDLE_THRESHOLD) {
    const idleMetrics = {
      interactionCount: 0,
      interactionDensity: 0,
      activeTime: 0,
      idleTime: timeSinceLastInteraction
    };

    const state = inferState(idleMetrics);
    transitionState(state);
  }

  // Always keep durations and focus ratio fresh
  updateDurations();
  
  const totalTime = now - sessionStart;
  const focusRatio = totalTime > 0 ? stateDurations.FOCUSED / totalTime : 0;

  updateMetrics({ 
    focusRatio,
    idleTime: timeSinceLastInteraction
  });
  updateStateBadge(lastState);
}, 1000);

window.addEventListener("beforeunload", () => {
  const now = Date.now();
  updateDurations();

  const summary = {
    startedAt: sessionStart,
    endedAt: now,
    durationMs: now - sessionStart,
    focusRatio: (now - sessionStart) > 0
      ? stateDurations.FOCUSED / (now - sessionStart)
      : 0,
    timeInState: stateDurations
  };

  saveSessionSummary(summary);
});

/* =========================
   UI Setup & Reset
   ========================= */

renderSessionSummary();

const resetBtn = document.getElementById("reset-session");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (confirm("Reset current session data?")) {
      sessionStart = Date.now();
      lastInteractionTime = Date.now();
      Object.keys(stateDurations).forEach(k => stateDurations[k] = 0);
      lastState = "IDLE";
      lastStateChange = Date.now();
      
      const tl = document.getElementById("timeline-list");
      if (tl) tl.innerHTML = "";
      
      clearSession();
      clearSummaryUI();
      addTimelineEvent("SYSTEM", "Session Reset");
      updateStateBadge("IDLE");
    }
  });
}
