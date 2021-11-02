"use strict";

const AutomatorPoints = {
  get perks() {
    return Perks.all.filter(p => p.automatorPoints);
  },

  // This also rejects rebuyables, where automatorPoints is undefined
  get upgrades() {
    return RealityUpgrades.all.filter(p => p.automatorPoints);
  },

  get pointsFromPerks() {
    return this.perks
      .filter(p => p.isBought)
      .map(p => p.automatorPoints)
      .sum();
  },

  get pointsFromUpgrades() {
    return this.upgrades
      .filter(p => p.isBought)
      .map(p => p.automatorPoints)
      .sum();
  },

  get pointsFromOther() {
    return GameDatabase.reality.otherAutomatorPoints.map(s => s.automatorPoints()).sum();
  },

  get totalPoints() {
    return this.pointsFromPerks + this.pointsFromUpgrades + this.pointsFromOther;
  },

  get pointsForAutomator() {
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
