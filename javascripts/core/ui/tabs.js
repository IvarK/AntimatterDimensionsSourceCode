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
    if (Enslaved.isRunning) return false;
    // eslint-disable-next-line no-bitwise
    return ((player.options.hiddenSubtabBits[this._parent.id] & (1 << this.id)) !== 0) &&
      this.config.hidable;
  }

  get isUnlocked() {
    return this.config.condition === undefined || this.config.condition() || player.devMode;
  }

  get isAvailable() {
    return this.isOpen || !this.isHidden && this.isUnlocked;
  }

  get hasNotification() {
    return player.tabNotifications.has(this._parent.key + this.key);
  }

  get key() {
    return this.config.key;
  }

  get id() {
    return this.config.id;
  }

  show(manual) {
    if (!this.isAvailable) return;
    this._parent.show(manual, this);
  }

  unhideTab() {
    this._parent.unhideTab();
    // eslint-disable-next-line no-bitwise
    player.options.hiddenSubtabBits[this._parent.id] &= ~(1 << this.id);
  }

  toggleVisibility() {
    if (this._parent.id === Tabs.current.id && this.id === Tabs.current._currentSubtab.id) return;
    // eslint-disable-next-line no-bitwise
    player.options.hiddenSubtabBits[this._parent.id] ^= (1 << this.id);
  }

  get isOpen() {
    return ui.view.tab === this._parent.key && ui.view.subtab === this.key;
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
    this._currentSubtab = subtabs.find(s => s.id === player.options.lastOpenSubtab[this.id]);
  }

  get name() {
    return this.config.name;
  }

  get key() {
    return this.config.key;
  }

  get id() {
    return this.config.id;
  }

  get isHidden() {
    if (Enslaved.isRunning) return false;
    const hasVisibleSubtab = this.subtabs.some(t => t.isAvailable);
    // eslint-disable-next-line no-bitwise
    return (((player.options.hiddenTabBits & (1 << this.id)) !== 0) || !hasVisibleSubtab) && this.config.hidable;
  }

  get isUnlocked() {
    return this.config.condition === undefined || this.config.condition() || player.devMode;
  }

  get isAvailable() {
    return this.isOpen || !this.isHidden && this.isUnlocked;
  }

  get isOpen() {
    return ui.view.tab === this.key;
  }

  get hasNotification() {
    return this.subtabs.some(tab => tab.hasNotification);
  }

  show(manual, subtab = undefined) {
    if (!manual && !player.options.automaticTabSwitching) return;
    ui.view.tab = this.key;
    if (subtab === undefined) {
      this._currentSubtab = this.subtabs.find(s => s.id === player.options.lastOpenSubtab[this.id]);
    } else {
      if (!Enslaved.isRunning) subtab.unhideTab();
      this._currentSubtab = subtab;
    }

    if (!this._currentSubtab.isUnlocked) this.resetToUnlocked();
    if (!this._currentSubtab.isAvailable) this.resetToAvailable();

    ui.view.subtab = this._currentSubtab.key;
    const tabNotificationKey = this.key + this._currentSubtab.key;
    if (player.tabNotifications.has(tabNotificationKey)) player.tabNotifications.delete(tabNotificationKey);

    // Makes it so that the glyph tooltip doesn't stay on tab change
    ui.view.tabs.reality.currentGlyphTooltip = -1;
    if (manual) Modal.hide();
    EventHub.dispatch(GAME_EVENT.TAB_CHANGED, this, this._currentSubtab);
  }

  unhideTab() {
    // eslint-disable-next-line no-bitwise
    player.options.hiddenTabBits &= ~(1 << this.id);
  }

  toggleVisibility() {
    if (this.id === Tabs.current.id) return;
    // eslint-disable-next-line no-bitwise
    player.options.hiddenTabBits ^= (1 << this.id);
  }

  resetToAvailable() {
    this._currentSubtab = this.subtabs.find(tab => tab.isAvailable);
    if (this._currentSubtab === undefined) {
      this._currentSubtab = this.subtabs[0];
      this._currentSubtab.unhideTab();
    }
  }

  resetToUnlocked() {
    this._currentSubtab = this.subtabs.find(tab => tab.isUnlocked);
  }
}

export const Tab = GameDatabase.tabs.mapToObject(
  config => config.key,
  config => new TabState(config)
);

export const Tabs = (function() {
  return {
    all: Object.values(Tab),
    get current() {
      return Tabs.all.find(tab => tab.isOpen);
    },
    oldUI: [
      Tab.dimensions,
      Tab.options,
      Tab.statistics,
      Tab.achievements,
      Tab.automation,
      Tab.challenges,
      Tab.infinity,
      Tab.eternity,
      Tab.reality,
      Tab.celestials,
      Tab.shop
    ],
    newUI: [
      Tab.dimensions,
      Tab.automation,
      Tab.challenges,
      Tab.infinity,
      Tab.eternity,
      Tab.reality,
      Tab.celestials,
      Tab.achievements,
      Tab.statistics,
      Tab.options,
      Tab.shop
    ],
    get currentUIFormat() {
      return ui.view.newUI ? this.newUI : this.oldUI;
    },
  };
}());

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  const currTab = Tabs.current.id;
  player.options.lastOpenTab = currTab;
  player.options.lastOpenSubtab[currTab] = Tabs.current._currentSubtab.id;
});
