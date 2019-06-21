"use strict";

const LAITELA_UNLOCKS = {
  RM_POW: {
    id: 0,
    price: 1e60,
    description: "Boost Lai'tela reward based on RM",
    value: () => Laitela.rmRewardPowEffect,
    format: x => `x^${x.toFixed(2)}`
  },
  ID: {
    id: 1,
    price: 1e150,
    description: "Increase Infinity Dimensions conversion amount based on matter",
    value: () => Laitela.idConversionEffect,
    format: x => `+${x.toFixed(2)}`
  },
  TD: {
    id: 2,
    price: 1e200,
    description: "Decrease free tickspeed cost multiplier based on matter",
    value: () => Laitela.freeTickspeedMultEffect,
    format: x => `x${x.toFixed(2)}`
  },
  DIM_POW: {
    id: 3,
    price: 1e250,
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
    player.celestials.laitela.run = startRealityOver() || player.celestials.laitela.run;
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
    let matterEffect = 1 / (1 + Decimal.pLog10(this.matter) / 100);
    if (matterEffect < 0.5) {
      matterEffect = Math.sqrt(matterEffect * 2) / 2;
    }
    return matterEffect;
  },
  get matterEffectPercentage() {
    return `${((1 - this.matterEffectToDimensionMultDecrease) * 100).toFixed(2)}%`;
  },
  get rmRewardPowEffect() {
    return 1 + Math.max(0, Math.log(Decimal.pLog10(player.reality.realityMachines) / Math.log10(Number.MAX_VALUE)));
  },
  get idConversionEffect() {
    return Math.sqrt(Decimal.pLog10(this.matter)) / 50;
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
    const amExponent = player.celestials.laitela.maxAmGained.e;
    const realityRewardExponent = Math.clamp(Math.log(amExponent / 1e6), 1, Math.sqrt(amExponent / 1e7));
    let matterDimMult = Math.pow(2, realityRewardExponent);
    if (this.has(LAITELA_UNLOCKS.RM_POW)) {
      matterDimMult = Math.pow(matterDimMult, this.rmRewardPowEffect);
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
