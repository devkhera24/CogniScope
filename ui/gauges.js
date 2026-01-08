// ui/gauges.js

export function updateMetrics(metrics) {
  if (!metrics) return;

  const focusEl = document.querySelector('[data-metric="focus"]');
  const densityEl = document.querySelector('[data-metric="density"]');
  const idleEl = document.querySelector('[data-metric="idle"]');

  if (focusEl && typeof metrics.focusRatio === "number") {
    focusEl.textContent = metrics.focusRatio.toFixed(2);
  }

  if (densityEl) {
    densityEl.textContent = metrics.interactionDensity.toFixed(2);
  }

  if (idleEl) {
    idleEl.textContent = `${Math.round(metrics.idleTime / 1000)} s`;
  }
}
