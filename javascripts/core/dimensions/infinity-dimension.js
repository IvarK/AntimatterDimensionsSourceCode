"use strict";

function infinityDimensionCommonMultiplier() {
  let mult = new Decimal(kongAllDimMult)
    .timesEffectsOf(
      Achievement(75),
      TimeStudy(82),
      TimeStudy(92),
      TimeStudy(162),
      InfinityChallenge(1).reward,
      EternityChallenge(4).reward,
      EternityChallenge(9).reward,
      EternityUpgrade.idMultEP,
      EternityUpgrade.idMultEternities,
      EternityUpgrade.idMultICRecords,
      AlchemyResource.dimensionality
    );

  if (player.replicanti.unl && player.replicanti.amount.gt(1)) {
    mult = mult.times(replicantiMult());
  }
  return mult;
}

function IDPurchasesToIDAmount(purchases) {
  // Because each ID purchase gives 10 IDs
  return purchases * 10;
}

function IDAmountToIDPurchases(baseAmount) {
  // Because each ID purchase gives 10 IDs
  return baseAmount / 10;
}

const HARDCAP_ID_PURCHASES = 2000000;

function buyManyInfinityDimension(tier) {
  if (!canBuyInfinityDimension(tier)) return false;
  const dim = InfinityDimension(tier);
  player.infinityPoints = player.infinityPoints.minus(dim.cost)
  dim.amount = dim.amount.plus(10);
  dim.cost = Decimal.round(dim.cost.times(dim.costMultiplier));
  dim.power = dim.power.times(dim.powerMultiplier);
  dim.power = dim.power.timesEffectsOf(tier === 8 ? GlyphSacrifice.infinity : null);
  dim.baseAmount += IDPurchasesToIDAmount(1)

  if (EternityChallenge(8).isRunning) {
    player.eterc8ids -= 1;
  }
  return true
}

function buyMaxInfDims(tier) {
  if (!canBuyInfinityDimension(tier)) return false;
  const dim = InfinityDimension(tier);
  const costMult = dim.costMultiplier;

  let toBuy = Math.floor((player.infinityPoints.e - dim.cost.e) / Math.log10(costMult));
  const purchasesUntilHardcap = IDAmountToIDPurchases(dim.baseAmountCap - dim.baseAmount);
  toBuy = Math.min(toBuy, purchasesUntilHardcap);

  dim.cost = dim.cost.times(Decimal.pow(costMult, toBuy - 1));
  player.infinityPoints = player.infinityPoints.minus(dim.cost);
  dim.cost = dim.cost.times(costMult);
  dim.amount = dim.amount.plus(10 * toBuy);
  if (toBuy > 0) {
    const base = dim.powerMultiplier * Effects.product(tier === 8 ? GlyphSacrifice.infinity : null);
    dim.power = dim.power.times(Decimal.pow(base, toBuy));
  }
  dim.baseAmount += IDPurchasesToIDAmount(toBuy);
  buyManyInfinityDimension(tier);
  return true;
}

function canBuyInfinityDimension(tier) {
  const dim = InfinityDimension(tier);
  return !dim.isCapped && dim.isAvailableForPuchase && dim.isUnlocked;

}

function buyMaxInfinityDimensions() {
  if (EternityChallenge(8).isRunning) return;
  for (const tier of Array.dimensionTiers) {
    buyMaxInfDims(tier);
  }
}

function toggleAllInfDims() {
  const areEnabled = player.infDimBuyers[0];
  for (let i = 1; i < 9; i++) {
    player.infDimBuyers[i - 1] = !areEnabled;
  }
}

class InfinityDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.infinity, tier);
    this._purchaseCap = tier === 8 ? Number.MAX_VALUE : HARDCAP_ID_PURCHASES;
    const UNLOCK_REQUIREMENTS = [
      undefined,
      new Decimal("1e1100"),
      new Decimal("1e1900"),
      new Decimal("1e2400"),
      new Decimal("1e10500"),
      new Decimal("1e30000"),
      new Decimal("1e45000"),
      new Decimal("1e54000"),
      new Decimal("1e60000"),
    ];
    this._unlockRequirement = UNLOCK_REQUIREMENTS[tier];
    const COST_MULTS = [null, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30];
    this._costMultiplier = COST_MULTS[tier];
    const POWER_MULTS = [null, 50, 30, 10, 5, 5, 5, 5, 5];
    this._powerMultiplier = POWER_MULTS[tier];
    const BASE_COSTS = [null, 1e8, 1e9, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280];
    this._baseCost = new Decimal(BASE_COSTS[tier]);
  }

  get baseAmount() {
    return this.data.baseAmount;
  }

  set baseAmount(value) {
    this.data.baseAmount = value;
  }

  get isUnlocked() {
    return this.data.isUnlocked;
  }

  set isUnlocked(value) {
    this.data.isUnlocked = value;
  }

  get requirement() {
    return this._unlockRequirement;
  }

  get isAutobuyerUnlocked() {
    return player.eternities.gte(10 + this.tier);
  }

  get isAvailableForPuchase() {
    return this.isAffordable && (player.eterc8ids > 0 || !EternityChallenge(8).isRunning);
  }

  get isAffordable() {
    return player.infinityPoints.gte(this.cost);
  }

  get hasRateOfChange() {
    return this.tier < 8 || EternityChallenge(7).completions > 0;
  }

  get rateOfChange() {
    const tier = this.tier;
    let toGain = new Decimal(0);
    if (tier === 8) {
      EternityChallenge(7).reward.applyEffect(v => toGain = v);
    } else {
      toGain = InfinityDimension(tier + 1).productionPerSecond;
    }
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupForDisplay());
  }

  get productionPerSecond() {
    if (EternityChallenge(10).isRunning) {
      return new Decimal(0);
    }
    let production = this.amount;
    if (EternityChallenge(11).isRunning) {
      return production;
    }
    if (EternityChallenge(7).isRunning) {
      production = production.dividedBy(Tickspeed.current.dividedBy(1000));
    }
    return production
      .timesEffectOf(InfinityChallenge(6).reward)
      .times(this.multiplier);
  }

  get multiplier() {
    const tier = this.tier;

    if (EternityChallenge(2).isRunning) {
      return new Decimal(0);
    }
    if (EternityChallenge(11).isRunning) {
      return new Decimal(1);
    }
    let mult = this.power
      .times(GameCache.infinityDimensionCommonMultiplier.value)
      .timesEffectsOf(
        tier === 1 ? Achievement(94) : null,
        tier === 4 ? TimeStudy(72) : null,
        tier === 1 ? EternityChallenge(2).reward : null
      );

    mult = mult.clampMin(0);

    if (player.dilation.active || TimeCompression.isActive) {
      mult = dilatedValueOf(mult);
    }

    mult = mult.pow(getAdjustedGlyphEffect("infinitypow"));

    mult = mult.pow(getAdjustedGlyphEffect("effarigdimensions"));

    mult = mult.powEffectOf(AlchemyResource.infinity);

    if (Laitela.has(LAITELA_UNLOCKS.DIM_POW)) mult = mult.pow(Laitela.dimensionMultPowerEffect);

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(mult);
    } else if (V.isRunning) {
      mult = mult.pow(0.5);
    } else if (Laitela.isRunning) {
      mult = mult.pow(Laitela.dimMultNerf);
    }

    return mult;
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    let costMult = this._costMultiplier;
    EternityChallenge(12).reward.applyEffect(v => costMult = Math.pow(costMult, v));
    return costMult;
  }

  get powerMultiplier() {
    return this._powerMultiplier;
  }

  get purchaseCap() {
    if (Enslaved.isRunning) {
      return 1;
    }
    const enslavedBoost = Enslaved.isCompleted
      ? Math.floor(player.totalTickGained / 1000) * 1000
      : 0;
    const compressionBoost = Effects.max(0, CompressionUpgrade.infDimSoftcap);
    return this._purchaseCap + enslavedBoost + compressionBoost;
  }

  get baseAmountCap() {
    return this.purchaseCap * 10;
  }

  get isCapped() {
    return this.baseAmount >= this.baseAmountCap;
  }

  get hardcapIPAmount() {
    return this._baseCost.times(Decimal.pow(this.costMultiplier, this.purchaseCap));
  }

  resetAmount() {
    this.amount = new Decimal(this.baseAmount);
  }

  fullReset() {
    this.cost = new Decimal(this.baseCost);
    this.amount = new Decimal(0);
    this.power = new Decimal(1);
    this.bought = 0;
    this.baseAmount = 0;
    this.isUnlocked = false;
  }
}

InfinityDimensionState.createIndex();

/**
 * @param {number} tier
 * @return {InfinityDimensionState}
 */
const InfinityDimension = tier => InfinityDimensionState.index[tier];

const InfinityDimensions = {
  /**
   * @type {InfinityDimensionState[]}
   */
  all: InfinityDimensionState.index.compact(),
  unlockNext() {
    if (InfinityDimension(8).isUnlocked) return;
    const next = InfinityDimensions.next();
    if (!Perk.bypassIDAntimatter.isBought && player.antimatter.lt(next.requirement)) return;
    next.isUnlocked = true;
    EventHub.dispatch(GameEvent.INFINITY_DIMENSION_UNLOCKED, next.tier);
  },
  next() {
    if (InfinityDimension(8).isUnlocked)
      throw "All Infinity Dimensions are unlocked";
    return this.all.first(dim => !dim.isUnlocked);
  },
  resetAmount() {
    player.infinityPower = new Decimal(0);
    for (const dimension of InfinityDimensions.all) {
      dimension.resetAmount();
    }
  },
  fullReset() {
    for (const dimension of InfinityDimensions.all) {
      dimension.fullReset();
    }
  }
};

function tryUnlockInfinityDimensions() {
  if (player.eternities.lt(25) || InfinityDimension(8).isUnlocked) return;
  for (let tier = 1; tier <= 8; ++tier) {
    if (InfinityDimension(tier).isUnlocked) continue;
    // If we cannot unlock this one, we can't unlock the rest, either
    if (!Perk.bypassIDAntimatter.isBought && InfinityDimension(tier).requirement.gt(player.antimatter)) break;
    InfinityDimension(tier).isUnlocked = true;
    EventHub.dispatch(GameEvent.INFINITY_DIMENSION_UNLOCKED, tier);
    if (player.infDimBuyers[tier - 1] &&
      !EternityChallenge(2).isRunning && !EternityChallenge(8).isRunning && !EternityChallenge(10).isRunning) {
      buyMaxInfDims(tier);
    }
  }
}

function getInfinityConversionRate() {
  const laitelaBoost = Laitela.has(LAITELA_UNLOCKS.ID) ? Laitela.idConversionEffect : 0;
  return 7 + getAdjustedGlyphEffect("infinityrate") + laitelaBoost;
}
