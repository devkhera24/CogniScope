import { initEventCollector } from "./core/eventCollector.js";
import { pushEvent, startBufferProcessor } from "./core/eventBuffer.js";
import { analyzeEventBatch } from "./core/analyzer.js";
import { inferState } from "./core/stateEngine.js";

import { updateStateBadge } from "./ui/stateBadge.js";
import { updateMetrics } from "./ui/gauges.js";
import { saveSessionSummary } from "./core/sessionStore.js";
import { renderSessionSummary } from "./ui/summary.js";

const stateDurations = {
  FOCUSED: 0,
  DISTRACTED: 0,
  IDLE: 0
};


/* =========================
   Session Tracking
   ========================= */

let sessionStart = Date.now();
let focusedTime = 0;

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

startBufferProcessor((eventBatch) => {
  const metrics = analyzeEventBatch(eventBatch);
  if (!metrics) return;

  const state = inferState(metrics);
  const now = Date.now();

  // Accumulate focused time

  stateDurations[lastState] += now - lastStateChange;

  if (lastState === "FOCUSED") {
    focusedTime += now - lastStateChange;
  }

  lastState = state;
  lastStateChange = now;

  const totalTime = now - sessionStart;
  const focusRatio = totalTime > 0 ? focusedTime / totalTime : 0;

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

  // If no interaction for threshold duration
  if (now - lastInteractionTime >= IDLE_THRESHOLD) {
    const idleMetrics = {
      interactionCount: 0,
      interactionDensity: 0,
      activeTime: 0,
      idleTime: now - lastInteractionTime
    };

    const state = inferState(idleMetrics);

    // Accumulate focused time correctly
    if (lastState === "FOCUSED") {
      focusedTime += now - lastStateChange;
    }

    lastState = state;
    lastStateChange = now;

    const totalTime = now - sessionStart;
    const focusRatio = totalTime > 0 ? focusedTime / totalTime : 0;

    updateStateBadge(state);
    updateMetrics({
      ...idleMetrics,
      focusRatio
    });
  }
}, 1000);


window.addEventListener("beforeunload", () => {
  const now = Date.now();

  // Finalize last state duration
  stateDurations[lastState] += now - lastStateChange;

  const summary = {
    startedAt: sessionStart,
    endedAt: now,
    durationMs: now - sessionStart,
    focusRatio: (now - sessionStart) > 0
      ? focusedTime / (now - sessionStart)
      : 0,
    timeInState: stateDurations
  };

  saveSessionSummary(summary);
});

renderSessionSummary();