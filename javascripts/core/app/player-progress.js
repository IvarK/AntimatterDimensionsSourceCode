"use strict";

class PlayerProgress {
  constructor(player) {
    this._player = player;
  }

  get isRealityUnlocked() {
    return this._player.realities > 0;
  }

  get isEternityUnlocked() {
    return this._player.eternities > 0 || this.isRealityUnlocked;
  }

  get isInfinityUnlocked() {
    // We add conversion to Decimal here since, when importing an old save, this._player.infinitied is a number,
    // and when displaying progress of an imported save, this._player.infinitied is a string (I believe).
    return new Decimal(this._player.infinitied).gt(0) || this.isEternityUnlocked;
  }

  static get current() {
    return new PlayerProgress(player);
  }

  static of(player) {
    return new PlayerProgress(player);
  }

  static infinityUnlocked() {
    return PlayerProgress.current.isInfinityUnlocked;
  }

  static eternityUnlocked() {
    return PlayerProgress.current.isEternityUnlocked;
  }

  static get realityUnlocked() {
    return PlayerProgress.current.isRealityUnlocked;
  }
}

