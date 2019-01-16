let crashed = false;

function crash(message) {
  GameKeyboard.disable();
  GameIntervals.stop();
  // TODO: remove after consolidation of all intervals.
  const id = setInterval(() => {}, 9999); // Get a reference to the last
  // interval +1
  for (let i = 1; i < id; i++) {
    clearInterval(i);
  }
  // requestAnimationFrame so Vue could initialize on init-time crashes
  requestAnimationFrame(() => {
    Modal.message.show(`Fatal error:<br>${message}<br>Check the console for more details`);
  });
  crashed = true;
  return "Fatal Error: " + message;
}