"use strict";

class CelestialQuotes {
  constructor(celestialName, quoteData) {
    this.quotesById = [];
    for (const quoteKey of Object.keys(quoteData)) {
      if (this[quoteKey] !== undefined) {
        throw new Error(`Celestial quote keys should not replace existing properties (${quoteKey})`);
      }
      const quote = quoteData[quoteKey];
      this[quoteKey] = quote;
      this.quotesById[quote.id] = quote;
    }
    this._celestial = celestialName;
  }

  static singleLine(id, line) {
    return {
      id,
      lines: [line]
    };
  }

  fromID(id) {
    return this.quotesById[id];
  }

  get seenArray() {
    return player.celestials[this._celestial].quotes;
  }

  seen(data) {
    return this.seenArray.includes(data.id);
  }

  show(data) {
    if (this.seen(data)) return;
    this.seenArray.push(data.id);
    Modal.celestialQuote.show(this._celestial, data.lines);
  }
}

EventHub.logic.on(GameEvent.TAB_CHANGED, (tab, subtab) => {
  if (tab !== "celestials") return;
  if (subtab === "teresa") Teresa.quotes.show(Teresa.quotes.INITIAL);
  if (subtab === "effarig") Effarig.quotes.show(Effarig.quotes.INITIAL);
  if (subtab === "enslaved") Enslaved.quotes.show(Enslaved.quotes.INITIAL);
});

EventHub.logic.on(GameEvent.CELESTIAL_UPGRADE_UNLOCKED, (celestial, upgradeInfo) => {
  if (celestial === Teresa) {
    if (upgradeInfo === TERESA_UNLOCKS.RUN) Teresa.quotes.show(Teresa.quotes.UNLOCK_REALITY);
    if (upgradeInfo === TERESA_UNLOCKS.EFFARIG) Teresa.quotes.show(Teresa.quotes.EFFARIG);
  }
});

EventHub.logic.on(GameEvent.GAME_LOAD, () => Teresa.checkForUnlocks());
