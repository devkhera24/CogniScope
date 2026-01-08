// ui/gauges.js

export function updateMetrics(metrics) {
  if (!metrics) return;

  const densityEl = document.querySelector(
    ".metric-value:nth-of-type(2)"
  );
  const idleEl = document.querySelector(
    ".metric-value:nth-of-type(3)"
  );

  if (densityEl) {
    densityEl.textContent = metrics.interactionDensity.toFixed(2);
  }

  if (idleEl) {
    idleEl.textContent = `${Math.round(metrics.idleTime / 1000)}s`;
  }
}
