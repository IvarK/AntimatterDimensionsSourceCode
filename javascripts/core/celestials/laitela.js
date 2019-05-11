"use strict";

const LAITELA_UNLOCKS = {
  PELLE: {
    id: 0,
    price: 1e150,
    description: "Unlock Pelle, the Celestial of Antimatter",
  },
  TD: {
    id: 1,
    price: 1e200,
    description: "Reduce Time Dimension cost multipliers by 20%"
  },
  TD2: {
    id: 2,
    price: 1e250,
    description: "Reduce Time Dimension cost scaling past 1e6000 EP"
  },
  ID: {
    id: 3,
    price: 1e300,
    description: "Increase Infinity Dimensions conversion amount",
    value: () => Laitela.idConversionEffect,
    format: x => `+${x.toFixed(2)}`
  }
};

// How much the starting matter dimension costs increase per tier
const COST_MULT_PER_TIER = 100;

const laitelaMatterUnlockThresholds = [1, 2, 3].map(x => 10 * Math.pow(COST_MULT_PER_TIER, x));

const Laitela = {
  handleMatterDimensionUnlocks() {
    for (let i = 1; i <= 3; i++) {
      const d = MatterDimension(i + 1);
      if (d.amount === 0 && this.matter >= laitelaMatterUnlockThresholds[i - 1]) {
        d.amount++;
        d.timeSinceLastUpdate = 0;
      }
    } 
  },

  has(info) {
    return player.celestials.laitela.unlocks.includes(info.id);
  },
  canBuyUnlock(info) {
    if (this.matter < info.price) return false;
    return !this.has(info);
  },
  buyUnlock(info) {
    if (!this.canBuyUnlock) return false;
    this.matter -= info.price;
    player.celestials.laitela.unlocks.push(info.id);
    return true;
  },
  startRun() {
    player.celestials.laitela.run = startRealityOver();
  },
  get isRunning() {
    return player.celestials.laitela.run;
  },
  get nextMatterDimensionThreshold() {
    for (let i = 1; i <= 3; i++) {
      const d = MatterDimension(i + 1);
      if (d.amount === 0) return `Next dimension at ${shorten(laitelaMatterUnlockThresholds[i - 1])} matter`;
    }
    return "";
  },
  get matterEffectToDimensionMultDecrease() {
    return Math.pow(0.99, Math.log10(Math.max(this.matter, 1)));
  },
  get matterEffectPercentage() {
    return `${((1 - this.matterEffectToDimensionMultDecrease) * 100).toFixed(2)}%`;
  },
  get idConversionEffect() {
    return Math.sqrt(Math.log10(Math.max(this.matter, 1)));
  },
  get dimMultNerf() {
    return Math.min(1, Math.log2(Math.max(this.matter, 1)) / 1024);
  },
  get realityReward() {
    return Math.pow(2, Math.sqrt(player.celestials.laitela.maxAmGained.e / 1e7));
  },
  get matter() {
    return player.celestials.laitela.matter;
  },
  set matter(x) {
    player.celestials.laitela.matter = x;
  }
};
