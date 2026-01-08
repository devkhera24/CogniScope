// core/eventBuffer.js

let buffer = [];
let flushIntervalId = null;

const FLUSH_INTERVAL = 3000; // milliseconds

export function pushEvent(event) {
  buffer.push(event);
}

function flush(processBatch) {
  if (buffer.length === 0) return;

  const batch = buffer.slice();
  buffer = [];

  processBatch(batch);
}

export function startBufferProcessor(processBatch) {
  if (typeof processBatch !== "function") {
    throw new Error("Buffer processor requires a batch handler");
  }

  // Periodic flushing
  flushIntervalId = setInterval(() => {
    flush(processBatch);
  }, FLUSH_INTERVAL);

  // Idle-time flushing (best-effort)
  if ("requestIdleCallback" in window) {
    const idleFlush = () => {
      flush(processBatch);
      requestIdleCallback(idleFlush);
    };

    requestIdleCallback(idleFlush);
  }
}

export function stopBufferProcessor() {
  if (flushIntervalId) {
    clearInterval(flushIntervalId);
    flushIntervalId = null;
  }
}
