import Mousetrap from "mousetrap";

class KeySpin {
  constructor(key, action) {
    this.key = key;
    this.action = action;
  }

  start() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.action();
    this.interval = setInterval(() => {
      clearInterval(this.interval);
      this.action();
      this.interval = setInterval(() => this.action(), 40);
    }, 500);
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
    for (const spin of GameKeyboard.spins) {
      spin.stop();
    }
  }

  static bind(key, callback, type) {
    Mousetrap.bind(key, () => executeKey(callback), type);
  }

  static bindRepeatable(key, callback) {
    this._bindSpin(key, new KeySpin(key, () => executeKey(callback)));
  }

  static bindHotkey(key, callback, type) {
    Mousetrap.bind(key, () => executeHotkey(callback), type);
  }

  static bindRepeatableHotkey(key, callback) {
    this._bindSpin(key, new KeySpin(key, () => executeHotkey(callback)));
  }

  static _bindSpin(key, spin) {
    if (GameKeyboard.spins.find(s => s.key === key)) {
      throw `Duplicate spin binding for ${key}`;
    }
    GameKeyboard.spins.push(spin);
    Mousetrap.bind(key, () => spin.start(), "keydown");
    Mousetrap.bind(key, () => spin.stop(), "keyup");
  }

  static disable() {
    this.stopSpins();
    Mousetrap.reset();
  }
}

GameKeyboard.spins = [];

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
