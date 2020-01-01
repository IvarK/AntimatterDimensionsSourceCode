"use strict";

// Multiplier applied to all normal dimensions, regardless of tier. This is cached using a Lazy
// and invalidated every update.
function normalDimensionCommonMultiplier() {
  let multiplier = new Decimal(1);

  multiplier = multiplier.times(Player.achievementPower);
  multiplier = multiplier.times(kongDimMult);
  multiplier = multiplier.times(kongAllDimMult);

  if (!EternityChallenge(9).isRunning) {
    multiplier = multiplier.times(player.infinityPower.pow(getInfinityConversionRate()).max(1));
  }
  multiplier = multiplier.timesEffectsOf(
    BreakInfinityUpgrade.totalAMMult,
    BreakInfinityUpgrade.currentAMMult,
    BreakInfinityUpgrade.achievementMult,
    BreakInfinityUpgrade.slowestChallengeMult,
    InfinityUpgrade.totalTimeMult,
    InfinityUpgrade.thisInfinityTimeMult,
    Achievement(48),
    Achievement(56),
    Achievement(65),
    Achievement(72),
    Achievement(73),
    Achievement(74),
    Achievement(76),
    Achievement(78).effects.dimensionMult,
    Achievement(84),
    Achievement(91),
    Achievement(92),
    TimeStudy(91),
    TimeStudy(101),
    TimeStudy(161),
    TimeStudy(193),
    InfinityChallenge(3),
    InfinityChallenge(3).reward,
    InfinityChallenge(8),
    EternityChallenge(10),
    TriadStudy(4),
    AlchemyResource.dimensionality
  );

  multiplier = multiplier.dividedByEffectOf(InfinityChallenge(6));
  multiplier = multiplier.times(getAdjustedGlyphEffect("powermult"));
  multiplier = multiplier.times(player.reality.realityMachines.powEffectOf(AlchemyResource.force));

  return multiplier;
}

function getDimensionFinalMultiplier(tier) {
  return GameCache.normalDimensionFinalMultipliers[tier].value;
}

function getDimensionFinalMultiplierUncached(tier) {
  if (tier < 1 || tier > 8) throw new Error(`Invalid Normal Dimension tier ${tier}`);
  if (NormalChallenge(10).isRunning && tier > 6) return new Decimal(1);
  if (EternityChallenge(11).isRunning) {
    return player.infinityPower.pow(
      getInfinityConversionRate()
      ).max(1).times(DimBoost.multiplierToNDTier(tier));
  }

  let multiplier = new Decimal(1);

  multiplier = applyNDMultipliers(multiplier, tier);
  multiplier = applyNDPowers(multiplier, tier);

  const glyphDilationPowMultiplier = getAdjustedGlyphEffect("dilationpow");
  if (player.dilation.active || TimeCompression.isActive) {
    multiplier = dilatedValueOf(multiplier.pow(glyphDilationPowMultiplier, 1));
  } else if (Enslaved.isRunning) {
    multiplier = dilatedValueOf(multiplier);
  }
  multiplier = multiplier.timesEffectOf(DilationUpgrade.ndMultDT);

  // The "unaffected by dilation" ND mult and ND dilation power effect only apply to the first layer of dilation
  if (TimeCompression.isActive) {
    multiplier = dilatedValueOf(multiplier, TimeCompression.compressionDepth - 1);
  }

  if (Effarig.isRunning) {
    multiplier = Effarig.multiplier(multiplier);
  } else if (V.isRunning) {
    multiplier = multiplier.pow(0.5);
  } else if (Laitela.isRunning) {
    multiplier = multiplier.pow(Laitela.dimMultNerf);
  }

  // This power effect goes intentionally after all the nerf effects and shouldn't be moved before them
  if (Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY) && multiplier.gte(AlchemyResource.inflation.effectValue)) {
    multiplier = multiplier.pow(1.05);
  }

  return multiplier;
}

