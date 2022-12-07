import Mousetrap from "mousetrap";

// Add all numpad keys to Mousetrap (keycodes 97-105 correspond to numpad 1-9)
const numpadKeys = {};
for (let num = 1; num <= 9; num++) numpadKeys[num + 96] = `num${num}`;
Mousetrap.addKeycodes(numpadKeys);

function getKeys(combination) {
  return combination.split("+");
}

// Extract "a" from "a", "shift+a", "shift+alt+a" and whatever else
// Returns undefined for mod-only combos, like "shift+alt"
const modifierKeys = ["ctrl", "shift", "alt", "mod"];
function getMainKey(keys) {
  return keys.find(key => !modifierKeys.includes(key));
}

class KeySpin {
  constructor(key) {
    this.key = key;
  }

  setAction(keys, action) {
    if (keys.includes("shift")) {
      this.shiftAction = action;
    } else {
      this.action = action;
    }
  }

  start() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.executeAction();
    this.interval = setInterval(() => {
      clearInterval(this.interval);
      this.executeAction();
      this.interval = setInterval(() => this.executeAction(), 40);
    }, 500);
  }

  executeAction() {
    if (ui.view.shiftDown && this.shiftAction !== undefined) {
      this.shiftAction();
    } else if (this.action !== undefined) {
      this.action();
    }
  }

  probablyStop() {
    // Goddamn, Mousetrap
    // It doesn't call keyup "1" for the case where you have "shift+1" pressed,
    // and you release the "1" key. Instead, it will call the keyup for "shift+1"
    // To fix this issue, we will stop on "shift+1", but only if we know that
    // shift is pressed, and that's what's in the ui.view.shiftDown
    if (ui.view.shiftDown) {
      this.stop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = undefined;
  }
}

export class GameKeyboard {
  static stopSpins() {
    for (const spin of spins) {
      spin.stop();
    }
  }

  static bind(key, callback, type) {
    Mousetrap.bind(key, () => executeKey(callback), type);
  }

  static bindRepeatable(key, callback) {
    this._bindSpin(key, () => executeKey(callback));
  }

  static bindHotkey(key, callback, type) {
    Mousetrap.bind(key, () => executeHotkey(callback), type);
  }

  static bindRepeatableHotkey(key, callback) {
    this._bindSpin(key, () => executeHotkey(callback));
  }

  static _bindSpin(combination, action) {
    const keys = getKeys(combination);
    const mainKey = getMainKey(keys);
    let spin = spins.find(s => s.key === mainKey);
    if (spin === undefined) {
      spin = new KeySpin(mainKey);
      spins.push(spin);
      Mousetrap.bind(mainKey, () => spin.start(), "keydown");
      Mousetrap.bind(mainKey, () => spin.stop(), "keyup");
    }

    if (combination !== mainKey) {
      Mousetrap.bind(combination, () => spin.start(), "keydown");
      Mousetrap.bind(combination, () => spin.probablyStop(), "keyup");
    }

    spin.setAction(keys, action);
  }

  static disable() {
    this.stopSpins();
    Mousetrap.reset();
  }
}

const spins = [];

function executeKey(action) {
  if (ui.$viewModel.modal.progressBar !== undefined || GameEnd.endState >= END_STATE_MARKERS.INTERACTIVITY_DISABLED) {
    return undefined;
  }
  return action();
}

function executeHotkey(action) {
  if (!player.options.hotkeys ||
    document.activeElement.type === "text" ||
    document.activeElement.type === "textarea") {
    return undefined;
  }
  return executeKey(action);
}
