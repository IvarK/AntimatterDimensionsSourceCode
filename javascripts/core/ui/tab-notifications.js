class TabNotificationState {
  constructor(config) {
    this.config = config;
    if (config.events) {
      for (const event of config.events) {
        EventHub.logic.on(event, this.tryTrigger.bind(this), this);
      }
    }
  }

  get triggered() {
    return player.triggeredTabNotificationBits & (1 << this.config.id);
  }

  tryTrigger() {
    if (!this.config.condition() || this.triggered) return;
    const currentTabKey = `${Tabs.current.key}${Tabs.current._currentSubtab.key}`;
    this.config.tabsToHighLight.map(t => t.parent + t.tab)
      .forEach(tab => {
        if (tab !== currentTabKey) player.tabNotifications.add(tab);
      });
    player.triggeredTabNotificationBits |= 1 << this.config.id;

    // Force all tabs and subtabs of this notification to be unhidden
    for (const location of this.config.tabsToHighLight) {
      const tab = Tabs.all.find(t => t.config.key === location.parent);
      const subtab = tab.subtabs.find(t => t.key === location.tab);
      tab.unhideTab();
      subtab.unhideTab();
    }
  }

  // In some cases we want to clear a trigger via an event that isn't tab-clicking, in order to show it again
  clearTrigger() {
    player.triggeredTabNotificationBits &= -1 - (1 << this.config.id);
    this.config.tabsToHighLight.map(t => t.parent + t.tab)
      .forEach(tab => player.tabNotifications.delete(tab));
  }
}

export const TabNotification = mapGameDataToObject(
  GameDatabase.tabNotifications,
  config => new TabNotificationState(config)
);
