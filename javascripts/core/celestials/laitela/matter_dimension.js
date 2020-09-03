"use strict";

/**
 * Constants for easily adjusting values
 */

const INTERVAL_COST_MULT = 5;
const POWER_DM_COST_MULT = 10;
const POWER_DE_COST_MULTS = [1.65, 1.6, 1.55, 1.5];

const INTERVAL_START_COST = 10;
const POWER_DM_START_COST = 10;
const POWER_DE_START_COST = 10;

// No constant for interval since it's tied to a milestone
const POWER_DM_PER_ASCENSION = 500;
const POWER_DE_PER_ASCENSION = 500;

const COST_MULT_PER_TIER = 1200;

class MatterDimensionState {
  constructor(tier) {
    this._tier = tier;
  }

  get dimension() {
    return player.celestials.laitela.dimensions[this._tier];
  }

  get ascensions() {
    return this.dimension.ascensionCount;
  }

  get intervalPurchaseCap() {
    return 10;
  }

  get interval() {
    const perUpgrade = 0.92;
    const tierFactor = Math.pow(4, this._tier);
    return Math.clampMin(this.intervalPurchaseCap, 1000 * tierFactor *
      Math.pow(perUpgrade, this.dimension.intervalUpgrades) *
      Math.pow(SingularityMilestone.ascensionIntervalScaling.effectValue, this.dimension.ascensionCount) *
      SingularityMilestone.darkDimensionIntervalReduction.effectValue);
  }

  get commonDarkMult() {
    return new Decimal(1).timesEffectsOf(
      SingularityMilestone.darkFromTesseracts,
      SingularityMilestone.darkFromGlyphLevel,
      SingularityMilestone.darkFromTheorems,
      SingularityMilestone.darkFromDM4,
      SingularityMilestone.darkFromGamespeed,
      SingularityMilestone.darkFromDilatedTime
    );
  }

  get powerDMPerAscension() {
    return POWER_DM_PER_ASCENSION + SingularityMilestone.improvedAscensionDM.effectValue;
  }

  get powerDM() {
    return new Decimal(1 + 2 * Math.pow(1.15, this.dimension.powerDMUpgrades))
      .times(Laitela.realityReward)
      .times(Laitela.darkMatterMult)
      .times(this.commonDarkMult)
      .times(Math.pow(this.powerDMPerAscension, this.dimension.ascensionCount))
      .timesEffectsOf(SingularityMilestone.darkMatterMult, SingularityMilestone.multFromInfinitied)
      .dividedBy(Math.pow(10, this._tier));
  }
  
  get powerDE() {
    const tierFactor = Math.pow(4, this._tier);
    return new Decimal(((1 + this.dimension.powerDEUpgrades * 0.1) * 
      Math.pow(1.005, this.dimension.powerDEUpgrades)) * tierFactor / 1000)
        .times(this.commonDarkMult)
        .times(Math.pow(POWER_DE_PER_ASCENSION, this.dimension.ascensionCount))
        .timesEffectsOf(
          SingularityMilestone.darkEnergyMult, 
          SingularityMilestone.realityDEMultiplier, 
          SingularityMilestone.multFromInfinitied
        ).toNumber();
  }

  get adjustedStartingCost() {
    const tiers = [0, 1, 3, 5];
    return 10 * Math.pow(COST_MULT_PER_TIER, tiers[this._tier]);
  }

  get intervalCost() {
    return Decimal.pow(this.intervalCostIncrease, this.dimension.intervalUpgrades)
      .times(this.adjustedStartingCost).times(INTERVAL_START_COST)
      .times(SingularityMilestone.darkDimensionCostReduction.effectValue).floor();
  }
  
  get intervalCostIncrease() {
    return Math.pow(INTERVAL_COST_MULT, SingularityMilestone.intervalCostScalingReduction.effectValue);
  }

  get powerDMCost() {
    return Decimal.pow(this.powerDMCostIncrease, this.dimension.powerDMUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DM_START_COST)
      .times(SingularityMilestone.darkDimensionCostReduction.effectValue).floor();
  }
  
  get powerDMCostIncrease() {
    return POWER_DM_COST_MULT;
  }
  
  get powerDECost() {
    return Decimal.pow(this.powerDECostIncrease, this.dimension.powerDEUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DE_START_COST)
      .times(SingularityMilestone.darkDimensionCostReduction.effectValue).floor();
  }
  
  get powerDECostIncrease() {
    return POWER_DE_COST_MULTS[this._tier];
  }

  get amount() {
    return this.dimension.amount;
  }

  set amount(value) {
    this.dimension.amount = value;
  }

  get timeSinceLastUpdate() {
    return this.dimension.timeSinceLastUpdate;
  }

  set timeSinceLastUpdate(ms) {
    this.dimension.timeSinceLastUpdate = ms;
  }

  get canBuyInterval() {
    return this.intervalCost.lte(player.celestials.laitela.matter) && this.interval > this.intervalPurchaseCap;
  }

  get canBuyPowerDM() {
    return this.powerDMCost.lte(player.celestials.laitela.matter);
  }
  
  get canBuyPowerDE() {
    return this.powerDECost.lte(player.celestials.laitela.matter);
  }
  
  get maxIntervalPurchases() {
    return Math.ceil(Math.log(this.intervalPurchaseCap / this.interval) / Math.log(0.92));
  }
  
  buyManyInterval(x) {
    if (x > this.maxIntervalPurchases) return false;
    let cost = this.intervalCost.times(Decimal.pow(this.intervalCostIncrease, x).minus(1)).div(this.intervalCostIncrease - 1);
    if (cost.gt(player.celestials.laitela.matter)) return false;
    player.celestials.laitela.matter = player.celestials.laitela.matter.minus(cost);
    this.dimension.intervalUpgrades += x;
    return true;
  }
  
  buyManyPowerDM(x) {
    let cost = this.powerDMCost.times(Decimal.pow(this.powerDMCostIncrease, x).minus(1)).div(this.powerDMCostIncrease - 1);
    if (cost.gt(player.celestials.laitela.matter)) return false;
    player.celestials.laitela.matter = player.celestials.laitela.matter.minus(cost);
    this.dimension.powerDMUpgrades += x;
    return true;
  }
  
  buyManyPowerDE(x) {
    let cost = this.powerDECost.times(Decimal.pow(this.powerDECostIncrease, x).minus(1)).div(this.powerDECostIncrease - 1);
    if (cost.gt(player.celestials.laitela.matter)) return false;
    player.celestials.laitela.matter = player.celestials.laitela.matter.minus(cost);
    this.dimension.powerDEUpgrades += x;
    return true;
  }

  buyInterval() {
    return this.buyManyInterval(1);
  }

  buyPowerDM() {
    return this.buyManyPowerDM(1);
  }
  
  buyPowerDE() {
    return this.buyManyPowerDE(1);
  }

  ascend() {
    if (this.interval > this.intervalPurchaseCap) return;
    this.dimension.ascensionCount++;
  }
}

MatterDimensionState.list = Array.range(1, 4).map(tier => new MatterDimensionState(tier - 1));

/**
 * @param {number} tier
 * @return {AntimatterDimensionState}
 */
function MatterDimension(tier) {
  return MatterDimensionState.list[tier - 1];
}
