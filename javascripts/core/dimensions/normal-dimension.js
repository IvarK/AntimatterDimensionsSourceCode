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
    Achievement(78),
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
    EternityChallenge(10)
  );

  multiplier = multiplier.dividedByEffectOf(InfinityChallenge(6));
  multiplier = multiplier.times(getAdjustedGlyphEffect("powermult"));

  return multiplier;
}

function getDimensionFinalMultiplier(tier) {
  return GameCache.normalDimensionFinalMultipliers[tier].value;
}

function getDimensionFinalMultiplierUncached(tier) {
  if (tier < 1 || tier > 8) throw new Error(`Invalid Normal Dimension tier ${tier}`);
  if (NormalChallenge(10).isRunning && tier > 6) return new Decimal(1);

  let multiplier = new Decimal(NormalDimension(tier).power);

  if (EternityChallenge(11).isRunning) {
    return player.infinityPower.pow(getInfinityConversionRate())
      .max(1)
      .times(DimBoost.power.pow(DimBoost.totalBoosts - tier + 1).max(1));
  }
  if (NormalChallenge(12).isRunning) {
    if (tier === 4) multiplier = multiplier.pow(1.4);
    if (tier === 2) multiplier = multiplier.pow(1.7)
  }

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

  multiplier = multiplier.timesEffectsOf(
    tier === 8 ? Achievement(23) : null,
    tier < 8 ? Achievement(34) : null,
    tier <= 4 ? Achievement(43) : null,
    tier < 8 ? TimeStudy(71) : null,
    tier === 8 ? TimeStudy(214) : null,
    tier > 1 && tier < 8 ? InfinityChallenge(8).reward : null,
    AlchemyResource.dimensionality
  );
  if (Achievement(77).isEnabled) {
    // Welp, this effect is too complex for Effects system
    multiplier = multiplier.times(1 + tier / 100);
  }

  multiplier = multiplier.times(player.reality.realityMachines.powEffectOf(AlchemyResource.force));

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

  return multiplier;
}

function multiplySameCosts(cost) {
  const tierCosts = [null,
    new Decimal(1e3),
    new Decimal(1e4),
    new Decimal(1e5),
    new Decimal(1e6),
    new Decimal(1e8),
    new Decimal(1e10),
    new Decimal(1e12),
    new Decimal(1e15)];

  for (let i = 1; i <= 8; ++i) {
    const dimension = NormalDimension(i);
    if (dimension.cost.e === cost.e) dimension.cost = dimension.cost.times(tierCosts[i]);
  }
  if (Tickspeed.cost.e === cost.e) player.chall9TickspeedPurchaseBumps++;
}


function multiplyPC5Costs(cost, tier) {
  for (let i = 1; i < 9; i++) {
    const dimension = NormalDimension(i);
    if (tier <= 4 && dimension.cost.e <= cost.e) {
      dimension.cost = dimension.cost.times(dimension.costMultiplier);
      if (dimension.cost.gte(getCostIncreaseThreshold())) dimension.costMultiplier = dimension.costMultiplier.times(10);
    } else if (tier >= 5 && dimension.cost.e >= cost.e) {
      dimension.cost = dimension.cost.times(dimension.costMultiplier);
      if (dimension.cost.gte(getCostIncreaseThreshold())) dimension.costMultiplier = dimension.costMultiplier.times(10);
    }
  }
}

function getBuyTenMultiplier() {
  let dimMult = 2;

  if (NormalChallenge(7).isRunning) dimMult = Math.pow(10 / 0.30, Math.random()) * 0.30;

  dimMult += Effects.sum(
    Achievement(141).secondaryEffect,
    EternityChallenge(3).reward
  );

  dimMult *= Effects.product(
    InfinityUpgrade.buy10Mult,
    Achievement(58)
  );

  dimMult *= getAdjustedGlyphEffect("powerbuy10");

  dimMult = Decimal.pow(dimMult, getAdjustedGlyphEffect("effarigforgotten"))

  dimMult = dimMult.powEffectsOf(InfinityUpgrade.buy10Mult.chargedEffect)

  return dimMult;
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
  if (NormalChallenge(4).isRunning) clearDimensions(tier - 1)

  player.postC4Tier = tier;
  player.thisInfinityLastBuyTime = player.thisInfinityTime;
  if (tier !== 8) player.onlyEighthDimensons = false;
  if (tier !== 1) player.onlyFirstDimensions = false;
  if (tier === 8) player.noEighthDimensions = false;
}

