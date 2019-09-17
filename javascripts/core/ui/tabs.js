"use strict";

class SubtabState {
  constructor(parent, config) {
    this._parent = parent;
    this.config = config;
  }

  get name() {
    return this.config.name;
  }

  get symbol() {
    return this.config.symbol;
  }

  get isAvailable() {
    return this.config.condition === undefined || this.config.condition();
  }

  get key() {
    return this.config.key;
  }

  show() {
    this._parent.show(this);
  }

  get isOpen() {
    return ui.view.subtab === this.key;
  }
}

class TabState {
  constructor(config) {
    this.config = config;
    this.isOpened = false;
    const subtabs = [];
    for (const subtabConfig of config.subtabs) {
      const subtab = new SubtabState(this, subtabConfig);
      this[subtabConfig.key] = subtab;
      subtabs.push(subtab);
    }
    this.subtabs = subtabs;
    this._currentSubtab = subtabs[0];
  }

  get name() {
    return this.config.name;
  }

  get isAvailable() {
    return this.config.condition === undefined || this.config.condition();
  }

  get isOpen() {
    return ui.view.tab === this.config.key;
  }

  show(subtab = undefined) {
    ui.view.tab = this.config.key;
    if (subtab !== undefined) {
      this._currentSubtab = subtab;
    }
    ui.view.subtab = this._currentSubtab.key;
    Modal.hide();
    EventHub.dispatch(GameEvent.TAB_CHANGED, ui.view.tab, ui.view.subtab);
  }

  resetCurrentSubtab() {
    this._currentSubtab = this.subtabs[0];
  }
}

const Tab = GameDatabase.tabs.mapToObject(
  config => config.key,
  config => new TabState(config)
);

const Tabs = (function() {
  return {
    all: Object.values(Tab),
    get current() {
      return Tabs.all.find(tab => tab.isOpen);
    }
  };
}());

EventHub.logic.on(GameEvent.GAME_LOAD, () => {
  for (const tab of Tabs.all) {
    tab.resetCurrentSubtab();
  }
});
