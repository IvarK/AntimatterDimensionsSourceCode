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
    handlers.push({ fn, target });
  }

  offAll(target) {
    for (const handlers in this._handlers) {
      this._handlers[handlers] = this._handlers[handlers]
        .filter(handler => handler.target !== target);
    }
  }

  dispatch(event) {
    const handlers = this._handlers[event];
    if (handlers === undefined) return;
    for (const handler of handlers) {
      handler.fn();
    }
  }

  static dispatch(event) {
    EventHub.logic.dispatch(event);
    GameUI.dispatch(event);
  }

  static get stats() {
    // For debug/profiling purposes
    function countHandlers(eventHub) {
      return Object.values(eventHub._handlers)
        .map(handlers => handlers.length)
        .sum();
    }
    return `UI(UPDATE/Total): ${EventHub.ui._handlers[GameEvent.UPDATE].length}/${countHandlers(EventHub.ui)}; ` +
      `Logic(Total): ${countHandlers(EventHub.logic)}`;
  }
}

EventHub.logic = new EventHub();
EventHub.ui = new EventHub();

const GameEvent = {
  GAME_TICK: "GAME_TICK",
  UPDATE: "UPDATE",
  TAB_CHANGED: "TAB_CHANGED",
  ACHIEVEMENT_UNLOCKED: "ACHIEVEMENT_UNLOCKED",
  GALAXY_RESET: "GALAXY_RESET",
  INFINTIY_RESET: "INFINTIY_RESET",
  REALITY: "REALITY",
  GLYPHS_CHANGED: "GLYPHS_CHANGED",
};
