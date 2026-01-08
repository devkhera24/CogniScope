// core/analyzer.js

export function analyzeEventBatch(events) {
  if (!events || events.length === 0) {
    return null;
  }

  // Sort events by time (defensive, just in case)
  const sortedEvents = events.slice().sort(
    (a, b) => a.timestamp - b.timestamp
  );

  const batchStart = sortedEvents[0].timestamp;
  const batchEnd = sortedEvents[sortedEvents.length - 1].timestamp;
  const batchDurationMs = batchEnd - batchStart || 1;

  let idleTime = 0;

  for (let i = 1; i < sortedEvents.length; i++) {
    const gap =
      sortedEvents[i].timestamp - sortedEvents[i - 1].timestamp;

    // Treat gaps > 2s as idle
    if (gap > 2000) {
      idleTime += gap;
    }
  }

  const interactionCount = sortedEvents.length;
  const activeTime = batchDurationMs - idleTime;
  const interactionDensity =
    interactionCount / (batchDurationMs / 1000);

  return {
    interactionCount,
    interactionDensity: Number(interactionDensity.toFixed(2)),
    activeTime, // ms
    idleTime    // ms
  };
}
