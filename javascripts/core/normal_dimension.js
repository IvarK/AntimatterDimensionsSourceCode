"use strict";

// Multiplier applied to all normal dimensions, regardless of tier. This is cached using a Lazy
// and invalidated every update.
function normalDimensionCommonMultiplier() {
  let multiplier = new Decimal(1);

  multiplier = multiplier.times(Player.achievementPower);
  multiplier = multiplier.times(kongDimMult);
  multiplier = multiplier.times(kongAllDimMult);

  if (!EternityChallenge(9).isRunning) {
    let glyphConversionRate = 7 + getAdjustedGlyphEffect("infinityrate");
    if (Laitela.has(LAITELA_UNLOCKS.ID)) glyphConversionRate += Laitela.idConversionEffect
    multiplier = multiplier.times(player.infinityPower.pow(glyphConversionRate).max(1));
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
  //if (player.currentEternityChall == "eterc3" && tier > 4) return new Decimal(0)
  const dimension = NormalDimension(tier);

  if (Laitela.isRunning && tier > 1) {
    return new Decimal(0)
  }

  let multiplier = new Decimal(dimension.pow);

  if (EternityChallenge(11).isRunning) return player.infinityPower.pow(7 + getAdjustedGlyphEffect("infinityrate")).max(1).times(DimBoost.power.pow(player.resets - tier + 1).max(1));
  if (NormalChallenge(12).isRunning) {
    if (tier === 4) multiplier = multiplier.pow(1.4);
    if (tier === 2) multiplier = multiplier.pow(1.7)
  }

  multiplier = multiplier.times(GameCache.normalDimensionCommonMultiplier.value);

  const glyphPowMultiplier = getAdjustedGlyphEffect("powerpow");
  const glyphEffarigPowMultiplier = getAdjustedGlyphEffect("effarigdimensions");
  const glyphDilationPowMultiplier = getAdjustedGlyphEffect("dilationpow");

  let infinitiedMult = new Decimal(1).timesEffectsOf(
    dimension.infinityUpgrade,
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
        TimeStudy(234),
      );
  }

  multiplier = multiplier.timesEffectsOf(
    tier === 8 ? Achievement(23) : null,
    tier !== 8 ? Achievement(34) : null,
    tier <= 4 ? Achievement(43) : null,
    tier !== 8 ? TimeStudy(71) : null,
    tier === 8 ? TimeStudy(214) : null,
    tier > 1 && tier < 8 ? InfinityChallenge(8).reward : null
  );
  if (Achievement(77).isEnabled) {
    // Welp, this effect is too complex for Effects system
    multiplier = multiplier.times(1 + tier / 100);
  }

  multiplier = multiplier.clampMin(1);

  if (InfinityChallenge(4).isRunning && player.postC4Tier !== tier) {
    multiplier = multiplier.pow(InfinityChallenge(4).effectValue);
  }
  if (InfinityChallenge(4).isCompleted) {
    multiplier = multiplier.pow(InfinityChallenge(4).reward.effectValue);
  }

  multiplier = multiplier.pow(glyphPowMultiplier * glyphEffarigPowMultiplier);

  if (player.dilation.active) {
    multiplier = dilatedValueOf(multiplier.pow(glyphDilationPowMultiplier));
  } else if (Enslaved.isRunning) {
    multiplier = dilatedValueOf(multiplier);
  }
  multiplier = multiplier.timesEffectOf(DilationUpgrade.ndMultDT);

  multiplier = multiplier
    .powEffectsOf(
      dimension.infinityUpgrade.chargedEffect,
      InfinityUpgrade.totalTimeMult.chargedEffect,
      InfinityUpgrade.thisInfinityTimeMult.chargedEffect
    )

  if (Effarig.isRunning) {
    multiplier = Effarig.multiplier(multiplier);
  } else if (V.isRunning) {
    multiplier = multiplier.pow(0.5)
  } else if (Laitela.isRunning) {
    multiplier = multiplier.pow(0.01)
  }

  return multiplier;
}

function multiplySameCosts(cost) {
  const tierCosts = [null, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)];

  for (let i = 1; i <= 8; ++i) {
    const dimension = NormalDimension(i);
    if (dimension.cost.e === cost.e) dimension.cost = dimension.cost.times(tierCosts[i])

  }
  if (player.tickSpeedCost.e === cost.e) player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier)
}


