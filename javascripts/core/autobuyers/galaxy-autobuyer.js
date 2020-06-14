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

  get buyMaxInterval() {
    return this.data.buyMaxInterval;
  }

  set buyMaxInterval(value) {
    this.data.buyMaxInterval = value;
  }

  get isBuyMaxUnlocked() {
    return EternityMilestone.autobuyMaxGalaxies.isReached;
  }

  get interval() {
    return this.isBuyMaxUnlocked
      ? TimeSpan.fromSeconds(this.buyMaxInterval).totalMilliseconds
      : super.interval;
  }

  tick() {
    if (!Galaxy.requirement.isSatisfied) return;
    super.tick();
    const limit = this.limitGalaxies ? this.maxGalaxies : Number.MAX_VALUE;
    requestGalaxyReset(this.isBuyMaxUnlocked, limit);
  }
}();
