// ui/summaryChart.js

const STATES = { IDLE: 1, DISTRACTED: 2, FOCUSED: 3 };
const COLORS = { IDLE: "#64748b", DISTRACTED: "#facc15", FOCUSED: "#22c55e" };

export function drawSummaryChart(history) {
  const canvas = document.getElementById("summary-state-chart");
  if (!canvas || !history || history.length < 2) return;

  const ctx = canvas.getContext("2d");
  const parent = canvas.parentElement;
  
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 10;
  const innerHeight = height - 2 * padding;

  ctx.clearRect(0, 0, width, height);

  const startTime = history[0].timestamp;
  const endTime = history[history.length - 1].timestamp;
  const timeSpan = endTime - startTime || 1;

  const getY = (state) => height - padding - ((STATES[state] - 1) / 2) * innerHeight;

  // Draw background zones
  ctx.globalAlpha = 0.05;
  Object.keys(STATES).forEach(state => {
    ctx.fillStyle = COLORS[state];
    const y = getY(state);
    ctx.fillRect(0, y - 5, width, 10);
  });
  ctx.globalAlpha = 1.0;

  // Draw Step Line
  ctx.beginPath();
  ctx.lineWidth = 1.5;
  ctx.lineJoin = "round";

  history.forEach((point, i) => {
    const x = ((point.timestamp - startTime) / timeSpan) * width;
    const y = getY(point.state);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, getY(history[i-1].state)); // horizontal
      ctx.lineTo(x, y); // vertical
    }
  });

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, COLORS.FOCUSED);
  gradient.addColorStop(0.5, COLORS.DISTRACTED);
  gradient.addColorStop(1, COLORS.IDLE);
  
  ctx.strokeStyle = gradient;
  ctx.stroke();
}
