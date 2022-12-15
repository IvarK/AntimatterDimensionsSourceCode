export class PlayerProgress {
  constructor(player) {
    this._player = player;
  }

  get isInfinityUnlocked() {
    // Infinity count data is stored in either player.infinitied or player.infinities based on if the save is before
    // or after the reality update, but this also gets checked in the import modal before any migration code is run.
    // Thus, it needs to manually support "before" and "after" states by converting both to Decimal.
    const infinityData = this._player.infinitied ? this._player.infinitied : this._player.infinities;
    return new Decimal(infinityData).gt(0) || this.isEternityUnlocked;
  }

  get isEternityUnlocked() {
    // Similarly to above, player.eternities is a number pre-reality update and a Decimal post-reality update
    return new Decimal(this._player.eternities).gt(0) || this.isRealityUnlocked;
  }

  get isRealityUnlocked() {
    return this._player.realities > 0;
  }

  get hasFullCompletion() {
    return this._player.records?.fullGameCompletions > 0;
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

  static hasBroken() {
    return player.break || this.isEternityUnlocked || this.isRealityUnlocked;
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

  static seenAlteredSpeed() {
    const ec12 = EternityChallenge(12);
    return this.realityUnlocked() || ec12.completions > 0 || ec12.isRunning;
  }

  static challengeCompleted() {
    return NormalChallenges.all.slice(1).some(c => c.isCompleted);
  }

  static infinityChallengeCompleted() {
    return InfinityChallenges.all.some(c => c.isCompleted);
  }
}
