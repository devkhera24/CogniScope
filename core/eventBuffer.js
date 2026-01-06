// core/eventBuffer.js

const buffer = [];

export function pushEvent(event) {
  buffer.push(event);
}

export function getBufferedEvents() {
  return [...buffer];
}

export function clearBuffer() {
  buffer.length = 0;
}
