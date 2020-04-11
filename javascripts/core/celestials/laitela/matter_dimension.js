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

const COST_MULT_PER_TIER = 1e3;

class MatterDimensionState {
  constructor(tier) {
    this._tier = tier;
  }

  get dimension() {
    return player.celestials.laitela.dimensions[this._tier];
  }

  get intervalPurchaseCap() {
    return 10;
  }

  get baseInterval() {
    const perUpgrade = 0.92;
    const tierFactor = Math.pow(4, this._tier);
    return Math.clampMin(this.intervalPurchaseCap,
      Math.pow(perUpgrade, this.dimension.intervalUpgrades) * tierFactor * 1000);
  }

  // In milliseconds; if this is 10 then you can no longer buy it, but it can get lower with other upgrades
  get interval() {
    return this.baseInterval * SingularityMilestone(7).effectValue;
  }

  get powerDM() {
    return new Decimal(1 + 2 * Math.pow(1.15, this.dimension.powerDMUpgrades))
      .times(Laitela.realityReward)
      .times(Math.max(Laitela.darkMatterMult, 1))
      .timesEffectsOf(
        SingularityMilestone(2),
        SingularityMilestone(11),
        SingularityMilestone(15),
        SingularityMilestone(19)
      )
      .dividedBy(Math.pow(10, this._tier));
  }
  
  get powerDE() {
    const tierFactor = Math.pow(4, this._tier);
    return new Decimal(((1 + this.dimension.powerDEUpgrades * 0.1) * 
      Math.pow(1.005, this.dimension.powerDEUpgrades)) * tierFactor / 1000)
      .timesEffectsOf(
        SingularityMilestone(3),
        SingularityMilestone(13),
        SingularityMilestone(15),
        SingularityMilestone(17)
      ).toNumber();
  }

  get adjustedStartingCost() {
    const tiers = [0, 1, 3, 5];
    return 10 * Math.pow(COST_MULT_PER_TIER, tiers[this._tier]);
  }

  get intervalCost() {
    return Decimal.pow(INTERVAL_COST_MULT, this.dimension.intervalUpgrades)
      .times(this.adjustedStartingCost).times(INTERVAL_START_COST).times(SingularityMilestone(4).effectValue).floor();
  }

  get powerDMCost() {
    return Decimal.pow(POWER_DM_COST_MULT, this.dimension.powerDMUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DM_START_COST).times(SingularityMilestone(4).effectValue).floor();
  }
  
  get powerDECost() {
    return Decimal.pow(POWER_DE_COST_MULTS[this._tier], this.dimension.powerDEUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DE_START_COST).times(SingularityMilestone(4).effectValue).floor();
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
    return this.intervalCost.lte(player.celestials.laitela.matter) && this.baseInterval > this.intervalPurchaseCap;
  }

  get canBuyPowerDM() {
    return this.powerDMCost.lte(player.celestials.laitela.matter);
  }
  
  get canBuyPowerDE() {
    return this.powerDECost.lte(player.celestials.laitela.matter);
  }

  buyInterval() {
    if (!this.canBuyInterval) return false;
    player.celestials.laitela.matter = player.celestials.laitela.matter.minus(this.intervalCost);
    this.dimension.intervalUpgrades++;
    return true;
  }

  buyPowerDM() {
    if (!this.canBuyPowerDM) return false;
    player.celestials.laitela.matter = player.celestials.laitela.matter.minus(this.powerDMCost);
    this.dimension.powerDMUpgrades++;
    return true;
  }
  
  buyPowerDE() {
    if (!this.canBuyPowerDE) return false;
    player.celestials.laitela.matter = player.celestials.laitela.matter.minus(this.powerDECost);
    this.dimension.powerDEUpgrades++;
    return true;
  }
}

MatterDimensionState.list = Array.range(1, 4).map(tier => new MatterDimensionState(tier - 1));

/**
 * @param {number} tier
 * @return {NormalDimensionState}
 */
function MatterDimension(tier) {
  return MatterDimensionState.list[tier - 1];
}
