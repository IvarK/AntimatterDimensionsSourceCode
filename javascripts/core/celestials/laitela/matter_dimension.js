"use strict";

/**
 * Constants for easily adjusting values
 */

const CHANCE_COST_MULT = 1.6;
const INTERVAL_COST_MULT = 3.2;
const POWER_COST_MULT = 1.4;

const CHANCE_START_COST = 10;
const INTERVAL_START_COST = 10;
const POWER_START_COST = 10;

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

  // In percents
  get chance() {
    const fromUpgrades = 1 + this.dimension.chanceUpgrades * (this.dimension.chanceUpgrades + 1) / 2;
    const tierFactor = Math.pow(2, this._tier);
    const otherBoosts = 1 + AlchemyResource.unpredictability.effectValue;
    return Math.min(fromUpgrades * otherBoosts / tierFactor, 100);
  }

  // In milliseconds; if this is 10 then you can no longer buy it, but it can get lower with other upgrades
  get interval() {
    const perUpgrade = 0.92 - AnnihilationUpgrade.intervalPower.effect;
    const tierFactor = Math.pow(4, this._tier);
    return Decimal.pow(perUpgrade, this.dimension.intervalUpgrades)
      .times(tierFactor)
      .times(1000)
      .clampMin(this.intervalPurchaseCap);
  }

  get power() {
    let base = new Decimal(1 + Math.pow(1.05, this.dimension.powerUpgrades)).times(Laitela.realityReward);
    if (DarkEnergyUpgrade.matterDimensionMult.isBought) {
      base = base.times(DarkEnergyUpgrade.matterDimensionMult.effect);
    }
    return base;
  }

  get chanceCost() {
    return Decimal.pow(CHANCE_COST_MULT, this.dimension.chanceUpgrades)
      .times(Decimal.pow(COST_MULT_PER_TIER, this._tier)).times(CHANCE_START_COST).floor();
  }

  get intervalCost() {
    return Decimal.pow(INTERVAL_COST_MULT, this.dimension.intervalUpgrades)
      .times(Decimal.pow(COST_MULT_PER_TIER, this._tier)).times(INTERVAL_START_COST).floor();
  }

  get powerCost() {
    return Decimal.pow(POWER_COST_MULT, this.dimension.powerUpgrades)
      .times(Decimal.pow(COST_MULT_PER_TIER, this._tier)).times(POWER_START_COST).floor();
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

  get canBuyChance() {
    return this.chanceCost.lte(player.celestials.laitela.matter) && this.chance < 100;
  }

  get canBuyInterval() {
    return this.intervalCost.lte(player.celestials.laitela.matter) && this.interval.gt(this.intervalPurchaseCap);
  }

  get canBuyPower() {
    return this.powerCost.lte(player.celestials.laitela.matter);
  }

  buyChance() {
    if (!this.canBuyChance) return false;
    player.celestials.laitela.matter = player.celestials.laitela.matter.minus(this.chanceCost);
    this.dimension.chanceUpgrades++;
    return true;
  }

  buyInterval() {
    if (!this.canBuyInterval) return false;
    player.celestials.laitela.matter = player.celestials.laitela.matter.minus(this.intervalCost);
    this.dimension.intervalUpgrades++;
    return true;
  }

  buyPower() {
    if (!this.canBuyPower) return false;
    player.celestials.laitela.matter = player.celestials.laitela.matter.minus(this.powerCost);
    this.dimension.powerUpgrades++;
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