function applyNDMultipliers(mult, tier) {
  let multiplier = mult.times(GameCache.normalDimensionCommonMultiplier.value);

  multiplier = multiplier.times(Decimal.pow(
    NormalDimensions.buyTenMultiplier, Math.floor(NormalDimension(tier).bought / 10)
    ));
  multiplier = multiplier.times(DimBoost.multiplierToNDTier(tier));

  let infinitiedMult = new Decimal(1).timesEffectsOf(
    NormalDimension(tier).infinityUpgrade,
    BreakInfinityUpgrade.infinitiedMult
  );
  infinitiedMult = infinitiedMult.pow(Effects.product(TimeStudy(31)));
  multiplier = multiplier.times(infinitiedMult);

  if (tier === 1) {
    multiplier = multiplier
      .timesEffectsOf(
        InfinityUpgrade.unspentIPMult,
        InfinityUpgrade.unspentIPMult.chargedEffect,
        Achievement(28),
        Achievement(31),
        Achievement(68),
        Achievement(71),
        TimeStudy(234)
      );
  }
  if (tier === 8) {
    multiplier = multiplier.times(Sacrifice.totalBoost);
  }

  multiplier = multiplier.timesEffectsOf(
    tier === 8 ? Achievement(23) : null,
    tier < 8 ? Achievement(34) : null,
    tier <= 4 ? Achievement(43) : null,
    tier < 8 ? TimeStudy(71) : null,
    tier === 8 ? TimeStudy(214) : null,
    tier > 1 && tier < 8 ? InfinityChallenge(8).reward : null
  );
  if (Achievement(77).isEnabled) {
    // Welp, this effect is too complex for Effects system
    multiplier = multiplier.times(1 + tier / 100);
  }

  multiplier = multiplier.clampMin(1);

  return multiplier;
}

function applyNDPowers(mult, tier) {
  let multiplier = mult;
  const glyphPowMultiplier = getAdjustedGlyphEffect("powerpow");
  const glyphEffarigPowMultiplier = getAdjustedGlyphEffect("effarigdimensions");
  const laitelaPowMultiplier = Laitela.has(LAITELA_UNLOCKS.DIM_POW) ? Laitela.dimensionMultPowerEffect : 1;

  if (InfinityChallenge(4).isRunning && player.postC4Tier !== tier) {
    multiplier = multiplier.pow(InfinityChallenge(4).effectValue);
  }
  if (InfinityChallenge(4).isCompleted) {
    multiplier = multiplier.pow(InfinityChallenge(4).reward.effectValue);
  }

  multiplier = multiplier.pow(glyphPowMultiplier * glyphEffarigPowMultiplier * laitelaPowMultiplier);

  multiplier = multiplier
    .powEffectsOf(
      NormalDimension(tier).infinityUpgrade.chargedEffect,
      InfinityUpgrade.totalTimeMult.chargedEffect,
      InfinityUpgrade.thisInfinityTimeMult.chargedEffect,
      AlchemyResource.power
    );

  multiplier = multiplier.pow(getAdjustedGlyphEffect("curseddimensions"));

  return multiplier;
}

function clearDimensions(maxTier) {
  for (let i = 1; i <= maxTier; i++) {
    NormalDimension(i).amount = new Decimal(0);
  }
}

function onBuyDimension(tier) {
  Achievement(10 + tier).unlock();
  Achievement(23).tryUnlock();

  if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
  if (NormalChallenge(4).isRunning || InfinityChallenge(1).isRunning) clearDimensions(tier - 1);

  player.postC4Tier = tier;
  player.thisInfinityLastBuyTime = player.thisInfinityTime;
  if (tier !== 8) player.onlyEighthDimensons = false;
  if (tier !== 1) player.onlyFirstDimensions = false;
  if (tier === 8) player.noEighthDimensions = false;
}

function floatText(tier, text) {
  if (!player.options.animations.floatingText) return;
  const floatingText = ui.view.tabs.dimensions.normal.floatingText[tier];
  floatingText.push({ text, key: UIID.next() });
  setTimeout(() => floatingText.shift(), 1000);
}

function getCostIncreaseThreshold() {
  return Decimal.MAX_NUMBER;
}

function buyOneDimension(tier) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailableForPurchase || !dimension.isAffordable) return false;

  const cost = dimension.cost;

  if (tier === 8 && Enslaved.isRunning && NormalDimension(8).bought >= 1) return false;

  dimension.currencyAmount = dimension.currencyAmount.minus(cost);

  if (dimension.boughtBefore10 === 9) {
    dimension.challengeCostBump();
  }

  dimension.amount = dimension.amount.plus(1);
  dimension.bought++;

  if (dimension.boughtBefore10 === 0) {
    floatText(tier, `x${shorten(NormalDimensions.buyTenMultiplier, 2, 1)}`);
  }

  onBuyDimension(tier);

  return true;
}

function buyManyDimension(tier) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) return false;
  const cost = dimension.costUntil10;

  if (tier === 8 && Enslaved.isRunning) return buyOneDimension(8);

  dimension.currencyAmount = dimension.currencyAmount.minus(cost);
  dimension.challengeCostBump();
  dimension.amount = dimension.amount.plus(dimension.remainingUntil10);
  dimension.bought += dimension.remainingUntil10;

  floatText(tier, `x${shorten(NormalDimensions.buyTenMultiplier, 2, 1)}`);
  onBuyDimension(tier);

  return true;
}

