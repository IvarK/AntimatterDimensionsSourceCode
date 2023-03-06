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

  get isPermanentlyHidden() {
    return this.config.hideAt < GameEnd.endState && !GameEnd.creditsClosed;
  }

  get hidable() {
    return this.config.hidable;
  }

  get isHidden() {
    if (Enslaved.isRunning || Pelle.hasGalaxyGenerator) return false;
    return ((player.options.hiddenSubtabBits[this._parent.id] & (1 << this.id)) !== 0) &&
      this.hidable;
  }

  get isUnlocked() {
    return this.config.condition === undefined || this.config.condition();
  }

  get isAvailable() {
    return !this.isPermanentlyHidden && (this.isOpen || !this.isHidden && this.isUnlocked);
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
    this._parent.show(manual, this);
  }

  unhideTab() {
    this._parent.unhideTab();
    player.options.hiddenSubtabBits[this._parent.id] &= ~(1 << this.id);
  }

  toggleVisibility() {
    if (this._parent.id === Tabs.current.id && this.id === Tabs.current._currentSubtab.id) return;
    player.options.hiddenSubtabBits[this._parent.id] ^= (1 << this.id);

    checkTabVisibilityForSecretAchievement();
  }

  get isOpen() {
    return ui.view.tab === this._parent.key && ui.view.subtab === this.key;
  }
}

function findLastOpenSubtab(tabId, subtabs) {
  return subtabs.find(s => s.id === player.options.lastOpenSubtab[tabId]) ?? subtabs[0];
}

function cycleThroughSubtabs(subtabs, currentSubtab) {
  const availableTabs = subtabs.filter(tab => tab.isAvailable);
  const currentIndex = availableTabs.indexOf(currentSubtab);
  const direction = ui.view.shiftDown ? -1 : 1;
  let newIndex = currentIndex + direction;
  newIndex = newIndex < 0 ? availableTabs.length - 1 : newIndex;
  newIndex = newIndex > availableTabs.length - 1 ? 0 : newIndex;
  return availableTabs[newIndex];
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
    this._currentSubtab = findLastOpenSubtab(this.id, subtabs);
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

  get isPermanentlyHidden() {
    return this.config.hideAt < GameEnd.endState && !GameEnd.creditsClosed;
  }

  get hidable() {
    return this.config.hidable;
  }

  get isHidden() {
    if (Enslaved.isRunning || Pelle.hasGalaxyGenerator) return false;
    const hasVisibleSubtab = this.subtabs.some(t => t.isAvailable);
    return (((player.options.hiddenTabBits & (1 << this.id)) !== 0) || !hasVisibleSubtab) && this.hidable;
  }

  get isUnlocked() {
    return this.config.condition === undefined || this.config.condition();
  }

  get isAvailable() {
    return !this.isPermanentlyHidden && (this.isOpen || !this.isHidden && this.isUnlocked);
  }

  get isOpen() {
    return ui.view.tab === this.key;
  }

  get hasNotification() {
    return this.subtabs.some(tab => tab.hasNotification);
  }

  show(manual, subtab = undefined) {
    if (!manual && !player.options.automaticTabSwitching || Quote.isOpen) return;
    if (subtab !== undefined) {
      if (!Enslaved.isRunning) subtab.unhideTab();
      this._currentSubtab = subtab;
    } else if (ui.view.tab === this.key && ui.view.initialized && manual) {
      this._currentSubtab = cycleThroughSubtabs(this.subtabs, this._currentSubtab);
    } else {
      this._currentSubtab = findLastOpenSubtab(this.id, this.subtabs);
    }

    if (!this._currentSubtab.isUnlocked) this.resetToUnlocked();
    if (!this._currentSubtab.isAvailable) this.resetToAvailable();

    ui.view.tab = this.key;
    ui.view.subtab = this._currentSubtab.key;
    const tabNotificationKey = this.key + this._currentSubtab.key;
    if (player.tabNotifications.has(tabNotificationKey)) player.tabNotifications.delete(tabNotificationKey);

    if (manual) Modal.hideAll();
    EventHub.dispatch(GAME_EVENT.TAB_CHANGED, this, this._currentSubtab);
  }

  unhideTab() {
    player.options.hiddenTabBits &= ~(1 << this.id);
  }

  toggleVisibility() {
    if (this.id === Tabs.current.id) return;
    player.options.hiddenTabBits ^= (1 << this.id);

    checkTabVisibilityForSecretAchievement();
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

const checkTabVisibilityForSecretAchievement = () => {
  // Checks if every unlocked tab that is hidable is hidden
  if (Tabs.all.filter(t => t.isUnlocked && t.hidable).every(t => t.isHidden)) SecretAchievement(47).unlock();
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  const currTab = Tabs.current.id;
  player.options.lastOpenTab = currTab;
  player.options.lastOpenSubtab[currTab] = Tabs.current._currentSubtab.id;
});
