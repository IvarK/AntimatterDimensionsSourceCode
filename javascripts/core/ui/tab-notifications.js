"use strict";

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
    // eslint-disable-next-line no-bitwise
    return player.triggeredTabNotificationBits & (1 << this.config.id);
  }

  tryTrigger() {
    if (!this.config.condition() || this.triggered) return;
    this.config.tabsToHighLight.map(t => t.parent + t.tab)
      .forEach(tab => player.tabNotifications.add(tab));
    // eslint-disable-next-line no-bitwise
    player.triggeredTabNotificationBits |= 1 << this.config.id;
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
    realityUnlock: new TabNotificationState(db.realityUnlock),
    blackHoleUnlock: new TabNotificationState(db.blackHoleUnlock),
    automatorUnlock: new TabNotificationState(db.automatorUnlock)
  };
}());