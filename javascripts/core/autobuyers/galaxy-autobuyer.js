"use strict";

Autobuyer.galaxy = new class GalaxyAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.galaxy;
  }

  get isUnlocked() {
    return NormalChallenge(11).isCompleted;
  }

  get baseInterval() {
    return Player.defaultStart.auto.galaxy.interval;
  }

  get limitGalaxies() {
    return this.data.limitGalaxies;
  }

  set limitGalaxies(value) {
    this.data.limitGalaxies = value;
  }

  get maxGalaxies() {
    return this.data.maxGalaxies;
  }

  set maxGalaxies(value) {
    this.data.maxGalaxies = value;
  }

  get buyMax() {
    return this.data.buyMax;
  }

  set buyMax(value) {
    this.data.buyMax = value;
  }

  get buyMaxInterval() {
    return this.data.buyMaxInterval;
  }

  set buyMaxInterval(value) {
    this.data.buyMaxInterval = value;
  }

  get isBuyMaxUnlocked() {
    return EternityMilestone.autobuyMaxGalaxies.isReached;
  }

  get isBuyMaxActive() {
    return this.isBuyMaxUnlocked && this.buyMax;
  }

  get interval() {
    return this.isBuyMaxActive
      ? TimeSpan.fromSeconds(this.buyMaxInterval).totalMilliseconds
      : super.interval;
  }

  tick() {
    if (!Galaxy.requirement.isSatisfied) return;
    super.tick();
    if (this.limitGalaxies && player.galaxies >= this.maxGalaxies) return;
    if (this.isBuyMaxActive) {
      maxBuyGalaxies();
      return;
    }
    galaxyResetBtnClick(true);
  }
}();
