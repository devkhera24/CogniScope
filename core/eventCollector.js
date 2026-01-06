// core/eventCollector.js

export function initEventCollector(emit) {
  if (typeof emit !== "function") {
    throw new Error("EventCollector requires an emit function");
  }

  // ---------- Page Visibility ----------
  document.addEventListener("visibilitychange", () => {
    emit({
      type: "VISIBILITY_CHANGE",
      timestamp: Date.now(),
      payload: {
        state: document.visibilityState
      }
    });
  });

  // ---------- Focus / Blur ----------
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

  // ---------- Keyboard ----------
  window.addEventListener("keydown", (e) => {
    emit({
      type: "KEY_DOWN",
      timestamp: Date.now(),
      payload: {
        key: e.key
      }
    });
  });

  // ---------- Mouse ----------
  window.addEventListener("mousemove", () => {
    emit({
      type: "MOUSE_MOVE",
      timestamp: Date.now(),
      payload: {}
    });
  });

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

  // ---------- Scroll ----------
  window.addEventListener("scroll", () => {
    emit({
      type: "SCROLL",
      timestamp: Date.now(),
      payload: {
        scrollY: window.scrollY
      }
    });
  });
}
