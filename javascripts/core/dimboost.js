"use strict";

class DimBoostRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    const dimension = AntimatterDimension(this.tier);
    return dimension.totalAmount.gte(this.amount);
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

  static get maxDimensionsUnlockable() {
    return NormalChallenge(10).isRunning ? 6 : 8;
  }

  static get canUnlockNewDimension() {
    return DimBoost.purchasedBoosts + 4 < DimBoost.maxDimensionsUnlockable;
  }

  static get challenge8MaxBoosts() {
    // In Challenge 8, the only boosts that are useful are the first 5
    // (the fifth unlocks sacrifice). In IC1 (Challenge 8 and Challenge 10
    // combined, among other things), only the first 2 are useful
    // (they unlock new dimensions).
    // There's no actual problem with bulk letting the player get
    // more boosts than this; it's just that boosts beyond this are pointless.
    return NormalChallenge(10).isRunning ? 2 : 5;
  }

  static get canBeBought() {
    if (NormalChallenge(8).isRunning && DimBoost.purchasedBoosts >= this.challenge8MaxBoosts) return false;
    if (Ra.isRunning) return false;
    if (player.thisInfinityMaxAM.gt(Player.infinityGoal) &&
       (!player.break || NormalChallenge.isRunning || InfinityChallenge.isRunning)) return false;
    return true;
  }

  static get lockText() {
    if (NormalChallenge(8).isRunning && DimBoost.purchasedBoosts >= this.challenge8MaxBoosts) {
      return "Locked (8th Antimatter Dimension Autobuyer Challenge)";
    }
    if (Ra.isRunning) return "Locked (Ra's reality)";
    return null;
  }

  static get requirement() {
    return this.bulkRequirement(1);
  }

  static bulkRequirement(bulk) {
    const targetResets = DimBoost.purchasedBoosts + bulk;
    const tier = Math.min(targetResets + 3, this.maxDimensionsUnlockable);
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

    amount *= InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1);

    amount = Math.ceil(amount);

    return new DimBoostRequirement(tier, amount);
  }

  static get purchasedBoosts() {
    return Math.floor(player.dimensionBoosts);
  }

  static get freeBoosts() {
    // This was originally used for Time Compression, probably use it for something in Lai'tela now
    return 0;
  }

  static get totalBoosts() {
    return Math.floor(this.purchasedBoosts + this.freeBoosts);
  }
}

function softReset(bulk, forcedNDReset = false, forcedAMReset = false) {
    if (Currency.antimatter.gt(Player.infinityLimit)) return;
    EventHub.dispatch(GAME_EVENT.DIMBOOST_BEFORE, bulk);
    player.dimensionBoosts = Math.max(0, player.dimensionBoosts + bulk);
    resetChallengeStuff();
    if (forcedNDReset || !Perk.dimboostNonReset.isBought) {
      AntimatterDimensions.reset();
      player.sacrificed = new Decimal(0);
      resetTickspeed();
    }
    skipResetsIfPossible();
    const canKeepAntimatter = Achievement(111).isUnlocked || Perk.dimboostNonReset.isBought;
    if (!forcedAMReset && canKeepAntimatter) {
      Currency.antimatter.bumpTo(Currency.antimatter.startingValue);
    } else {
      Currency.antimatter.reset();
    }
    EventHub.dispatch(GAME_EVENT.DIMBOOST_AFTER, bulk);
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

function requestDimensionBoost(bulk) {
  if (Currency.antimatter.gt(Player.infinityLimit) || !DimBoost.requirement.isSatisfied) return;
  if (!DimBoost.canBeBought) return;
  if (BreakInfinityUpgrade.bulkDimBoost.isBought && bulk) maxBuyDimBoosts(true);
  else softReset(1);

  for (let tier = 1; tier < 9; tier++) {
    const mult = DimBoost.multiplierToNDTier(tier);
    if (mult.gt(1)) floatText(tier, formatX(mult));
  }
}

function maxBuyDimBoosts() {
  // Boosts that unlock new dims are bought one at a time, unlocking the next dimension
  if (DimBoost.canUnlockNewDimension) {
    if (DimBoost.requirement.isSatisfied) softReset(1);
    return;
  }
  const req1 = DimBoost.bulkRequirement(1);
  if (!req1.isSatisfied) return;
  const req2 = DimBoost.bulkRequirement(2);
  if (!req2.isSatisfied) {
    softReset(1);
    return;
  }
  // Linearly extrapolate dimboost costs. req1 = a * 1 + b, req2 = a * 2 + b
  // so a = req2 - req1, b = req1 - a = 2 req1 - req2, num = (dims - b) / a
  const increase = req2.amount - req1.amount;
  const dim = AntimatterDimension(req1.tier);
  let maxBoosts = Math.min(Number.MAX_VALUE,
    1 + Math.floor((dim.totalAmount.toNumber() - req1.amount) / increase));
  if (DimBoost.bulkRequirement(maxBoosts).isSatisfied) {
    softReset(maxBoosts);
    return;
  }
  // But in case of EC5 it's not, so do binary search for appropriate boost amount
  let minBoosts = 2;
  while (maxBoosts !== minBoosts + 1) {
    const middle = Math.floor((maxBoosts + minBoosts) / 2);
    if (DimBoost.bulkRequirement(middle).isSatisfied) minBoosts = middle;
    else maxBoosts = middle;
  }
  softReset(minBoosts);
}