function buyAsManyAsYouCanBuy(tier) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailableForPurchase || !dimension.isAffordable) return false;
  const howMany = dimension.howManyCanBuy;
  const cost = dimension.cost.times(howMany);

  if (tier === 8 && Enslaved.isRunning && NormalDimension(8).bought >= 1) return buyOneDimension(8);

  dimension.currencyAmount = dimension.currencyAmount.minus(cost);
  dimension.challengeCostBump();
  dimension.amount = dimension.amount.plus(howMany);
  dimension.bought += howMany;

  if (dimension.boughtBefore10 === 0) {
    floatText(tier, `x${shorten(NormalDimensions.buyTenMultiplier, 2, 1)}`);
  }

  onBuyDimension(tier);

  return true;
}

// This function doesn't do cost checking as challenges generally modify costs, it just buys and updates dimensions
function buyUntilTen(tier) {
  const dimension = NormalDimension(tier);
  dimension.challengeCostBump();
  dimension.amount = Decimal.round(dimension.amount.plus(dimension.remainingUntil10));
  dimension.bought += dimension.remainingUntil10;
  onBuyDimension(tier);
}

function maxAll() {
  if (!player.break && player.antimatter.gt(Decimal.MAX_NUMBER)) return;

  player.usedMaxAll = true;

  buyMaxTickSpeed();

  for (let tier = 1; tier < 9; tier++) {
    buyMaxDimension(tier);
  }
}

function buyMaxDimension(tier, bulk = Infinity, auto = false) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) return;
  const cost = dimension.costUntil10;
  let bulkLeft = bulk;
  const goal = Player.infinityGoal;
  if (dimension.cost.gt(goal) && (NormalChallenge.isRunning || InfinityChallenge.isRunning)) return;

  if (tier === 8 && Enslaved.isRunning) {
    buyOneDimension(8);
    return;
  }

  const multBefore = Decimal.pow(NormalDimensions.buyTenMultiplier, dimension.bought / 10);

  // Buy any remaining until 10 before attempting to bulk-buy
  if (cost.lt(player.antimatter)) {
    player.antimatter = player.antimatter.minus(cost);
    buyUntilTen(tier);
    bulkLeft--;
  }

  // Buy in a while loop in order to properly trigger abnormal price increases
  if (NormalChallenge(9).isRunning || InfinityChallenge(5).isRunning) {
    while (dimension.isAffordableUntil10 && dimension.cost.lt(goal) && bulkLeft > 0) {
      player.antimatter = player.antimatter.minus(dimension.costUntil10);
      buyUntilTen(tier);
      bulkLeft--;
    }
    return;
  }

  // This is the bulk-buy math, explicitly ignored if abnormal cost increases are active
  const maxBought = dimension.costScale.getMaxBought(
    Math.floor(dimension.bought / 10) + dimension.costBumps, dimension.currencyAmount
  );
  if (maxBought === null) {
    return;
  }
  let buying = maxBought.quantity;
  if (buying > bulkLeft) buying = bulkLeft;
  dimension.amount = dimension.amount.plus(10 * buying).round();
  dimension.bought += 10 * buying;
  dimension.currencyAmount = dimension.currencyAmount.minus(Decimal.pow10(maxBought.logPrice));
  const multAfter = Decimal.pow(NormalDimensions.buyTenMultiplier, dimension.bought / 10);
  if (multBefore.neq(multAfter) && auto === false) {
    floatText(tier, `x${shorten(multAfter.dividedBy(multBefore), 2, 1)}`);
  }
}


function canAfford(cost) {
  return (player.break || cost.lt(new Decimal("1.79e308"))) && cost.lte(player.antimatter);
}

function buyOneDimensionBtnClick(tier) {
  if (tier === 1) {
    if (buyOneDimension(1)) {
      // This achievement is granted only if the buy one button is pressed
      Achievement(28).tryUnlock();
    }
    return;
  }
  buyOneDimension(tier);
}

function buyManyDimensionsBtnClick(tier) {
  buyManyDimension(tier);
}

function buyAsManyAsYouCanBuyBtnClick(tier) {
  buyAsManyAsYouCanBuy(tier);
}

