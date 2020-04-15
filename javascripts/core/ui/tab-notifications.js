"use strict";

class TabNotificationState {
  constructor(config) {
    this.config = config;
    if (config.events) {
      for (const event of config.events) {
        EventHub.logic.on(event, this.tryTrigger, this);
      }
    }
  }

  tryTrigger() {
    if (!this.target.config.condition()) return;
    this.target.config.tabsToHighLight.map(t => t.parent + t.tab)
      .forEach(tab => player.tabNotifications.add(tab));
  }
}

const TabNotification = (function() {
  const db = GameDatabase.tabNotifications;
  return {
    firstInfinity: new TabNotificationState(db.firstInfinity),
    IDUnlock: new TabNotificationState(db.ICUnlock),
    ICUnlock: new TabNotificationState(db.ICUnlock),
    breakInfinity: new TabNotificationState(db.breakInfinity),
    firstEternity: new TabNotificationState(db.firstEternity),
    dilationAfterUnlock: new TabNotificationState(db.dilationAfterUnlock),
    blackHoleUnlock: new TabNotificationState(db.blackHoleUnlock),
    automatorUnlock: new TabNotificationState(db.automatorUnlock)
  };
}());