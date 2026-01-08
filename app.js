import { initEventCollector } from "./core/eventCollector.js";
import { pushEvent, startBufferProcessor } from "./core/eventBuffer.js";
import { analyzeEventBatch } from "./core/analyzer.js";
import { inferState } from "./core/stateEngine.js";

import { updateStateBadge } from "./ui/stateBadge.js";
import { updateMetrics } from "./ui/gauges.js";

let sessionStart = Date.now();
let focusedTime = 0;
let lastState = "IDLE";
let lastStateChange = Date.now();


console.log("CogniScope initialized");

initEventCollector((event) => {
  pushEvent(event);
});

startBufferProcessor((eventBatch) => {
  const metrics = analyzeEventBatch(eventBatch);
  const state = inferState(metrics);

  const now = Date.now();

  // Accumulate focused time
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