function getCostIncreaseThreshold() {
  return Decimal.MAX_NUMBER;
}

function buyOneDimension(tier) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailable || !dimension.isAffordable) return false;

  const cost = dimension.cost;

  if (tier === 8 && Enslaved.isRunning && NormalDimension(8).bought >= 1) return false;

  if (tier < 3 || !NormalChallenge(6).isRunning) {
    player.antimatter = player.antimatter.minus(cost);
  } else {
    NormalDimension(tier - 2).amount = NormalDimension(tier - 2).amount.minus(cost)
  }

  dimension.amount = dimension.amount.plus(1);
  dimension.bought++;

  if (dimension.boughtBefore10 === 0) {
    dimension.power = dimension.power.times(getBuyTenMultiplier());
    if (!NormalChallenge(9).isRunning && !InfinityChallenge(5).isRunning) dimension.cost = dimension.cost.times(dimension.costMultiplier);
    else if (InfinityChallenge(5).isRunning) multiplyPC5Costs(dimension.cost, tier);
    else multiplySameCosts(cost);
    if (dimension.cost.gte(getCostIncreaseThreshold())) dimension.costMultiplier = dimension.costMultiplier.times(Player.dimensionMultDecrease);
    floatText(tier, "x" + shortenMoney(getBuyTenMultiplier()))
  }

  onBuyDimension(tier);


  return true;
}

function buyManyDimension(tier) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailable || !dimension.isAffordableUntil10) return false;
  const cost = dimension.costUntil10;

  if (tier === 8 && Enslaved.isRunning) return buyOneDimension(8);

  if (tier < 3 || !NormalChallenge(6).isRunning) {
    player.antimatter = player.antimatter.minus(cost);
  } else {
    NormalDimension(tier - 2).amount = NormalDimension(tier - 2).amount.minus(cost)
  }

  dimension.amount = dimension.amount.plus(dimension.remainingUntil10);
  dimension.bought += dimension.remainingUntil10;
  dimension.power = dimension.power.times(getBuyTenMultiplier());
  if (!NormalChallenge(9).isRunning && !InfinityChallenge(5).isRunning) dimension.cost = dimension.cost.times(dimension.costMultiplier);
  else if (InfinityChallenge(5).isRunning) multiplyPC5Costs(dimension.cost, tier);
  else multiplySameCosts(dimension.cost);
  if (dimension.cost.gte(getCostIncreaseThreshold())) dimension.costMultiplier = dimension.costMultiplier.times(Player.dimensionMultDecrease);

  floatText(tier, "x" + shortenMoney(getBuyTenMultiplier()));
  onBuyDimension(tier);

  return true;
}

function buyAsManyAsYouCanBuy(tier) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailable || !dimension.isAffordable) return false;
  const howMany = dimension.howManyCanBuy;
  const cost = dimension.cost.times(howMany);

  if (tier === 8 && Enslaved.isRunning && NormalDimension(8).bought >= 1) return buyOneDimension(8);

  if (tier < 3 || !NormalChallenge(6).isRunning) {
    player.antimatter = player.antimatter.minus(cost);
  } else {
    NormalDimension(tier - 2).amount = NormalDimension(tier - 2).amount.minus(cost)
  }

  dimension.amount = dimension.amount.plus(howMany);
  dimension.bought += howMany;

  if (dimension.boughtBefore10 === 0) {
    dimension.power = dimension.power.times(getBuyTenMultiplier());
    if (!NormalChallenge(9).isRunning && !InfinityChallenge(5).isRunning) dimension.cost = dimension.cost.times(dimension.costMultiplier);
    else if (InfinityChallenge(5).isRunning) multiplyPC5Costs(dimension.cost, tier);
    else multiplySameCosts(dimension.cost);
    if (dimension.cost.gte(getCostIncreaseThreshold())) dimension.costMultiplier = dimension.costMultiplier.times(Player.dimensionMultDecrease);

    floatText(tier, "x" + shortenMoney(getBuyTenMultiplier()));
  }

  onBuyDimension(tier);

  return true;
}

