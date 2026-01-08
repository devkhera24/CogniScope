// ui/gauges.js

export function updateMetrics(metrics) {
  if (!metrics) return;

  const focusEl = document.querySelector('[data-metric="focus"]');
  const densityEl = document.querySelector('[data-metric="density"]');
  const idleEl = document.querySelector('[data-metric="idle"]');
  const scrollEl = document.querySelector('[data-metric="scroll"]');

  if (focusEl && typeof metrics.focusRatio === "number") {
    focusEl.textContent = metrics.focusRatio.toFixed(3);
  }

  if (densityEl) {
    densityEl.textContent = metrics.interactionDensity.toFixed(2);
  }

  if (idleEl) {
    const idleS = (metrics.idleTime / 1000).toFixed(1);
    idleEl.textContent = `${idleS}s`;
  }

  if (scrollEl && typeof metrics.scrollIntensity === "number") {
    scrollEl.textContent = metrics.scrollIntensity.toFixed(2);
  }
}
