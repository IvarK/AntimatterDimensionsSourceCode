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

  get isHidden() {
    // eslint-disable-next-line no-bitwise
    return ((player.options.hiddenSubtabBits[this._parent.config.id] & (1 << this.config.id)) !== 0) && 
      this.config.hidable;
  }

  get isUnlocked() {
    return this.config.condition === undefined || this.config.condition() || player.devMode;
  }

  get isAvailable() {
    return !this.isHidden && this.isUnlocked;
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

  unhideTab() {
    // eslint-disable-next-line no-bitwise
    player.options.hiddenSubtabBits[this._parent.config.id] &= ~(1 << this.config.id);
  }

  toggleVisibility() {
    if (this._parent.config.id === Tabs.current.config.id &&
      this.config.id === Tabs.current._currentSubtab.config.id) return;
    // eslint-disable-next-line no-bitwise
    player.options.hiddenSubtabBits[this._parent.config.id] ^= (1 << this.config.id);
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
    this._currentSubtab = subtabs.filter(tab => tab.isUnlocked)[0];
  }

  get name() {
    return this.config.name;
  }

  get isHidden() {
    const hasVisibleSubtab = this.subtabs.some(t => t.isAvailable);
    // eslint-disable-next-line no-bitwise
    return (((player.options.hiddenTabBits & (1 << this.config.id)) !== 0) || !hasVisibleSubtab) && this.config.hidable;
  }

  get isUnlocked() {
    return this.config.condition === undefined || this.config.condition() || player.devMode;
  }

  get isAvailable() {
    return !this.isHidden && this.isUnlocked;
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
    if (subtab === undefined) {
      this._currentSubtab = this.subtabs.find(s => s.config.id === player.options.lastOpenSubtab[this.config.id]);
    } else {
      this._currentSubtab = subtab;
    }
    if (!this._currentSubtab.isUnlocked) this.resetCurrentSubtab();
    ui.view.subtab = this._currentSubtab.key;
    const tabNotificationKey = this.config.key + this._currentSubtab.key;
    if (player.tabNotifications.has(tabNotificationKey)) player.tabNotifications.delete(tabNotificationKey);

    // Makes it so that the glyph tooltip doesn't stay on tab change
    ui.view.tabs.reality.currentGlyphTooltip = -1;
    if (manual) {
      Modal.hide();
    }
    this.unhideTab();
    this._currentSubtab.unhideTab();
    EventHub.dispatch(GAME_EVENT.TAB_CHANGED, this, this._currentSubtab);
  }

  unhideTab() {
    // eslint-disable-next-line no-bitwise
    player.options.hiddenTabBits &= ~(1 << this.config.id);
  }

  toggleVisibility() {
    if (this.config.id === Tabs.current.config.id) return;
    // eslint-disable-next-line no-bitwise
    player.options.hiddenTabBits ^= (1 << this.config.id);
  }

  resetCurrentSubtab() {
    this._currentSubtab = this.subtabs.filter(tab => tab.isUnlocked)[0];
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

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  const currTab = Tabs.current.config.id;
  player.options.lastOpenTab = currTab;
  player.options.lastOpenSubtab[currTab] = Tabs.current._currentSubtab.config.id;
});