function getDimensionProductionPerSecond(tier) {
  const multiplier = getDimensionFinalMultiplier(tier);
  const dimension = NormalDimension(tier);
  let amount = dimension.amount.floor();
  if (NormalChallenge(12).isRunning) {
    if (tier === 2) amount = amount.pow(1.6);
    if (tier === 4) amount = amount.pow(1.4);
    if (tier === 6) amount = amount.pow(1.2);
  }
  let production = amount.times(multiplier).dividedBy(Tickspeed.current.dividedBy(1000));
  if (NormalChallenge(2).isRunning) {
    production = production.times(player.chall2Pow);
  }
  const postBreak = (player.break && !InfinityChallenge.isRunning && !NormalChallenge.isRunning) ||
    InfinityChallenge.isRunning || Enslaved.isRunning;
  if (!postBreak && production.gte(Decimal.MAX_NUMBER)) {
    production = production.min("1e315");
  }
  if (tier === 1 && production.gt(10)) {
    const log10 = production.log10();
    production = Decimal.pow10(Math.pow(log10, getAdjustedGlyphEffect("effarigantimatter")));
  }
  return production;
}

class NormalDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.normal, tier);
    const BASE_COSTS = [null, 10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24];
    this._baseCost = BASE_COSTS[tier];
    const BASE_COST_MULTIPLIERS = [null, 1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15];
    this._baseCostMultiplier = BASE_COST_MULTIPLIERS[tier];
    const C6_BASE_COSTS = [null, 10, 100, 100, 500, 2500, 2e4, 2e5, 4e6];
    this._c6BaseCost = C6_BASE_COSTS[tier];
    const C6_BASE_COST_MULTIPLIERS = [null, 1e3, 5e3, 1e4, 1.2e4, 1.8e4, 2.6e4, 3.2e4, 4.2e4];
    this._c6BaseCostMultiplier = C6_BASE_COST_MULTIPLIERS[tier];
  }

  /**
   * @returns {Decimal}
   */
  get costScale() {
    return new ExponentialCostScaling({
      baseCost: NormalChallenge(6).isRunning ? this._c6BaseCost : this._baseCost,
      baseIncrease: NormalChallenge(6).isRunning ? this._c6BaseCostMultiplier : this._baseCostMultiplier,
      costScale: Player.dimensionMultDecrease,
      scalingCostThreshold: Number.MAX_VALUE
    });
  }

  /**
   * @returns {Decimal}
   */
  get cost() {
    return this.costScale.calculateCost(Math.floor(this.bought / 10) + this.costBumps);
  }

  /** @returns {number} */
  get costBumps() { return this.data.costBumps; }
  /** @param {number} value */
  set costBumps(value) { this.data.costBumps = value; }

  /**
   * @returns {number}
   */
  get boughtBefore10() {
    return this.bought % 10;
  }

  /**
   * @returns {number}
   */
  get remainingUntil10() {
    return 10 - this.boughtBefore10;
  }

  /**
   * @returns {Decimal}
   */
  get costUntil10() {
    return this.cost.times(this.remainingUntil10);
  }

  get howManyCanBuy() {
    const ratio = this.currencyAmount.dividedBy(this.cost);
    return Decimal.floor(Decimal.max(Decimal.min(ratio, 10 - this.boughtBefore10), 0)).toNumber();
  }

  /**
   * @returns {InfinityUpgrade}
   */
  get infinityUpgrade() {
    switch (this.tier) {
      case 1:
      case 8:
        return InfinityUpgrade.dim18mult;
      case 2:
      case 7:
        return InfinityUpgrade.dim27mult;
      case 3:
      case 6:
        return InfinityUpgrade.dim36mult;
      case 4:
      case 5:
        return InfinityUpgrade.dim45mult;
    }
    return false;
  }

  /**
   * @returns {Decimal}
   */
  get rateOfChange() {
    const tier = this.tier;
    if (tier === 8 ||
      (tier > 3 && EternityChallenge(3).isRunning) ||
      (tier > 6 && NormalChallenge(12).isRunning)) {
      return new Decimal(0);
    }

    let toGain;
    if (tier === 7 && EternityChallenge(7).isRunning) {
      toGain = InfinityDimension(1).productionPerSecond.times(10);
    } else if (NormalChallenge(12).isRunning) {
      toGain = getDimensionProductionPerSecond(tier + 2);
    } else {
      toGain = getDimensionProductionPerSecond(tier + 1);
    }
    return toGain.times(10).dividedBy(this.amount.max(1)).times(getGameSpeedupForDisplay());
  }

  /**
   * @returns {Decimal}
   */
  get currencyAmount() {
    return this.tier >= 3 && NormalChallenge(6).isRunning
      ? NormalDimension(this.tier - 2).amount
      : player.antimatter;
  }

  /**
   * @param {Decimal} value
   */
  set currencyAmount(value) {
    return this.tier >= 3 && NormalChallenge(6).isRunning
      ? NormalDimension(this.tier - 2).amount = value
      : player.antimatter = value;
  }

   /**
    * @returns {boolean}
    */
  get isAffordable() {
    if (!player.break && this.cost.gt(Decimal.MAX_NUMBER)) return false;
    return this.cost.lte(this.currencyAmount);
  }

  /**
   * @returns {boolean}
   */
  get isAffordableUntil10() {
    if (!player.break && this.cost.gt(Decimal.MAX_NUMBER)) return false;
    return this.costUntil10.lte(this.currencyAmount);
  }

  get isAvailableForPurchase() {
    if (!player.break && player.antimatter.gt(Decimal.MAX_NUMBER)) return false;
    if (this.tier > DimBoost.totalBoosts + 4) return false;
    if (this.tier > 1 &&
      NormalDimension(this.tier - 1).amount.eq(0) &&
      !EternityMilestone.unlockAllND.isReached) return false;
    return this.tier < 7 || !NormalChallenge(10).isRunning;
  }

  reset() {
    this.amount = new Decimal(0);
    this.bought = 0;
    this.costBumps = 0;
  }

  challengeCostBump() {
    if (InfinityChallenge(5).isRunning) this.multiplyIC5Costs();
    else if (NormalChallenge(9).isRunning) this.multiplySameCosts();
  }

  multiplySameCosts() {
    for (const dimension of NormalDimensions.all.filter(dim => dim.tier !== this.tier)) {
      if (dimension.cost.e === this.cost.e) {
        dimension.costBumps++;
      }
    }
    if (Tickspeed.cost.e === this.cost.e) player.chall9TickspeedCostBumps++;
  }

  multiplyIC5Costs() {
    for (const dimension of NormalDimensions.all.filter(dim => dim.tier !== this.tier)) {
      if (this.tier <= 4 && dimension.cost.e <= this.cost.e) {
        dimension.costBumps++;
      } else if (this.tier >= 5 && dimension.cost.e >= this.cost.e) {
        dimension.costBumps++;
      }
    }
  }

  get multiplier() {
    return getDimensionFinalMultiplier(this.tier);
  }
}

