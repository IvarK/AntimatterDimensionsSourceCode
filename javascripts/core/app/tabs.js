"use strict";

class Tab {
  constructor(component) {
    this._component = component;
  }

  get isOpen() {
    return ui.view.tabs.current === this._component;
  }

  show() {
    ui.view.tabs.current = this._component;
    EventHub.dispatch(GameEvent.TAB_CHANGED);
  }
}

class Subtab {
  constructor(id, parent, view, isDefault) {
    this._id = id;
    this._parent = parent;
    this._view = view;
    if (isDefault) {
      this._view.subtab = this._id;
    }
  }

  get isOpen() {
    return this._parent.isOpen && this._view.subtab === this._id;
  }

  show() {
    this._view.subtab = this._id;
    this._parent.show();
    EventHub.dispatch(GameEvent.TAB_CHANGED);
  }
}

Tab.dimensions = new Tab("dimensions-tab");
Tab.dimensions.normal = new Subtab("Dimensions", Tab.dimensions, ui.view.tabs.dimensions, true);
Tab.dimensions.infinity = new Subtab("Infinity Dimensions", Tab.dimensions, ui.view.tabs.dimensions);
Tab.dimensions.time = new Subtab("Time Dimensions", Tab.dimensions, ui.view.tabs.dimensions);
Tab.options = new Tab("options-tab");
Tab.statistics = new Tab("stats-tab");
Tab.achievements = new Tab("achievements-tab");
Tab.challenges = new Tab("challenges-tab");
Tab.challenges.normal = new Subtab("Challenges", Tab.challenges, ui.view.tabs.challenges, true);
Tab.challenges.infinity = new Subtab("Infinity Challenges", Tab.challenges, ui.view.tabs.challenges);
Tab.challenges.eternity = new Subtab("Eternity Challenges", Tab.challenges, ui.view.tabs.challenges);
Tab.infinity = new Tab("infinity-tab");
Tab.eternity = new Tab("eternity-tab");
Tab.eternity.timeStudies = new Subtab("Time studies", Tab.eternity, ui.view.tabs.eternity, true);
Tab.eternity.dilation = new Subtab("Time dilation", Tab.eternity, ui.view.tabs.eternity);
Tab.reality = new Tab("reality-tab");
Tab.reality.glyphs = new Subtab("Glyphs", Tab.reality, ui.view.tabs.reality, true);
Tab.celestials = new Tab("celestials-tab");

// small hack until Vue migration is complete
function tryShowtab(tab) {
  if (tab === 'options') {
    Tab.options.show();
    return true;
  }
  if (tab === 'statistics') {
    Tab.statistics.show();
    return true;
  }
  if (tab === 'dimensions') {
    Tab.dimensions.show();
    return true;
  }
  if (tab === 'achievements') {
    Tab.achievements.show();
    return true;
  }
  if (tab === 'challenges') {
    Tab.challenges.show();
    return true;
  }
  if (tab === 'infinity') {
    Tab.infinity.show();
    return true;
  }
  if (tab === 'eternitystore') {
    Tab.eternity.show();
    return true;
  }
  if (tab === 'celestials') {
    Tab.celestials.show();
    return true;
  }
  if (tab === 'reality') {
    Tab.reality.show();
    return true;
  }
  ui.view.tabs.current = undefined;
  EventHub.dispatch(GameEvent.TAB_CHANGED);
  return false;
}
