"use strict";

let crashed = false;

function crash(message) {
  GameKeyboard.disable();
  GameIntervals.stop();
  function clearHandles(set, clear) {
    // eslint-disable-next-line no-empty-function
    let id = set(() => {}, 9999);
    while (id--) {
      clear(id);
    }
  }
  clearHandles(setInterval, clearInterval);
  clearHandles(setTimeout, clearTimeout);
  clearHandles(requestAnimationFrame, cancelAnimationFrame);
  // We are calling requestAnimationFrame here so Vue could initialize on init-time crashes
  requestAnimationFrame(() => {
    Modal.message.show(`Fatal error:<br>${message}<br>Check the console for more details`);
  });
  crashed = true;
  // eslint-disable-next-line no-debugger
  debugger;
  return Error(`Fatal Error: ${message}`);
}

function NotImplementedCrash() {
  return crash("The method is not implemented.");
}

function NotSupportedCrash() {
  return crash("The method is not supported.");
}
