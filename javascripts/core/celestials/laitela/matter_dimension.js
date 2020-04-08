"use strict";

/**
 * Constants for easily adjusting values
 */

const INTERVAL_COST_MULT = 3.2;
const POWER_DM_COST_MULT = 1.4;
const POWER_DE_COST_MULTS = [1.35, 1.3, 1.28, 1.27];

const INTERVAL_START_COST = 10;
const POWER_DM_START_COST = 10;
const POWER_DE_START_COST = 10;

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

  // In milliseconds; if this is 10 then you can no longer buy it, but it can get lower with other upgrades
  get interval() {
    const perUpgrade = 0.92;
    const tierFactor = Math.pow(4, this._tier);
    return Math.clampMin(this.intervalPurchaseCap,
      Math.pow(perUpgrade, this.dimension.intervalUpgrades) * tierFactor * 1000);
  }

  get powerDM() {
    return new Decimal(1 + Math.pow(1.05, this.dimension.powerDMUpgrades)).times(
      Laitela.realityReward).times(Laitela.darkMatterMultFromDE);
  }
  
  get powerDE() {
    return (1 + this.dimension.powerDEUpgrades / 10) * Laitela.darkEnergyMult / 1000;
  }

  get intervalCost() {
    return Decimal.pow(INTERVAL_COST_MULT, this.dimension.intervalUpgrades)
      .times(Decimal.pow(COST_MULT_PER_TIER, this._tier)).times(INTERVAL_START_COST).floor();
  }

  get powerDMCost() {
    return Decimal.pow(POWER_DM_COST_MULT, this.dimension.powerDMUpgrades)
      .times(Decimal.pow(COST_MULT_PER_TIER, this._tier)).times(POWER_DM_START_COST).floor();
  }
  
  get powerDECost() {
    return Decimal.pow(POWER_DE_COST_MULTS[this._tier], this.dimension.powerDEUpgrades)
      .times(Decimal.pow(COST_MULT_PER_TIER, this._tier)).times(POWER_DE_START_COST).floor();
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
