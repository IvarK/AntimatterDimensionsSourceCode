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
  
  get celestial() {
    return player.celestials.laitela;
  },

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
    return this.celestial.unlocks.includes(info.id);
  },
  canBuyUnlock(info) {
    if (this.matter.lt(info.price)) return false;
    return !this.has(info);
  },
  buyUnlock(info) {
    if (!this.canBuyUnlock) return false;
    this.matter = this.matter.minus(info.price);
    this.celestial.unlocks.push(info.id);
    return true;
  },
  startRun() {
    this.celestial.run = startRealityOver() || this.celestial.run;
  },
  get isRunning() {
    return this.celestial.run;
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
  get freeTickspeedMultEffect() {
    return 1 / (1 + Math.sqrt(Decimal.pLog10(this.matter)) / 100);
  },
  get dimensionMultPowerEffect() {
    return 1 + Decimal.pLog10(this.matter) / 5000;
  },
  get dimMultNerf() {
    const base = Math.min(1, Decimal.pLog10(this.matter) / LOG10_MAX_VALUE);
    if (DarkEnergyUpgrade.realityPenaltyReduction.isBought) {
      return base * DarkEnergyUpgrade.realityPenaltyReduction.isBought;
    }
    return base;
  },
  get realityReward() {
    return this.rewardMultiplier(this.celestial.maxAmGained.clampMin(1));
  },
  rewardMultiplier(num) {
    const realityRewardExponent = Math.clamp(Math.log(num.log10() / 1e6), 1, Math.sqrt(num.log10() / 1e7));
    let matterDimMult = Math.pow(2, realityRewardExponent);
    matterDimMult = Math.pow(matterDimMult, AnnihilationUpgrade.realityReward.effect);
    return matterDimMult;
  },
  get matter() {
    return this.celestial.matter;
  },
  set matter(x) {
    this.celestial.matter = x;
  },
  get higgsGain() {
    return Decimal.floor(Decimal.pow(this.matter.dividedBy(1e8), 0.3));
  },
  get darkEnergyChance() {
    return this.celestial.higgs.plus(1).log10() / 10000;
  },

  annihilate() {
    this.celestial.higgs = this.celestial.higgs.plus(this.higgsGain);
    this.celestial.dimensions = this.celestial.dimensions.map(
      () => (
        { 
          amount: new Decimal(0),
          chanceUpgrades: 0,
          intervalUpgrades: 0,
          powerUpgrades: 0,
          timeSinceLastUpdate: 0
        }
      )
    );
    this.celestial.dimensions[0].amount = new Decimal(1);
    this.celestial.matter = new Decimal(0);
    this.celestial.annihilated = true;
  }

};
