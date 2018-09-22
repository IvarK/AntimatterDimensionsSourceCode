class KeySpin {
  constructor(action) {
    this.action = action;
  }

  start() {
    if (this.isRunning) return;
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
    clearInterval(this.interval);
  }
}

class Keyboard {
  static bind(key, callback, type) {
    Mousetrap.bind(key, callback, type);
  }

  static bindRepeatable(key, callback) {
    this._bindSpin(key, new KeySpin(callback));
  }

  static bindHotkey(key, callback, type) {
    Mousetrap.bind(key, () => executeHotkey(callback), type);
  }

  static bindRepeatableHotkey(key, callback) {
    this._bindSpin(key, new KeySpin(() => executeHotkey(callback)));
  }

  static _bindSpin(key, spin) {
    if (Keyboard.spins[key] !== undefined) {
      throw "Duplicate spin binding";
    }
    Mousetrap.bind(key, () => spin.start(), "keydown");
    Mousetrap.bind(key, () => spin.stop(), "keyup");
  }
}

Keyboard.spins = [];

function executeHotkey(action) {
  if (!player.options.hotkeys || controlDown
    || document.activeElement.type === "text"
    || document.activeElement.type === "textarea")
    return;
  action();
}