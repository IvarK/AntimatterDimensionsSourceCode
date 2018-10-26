class PlayerProgress {
  constructor(player) {
    this._player = player;
  }

  get isSacrificeUnlocked() {
    return this._player.infinitied > 0 || this._player.resets > 4;
  }

  get isRealityUnlocked() {
    return this._player.realities > 0;
  }

  get isEternityUnlocked() {
    return this._player.eternities > 0 || this.isRealityUnlocked;
  }

  get isInfinityUnlocked() {
    return this._player.infinitied > 0 || this.isEternityUnlocked;
  }

  static get current() {
    return new PlayerProgress(player);
  }

  static of(player) {
    return new PlayerProgress(player);
  }

  static get isSacrificeUnlocked() {
    return PlayerProgress.current.isSacrificeUnlocked;
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

