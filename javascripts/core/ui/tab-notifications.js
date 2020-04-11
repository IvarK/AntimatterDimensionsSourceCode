"use strict";

class TabNotificationState {
  constructor(config) {
    this.config = config;
    for (const event of config.events) {
      EventHub.logic.on(event, this.tryTrigger, this);
    }
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
    firstInfinity: new TabNotificationState(db.firstInfinity),
    ICUnlock: new TabNotificationState(db.ICUnlock),
    replicanti: new TabNotificationState(db.replicanti),
    breakInfinity: new TabNotificationState(db.breakInfinity),
    firstEternity: new TabNotificationState(db.firstEternity)
  };
}());