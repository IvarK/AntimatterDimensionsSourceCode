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
    this.config.tabsToHighLight.map(t => t.parent + t.tab)
      .forEach(tab => player.tabNotifications.add(tab));
    player.triggeredTabNotificationBits |= 1 << this.config.id;

    // Force all tabs and subtabs of this notification to be unhidden
    for (const location of this.config.tabsToHighLight) {
      const tab = Tabs.all.find(t => t.config.key === location.parent);
      const subtab = tab.subtabs.find(t => t.key === location.tab);
      tab.unhideTab();
      subtab.unhideTab();
    }
  }
}

export const TabNotification = mapGameDataToObject(
  GameDatabase.tabNotifications,
  config => new TabNotificationState(config)
);
