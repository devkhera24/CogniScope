// ui/stateBadge.js

export function updateStateBadge(state) {
  const stateLabel = document.querySelector(".state-label");
  if (!stateLabel) return;

  stateLabel.textContent = state;

  // Optional: visual emphasis via data attribute
  stateLabel.setAttribute("data-state", state);
}
