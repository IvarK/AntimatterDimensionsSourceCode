class PlayerProgress {
  constructor(player) {
    this._player = player;
  }

  get isSacrificeUnlocked() {
    return this._player.infinitied > 0 || this._player.resets > 4;
  }

  realityUnlocked() {
    return this._player.realities > 0;
  }

  eternityUnlocked() {
    return this._player.eternities > 0 || this.realityUnlocked();
  }

  infinityUnlocked() {
    return this._player.infinitied > 0 || this.eternityUnlocked();
  }

  static current() {
    return new PlayerProgress(player);
  }

  static of(player) {
    return new PlayerProgress(player);
  }

  static get isSacrificeUnlocked() {
    return PlayerProgress.current().isSacrificeUnlocked;
  }

  static infinityUnlocked() {
    return PlayerProgress.current().infinityUnlocked();
  }

  static eternityUnlocked() {
    return PlayerProgress.current().eternityUnlocked();
  }

  static realityUnlocked() {
    return PlayerProgress.current().realityUnlocked();
  }
}

