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
export const POWER_DM_PER_ASCENSION = 500;
export const POWER_DE_PER_ASCENSION = 500;

const COST_MULT_PER_TIER = 1200;

export class MatterDimensionState {
  constructor(tier) {
    this._tier = tier;
  }

  get dimension() {
    return player.celestials.laitela.dimensions[this._tier];
  }

  get unlockUpgrade() {
    // 0-indexed, and the unlocks start at ID 16 to unlock 2nd DMD
    return ImaginaryUpgrade(this._tier + 15);
  }

  get isUnlocked() {
    return this.unlockUpgrade.isBought;
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
    return DC.D1.timesEffectsOf(
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
      .dividedBy(Math.pow(1e4, Math.pow(this._tier, 0.5)));
  }

  get powerDE() {
    const tierFactor = Math.pow(15, this._tier);
    const destabilizeBoost = Laitela.isFullyDestabilized ? 8 : 1;
    return new Decimal(((1 + this.dimension.powerDEUpgrades * 0.1) *
      Math.pow(1.005, this.dimension.powerDEUpgrades)) * tierFactor / 1000)
      .times(this.commonDarkMult)
      .times(Math.pow(POWER_DE_PER_ASCENSION, this.dimension.ascensionCount))
      .timesEffectsOf(
        SingularityMilestone.darkEnergyMult,
        SingularityMilestone.realityDEMultiplier,
        SingularityMilestone.multFromInfinitied
      ).toNumber() * destabilizeBoost;
  }

  get adjustedStartingCost() {
    const tiers = [0, 2, 5, 13];
    return 10 * Math.pow(COST_MULT_PER_TIER, tiers[this._tier]) *
      SingularityMilestone.darkDimensionCostReduction.effectValue;
  }

  get rawIntervalCost() {
    return Decimal.pow(this.intervalCostIncrease, this.dimension.intervalUpgrades)
      .times(this.adjustedStartingCost).times(INTERVAL_START_COST);
  }

  get intervalCost() {
    return this.rawIntervalCost.floor();
  }

  get intervalCostIncrease() {
    return Math.pow(INTERVAL_COST_MULT, SingularityMilestone.intervalCostScalingReduction.effectValue);
  }

  get rawPowerDMCost() {
    return Decimal.pow(this.powerDMCostIncrease, this.dimension.powerDMUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DM_START_COST);
  }

  get powerDMCost() {
    return this.rawPowerDMCost.floor();
  }

  get powerDMCostIncrease() {
    return POWER_DM_COST_MULT;
  }

  get rawPowerDECost() {
    return Decimal.pow(this.powerDECostIncrease, this.dimension.powerDEUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DE_START_COST);
  }

  get powerDECost() {
    return this.rawPowerDECost.floor();
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
    return Currency.darkMatter.gte(this.intervalCost) && this.interval > this.intervalPurchaseCap;
  }

  get canBuyPowerDM() {
    return Currency.darkMatter.gte(this.powerDMCost);
  }

  get canBuyPowerDE() {
    return Currency.darkMatter.gte(this.powerDECost);
  }

  get maxIntervalPurchases() {
    return Math.ceil(Math.log(this.intervalPurchaseCap / this.interval) / Math.log(0.92));
  }

  buyManyInterval(x) {
    if (x > this.maxIntervalPurchases) return false;
    const cost = this.rawIntervalCost.times(
      Decimal.pow(this.intervalCostIncrease, x).minus(1)).div(this.intervalCostIncrease - 1).floor();
    if (!Currency.darkMatter.purchase(cost)) return false;
    this.dimension.intervalUpgrades += x;
    return true;
  }

  buyManyPowerDM(x) {
    const cost = this.rawPowerDMCost.times(
      Decimal.pow(this.powerDMCostIncrease, x).minus(1)).div(this.powerDMCostIncrease - 1).floor();
    if (!Currency.darkMatter.purchase(cost)) return false;
    this.dimension.powerDMUpgrades += x;
    return true;
  }

  buyManyPowerDE(x) {
    const cost = this.rawPowerDECost.times(
      Decimal.pow(this.powerDECostIncrease, x).minus(1)).div(this.powerDECostIncrease - 1).floor();
    if (!Currency.darkMatter.purchase(cost)) return false;
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
 * @return {MatterDimensionState}
 */
export function MatterDimension(tier) {
  return MatterDimensionState.list[tier - 1];
}
