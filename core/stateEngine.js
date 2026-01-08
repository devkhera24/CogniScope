// core/stateEngine.js

let currentState = "IDLE";

export function inferState(metrics) {
  if (!metrics) {
    return currentState;
  }

  const {
    interactionDensity,
    activeTime,
    idleTime
  } = metrics;

  // ----- Rule: IDLE -----
  if (
    interactionDensity < 0.2 &&
    idleTime > activeTime
  ) {
    currentState = "IDLE";
    return currentState;
  }

  // ----- Rule: FOCUSED -----
  if (
    interactionDensity >= 1.5 &&
    idleTime < activeTime * 0.3
  ) {
    currentState = "FOCUSED";
    return currentState;
  }

  // ----- Rule: DISTRACTED -----
  currentState = "DISTRACTED";
  return currentState;
}

export function getCurrentState() {
  return currentState;
}