function buyManyDimensionAutobuyer(tier, bulk) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailable) return false;
  let antimatter = new Decimal(player.antimatter);
  if (antimatter.eq(0)) return false;
  if (tier === 8 && Enslaved.isRunning) return buyOneDimension(8);
  const boughtBefore10 = dimension.boughtBefore10;
  const remainingUntil10 = 10 - boughtBefore10;
  const costMultiplier = dimension.costMultiplier;
  const buyTenMultiplier = getBuyTenMultiplier();
  const dimensionMultDecrease = Player.dimensionMultDecrease;
  const costUntil10 = dimension.cost.times(remainingUntil10);

  if (tier >= 3 && NormalChallenge(6).isRunning) {
    let lowerDimension = NormalDimension(tier - 2);
    if (lowerDimension.amount.lt(costUntil10)) return false;
    if (costUntil10.lt(lowerDimension.amount) && boughtBefore10 !== 0) {
      lowerDimension.amount = lowerDimension.amount.minus(costUntil10);
      dimension.amount = Decimal.round(dimension.amount.plus(remainingUntil10));
      dimension.bought += remainingUntil10;
      dimension.power = dimension.power.times(buyTenMultiplier);
      dimension.cost = dimension.cost.times(costMultiplier)
    }
    let x = bulk;
    while (lowerDimension.amount.gt(dimension.cost.times(10)) && x > 0) {
      lowerDimension.amount = lowerDimension.amount.minus(dimension.cost.times(10));
      dimension.cost = dimension.cost.times(costMultiplier);
      dimension.amount = Decimal.round(dimension.amount.plus(10));
      dimension.bought += 10;
      dimension.power = dimension.power.times(buyTenMultiplier);
      if (dimension.cost.gte(getCostIncreaseThreshold())) costMultiplier.fromDecimal(costMultiplier.times(dimensionMultDecrease));
      x--;
    }
    onBuyDimension(tier);
    return true;
  }
  if (costUntil10.lt(player.antimatter) && boughtBefore10 !== 0) {
    player.antimatter = player.antimatter.minus(costUntil10);
    dimension.amount = Decimal.round(dimension.amount.plus(remainingUntil10));
    dimension.bought += remainingUntil10;
    dimension.power = dimension.power.times(buyTenMultiplier);
    dimension.cost = dimension.cost.times(costMultiplier)
  }
  if (player.antimatter.lt(dimension.cost.times(10))) return false;
  let x = bulk;

  if ((!BreakInfinityUpgrade.dimCostMult.isMaxed || InfinityChallenge(5).isRunning || NormalChallenge(9).isRunning)) {
    while (player.antimatter.gte(dimension.cost.times(10)) && x > 0) {
      player.antimatter = player.antimatter.minus(dimension.cost.times(10));
      if (InfinityChallenge(5).isRunning) multiplyPC5Costs(dimension.cost, tier);
      else if (NormalChallenge(9).isRunning) multiplySameCosts(dimension.cost);
      else dimension.cost = dimension.cost.times(costMultiplier);
      dimension.amount = Decimal.round(dimension.amount.plus(10));
      dimension.bought += 10;
      dimension.power = dimension.power.times(buyTenMultiplier);
      if (dimension.cost.gte(getCostIncreaseThreshold())) costMultiplier.fromDecimal(costMultiplier.times(dimensionMultDecrease));
      if (NormalChallenge(4).isRunning) clearDimensions(tier - 1);
      x--;
    }
  } else {
    let cost = new Decimal(dimension.cost);
    let amount = new Decimal(dimension.amount);
    let bought = dimension.bought;
    let pow = new Decimal(dimension.power);
    function flushValues() {
      player.antimatter.fromDecimal(antimatter);
      dimension.cost.fromDecimal(cost);
      dimension.amount.fromDecimal(amount);
      dimension.bought = bought;
      dimension.power.fromDecimal(pow);
    }
    if (dimension.cost.lt(getCostIncreaseThreshold())) {
      let failsafe = 0;
      while (antimatter.gte(cost.times(10)) && x > 0 && cost.lte(getCostIncreaseThreshold()) && failsafe < 150) {
        antimatter = antimatter.minus(cost.times(10));
        if (InfinityChallenge(5).isRunning) multiplyPC5Costs(cost, tier);
        else if (NormalChallenge(9).isRunning) multiplySameCosts(cost);
        else cost = cost.times(costMultiplier);
        amount = amount.plus(10).round();
        bought += 10;
        pow.fromDecimal(pow.times(buyTenMultiplier));
        if (cost.gte(getCostIncreaseThreshold())) costMultiplier.fromDecimal(costMultiplier.times(dimensionMultDecrease));
        if (NormalChallenge(4).isRunning) clearDimensions(tier - 1);
        x--;
        failsafe++;
      }
    }
    if (cost.gte(getCostIncreaseThreshold())) {
      const a = Math.log10(Math.sqrt(dimensionMultDecrease));
      const b = costMultiplier.dividedBy(Math.sqrt(dimensionMultDecrease)).log10();
      const c = cost.dividedBy(antimatter).log10();
      const discriminant = Math.pow(b, 2) - (c * a * 4);
      if (discriminant < 0) {
        flushValues();
        return false;
      }
      let buying = Math.floor((Math.sqrt(Math.pow(b, 2) - (c * a * 4)) - b) / (2 * a)) + 1;
      if (buying <= 0) {
        flushValues();
        return false;
      }
      if (buying > bulk) buying = bulk;
      amount = amount.plus(10 * buying).round();
      let preInfBuy = Math.floor(1 + (getCostIncreaseThreshold().e - dimension.baseCost.log10()) / dimension.baseCostMultiplier.log10());
      let postInfBuy = bought / 10 + buying - preInfBuy - 1;
      let postInfInitCost = dimension.baseCost.times(Decimal.pow(dimension.baseCostMultiplier, preInfBuy));
      bought += 10 * buying;
      pow = pow.times(Decimal.pow(buyTenMultiplier, buying));

      let newCost = null;
      let postInfBuyOriginal = postInfBuy;
      postInfBuy++;

      do {
        postInfBuy--;
        newCost = postInfInitCost.times(Decimal.pow(dimension.baseCostMultiplier, postInfBuy)).times(Decimal.pow(dimensionMultDecrease, postInfBuy * (postInfBuy + 1) / 2));
      }
      while (newCost.gt(antimatter) && postInfBuy >= 0);

      if (postInfBuyOriginal < postInfBuy) {
        console.log("Had to decrease postInfBuy. Tier = " + tier + ", a = " + a + ", b = " + b + ", c = " + c + ", discriminant = " + discriminant + ", buying = " + buying + ", amount = " + amount + ", preInfBuy = " + preInfBuy + ", postInfBuy = " + postInfBuy + ", postInfBuyOriginal = " + postInfBuyOriginal + ", postInfInitCost = ", + postInfInitCost.toString() + " , bought = " + bought + ", newCost = " + newCost.toString() + ", antimatter = " + antimatter.toString() + ".");
      }

      costMultiplier.fromDecimal(dimension.baseCostMultiplier.times(Decimal.pow(dimensionMultDecrease, postInfBuy + 1)));
      antimatter = antimatter.minus(newCost).max(0);
      cost = newCost.times(costMultiplier);
      costMultiplier.fromDecimal(costMultiplier.times(dimensionMultDecrease));
    }
    flushValues();
  }
  if ((NormalChallenge(11).isRunning || InfinityChallenge(6).isRunning) && player.matter.equals(0)) player.matter = new Decimal(1);
  if (InfinityChallenge(1).isRunning) clearDimensions(tier - 1);
  onBuyDimension(tier);
}


