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
    return this.config.condition === undefined || this.config.condition() || player.devMode;
  }

  get hasNotification() {
    return player.tabNotifications.has(this._parent.config.key + this.key);
  }

  get key() {
    return this.config.key;
  }

  show(manual) {
    if (!this.isAvailable) {
      Modal.message.show("The requested subtab is not available! This should be considered an issue.");
      return;
    }
    this._parent.show(manual, this);
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
    this._currentSubtab = subtabs.filter(tab => tab.isAvailable)[0];
  }

  get name() {
    return this.config.name;
  }

  get isAvailable() {
    return this.config.condition === undefined || this.config.condition() || player.devMode;
  }

  get isOpen() {
    return ui.view.tab === this.config.key;
  }

  get hasNotification() {
    return this.subtabs.some(tab => tab.hasNotification);
  }

  show(manual, subtab = undefined) {
    if (!manual && !player.options.automaticTabSwitching) return;
    ui.view.tab = this.config.key;
    if (subtab !== undefined) {
      this._currentSubtab = subtab;
    }
    if (!this._currentSubtab.isAvailable) this.resetCurrentSubtab();
    ui.view.subtab = this._currentSubtab.key;
    const tabNotificationKey = this.config.key + this._currentSubtab.key;
    if (player.tabNotifications.has(tabNotificationKey)) player.tabNotifications.delete(tabNotificationKey);

    // Makes it so that the glyph tooltip doesn't stay on tab change
    ui.view.tabs.reality.currentGlyphTooltip = -1;
    if (manual) {
      Modal.hide();
    }
    EventHub.dispatch(GAME_EVENT.TAB_CHANGED, this, this._currentSubtab);

    if (this.config.key === "reality" &&
        player.saveOverThresholdFlag &&
        !player.saveOverThresholdFlagModalDisplayed) {
      Modal.message.show(`Your save seems to be over ${format(new Decimal("1e6000"))} Eternity Points.
        There have been nerfs past that in the update, so for the first Reality your
        Eternity Points gives fewer Reality Machines
        past ${format(new Decimal("1e6000"))} Eternity Points.`);
      player.saveOverThresholdFlagModalDisplayed = true;
    }
  }

  resetCurrentSubtab() {
    this._currentSubtab = this.subtabs.filter(tab => tab.isAvailable)[0];
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

EventHub.logic.on(GAME_EVENT.GAME_LOAD, () => {
  for (const tab of Tabs.all) {
    tab.resetCurrentSubtab();
  }
});
