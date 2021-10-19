"use strict";

function infinityDimensionCommonMultiplier() {
  let mult = new Decimal(ShopPurchase.allDimPurchases.currentMult)
    .timesEffectsOf(
      Achievement(75),
      TimeStudy(82),
      TimeStudy(92),
      TimeStudy(162),
      InfinityChallenge(1).reward,
      InfinityChallenge(6).reward,
      EternityChallenge(4).reward,
      EternityChallenge(9).reward,
      EternityUpgrade.idMultEP,
      EternityUpgrade.idMultEternities,
      EternityUpgrade.idMultICRecords,
      AlchemyResource.dimensionality,
      ImaginaryUpgrade(8)
    );

  if (Replicanti.areUnlocked && Replicanti.amount.gt(1)) {
    mult = mult.times(replicantiMult());
  }
  return mult;
}

const InfinityDimensionCommonMultiplier = new EffectScope("Infinity Dimension Common Multiplier", scope =>
  scope.addMultipliers(
    new Effect(() => ShopPurchase.allDimPurchases.currentMult),
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
    AlchemyResource.dimensionality,
    // Change this to better handle replicanti
    new Effect(
      () => replicantiMult(),
      undefined,
      () => Replicanti.areUnlocked && player.replicanti.amount.gt(1)
    )
  )
);

const InfinityDimensionStandardMultipliers = Array.range(0, 9).map(tier => {
  if (tier === 0) return null;
  return new EffectScope(`Infinity Dimension ${tier} Multipliers`, scope => {
    scope.addMultipliers(
      InfinityDimensionCommonMultiplier,
      new EffectScope(`Infinity Dimension ${tier} Buy10 Multiplier`, scoped =>
        scoped.addMultipliers(
          new Effect(() => InfinityDimension(tier).powerMultiplier)
        ).addPowers(
          new Effect(() => Math.floor(InfinityDimension(tier).baseAmount / 10))
        )
      )
    );
    if (tier === 1)
      scope.addMultipliers(
        Achievement(94),
        EternityChallenge(2).reward
      );
    if (tier === 4)
      scope.addMultipliers(
        TimeStudy(72)
      );
  });
});

function buyManyInfinityDimension(tier) {
  if (!canBuyInfinityDimension(tier)) return false;
  const dim = InfinityDimension(tier);
  Currency.infinityPoints.subtract(dim.cost);
  dim.cost = Decimal.round(dim.cost.times(dim.costMultiplier));
  // Because each ID purchase gives 10 IDs
  dim.amount = dim.amount.plus(10);
  dim.baseAmount += 10;

  if (EternityChallenge(8).isRunning) {
    player.eterc8ids -= 1;
  }
  return true;
}

function buyMaxInfDims(tier) {
  if (!canBuyInfinityDimension(tier)) return false;
  const dim = InfinityDimension(tier);
  const costMult = dim.costMultiplier;
  const exponentDifference = (Currency.infinityPoints.exponent - dim.cost.e);
  let toBuy = exponentDifference === 0 ? 1 : Math.floor(exponentDifference / Math.log10(costMult));
  const purchasesUntilHardcap = dim.purchaseCap - dim.purchases;
  toBuy = Math.min(toBuy, purchasesUntilHardcap);
  if (EternityChallenge(8).isRunning) {
    toBuy = Math.clampMax(toBuy, player.eterc8ids);
    player.eterc8ids -= toBuy;
  }

  dim.cost = dim.cost.times(Decimal.pow(costMult, toBuy - 1));
  Currency.infinityPoints.subtract(dim.cost);
  dim.cost = dim.cost.times(costMult);
  // Because each ID purchase gives 10 IDs
  dim.amount = dim.amount.plus(10 * toBuy);
  dim.baseAmount += 10 * toBuy;
  buyManyInfinityDimension(tier);
  return true;
}

function canBuyInfinityDimension(tier) {
  const dim = InfinityDimension(tier);
  return !dim.isCapped && dim.isAvailableForPurchase && dim.isUnlocked;

}

function buyMaxInfinityDimensions() {
  if (EternityChallenge(8).isRunning) return;
  for (const tier of Array.dimensionTiers) {
    buyMaxInfDims(tier);
  }
}

function toggleAllInfDims() {
  const areEnabled = Autobuyer.infinityDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.infinityDimension(i).isActive = !areEnabled;
  }
}

class InfinityDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.infinity, tier);
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

  /** @returns {Decimal} */
  get cost() { return this.data.cost; }
  /** @param {Decimal} value */
  set cost(value) { this.data.cost = value; }

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

  get requirementReached() {
    return player.records.thisEternity.maxAM.gte(this.requirement);
  }

  get isAvailableForPurchase() {
    return this.isAffordable && (player.eterc8ids > 0 || !EternityChallenge(8).isRunning);
  }

  get isAffordable() {
    return Currency.infinityPoints.gte(this.cost);
  }

  get rateOfChange() {
    const tier = this.tier;
    let toGain = new Decimal(0);
    if (tier === 8) {
      // We need a extra 10x here (since ID8 production is per-second and
      // other ID production is per-10-seconds).
      EternityChallenge(7).reward.applyEffect(v => toGain = v.times(10));
      if (EternityChallenge(7).isRunning) EternityChallenge(7).applyEffect(v => toGain = v.times(10));
    } else {
      toGain = InfinityDimension(tier + 1).productionPerSecond;
    }
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupForDisplay());
  }

  get productionPerSecond() {
    let production = this.amount;
    if (EternityChallenge(11).isRunning) {
      return production;
    }
    if (EternityChallenge(7).isRunning) {
      production = production.times(Tickspeed.perSecond);
    }
    return production.times(this.multiplier);
  }

  get multiplier() {
    const tier = this.tier;

    if (EternityChallenge(2).isRunning || EternityChallenge(10).isRunning ||
      (Laitela.isRunning && this.tier > Laitela.maxAllowedDimension)) {
      return new Decimal(0);
    }
    if (EternityChallenge(11).isRunning) return new Decimal(1);
    let mult = GameCache.infinityDimensionCommonMultiplier.value
      .timesEffectsOf(
        tier === 1 ? Achievement(94) : null,
        tier === 4 ? TimeStudy(72) : null,
        tier === 1 ? EternityChallenge(2).reward : null
      );
    mult = mult.times(Decimal.pow(this.powerMultiplier, Math.floor(this.baseAmount / 10)));

    mult = mult.pow(getAdjustedGlyphEffect("infinitypow"));
    mult = mult.pow(getAdjustedGlyphEffect("effarigdimensions"));
    mult = mult.pow(getAdjustedGlyphEffect("curseddimensions"));
    mult = mult.powEffectOf(AlchemyResource.infinity);
    mult = mult.pow(Ra.momentumValue);

    if (player.dilation.active) {
      mult = dilatedValueOf(mult);
    }

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(mult);
    } else if (V.isRunning) {
      mult = mult.pow(0.5);
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
    return new Decimal(this._powerMultiplier)
      .timesEffectsOf(this._tier === 8 ? GlyphSacrifice.infinity : null)
      .pow(ImaginaryUpgrade(14).effectOrDefault(1));
  }

  get purchases() {
    // Because each ID purchase gives 10 IDs
    return this.data.baseAmount / 10;
  }

  get purchaseCap() {
    if (Enslaved.isRunning) {
      return 1;
    }
    return InfinityDimensions.capIncrease + (this.tier === 8
      ? Number.MAX_VALUE
      : InfinityDimensions.HARDCAP_PURCHASES);
  }

  get isCapped() {
    return this.purchases >= this.purchaseCap;
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
    this.bought = 0;
    this.baseAmount = 0;
    this.isUnlocked = false;
  }

  tryUnlock(manual) {
    if (!Perk.bypassIDAntimatter.isBought && !this.requirementReached) return;

    this.isUnlocked = true;
    EventHub.dispatch(GAME_EVENT.INFINITY_DIMENSION_UNLOCKED, this.tier);
    if (Autobuyer.infinityDimension(this.tier).isActive && !manual &&
      !EternityChallenge(2).isRunning && !EternityChallenge(8).isRunning && !EternityChallenge(10).isRunning) {
      buyMaxInfDims(this.tier);
    }
  }
}

/**
 * @function
 * @param {number} tier
 * @return {InfinityDimensionState}
 */
const InfinityDimension = InfinityDimensionState.createAccessor();

const InfinityDimensions = {
  /**
   * @type {InfinityDimensionState[]}
   */
  all: InfinityDimension.index.compact(),
  HARDCAP_PURCHASES: 2000000,

  unlockNext() {
    if (InfinityDimension(8).isUnlocked) return;
    const next = InfinityDimensions.next();
    if (!Perk.bypassIDAntimatter.isBought && player.records.thisEternity.maxAM.lt(next.requirement)) return;
    next.isUnlocked = true;
    EventHub.dispatch(GAME_EVENT.INFINITY_DIMENSION_UNLOCKED, next.tier);
  },

  next() {
    if (InfinityDimension(8).isUnlocked)
      throw "All Infinity Dimensions are unlocked";
    return this.all.first(dim => !dim.isUnlocked);
  },

  resetAmount() {
    Currency.infinityPower.reset();
    for (const dimension of InfinityDimensions.all) {
      dimension.resetAmount();
    }
  },

  fullReset() {
    for (const dimension of InfinityDimensions.all) {
      dimension.fullReset();
    }
  },

  get capIncrease() {
    return Math.floor(Tesseracts.capIncrease());
  },

  get totalDimCap() {
    return this.HARDCAP_PURCHASES + this.capIncrease;
  },

  tick(diff) {
    for (let tier = 8; tier > 1; tier--) {
      InfinityDimension(tier).produceDimensions(InfinityDimension(tier - 1), diff / 10);
    }

    if (EternityChallenge(7).isRunning) {
      if (!NormalChallenge(10).isRunning) {
        InfinityDimension(1).produceDimensions(AntimatterDimension(7), diff);
      }
    } else {
      InfinityDimension(1).produceCurrency(Currency.infinityPower, diff);
    }

    player.requirementChecks.reality.maxID1 = player.requirementChecks.reality.maxID1
      .clampMin(InfinityDimension(1).amount);
  },

  get powerConversionRate() {
    return 7 + getAdjustedGlyphEffect("infinityrate");
  }
};

function tryUnlockInfinityDimensions(auto) {
  if (auto && (!EternityMilestone.autoUnlockID.isReached || InfinityDimension(8).isUnlocked)) return;
  for (let tier = 1; tier <= 8; ++tier) {
    if (InfinityDimension(tier).isUnlocked) continue;
    InfinityDimension(tier).tryUnlock();
  }
}
