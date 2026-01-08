// core/stateEngine.js

let currentState = "IDLE";
let focusScore = 0;

export function inferState(metrics) {
  if (!metrics) return currentState;

  const {
    interactionDensity,
    interactionCount,
    idleTime
  } = metrics;

  // -----------------
  // IDLE
  // -----------------
  if (idleTime >= 3000) {
    focusScore = 0;
    currentState = "IDLE";
    return currentState;
  }

  // -----------------
  // Build focus score
  // -----------------
  // interactionCount >= 2 usually means typing or repeated clicks
  if (interactionCount >= 3 && interactionDensity >= 1) {
    // Strong intent (typing / repetitive clicking)
    focusScore += 2;
  } else if (interactionCount >= 1 && interactionDensity >= 1) {
    // Weak intent (single click, light activity)
    focusScore += 1;
  } else {
    // Decay when signals weaken
    focusScore = Math.max(focusScore - 1, 0);
  }

  // -----------------
  // FOCUSED
  // -----------------
  if (focusScore >= 4) {
    currentState = "FOCUSED";
    return currentState;
  }

  // -----------------
  // DISTRACTED
  // -----------------
  currentState = "DISTRACTED";
  return currentState;
}

export function getCurrentState() {
  return currentState;
}
