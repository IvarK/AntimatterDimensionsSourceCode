"use strict";

/**
 * Constants for easily adjusting values
 */

const CHANCE_COST_MULT = 1.5;
const INTERVAL_COST_MULT = 2.5;
const POWER_COST_MULT = 3;

const CHANCE_START_COST = 20;
const INTERVAL_START_COST = 5;
const POWER_START_COST = 10;

class MatterDimensionState {
  constructor(tier) {
    this._tier = tier;
  }

  get dimension() {
    return player.celestials.laitela.dimensions[this._tier];
  }

  // In percents
  get chance() {
    return 5 - this._tier + this.dimension.chanceUpgrades +
      Math.floor(100 * AlchemyResource.unpredictability.effectValue);
  }

  // In milliseconds
  get interval() {
    return Decimal.pow(0.89 - AnnihilationUpgrade.intervalPower.effect, this.dimension.intervalUpgrades)
      .times(Decimal.pow(2, this._tier))
      .times(1000)
      .divide(Effects.max(1, CompressionUpgrade.matterBoost));
  }

  get power() {
    return Decimal.pow(1.1, this.dimension.powerUpgrades).times(Laitela.realityReward);
  }

  get chanceCost() {
    return Decimal.pow(CHANCE_COST_MULT, 
      this.dimension.chanceUpgrades + Math.max((this.dimension.chanceUpgrades - 15) * 2, 0))
      .times(Decimal.pow(COST_MULT_PER_TIER, this._tier)).times(CHANCE_START_COST);
  }

  get intervalCost() {
    return Decimal.pow(INTERVAL_COST_MULT, 
      this.dimension.intervalUpgrades + Math.max((this.dimension.intervalUpgrades - 9) * 2, 0))
      .times(Decimal.pow(COST_MULT_PER_TIER, this._tier)).times(INTERVAL_START_COST);
  }

  get powerCost() {
    return Decimal.pow(POWER_COST_MULT, 
      this.dimension.powerUpgrades + Math.max((this.dimension.powerUpgrades - 8) * 2, 0))
      .times(Decimal.pow(COST_MULT_PER_TIER, this._tier)).times(POWER_START_COST);
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

  buyChance() {
    if (this.chanceCost.gt(player.celestials.laitela.matter)) return false;
    player.celestials.laitela.matter = player.celestials.laitela.matter.minus(this.chanceCost);
    this.dimension.chanceUpgrades++;
    return true;
  }

  buyInterval() {
    if (this.intervalCost.gt(player.celestials.laitela.matter)) return false;
    player.celestials.laitela.matter = player.celestials.laitela.matter.minus(this.intervalCost);
    this.dimension.intervalUpgrades++;
    return true;
  }

  buyPower() {
    if (this.powerCost.gt(player.celestials.laitela.matter)) return false;
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


/**
 * This will be called in a loop
 * if interval >= updaterate -> if lastupdate + interval is smaller than now it will be called
 * if interval < updaterate it will be called with diff each update
 */
function getMatterDimensionProduction(tier, ticks) {
  const d = MatterDimension(tier);
  // The multiple ticks act just like more binomial samples
  const produced = binomialDistribution(d.amount.times(ticks), (d.chance / 100));
  return produced.times(d.power);
}

function matterDimensionLoop(realDiff) {
  for (let i = 1; i <= 4; i++) {
    const d = MatterDimension(i);
    d.timeSinceLastUpdate += realDiff;
    if (d.interval.lt(d.timeSinceLastUpdate)) {
      const ticks = Decimal.floor(Decimal.div(d.timeSinceLastUpdate, d.interval));
      const production = getMatterDimensionProduction(i, ticks);
      if (i === 1) player.celestials.laitela.matter = player.celestials.laitela.matter.plus(production);
      else MatterDimension(i - 1).amount = MatterDimension(i - 1).amount.plus(production);
      d.timeSinceLastUpdate = Decimal.minus(d.timeSinceLastUpdate, d.interval.times(ticks)).toNumber();
    }
  }

}
