import { initEventCollector } from "./core/eventCollector.js";
import { pushEvent } from "./core/eventBuffer.js";

console.log("CogniScope initialized");

initEventCollector((event) => {
  pushEvent(event);
});
