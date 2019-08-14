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

class GameKeyboard {
  static stopSpins() {
    for (const spin of GameKeyboard.spins) {
      spin.stop();
    }
  }

  static bind(key, callback, type) {
    Mousetrap.bind(key, callback, type);
  }

  static bindRepeatable(key, callback) {
    this._bindSpin(key, new KeySpin(key, callback));
  }

  static bindHotkey(key, callback, type) {
    Mousetrap.bind(key, () => executeHotkey(callback), type);
  }

  static bindRepeatableHotkey(key, callback) {
    this._bindSpin(key, new KeySpin(key, () => executeHotkey(callback)));
  }

  static _bindSpin(key, spin) {
    if (GameKeyboard.spins.find(spin => spin.key === key)) {
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

function executeHotkey(action) {
  if (!player.options.hotkeys || controlDown ||
    document.activeElement.type === "text" ||
    document.activeElement.type === "textarea") {
    return;
  }
  action();
}