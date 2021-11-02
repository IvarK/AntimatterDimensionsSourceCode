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
    return GameDatabase.reality.otherAutomatorPoints.map(s => s.automatorPoints()).sum();
  },

  get totalPoints() {
    return this.pointsFromPerks + this.pointsFromUpgrades + this.pointsFromOther;
  },

  get requiredPoints() {
    return 100;
  }
};

GameDatabase.reality.otherAutomatorPoints = (function() {
  return [
    {
      name: "Reality Count",
      automatorPoints: () => 2 * Math.clampMax(Currency.realities.value, 100),
      shortDescription: () => `+${formatInt(2)} per Reality, up to ${formatInt(100)} Realities`,
      symbol: "Ϟ",
    },
    {
      name: "Black Hole",
      automatorPoints: () => (BlackHole(1).isUnlocked ? 10 : 0),
      shortDescription: () => `Unlocking gives ${formatInt(10)} AP`,
      symbol: "<i class='fas fa-circle'></i>",
    },
  ];
}());