function multiplyPC5Costs(cost, tier) {
  if (tier < 5) {
    for (let i = 1; i < 9; i++) {
      const dimension = NormalDimension(i);
      if (dimension.cost.e <= cost.e) {
        dimension.cost = dimension.cost.times(player.costMultipliers[i - 1]);
        if (dimension.cost.gte(getCostIncreaseThreshold())) player.costMultipliers[i - 1] = player.costMultipliers[i - 1].times(10)
      }
    }
  } else {
    for (let i = 1; i < 9; i++) {
      const dimension = NormalDimension(i);
      if (dimension.cost.e >= cost.e) {
        dimension.cost = dimension.cost.times(player.costMultipliers[i - 1]);
        if (dimension.cost.gte(getCostIncreaseThreshold())) player.costMultipliers[i - 1] = player.costMultipliers[i - 1].times(10)
      }
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

function getDimensionCostMultiplier(tier) {
  return player.costMultipliers[tier - 1];
}

function onBuyDimension(tier) {
  if (!player.break) {
    Achievement(10 + tier).unlock();
  }
  Achievement(23).tryUnlock();

  if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
  if (NormalChallenge(4).isRunning) clearDimensions(tier - 1)

  player.postC4Tier = tier;
  postc8Mult = new Decimal(1);
  if (tier !== 8) player.dimlife = false;
  if (tier !== 1) player.dead = false;
  if (tier === 8) player.noEighthDimensions = false;
}

function getCostIncreaseThreshold() {
  return Decimal.MAX_NUMBER;
}

function buyOneDimension(tier) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailable || !dimension.isAffordable) return false;

  const cost = dimension.cost;

  if (tier === 8 && Enslaved.isRunning && player.eightBought >= 10) return false;

  if (tier < 3 || !NormalChallenge(6).isRunning) {
    player.money = player.money.minus(cost);
  } else {
    NormalDimension(tier - 2).amount = NormalDimension(tier - 2).amount.minus(cost)
  }

  dimension.amount = dimension.amount.plus(1);
  dimension.bought++;

  if (dimension.boughtBefore10 === 0) {
    dimension.pow = dimension.pow.times(getBuyTenMultiplier());
    if (!NormalChallenge(9).isRunning && !InfinityChallenge(5).isRunning) dimension.cost = dimension.cost.times(getDimensionCostMultiplier(tier));
    else if (InfinityChallenge(5).isRunning) multiplyPC5Costs(dimension.cost, tier);
    else multiplySameCosts(cost);
    if (dimension.cost.gte(getCostIncreaseThreshold())) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(Player.dimensionMultDecrease);
    floatText(tier, "x" + shortenMoney(getBuyTenMultiplier()))
  }

  onBuyDimension(tier);


  return true;
}

function buyManyDimension(tier) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailable || !dimension.isAffordableUntil10) return false;
  const cost = dimension.costUntil10;

  if (tier === 8 && Enslaved.isRunning && player.eightBought >= 10) return false;

  if (tier < 3 || !NormalChallenge(6).isRunning) {
    player.money = player.money.minus(cost);
  } else {
    NormalDimension(tier - 2).amount = NormalDimension(tier - 2).amount.minus(cost)
  }

  dimension.amount = dimension.amount.plus(dimension.remainingUntil10);
  dimension.bought += dimension.remainingUntil10;
  dimension.pow = dimension.pow.times(getBuyTenMultiplier());
  if (!NormalChallenge(9).isRunning && !InfinityChallenge(5).isRunning) dimension.cost = dimension.cost.times((getDimensionCostMultiplier(tier)));
  else if (InfinityChallenge(5).isRunning) multiplyPC5Costs(dimension.cost, tier);
  else multiplySameCosts(dimension.cost);
  if (dimension.cost.gte(getCostIncreaseThreshold())) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(Player.dimensionMultDecrease);

  floatText(tier, "x" + shortenMoney(getBuyTenMultiplier()));
  onBuyDimension(tier);

  return true;
}

function buyAsManyAsYouCanBuy(tier) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailable || !dimension.isAffordable) return false;
  const howMany = dimension.howManyCanBuy;
  const cost = dimension.cost.times(howMany);

  if (tier === 8 && Enslaved.isRunning && player.eightBought >= 10) return false;

  if (tier < 3 || !NormalChallenge(6).isRunning) {
    player.money = player.money.minus(cost);
  } else {
    NormalDimension(tier - 2).amount = NormalDimension(tier - 2).amount.minus(cost)
  }
  
  dimension.amount = dimension.amount.plus(howMany);
  dimension.bought += howMany;

  if (dimension.boughtBefore10 === 0) {
    dimension.pow = dimension.pow.times(getBuyTenMultiplier());
    if (!NormalChallenge(9).isRunning && !InfinityChallenge(5).isRunning) dimension.cost = dimension.cost.times((getDimensionCostMultiplier(tier)));
    else if (InfinityChallenge(5).isRunning) multiplyPC5Costs(dimension.cost, tier);
    else multiplySameCosts(dimension.cost);
    if (dimension.cost.gte(getCostIncreaseThreshold())) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(Player.dimensionMultDecrease);

    floatText(tier, "x" + shortenMoney(getBuyTenMultiplier()));
  }

  onBuyDimension(tier);

  return true;
}


