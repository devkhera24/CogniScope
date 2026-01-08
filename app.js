import { initEventCollector } from "./core/eventCollector.js";
import { pushEvent, startBufferProcessor } from "./core/eventBuffer.js";
import { analyzeEventBatch } from "./core/analyzer.js";
import { inferState } from "./core/stateEngine.js";

import { updateStateBadge } from "./ui/stateBadge.js";
import { updateMetrics } from "./ui/gauges.js";

console.log("CogniScope initialized");

initEventCollector((event) => {
  pushEvent(event);
});

startBufferProcessor((eventBatch) => {
  const metrics = analyzeEventBatch(eventBatch);
  const state = inferState(metrics);

  updateStateBadge(state);
  updateMetrics(metrics);
});
