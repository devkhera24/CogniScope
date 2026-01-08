// ui/timeline.js

const MAX_ITEMS = 50;

/**
 * Adds an event to the interaction timeline UI
 * @param {string} type - Event category (STATE, ACTIVITY, etc.)
 * @param {string} value - Principal value to display
 */
export function addTimelineEvent(type, value) {
  const container = document.getElementById("timeline-list");
  if (!container) return;

  const item = document.createElement("div");
  item.className = "timeline-item";

  const now = new Date();
  const timeStr = [
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  ].map(unit => String(unit).padStart(2, '0')).join(':');

  let valueClass = "";
  if (type === "STATE") {
    valueClass = `state-${value.toLowerCase()}`;
  }

  item.innerHTML = `
    <span class="timeline-time">${timeStr}</span>
    <span class="timeline-type">${type}</span>
    <span class="timeline-value ${valueClass}">${value}</span>
  `;

  // Prepend to show latest at top
  container.insertBefore(item, container.firstChild);

  // Maintain max list size
  if (container.children.length > MAX_ITEMS) {
    container.removeChild(container.lastChild);
  }
}
