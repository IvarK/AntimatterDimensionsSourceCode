"use strict";

/**
 * Constants for easily adjusting values
 */

const CHANCE_COST_MULT = 1.6;
const INTERVAL_COST_MULT = 2.1;
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

  // In percents
  get chance() {
    const fromUpgrades = 1 + this.dimension.chanceUpgrades * (this.dimension.chanceUpgrades + 1) / 2;
    const tierFactor = Math.pow(2, this._tier);
    const otherBoosts = 1 + AlchemyResource.unpredictability.effectValue;
    return Math.min(fromUpgrades * otherBoosts / tierFactor, 100);
  }

  // In milliseconds; if this is 50 then you can no longer buy it, but it can get lower with other upgrades
  get interval() {
    const perUpgrade = 0.89 - AnnihilationUpgrade.intervalPower.effect;
    const tierFactor = Math.pow(4, this._tier);
    const postCapBoosts = Effects.max(1, CompressionUpgrade.matterBoost);
    return Decimal.pow(perUpgrade, this.dimension.intervalUpgrades)
      .times(tierFactor)
      .times(1000)
      .clampMin(50)
      .divide(postCapBoosts);
  }

  get power() {
    let base = Decimal.pow(1.1, this.dimension.powerUpgrades).times(Laitela.realityReward).times(2);
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
    return this.intervalCost.lte(player.celestials.laitela.matter) && this.interval.gt(50);
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


/**
 * This will be called in a loop
 * if interval >= updaterate -> if lastupdate + interval is smaller than now it will be called
 * if interval < updaterate it will be called with diff each update
 */
function getMatterDimensionProduction(tier, ticks) {
  const d = MatterDimension(tier);
  // The multiple ticks act just like more binomial samples
  const produced = binomialDistribution(d.amount.times(ticks), (d.chance / 100)).times(d.power);
  return produced;
}

function getDarkEnergyProduction(tier, ticks) {
  const d = MatterDimension(tier);
  // The multiple ticks act just like more binomial samples
  const produced = binomialDistribution(ticks.times(d.amount.log10()), Laitela.darkEnergyChance);

  // Idk why but for some reason binomialDistribution sometimes returns Decimal and sometimes a number.
  if (typeof produced === "number") return produced * AnnihilationUpgrade.darkEnergyMult.effect;
  return produced.times(AnnihilationUpgrade.darkEnergyMult.effect).toNumber();
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

      player.celestials.laitela.darkEnergy += getDarkEnergyProduction(i, ticks);

      d.timeSinceLastUpdate = Decimal.minus(d.timeSinceLastUpdate, d.interval.times(ticks)).toNumber();
    }
  }

}
