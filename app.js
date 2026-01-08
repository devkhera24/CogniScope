import { initEventCollector } from "./core/eventCollector.js";
import { pushEvent, startBufferProcessor } from "./core/eventBuffer.js";
import { analyzeEventBatch } from "./core/analyzer.js";

console.log("CogniScope initialized");

initEventCollector((event) => {
  pushEvent(event);
});

startBufferProcessor((eventBatch) => {
  analyzeEventBatch(eventBatch);
});
