window.EventHub = class EventHub {
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
    for (const handlers of Object.keys(this._handlers)) {
      this._handlers[handlers] = this._handlers[handlers]
        .filter(handler => handler.target !== target);
    }
  }

  dispatch(event, args) {
    const handlers = this._handlers[event];
    if (handlers === undefined) return;
    for (const handler of handlers) {
      handler.fn(args);
    }
  }

  static dispatch(event, ...args) {
    EventHub.logic.dispatch(event, args);
    GameUI.dispatch(event, args);
  }

  static get stats() {
    // For debug/profiling purposes
    function countHandlers(eventHub) {
      return Object.values(eventHub._handlers)
        .map(handlers => handlers.length)
        .sum();
    }
    return `UI(UPDATE/Total): ${EventHub.ui._handlers[GAME_EVENT.UPDATE].length}/${countHandlers(EventHub.ui)}; ` +
      `Logic(Total): ${countHandlers(EventHub.logic)}`;
  }
};

EventHub.logic = new EventHub();
EventHub.ui = new EventHub();

window.GAME_EVENT = {
  // Ticks
  GAME_TICK_BEFORE: "GAME_TICK_BEFORE",
  GAME_TICK_AFTER: "GAME_TICK_AFTER",
  REPLICANTI_TICK_BEFORE: "REPLICANTI_TICK_BEFORE",
  REPLICANTI_TICK_AFTER: "REPLICANTI_TICK_AFTER",

  // Resets
  DIMBOOST_BEFORE: "DIMBOOST_BEFORE",
  DIMBOOST_AFTER: "DIMBOOST_AFTER",
  GALAXY_RESET_BEFORE: "GALAXY_RESET_BEFORE",
  GALAXY_RESET_AFTER: "GALAXY_RESET_AFTER",
  SACRIFICE_RESET_BEFORE: "SACRIFICE_RESET_BEFORE",
  SACRIFICE_RESET_AFTER: "SACRIFICE_RESET_AFTER",
  BIG_CRUNCH_BEFORE: "BIG_CRUNCH_BEFORE",
  BIG_CRUNCH_AFTER: "BIG_CRUNCH_AFTER",
  ETERNITY_RESET_BEFORE: "ETERNITY_RESET_BEFORE",
  ETERNITY_RESET_AFTER: "ETERNITY_RESET_AFTER",
  REALITY_RESET_BEFORE: "REALITY_RESET_BEFORE",
  REALITY_RESET_AFTER: "REALITY_RESET_AFTER",
  SINGULARITY_RESET_BEFORE: "SINGULARITY_RESET_BEFORE",
  SINGULARITY_RESET_AFTER: "SINGULARITY_RESET_AFTER",
  ARMAGEDDON_BEFORE: "ARMAGEDDON_BEFORE",
  ARMAGEDDON_AFTER: "ARMAGEDDON_AFTER",

  // Glyphs
  GLYPHS_EQUIPPED_CHANGED: "GLYPHS_EQUIPPED_CHANGED",
  GLYPHS_CHANGED: "GLYPHS_CHANGED",
  GLYPH_SACRIFICED: "GLYPH_SACRIFICED",
  GLYPH_SET_SAVE_CHANGE: "GLYPH_SET_SAVE_CHANGE",
  GLYPH_VISUAL_CHANGE: "GLYPH_VISUAL_CHANGE",

  // Break Infinity
  BREAK_INFINITY: "BREAK_INFINITY",
  FIX_INFINITY: "FIX_INFINITY",

  // Other
  INFINITY_DIMENSION_UNLOCKED: "INFINITY_DIMENSION_UNLOCKED",
  INFINITY_CHALLENGE_COMPLETED: "INFINITY_CHALLENGE_COMPLETED",
  INFINITY_UPGRADE_BOUGHT: "INFINITY_UPGRADE_BOUGHT",
  INFINITY_UPGRADE_CHARGED: "INFINITY_UPGRADE_CHARGED",
  INFINITY_UPGRADES_DISCHARGED: "INFINITY_UPGRADES_DISCHARGED",
  ACHIEVEMENT_UNLOCKED: "ACHIEVEMENT_UNLOCKED",
  CHALLENGE_FAILED: "CHALLENGE_FAILED",
  REALITY_UPGRADE_BOUGHT: "REALITY_UPGRADE_BOUGHT",
  REALITY_UPGRADE_TEN_BOUGHT: "REALITY_UPGRADE_TEN_BOUGHT",
  PERK_BOUGHT: "PERK_BOUGHT",
  BLACK_HOLE_UNLOCKED: "BLACK_HOLE_UNLOCKED",
  BLACK_HOLE_UPGRADE_BOUGHT: "BLACK_HOLE_UPGRADE_BOUGHT",
  GAME_LOAD: "GAME_LOAD",
  OFFLINE_CURRENCY_GAINED: "OFFLINE_CURRENCY_GAINED",
  SAVE_CONVERTED_FROM_PREVIOUS_VERSION: "SAVE_CONVERTED_FROM_PREVIOUS_VERSION",
  REALITY_FIRST_UNLOCKED: "REALITY_FIRST_UNLOCKED",
  AUTOMATOR_TYPE_CHANGED: "AUTOMATOR_TYPE_CHANGED",
  AUTOMATOR_SAVE_CHANGED: "AUTOMATOR_SAVE_CHANGED",
  AUTOMATOR_CONSTANT_CHANGED: "AUTOMATOR_CONSTANT_CHANGED",
  PELLE_STRIKE_UNLOCKED: "PELLE_STRIKE_UNLOCKED",

  // Used by events to signify that they are triggered by a particular
  // event, not handled by the event hub
  ACHIEVEMENT_EVENT_OTHER: "ACHIEVEMENT_EVENT_OTHER",

  ENTER_PRESSED: "ENTER_PRESSED",
  ARROW_KEY_PRESSED: "ARROW_KEY_PRESSED",

  // UI Events
  UPDATE: "UPDATE",
  TAB_CHANGED: "TAB_CHANGED",
  CLOSE_MODAL: "CLOSE_MODAL",
};
