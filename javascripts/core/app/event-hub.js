class EventHub {
  constructor() {
    this._handlers = {};
  }

  on(event, fn, target) {
    let handlers = this._handlers[event];
    if (handlers === undefined) {
      handlers = [];
      this._handlers[event] = handlers;
    }
    handlers.push({ fn: fn, target: target });
  }

  offAll(target) {
    for (let handlers in this._handlers) {
      this._handlers[handlers] = this._handlers[handlers]
        .filter(handler => handler.target !== target);
    }
  }

  emit(event) {
    let handlers = this._handlers[event];
    if (handlers === undefined) return;
    for (let handler of handlers) {
      handler.fn();
    }
  }
}

EventHub.global = new EventHub();

const GameEvent = {
  UPDATE: "UPDATE",
  TAB_CHANGED: "TAB_CHANGED",
  ACHIEVEMENT_UNLOCKED: "ACHIEVEMENT_UNLOCKED",
  REALITY: "REALITY",
  GLYPHS_CHANGED: "GLYPHS_CHANGED",
};