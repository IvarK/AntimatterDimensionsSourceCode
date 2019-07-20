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

  get isBuyMaxActive() {
    // TODO
    return this.isBuyMaxUnlocked && this.buyMaxInterval > 0;
  }

  get interval() {
    return this.isBuyMaxActive ? this.buyMaxInterval : super.interval;
  }

  tick() {
    super.tick();
    if (!Galaxy.requirement.isSatisfied) return;
    if (player.galaxies >= this.maxGalaxies) return;
    if (this.isBuyMaxActive) {
      maxBuyGalaxies();
      return;
    }
    galaxyResetBtnClick();
  }
}();