function canAfford(cost) {
  return (player.break || cost.lt(new Decimal("1.79e308"))) && cost.lte(player.antimatter);
}

function buyOneDimensionBtnClick(tier) {
  resetMatterOnBuy(tier);
  if (tier === 1) {
    if (buyOneDimension(1)) {
      // This achievement is granted only if the buy one button is pressed
      Achievement(28).tryUnlock();
    }
    let dimension = NormalDimension(1);
    if (dimension.amount.lt(1)) {
      // Edge case in the very beginning of the game
      player.antimatter = new Decimal(0);
      dimension.amount = dimension.amount.plus(1);
      dimension.bought++;
      Achievement(11).unlock();
    }
    return;
  }
  buyOneDimension(tier);
}

function buyManyDimensionsBtnClick(tier) {
  resetMatterOnBuy(tier);
  buyManyDimension(tier);
}

function buyAsManyAsYouCanBuyBtnClick(tier) {
  resetMatterOnBuy(tier);
  buyAsManyAsYouCanBuy(tier)
}

function resetMatterOnBuy(tier) {
  if (tier < 5 && Player.isInMatterChallenge && player.matter.equals(0)) {
    player.matter = new Decimal(1);
  }
}

function getDimensionProductionPerSecond(tier) {
  const multiplier = getDimensionFinalMultiplier(tier);
  const dimension = NormalDimension(tier);
  let amount = dimension.amount.floor();
  if (NormalChallenge(12).isRunning) {
    if (tier === 2) amount = amount.pow(1.5);
    if (tier === 4) amount = amount.pow(1.3);
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
    this._baseCost = new Decimal(BASE_COSTS[tier]);
    const BASE_COST_MULTIPLIERS = [null, 1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15];
    this._baseCostMultiplier = new Decimal(BASE_COST_MULTIPLIERS[tier]);
    const C6_BASE_COSTS = [null, 10, 100, 100, 500, 2500, 2e4, 2e5, 4e6];
    this._c6BaseCost = new Decimal(C6_BASE_COSTS[tier]);
    const C6_BASE_COST_MULTIPLIERS = [null, 1e3, 5e3, 1e4, 1.2e4, 1.8e4, 2.6e4, 3.2e4, 4.2e4];
    this._c6BaseCostMultiplier = new Decimal(C6_BASE_COST_MULTIPLIERS[tier]);
  }

  /**
   * @returns {Decimal}
   */
  get costMultiplier() {
    return this.data.costMultiplier;
  }

  /**
   * @param {Decimal} value
   */
  set costMultiplier(value) {
    this.data.costMultiplier = value;
  }

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
    let ratio = this.currencyAmount.dividedBy(this.cost)

    return Decimal.floor(Decimal.max(Decimal.min(ratio, 10 - this.boughtBefore10), 0)).toNumber()
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
    }
    else if (NormalChallenge(12).isRunning) {
      toGain = getDimensionProductionPerSecond(tier + 2);
    }
    else {
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

  get isAvailable() {
    if (!player.break && player.antimatter.gt(Decimal.MAX_NUMBER)) return false;
    if (this.tier > DimBoost.totalBoosts + 4) return false;
    if (this.tier > 1 &&
      NormalDimension(this.tier - 1).amount.eq(0) &&
      !EternityMilestone.unlockAllND.isReached) return false;
    return this.tier < 7 || !NormalChallenge(10).isRunning;
  }

  get baseCost() {
    return this._baseCost;
  }

  get baseCostMultiplier() {
    return this._baseCostMultiplier;
  }

  reset() {
    this.amount = new Decimal(0);
    this.power = new Decimal(1);
    this.bought = 0;
    const cost = NormalChallenge(6).isRunning
      ? this._c6BaseCost
      : this._baseCost;
    this.cost = new Decimal(cost);
    const costMultiplier = NormalChallenge(6).isRunning
      ? this._c6BaseCostMultiplier
      : this._baseCostMultiplier;
    this.costMultiplier = new Decimal(costMultiplier);
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
    NormalDimension(8).power = new Decimal(player.chall11Pow);
    GameCache.dimensionMultDecrease.invalidate();
  }
};
