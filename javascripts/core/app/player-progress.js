"use strict";

class PlayerProgress {
  constructor(player) {
    this._player = player;
  }

  get isInfinityUnlocked() {
    // We add conversion to Decimal here since, when importing an old save, this._player.infinitied is a number,
    // and when displaying progress of an imported save, this._player.infinitied is a string (I believe).
    return new Decimal(this._player.infinitied).gt(0) || this.isEternityUnlocked;
  }

  get isEternityUnlocked() {
    // This is some old-save-new-save number-to-Decimal conversion schenanigans (see above)
    return new Decimal(this._player.eternities).gt(0) || this.isRealityUnlocked;
  }

  get isRealityUnlocked() {
    return this._player.realities > 0;
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

  static replicantiUnlocked() {
    return Replicanti.areUnlocked || this.isEternityUnlocked;
  }

  static eternityUnlocked() {
    return PlayerProgress.current.isEternityUnlocked;
  }

  static dilationUnlocked() {
    return TimeStudy.dilation.isBought;
  }

  static realityUnlocked() {
    return PlayerProgress.current.isRealityUnlocked;
  }

  static challengeCompleted() {
    return NormalChallenges.all.slice(1).some(c => c.isCompleted);
  }

  static infinityChallengeCompleted() {
    return InfinityChallenges.all.some(c => c.isCompleted);
  }
}

