"use strict";

class TabNotificationState {
  constructor(config) {
    this.config = config;
  }

  tryTrigger() {
    if (!this.config.condition()) return;
    this.config.tabsToHighLight.map(t => t.parent + t.tab)
      .forEach(tab => player.tabNotifications.add(tab));
  }
}

const TabNotification = (function() {
  const db = GameDatabase.tabNotifications;
  return {
    firstInfinity: new TabNotificationState(db.firstInfinity)
  };
}());