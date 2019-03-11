let crashed = false;

function crash(message) {
  GameKeyboard.disable();
  GameIntervals.stop();
  function clearHandles(set, clear) {
    let id = set(() => {}, 9999);
    while (id--) {
      clear(id);
    }
  }
  clearHandles(setInterval, clearInterval);
  clearHandles(setTimeout, clearTimeout);
  clearHandles(requestAnimationFrame, cancelAnimationFrame);
  // requestAnimationFrame so Vue could initialize on init-time crashes
  requestAnimationFrame(() => {
    Modal.message.show(`Fatal error:<br>${message}<br>Check the console for more details`);
  });
  crashed = true;
  debugger;
  return Error("Fatal Error: " + message);
}