const initCost = [null, new Decimal(10), new Decimal(1e2), new Decimal(1e4), new Decimal(1e6), new Decimal(1e9), new Decimal(1e13), new Decimal(1e18), new Decimal(1e24)];
const costMults = [null, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)];

function buyManyDimensionAutobuyer(tier, bulk) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailable) return false;
  let money = new Decimal(player.money);
  if (money.eq(0)) return false;
  if (tier === 8 && Enslaved.isRunning) return buyManyDimension(8);
  const boughtBefore10 = dimension.boughtBefore10;
  const remainingUntil10 = 10 - boughtBefore10;
  const costMultiplier = player.costMultipliers[tier - 1];
  const buyTenMultiplier = getBuyTenMultiplier();
  const dimensionCostMultiplier = getDimensionCostMultiplier(tier);
  const dimensionMultDecrease = Player.dimensionMultDecrease;
  const costUntil10 = dimension.cost.times(remainingUntil10);

  if (tier >= 3 && NormalChallenge(6).isRunning) {
    let lowerDimension = NormalDimension(tier - 2);
    if (lowerDimension.amount.lt(costUntil10)) return false;
    if (costUntil10.lt(lowerDimension.amount) && boughtBefore10 !== 0) {
      lowerDimension.amount = lowerDimension.amount.minus(costUntil10);
      dimension.amount = Decimal.round(dimension.amount.plus(remainingUntil10));
      dimension.bought += remainingUntil10;
      dimension.pow = dimension.pow.times(buyTenMultiplier);
      dimension.cost = dimension.cost.times(dimensionCostMultiplier)
    }
    let x = bulk;
    while (lowerDimension.amount.gt(dimension.cost.times(10)) && x > 0) {
      lowerDimension.amount = lowerDimension.amount.minus(dimension.cost.times(10));
      dimension.cost = dimension.cost.times(dimensionCostMultiplier);
      dimension.amount = Decimal.round(dimension.amount.plus(10));
      dimension.bought += 10;
      dimension.pow = dimension.pow.times(buyTenMultiplier);
      if (dimension.cost.gte(getCostIncreaseThreshold())) costMultiplier.fromDecimal(costMultiplier.times(dimensionMultDecrease));
      x--;
    }
    onBuyDimension(tier);
    return true;
  }
  if (costUntil10.lt(player.money) && boughtBefore10 !== 0) {
    player.money = player.money.minus(costUntil10);
    dimension.amount = Decimal.round(dimension.amount.plus(remainingUntil10));
    dimension.bought += remainingUntil10;
    dimension.pow = dimension.pow.times(buyTenMultiplier);
    dimension.cost = dimension.cost.times(dimensionCostMultiplier)
  }
  if (player.money.lt(dimension.cost.times(10))) return false;
  let x = bulk;

  if ((!BreakInfinityUpgrade.dimCostMult.isMaxed || InfinityChallenge(5).isRunning || NormalChallenge(9).isRunning)) {
    while (player.money.gte(dimension.cost.times(10)) && x > 0) {
      player.money = player.money.minus(dimension.cost.times(10));
      if (InfinityChallenge(5).isRunning) multiplyPC5Costs(dimension.cost, tier);
      else if (NormalChallenge(9).isRunning) multiplySameCosts(dimension.cost);
      else dimension.cost = dimension.cost.times(dimensionCostMultiplier);
      dimension.amount = Decimal.round(dimension.amount.plus(10));
      dimension.bought += 10;
      dimension.pow = dimension.pow.times(buyTenMultiplier);
      if (dimension.cost.gte(getCostIncreaseThreshold())) costMultiplier.fromDecimal(costMultiplier.times(dimensionMultDecrease));
      if (NormalChallenge(4).isRunning) clearDimensions(tier - 1);
      x--;
    }
  } else {
    let cost = new Decimal(dimension.cost);
    let amount = new Decimal(dimension.amount);
    let bought = dimension.bought;
    let pow = new Decimal(dimension.pow);
    function flushValues() {
      player.money.fromDecimal(money);
      dimension.cost.fromDecimal(cost);
      dimension.amount.fromDecimal(amount);
      dimension.bought = bought;
      dimension.pow.fromDecimal(pow);
    }
    if (dimension.cost.lt(getCostIncreaseThreshold())) {
      let failsafe = 0;
      while (money.gte(cost.times(10)) && x > 0 && cost.lte(getCostIncreaseThreshold()) && failsafe < 150) {
        money = money.minus(cost.times(10));
        if (InfinityChallenge(5).isRunning) multiplyPC5Costs(cost, tier);
        else if (NormalChallenge(9).isRunning) multiplySameCosts(cost);
        else cost = cost.times(dimensionCostMultiplier);
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
      const c = cost.dividedBy(money).log10();
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
      let preInfBuy = Math.floor(1 + (getCostIncreaseThreshold().e - initCost[tier].log10()) / costMults[tier].log10());
      let postInfBuy = bought / 10 + buying - preInfBuy - 1;
      let postInfInitCost = initCost[tier].times(Decimal.pow(costMults[tier], preInfBuy));
      bought += 10 * buying;
      pow = pow.times(Decimal.pow(buyTenMultiplier, buying));

      let newCost = null;
      let postInfBuyOriginal = postInfBuy;
      postInfBuy++;

      do {
        postInfBuy--;
        newCost = postInfInitCost.times(Decimal.pow(costMults[tier], postInfBuy)).times(Decimal.pow(dimensionMultDecrease, postInfBuy * (postInfBuy + 1) / 2));
      }
      while (newCost.gt(money) && postInfBuy >= 0);

      if (postInfBuyOriginal < postInfBuy) {
        console.log("Had to decrease postInfBuy. Tier = " + tier + ", a = " + a + ", b = " + b + ", c = " + c + ", discriminant = " + discriminant + ", buying = " + buying + ", amount = " + amount + ", preInfBuy = " + preInfBuy + ", postInfBuy = " + postInfBuy + ", postInfBuyOriginal = " + postInfBuyOriginal + ", postInfInitCost = ", + postInfInitCost.toString() + " , bought = " + bought + ", newCost = " + newCost.toString() + ", money = " + money.toString() + ".");
      }

      costMultiplier.fromDecimal(costMults[tier].times(Decimal.pow(dimensionMultDecrease, postInfBuy + 1)));
      money = money.minus(newCost).max(0);
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
  return (player.break || cost.lt(new Decimal("1.79e308"))) && cost.lte(player.money);
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
      player.money = new Decimal(0);
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

class NormalDimensionState {
  constructor(tier, props) {
    this._tier = tier;
    this._props = props;
  }

  /**
   * @returns {Decimal}
   */
  get cost() {
    return player[this._props.cost];
  }

  /**
   * @param {Decimal} value
   */
  set cost(value) {
    player[this._props.cost] = value;
  }

  /**
   * @returns {Decimal}
   */
  get amount() {
    return player[this._props.amount];
  }

  /**
   * @param {Decimal} value
   */
  set amount(value) {
    player[this._props.amount] = value;
  }

  /**
   * @returns {number}
   */
  get bought() {
    return player[this._props.bought];
  }

  /**
   * @param {number} value
   */
  set bought(value) {
    player[this._props.bought] = value;
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
   * @returns {Decimal}
   */
  get pow() {
    return player[this._props.pow];
  }

  /**
   * @param {Decimal} value
   */
  set pow(value) {
    player[this._props.pow] = value;
  }

  /**
   * @returns {InfinityUpgrade}
   */
  get infinityUpgrade() {
    switch (this._tier) {
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
    const tier = this._tier;
    if (tier === 8 ||
      (tier > 4 && EternityChallenge(3).isRunning) ||
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
    return toGain.times(10).dividedBy(this.amount.max(1)).times(getGameSpeedupFactor());
  }

  /**
   * @returns {Decimal}
   */

  get currencyAmount() {
    return this._tier >= 3 && NormalChallenge(6).isRunning
      ? NormalDimension(this._tier - 2).amount
      : player.money;
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
    if (!player.break && player.money.gt(Decimal.MAX_NUMBER)) return false;
    if (this._tier > player.resets + 4) return false;
    if (this._tier > 1 && NormalDimension(this._tier - 1).amount.eq(0) && player.eternities < 30) return false;
    return this._tier < 7 || !NormalChallenge(10).isRunning;
  }
}

NormalDimensionState.all = Array.dimensionTiers
  .map(tier => {
    const name = [null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight"][tier];
    const props = {
      cost: name + "Cost",
      amount: name + "Amount",
      bought: name + "Bought",
      pow: name + "Pow",
    };
    return new NormalDimensionState(tier, props);
  });

/**
 * @param {number} tier
 * @return {NormalDimensionState}
 */
function NormalDimension(tier) {
  return NormalDimensionState.all[tier - 1];
}

/**
 * @type {NormalDimensionState[]}
 */
NormalDimension.all = NormalDimensionState.all;
