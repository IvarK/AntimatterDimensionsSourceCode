"use strict";

const LAITELA_UNLOCKS = {
  RM_POW: {
    id: 0,
    price: 1e60,
    description: "Boost La'itela reward based on RM",
    value: () => Laitela.rmRewardPowEffect,
    format: x => `x^${x.toFixed(2)}`
  },
  ID: {
    id: 1,
    price: 1e120,
    description: "Increase Infinity Dimensions conversion amount based on matter",
    value: () => Laitela.idConversionEffect,
    format: x => `+${x.toFixed(2)}`
  },
  TD: {
    id: 2,
    price: 1e180,
    description: "Decrease free tickspeed cost multiplier based on matter",
    value: () => Laitela.freeTickspeedMultEffect,
    format: x => `x${x.toFixed(2)}`
  },
  DIM_POW: {
    id: 3,
    price: 1e240,
    description: "Power all dimension multipliers based on matter",
    value: () => Laitela.dimensionMultPowerEffect,
    format: x => `x^${x.toFixed(2)}`
  },
  PELLE: {
    id: 4,
    price: Number.MAX_VALUE,
    description: "Unlock Pelle, the Celestial of Antimatter",
  },
};

// How much the starting matter dimension costs increase per tier
const COST_MULT_PER_TIER = 100;

const laitelaMatterUnlockThresholds = [1, 2, 3].map(x => 10 * Math.pow(COST_MULT_PER_TIER, x));

const Laitela = {
  handleMatterDimensionUnlocks() {
    for (let i = 1; i <= 3; i++) {
      const d = MatterDimension(i + 1);
      if (d.amount.eq(0) && this.matter.gte(laitelaMatterUnlockThresholds[i - 1])) {
        d.amount = new Decimal(1);
        d.timeSinceLastUpdate = 0;
      }
    } 
  },

  has(info) {
    return player.celestials.laitela.unlocks.includes(info.id);
  },
  canBuyUnlock(info) {
    if (this.matter.lt(info.price)) return false;
    return !this.has(info);
  },
  buyUnlock(info) {
    if (!this.canBuyUnlock) return false;
    this.matter = this.matter.minus(info.price);
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
      if (d.amount.eq(0)) return `Next dimension at ${shorten(laitelaMatterUnlockThresholds[i - 1])} matter`;
    }
    return "";
  },
  get matterEffectToDimensionMultDecrease() {
    return 1 / (1 + Decimal.pLog10(this.matter) / 100);
  },
  get matterEffectPercentage() {
    return `${((1 - this.matterEffectToDimensionMultDecrease) * 100).toFixed(2)}%`;
  },
  get rmRewardPowEffect() {
    return 1 + Math.max(0, Math.log(Decimal.pLog10(player.reality.realityMachines) / Math.log10(Number.MAX_VALUE)));
  },
  get idConversionEffect() {
    return Math.sqrt(Decimal.pLog10(this.matter)) / 10;
  },
  get freeTickspeedMultEffect() {
    return 1 / (1 + Math.sqrt(Decimal.pLog10(this.matter)) / 100);
  },
  get dimensionMultPowerEffect() {
    return 1 + Decimal.pLog10(this.matter) / 5000;
  },
  get dimMultNerf() {
    return Math.min(1, Decimal.pLog10(this.matter) / Math.log10(Number.MAX_VALUE));
  },
  get realityReward() {
    let matterDimMult = Math.pow(2, Math.sqrt(player.celestials.laitela.maxAmGained.e / 1e7));
    if (this.has(LAITELA_UNLOCKS.RM_POW)) {
      matterDimMult = Math.pow(matterDimMult, this.rmRewardPow);
    }
    return matterDimMult;
  },
  get matter() {
    return player.celestials.laitela.matter;
  },
  set matter(x) {
    player.celestials.laitela.matter = x;
  }
};
