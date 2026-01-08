import { initEventCollector } from "./core/eventCollector.js";
import { pushEvent, startBufferProcessor } from "./core/eventBuffer.js";
import { analyzeEventBatch } from "./core/analyzer.js";
import { inferState } from "./core/stateEngine.js";

console.log("CogniScope initialized");

initEventCollector((event) => {
  pushEvent(event);
});

startBufferProcessor((eventBatch) => {
  const metrics = analyzeEventBatch(eventBatch);
  const state = inferState(metrics);

  console.log("State:", state, "Metrics:", metrics);
});

