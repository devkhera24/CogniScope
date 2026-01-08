// ui/stateBadge.js
import { addTimelineEvent } from "./timeline.js";

export function updateStateBadge(state) {
  const stateLabel = document.querySelector(".state-label");
  if (!stateLabel) return;

  const oldState = stateLabel.textContent;
  if (oldState !== state) {
    stateLabel.textContent = state;
    stateLabel.setAttribute("data-state", state);
    
    // Log state change to timeline
    addTimelineEvent("STATE", state);
  }
}
