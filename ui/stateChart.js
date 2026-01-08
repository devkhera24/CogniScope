// ui/stateChart.js

const MAX_POINTS = 200;
let history = [];

const STATES = {
  IDLE: 1,
  DISTRACTED: 2,
  FOCUSED: 3
};

const COLORS = {
  IDLE: "#64748b",
  DISTRACTED: "#facc15",
  FOCUSED: "#22c55e"
};

/**
 * Adds a state point to the chart history
 * @param {string} state - The current state
 */
export function addChartPoint(state) {
  const now = Date.now();
  
  history.push({
    timestamp: now,
    state: state
  });

  if (history.length > MAX_POINTS) {
    history.shift();
  }

  drawChart();
}

/**
 * Returns the current history for session saving
 */
export function getChartHistory() {
  return history;
}

/**
 * Clears the chart history
 */
export function clearChart() {
  history = [];
  drawChart();
}

function drawChart() {
  const canvas = document.getElementById("state-chart");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  const parent = canvas.parentElement;
  
  // Resize to match container
  const rect = parent.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  if (history.length < 2) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 30;

  // Clear
  ctx.clearRect(0, 0, width, height);

  // Draw Grid Lines (Y-Axis)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.font = "10px Inter, sans-serif";
  ctx.fillStyle = "#64748b";

  Object.entries(STATES).forEach(([name, value]) => {
    const y = getYForValue(value, height, padding);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
    ctx.fillText(name, 5, y + 3);
  });

  // Plot Step Line
  const startTime = history[0].timestamp;
  const endTime = history[history.length - 1].timestamp;
  const timeSpan = Math.max(endTime - startTime, 1000);

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";

  history.forEach((point, i) => {
    const x = padding + ((point.timestamp - startTime) / timeSpan) * (width - 2 * padding);
    const y = getYForValue(STATES[point.state], height, padding);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      const prevX = padding + ((history[i-1].timestamp - startTime) / timeSpan) * (width - 2 * padding);
      const prevY = getYForValue(STATES[history[i-1].state], height, padding);
      
      // Step transition: move horizontally to current X, then vertically to current Y
      ctx.lineTo(x, prevY);
      ctx.lineTo(x, y);
    }
  });

  // Create Gradient Stroke
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, COLORS.FOCUSED);
  gradient.addColorStop(0.5, COLORS.DISTRACTED);
  gradient.addColorStop(1, COLORS.IDLE);
  
  ctx.strokeStyle = gradient;
  ctx.stroke();

  // Draw Points
  history.forEach((point) => {
    const x = padding + ((point.timestamp - startTime) / timeSpan) * (width - 2 * padding);
    const y = getYForValue(STATES[point.state], height, padding);
    
    ctx.fillStyle = COLORS[point.state];
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function getYForValue(val, height, padding) {
  // val 1 (IDLE) -> low (higher Y)
  // val 3 (FOCUSED) -> high (lower Y)
  const innerHeight = height - 2 * padding;
  return height - padding - ((val - 1) / 2) * innerHeight;
}

// Redraw on resize
window.addEventListener("resize", drawChart);
