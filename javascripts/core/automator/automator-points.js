"use strict";

const AutomatorPoints = {
  get pointsFromPerks() {
    return Perks.all
      .filter(p => p._config.automatorPoints && p.isBought)
      .map(p => p._config.automatorPoints)
      .sum();
  },

  get pointsFromUpgrades() {
    return RealityUpgrades.all
      .filter(p => p._config.automatorPoints && p.isBought)
      .map(p => p._config.automatorPoints)
      .sum();
  },

  get pointsFromOther() {
    const realities = 2 * Math.clampMax(Currency.realities.value, 100);
    const blackhole = BlackHole(1).isUnlocked ? 10 : 0;
    return realities + blackhole;
  },

  get totalPoints() {
    return this.pointsFromPerks + this.pointsFromUpgrades + this.pointsFromOther;
  },

  get requiredPoints() {
    return 100;
  }
};
