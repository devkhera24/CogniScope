// ui/gauges.js

export function updateMetrics(metrics) {
  if (!metrics) return;

  const densityEl = document.querySelector('[data-metric="density"]');
  const idleEl = document.querySelector('[data-metric="idle"]');

  if (densityEl) {
    densityEl.textContent = metrics.interactionDensity.toFixed(2);
  }

  if (idleEl) {
    idleEl.textContent = `${Math.round(metrics.idleTime / 1000)} s`;
  }
}
