"use strict";

Autobuyer.sacrifice = new class SacrificeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.sacrifice;
  }

  get name() {
    return `Dimensional Sacrifice`;
  }

  get isUnlocked() {
    return EternityMilestone.autoIC.isReached || InfinityChallenge(2).isCompleted;
  }

  get multiplier() {
    return this.data.multiplier;
  }

  set multiplier(value) {
    this.data.multiplier = value;
  }

  tick() {
    if (Sacrifice.nextBoost.lt(Decimal.max(this.multiplier, 1.01))) return;
    sacrificeReset(true);
  }
}();
