"use strict";

class DimBoostRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    return NormalDimension(this.tier).amount.gte(this.amount);
  }
}

class DimBoost {
  static get power() {
    if (NormalChallenge(8).isRunning) {
      return new Decimal(1);
    }

    let boost = Effects.max(
        2,
        InfinityUpgrade.dimboostMult,
        InfinityChallenge(7).reward,
        InfinityChallenge(7),
        TimeStudy(81)
      )
      .toDecimal()
      .timesEffectsOf(
        TimeStudy(83),
        TimeStudy(231),
        Achievement(101),
        Achievement(142),
        GlyphEffect.dimBoostPower
      ).powEffectsOf(InfinityUpgrade.dimboostMult.chargedEffect);
    if (GlyphAlteration.isAdded("effarig")) boost = boost.pow(getSecondaryGlyphEffect("effarigforgotten"));
    return boost;
  }

  static multiplierToNDTier(tier) {
    return DimBoost.power.pow(this.totalBoosts + 1 - tier).clampMin(1);
  }

  static get maxShiftTier() {
    return NormalChallenge(10).isRunning ? 6 : 8;
  }

  static get isShift() {
    // Player starts with 4 unlocked dimensions,
    // hence there are just 4 (or 2, if in Auto DimBoosts challenge) shifts
    return DimBoost.purchasedBoosts + 4 < this.maxShiftTier;
  }

  static get requirement() {
    return this.bulkRequirement(1);
  }

  static bulkRequirement(bulk) {
    const targetResets = DimBoost.purchasedBoosts + bulk;
    const tier = Math.min(targetResets + 3, this.maxShiftTier);
    let amount = 20;
    const discount = Effects.sum(
      TimeStudy(211),
      TimeStudy(222)
    );
    if (tier === 6 && NormalChallenge(10).isRunning) {
      amount += Math.ceil((targetResets - 3) * (20 - discount));
    } else if (tier === 8) {
      amount += Math.ceil((targetResets - 5) * (15 - discount));
    }
    if (EternityChallenge(5).isRunning) {
      amount += Math.pow(targetResets - 1, 3) + targetResets - 1;
    }

    amount -= Effects.sum(InfinityUpgrade.resetBoost);
    if (InfinityChallenge(5).isCompleted) amount -= 1;

    amount *= Effects.product(InfinityUpgrade.resetBoost.chargedEffect);

    amount = Math.ceil(amount);

    return new DimBoostRequirement(tier, amount);
  }

  static get purchasedBoosts() {
    return player.dimensionBoosts;
  }

  static get freeBoosts() {
    return Math.floor(Effects.max(0, CompressionUpgrade.freeBoost));
  }

  static get totalBoosts() {
    return this.purchasedBoosts + this.freeBoosts;
  }
}

function softReset(bulk, forcedNDReset = false, forcedAMReset = false) {
    if (!player.break && player.antimatter.gt(Decimal.MAX_NUMBER)) return;
    EventHub.dispatch(GameEvent.DIMBOOST_BEFORE, bulk);
    player.dimensionBoosts = Math.max(0, player.dimensionBoosts + bulk);

    /**
     * All reset stuff are in these functions now. (Hope this works)
     */
    player.sacrificed = new Decimal(0);
    resetChallengeStuff();
    if (forcedNDReset || !Perk.dimboostNonReset.isBought) {
      NormalDimensions.reset();
    }
    skipResetsIfPossible();
    resetTickspeed();
    const currentAntimatter = player.antimatter;
    player.antimatter = Player.startingAM;
    if (!forcedAMReset && (Achievement(111).isEnabled || Perk.dimboostNonReset.isBought)) {
        player.antimatter = player.antimatter.max(currentAntimatter);
    }
    EventHub.dispatch(GameEvent.DIMBOOST_AFTER, bulk);
}

function skipResetsIfPossible() {
  if (NormalChallenge.isRunning || InfinityChallenge.isRunning) {
    return;
  }
  if (InfinityUpgrade.skipResetGalaxy.isBought && player.dimensionBoosts < 4) {
    player.dimensionBoosts = 4;
    if (player.galaxies === 0) player.galaxies = 1;
  } else if (InfinityUpgrade.skipReset3.isBought && player.dimensionBoosts < 3) player.dimensionBoosts = 3;
  else if (InfinityUpgrade.skipReset2.isBought && player.dimensionBoosts < 2) player.dimensionBoosts = 2;
  else if (InfinityUpgrade.skipReset1.isBought && player.dimensionBoosts < 1) player.dimensionBoosts = 1;
}

function softResetBtnClick() {
  if ((!player.break && player.antimatter.gt(Decimal.MAX_NUMBER)) || !DimBoost.requirement.isSatisfied) return;
  if (Ra.isRunning) return;
  if (BreakInfinityUpgrade.bulkDimBoost.isBought) maxBuyDimBoosts(true);
  else softReset(1);
  
  for (let tier = 1; tier < 9; tier++) {
    const mult = DimBoost.multiplierToNDTier(tier);
    if (mult.gt(1)) floatText(tier, formatX(mult));
  }
}

function maxBuyDimBoosts() {
  // Shifts are bought one at a time, unlocking the next dimension
  if (DimBoost.isShift) {
    if (DimBoost.requirement.isSatisfied) softReset(1);
    return;
  }
  const req1 = DimBoost.bulkRequirement(1);
  if (!req1.isSatisfied) return;
  const req2 = DimBoost.bulkRequirement(2);
  if (!req2.isSatisfied) return softReset(1);
  // Linearly extrapolate dimboost costs. req1 = a * 1 + b, req2 = a * 2 + b
  // so a = req2 - req1, b = req1 - a = 2 req1 - req2, num = (dims - b) / a
  const increase = req2.amount - req1.amount;
  let maxBoosts = Math.min(Number.MAX_VALUE,
    1 + Math.floor((NormalDimension(req1.tier).amount.toNumber() - req1.amount) / increase));
  if (DimBoost.bulkRequirement(maxBoosts).isSatisfied) return softReset(maxBoosts);

  // But in case of EC5 it's not, so do binary search for appropriate boost amount
  let minBoosts = 2;
  while (maxBoosts !== minBoosts + 1) {
    const middle = Math.floor((maxBoosts + minBoosts) / 2);
    if (DimBoost.bulkRequirement(middle).isSatisfied) minBoosts = middle;
    else maxBoosts = middle;
  }
  softReset(minBoosts);
}
