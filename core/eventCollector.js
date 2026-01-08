// core/eventCollector.js

export function initEventCollector(emit) {
  if (typeof emit !== "function") {
    throw new Error("EventCollector requires an emit function");
  }

  // -------------------------------
  // Page Visibility
  // -------------------------------
  document.addEventListener("visibilitychange", () => {
    emit({
      type: "VISIBILITY_CHANGE",
      timestamp: Date.now(),
      payload: {
        state: document.visibilityState
      }
    });
  });

  // -------------------------------
  // Window Focus / Blur
  // -------------------------------
  window.addEventListener("focus", () => {
    emit({
      type: "WINDOW_FOCUS",
      timestamp: Date.now(),
      payload: {}
    });
  });

  window.addEventListener("blur", () => {
    emit({
      type: "WINDOW_BLUR",
      timestamp: Date.now(),
      payload: {}
    });
  });

  // -------------------------------
  // Keyboard Interaction
  // -------------------------------
  window.addEventListener("keydown", (e) => {
    emit({
      type: "KEY_DOWN",
      timestamp: Date.now(),
      payload: {
        key: e.key
      }
    });
  });

  // -------------------------------
  // Mouse Click
  // -------------------------------
  window.addEventListener("click", (e) => {
    emit({
      type: "MOUSE_CLICK",
      timestamp: Date.now(),
      payload: {
        x: e.clientX,
        y: e.clientY
      }
    });
  });

  // -------------------------------
  // Scroll
  // -------------------------------
  window.addEventListener("scroll", () => {
    emit({
      type: "SCROLL",
      timestamp: Date.now(),
      payload: {
        scrollY: window.scrollY
      }
    });
  });

  // -------------------------------
  // Mouse Move (Downsampled)
  // -------------------------------
  let lastMouseMoveTime = 0;
  const MOUSEMOVE_INTERVAL = 200; // ms

  window.addEventListener("mousemove", () => {
    const now = Date.now();

    if (now - lastMouseMoveTime < MOUSEMOVE_INTERVAL) {
      return; // suppress noisy movement
    }

    lastMouseMoveTime = now;

    emit({
      type: "MOUSE_MOVE",
      timestamp: now,
      payload: {}
    });
  });
}