NormalDimensionState.createIndex();

/**
 * @param {number} tier
 * @return {NormalDimensionState}
 */
const NormalDimension = tier => NormalDimensionState.index[tier];

const NormalDimensions = {
  /**
   * @type {NormalDimensionState[]}
   */
  all: NormalDimensionState.index.compact(),
  reset() {
    for (const dimension of NormalDimensions.all) {
      dimension.reset();
    }
    GameCache.dimensionMultDecrease.invalidate();
  },
  get buyTenMultiplier() {
    if (NormalChallenge(7).isRunning) return new Decimal(2).min(1 + DimBoost.totalBoosts / 5);

    let mult = new Decimal(2).plusEffectsOf(
      Achievement(141).effects.buyTenMult,
      EternityChallenge(3).reward
    );

    mult = mult.timesEffectsOf(
      InfinityUpgrade.buy10Mult,
      Achievement(58)
    ).times(getAdjustedGlyphEffect("powerbuy10"));

    mult = mult.pow(getAdjustedGlyphEffect("effarigforgotten")).powEffectOf(InfinityUpgrade.buy10Mult.chargedEffect);

    return mult;
  }
};

function produceAntimatter(diff) {
  const challenge = NormalChallenge.current || InfinityChallenge.current;
  if (player.antimatter.gt(Decimal.MAX_NUMBER)) {
    if (!player.break) return;
    if (challenge && player.antimatter.gt(challenge.goal)) return;
  }

  let maxTierProduced = EternityChallenge(3).isRunning ? 3 : 7;
  let nextTierOffset = 1;
  if (NormalChallenge(12).isRunning) {
    // Reduce to 6 normally, leave at 3 for EC3:
    maxTierProduced = Math.min(maxTierProduced, 6);
    nextTierOffset = 2;
  }
  for (let tier = maxTierProduced; tier >= 1; --tier) {
    const dim = NormalDimension(tier);
    dim.amount = dim.amount.plus(getDimensionProductionPerSecond(tier + nextTierOffset).times(diff / 10000));
  }
  let amRate = getDimensionProductionPerSecond(1);
  if (NormalChallenge(3).isRunning) amRate = amRate.times(player.chall3Pow);
  if (NormalChallenge(12).isRunning) amRate = amRate.plus(getDimensionProductionPerSecond(2));
  const amProduced = amRate.times(diff / 1000);
  player.antimatter = player.antimatter.plus(amProduced);
  player.totalAntimatter = player.totalAntimatter.plus(amProduced);
  player.thisInfinityMaxAM = player.thisInfinityMaxAM.max(player.antimatter);
}
