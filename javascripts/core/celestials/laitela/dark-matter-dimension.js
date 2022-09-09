import { DC } from "../../constants";
import { DimensionState } from "../../dimensions/dimension";

/**
 * Constants for easily adjusting values
 */

const INTERVAL_COST_MULT = 5;
const POWER_DM_COST_MULT = 10;
const POWER_DE_COST_MULTS = [1.65, 1.6, 1.55, 1.5];

const INTERVAL_START_COST = 10;
const POWER_DM_START_COST = 10;
const POWER_DE_START_COST = 10;

const INTERVAL_PER_UPGRADE = 0.92;

// No constant for interval since it's tied to a milestone
export const POWER_DM_PER_ASCENSION = 500;
export const POWER_DE_PER_ASCENSION = 500;

const COST_MULT_PER_TIER = 1200;

export class DarkMatterDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.celestials.laitela.dimensions, tier);
  }

  // Does not include DM, only DE per second
  get productionPerSecond() { return this.powerDE * 1000 / this.interval; }

  get unlockUpgrade() {
    // The 15th Imaginary Upgrade unlocked Laitela and the 1st DMD
    return ImaginaryUpgrade(this.tier + 14);
  }

  get isUnlocked() {
    return this.unlockUpgrade.isBought;
  }

  get ascensions() {
    return this.data.ascensionCount;
  }

  get intervalPurchaseCap() {
    return 10;
  }

  get rawInterval() {
    const perUpgrade = INTERVAL_PER_UPGRADE;
    const tierFactor = Math.pow(4, this.tier - 1);
    return 1000 * tierFactor * Math.pow(perUpgrade, this.data.intervalUpgrades) *
      Math.pow(SingularityMilestone.ascensionIntervalScaling.effectOrDefault(1200), this.ascensions) *
      SingularityMilestone.darkDimensionIntervalReduction.effectOrDefault(1);
  }

  get interval() {
    return Math.clampMin(this.intervalPurchaseCap, this.rawInterval);
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
    return POWER_DM_PER_ASCENSION + SingularityMilestone.improvedAscensionDM.effectOrDefault(0);
  }

  get powerDM() {
    if (!this.isUnlocked) return new Decimal(0);
    return new Decimal(1 + 2 * Math.pow(1.15, this.data.powerDMUpgrades))
      .times(Laitela.realityReward)
      .times(Laitela.darkMatterMult)
      .times(this.commonDarkMult)
      .times(Math.pow(this.powerDMPerAscension, this.ascensions))
      .timesEffectsOf(SingularityMilestone.darkMatterMult, SingularityMilestone.multFromInfinitied)
      .dividedBy(Math.pow(1e4, Math.pow(this.tier - 1, 0.5)));
  }

  get powerDE() {
    if (!this.isUnlocked || Pelle.isDoomed) return 0;
    const tierFactor = Math.pow(15, this.tier - 1);
    const destabilizeBoost = Laitela.isFullyDestabilized ? 8 : 1;
    return new Decimal(((1 + this.data.powerDEUpgrades * 0.1) *
      Math.pow(1.005, this.data.powerDEUpgrades)) * tierFactor / 1000)
      .times(this.commonDarkMult)
      .times(Math.pow(POWER_DE_PER_ASCENSION, this.ascensions))
      .timesEffectsOf(
        SingularityMilestone.darkEnergyMult,
        SingularityMilestone.realityDEMultiplier,
        SingularityMilestone.multFromInfinitied
      ).toNumber() * destabilizeBoost;
  }

  get intervalAfterAscension() {
    const purchases = Decimal.affordGeometricSeries(Currency.darkMatter.value, this.rawIntervalCost,
      this.intervalCostIncrease, 0).toNumber();
    return Math.clampMin(this.intervalPurchaseCap, SingularityMilestone.ascensionIntervalScaling.effectOrDefault(1200) *
      this.rawInterval * Math.pow(INTERVAL_PER_UPGRADE, purchases));
  }

  get adjustedStartingCost() {
    const tiers = [null, 0, 2, 5, 13];
    return 10 * Math.pow(COST_MULT_PER_TIER, tiers[this.tier]) *
      SingularityMilestone.darkDimensionCostReduction.effectOrDefault(1);
  }

  get rawIntervalCost() {
    return Decimal.pow(this.intervalCostIncrease, this.data.intervalUpgrades)
      .times(this.adjustedStartingCost).times(INTERVAL_START_COST);
  }

  get intervalCost() {
    return this.rawIntervalCost.floor();
  }

  get intervalCostIncrease() {
    return Math.pow(INTERVAL_COST_MULT, SingularityMilestone.intervalCostScalingReduction.effectOrDefault(1));
  }

  get rawPowerDMCost() {
    return Decimal.pow(this.powerDMCostIncrease, this.data.powerDMUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DM_START_COST);
  }

  get powerDMCost() {
    return this.rawPowerDMCost.floor();
  }

  get powerDMCostIncrease() {
    return POWER_DM_COST_MULT;
  }

  get rawPowerDECost() {
    return Decimal.pow(this.powerDECostIncrease, this.data.powerDEUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DE_START_COST);
  }

  get powerDECost() {
    return this.rawPowerDECost.floor();
  }

  get powerDECostIncrease() {
    return POWER_DE_COST_MULTS[this.tier - 1];
  }

  get timeSinceLastUpdate() {
    return this.data.timeSinceLastUpdate;
  }

  set timeSinceLastUpdate(ms) {
    this.data.timeSinceLastUpdate = ms;
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
    return Math.ceil(Math.log(this.intervalPurchaseCap / this.interval) / Math.log(INTERVAL_PER_UPGRADE));
  }

  buyManyInterval(x) {
    if (x > this.maxIntervalPurchases) return false;
    const cost = this.rawIntervalCost.times(
      Decimal.pow(this.intervalCostIncrease, x).minus(1)).div(this.intervalCostIncrease - 1).floor();
    if (!Currency.darkMatter.purchase(cost)) return false;
    this.data.intervalUpgrades += x;
    return true;
  }

  buyManyPowerDM(x) {
    const cost = this.rawPowerDMCost.times(
      Decimal.pow(this.powerDMCostIncrease, x).minus(1)).div(this.powerDMCostIncrease - 1).floor();
    if (!Currency.darkMatter.purchase(cost)) return false;
    this.data.powerDMUpgrades += x;
    return true;
  }

  buyManyPowerDE(x) {
    const cost = this.rawPowerDECost.times(
      Decimal.pow(this.powerDECostIncrease, x).minus(1)).div(this.powerDECostIncrease - 1).floor();
    if (!Currency.darkMatter.purchase(cost)) return false;
    this.data.powerDEUpgrades += x;
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
    this.data.ascensionCount++;

    // Immediately buy as many interval upgrades as possible
    while (this.buyInterval());
  }

  static get dimensionCount() { return 4; }

  reset() {
    this.data.amount = DC.D1;
    this.data.intervalUpgrades = 0;
    this.data.powerDMUpgrades = 0;
    this.data.powerDEUpgrades = 0;
    this.data.timeSinceLastUpdate = 0;
    this.data.ascensionCount = 0;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {DarkMatterDimensionState}
 */
export const DarkMatterDimension = DarkMatterDimensionState.createAccessor();

export const DarkMatterDimensions = {
  /**
   * @type {DarkMatterDimension[]}
   */
  all: DarkMatterDimension.index.compact(),

  tick(realDiff) {
    if (!Laitela.isUnlocked) return;
    for (let tier = 4; tier >= 1; tier--) {
      const dim = DarkMatterDimension(tier);
      if (!dim.isUnlocked) continue;
      dim.timeSinceLastUpdate += realDiff;
      if (dim.interval < dim.timeSinceLastUpdate) {
        const ticks = Math.floor(dim.timeSinceLastUpdate / dim.interval);
        const productionDM = dim.amount.times(ticks).times(dim.powerDM);
        if (tier === 1) {
          Currency.darkMatter.add(productionDM);
        } else {
          DarkMatterDimension(tier - 1).amount = DarkMatterDimension(tier - 1).amount.plus(productionDM);
        }
        Currency.darkEnergy.add(ticks * dim.powerDE);
        dim.timeSinceLastUpdate -= dim.interval * ticks;
      }
    }
    if (SingularityMilestone.dim4Generation.canBeApplied && Laitela.annihilationUnlocked) {
      DarkMatterDimension(4).amount = DarkMatterDimension(4).amount
        .plus(SingularityMilestone.dim4Generation.effectValue * realDiff / 1000);
    }
  },

  reset() {
    for (const dimension of DarkMatterDimensions.all) {
      dimension.reset();
    }
    Currency.darkMatter.reset();
  },
};
