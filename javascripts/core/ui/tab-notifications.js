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
    ICUnlock: new TabNotificationState(db.ICUnlock),
    replicanti: new TabNotificationState(db.replicanti),
    breakInfinity: new TabNotificationState(db.breakInfinity),
    firstEternity: new TabNotificationState(db.firstEternity),
    dilationUnlock: new TabNotificationState(db.dilationUnlock),
    dilationAfterUnlock: new TabNotificationState(db.dilationAfterUnlock),
    blackHoleUnlock: new TabNotificationState(db.blackHoleUnlock),
    automatorUnlock: new TabNotificationState(db.automatorUnlock)
  };
}());