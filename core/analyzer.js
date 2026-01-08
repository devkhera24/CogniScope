// core/analyzer.js

let lastEventTimestamp = null;

export function analyzeEventBatch(events) {
  const now = Date.now();

  // Case: no events in this batch → full idle window
  if (!events || events.length === 0) {
    if (lastEventTimestamp) {
      const idleTime = now - lastEventTimestamp;
      return {
        interactionCount: 0,
        interactionDensity: 0,
        activeTime: 0,
        idleTime
      };
    }
    return null;
  }

  const sortedEvents = events.slice().sort(
    (a, b) => a.timestamp - b.timestamp
  );

  let idleTime = 0;

  // Idle gap BEFORE first event (between batches)
  if (lastEventTimestamp) {
    const gap = sortedEvents[0].timestamp - lastEventTimestamp;
    if (gap > 2000) {
      idleTime += gap;
    }
  }

  // Idle gaps INSIDE the batch
  for (let i = 1; i < sortedEvents.length; i++) {
    const gap =
      sortedEvents[i].timestamp - sortedEvents[i - 1].timestamp;

    if (gap > 2000) {
      idleTime += gap;
    }
  }

  const batchStart = sortedEvents[0].timestamp;
  const batchEnd = sortedEvents[sortedEvents.length - 1].timestamp;
  const batchDurationMs = batchEnd - batchStart || 1;

  const interactionCount = sortedEvents.length;
  const activeTime = Math.max(batchDurationMs - idleTime, 0);
  const MIN_WINDOW_MS = 1000; // 1 second minimum window
    const effectiveDurationMs = Math.max(batchDurationMs, MIN_WINDOW_MS);

    const interactionDensity =
    interactionCount / (effectiveDurationMs / 1000);

  lastEventTimestamp = batchEnd;

  return {
    interactionCount,
    interactionDensity: Number(interactionDensity.toFixed(2)),
    activeTime,
    idleTime
  };
}
