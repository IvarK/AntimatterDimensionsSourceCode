function getDimensionFinalMultiplier(tier) {
  //if (player.currentEternityChall == "eterc3" && tier > 4) return new Decimal(0)
  const dimension = NormalDimension(tier);

  let multiplier = new Decimal(dimension.pow);

  if (EternityChallenge(11).isRunning) return player.infinityPower.pow(7 + getAdjustedGlyphEffect("infinityrate")).max(1).times(DimBoost.power.pow(player.resets - tier + 1).max(1));
  if (Challenge(12).isRunning) {
    if (tier === 4) multiplier = multiplier.pow(1.4);
    if (tier === 2) multiplier = multiplier.pow(1.7)
  }

  if (isAchEnabled("r11")) multiplier = multiplier.times(player.achPow.pow(getAdjustedGlyphEffect("effarigachievement")));
  multiplier = multiplier.times(kongDimMult);
  multiplier = multiplier.times(kongAllDimMult);
  let glyphConversionRate = 7 + getAdjustedGlyphEffect("infinityrate");
  let glyphMultMultiplier = new Decimal(1).max(getAdjustedGlyphEffect("powermult"));
  let glyphPowMultiplier = new Decimal(1).max(getAdjustedGlyphEffect("powerpow"));
  let glyphEffarigPowMultiplier = new Decimal(1).max(getAdjustedGlyphEffect("effarigdimensions"));
  let glyphDilationPowMultiplier = new Decimal(1).max(getAdjustedGlyphEffect("dilationpow"));

  if (!EternityChallenge(9).isRunning) {
    multiplier = multiplier.times(player.infinityPower.pow(glyphConversionRate).max(1));
  }

  multiplier = multiplier.timesEffectsOf(
    BreakInfinityUpgrade.totalAMMult,
    BreakInfinityUpgrade.currentAMMult,
    BreakInfinityUpgrade.achievementMult,
    BreakInfinityUpgrade.slowestChallengeMult
  );

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
        Achievement(71)
      );
  }

  multiplier = multiplier.timesEffectsOf(
    InfinityUpgrade.totalTimeMult,
    InfinityUpgrade.thisInfinityTimeMult,
    tier === 8 ? Achievement(23) : null,
    tier !== 8 ? Achievement(34) : null,
    tier <= 4 ? Achievement(43) : null,
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
    tier !== 8 ? TimeStudy(71) : null,
    tier === 1 ? TimeStudy(234) : null,
    TimeStudy(91),
    TimeStudy(101),
    TimeStudy(161),
    InfinityChallenge(3),
    InfinityChallenge(3).reward,
    InfinityChallenge(8),
    tier > 1 && tier < 8 ? InfinityChallenge(8).reward : null
  );

  if (Achievement(77).isEnabled) {
    // Welp, this effect is too complex for Effects system
    multiplier = multiplier.times(1 + tier / 100);
  }

  multiplier = multiplier.dividedByEffectOf(InfinityChallenge(6));

  if (InfinityChallenge(4).isRunning && player.postC4Tier !== tier) {
    multiplier = multiplier.pow(InfinityChallenge(4).effectValue);
  }
  if (InfinityChallenge(4).isCompleted) {
    multiplier = multiplier.pow(InfinityChallenge(4).reward.effectValue);
  }

  multiplier = multiplier
    .timesEffectsOf(
      TimeStudy(193),
      tier === 8 ? TimeStudy(214) : null,
      EternityChallenge(10)
    );
  multiplier = multiplier.clampMin(1);
  multiplier = multiplier.times(glyphMultMultiplier).pow(glyphPowMultiplier.times(glyphEffarigPowMultiplier));

  if (player.dilation.active) {
    multiplier = dilatedValueOf(multiplier.pow(glyphDilationPowMultiplier));
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

function isTickspeedPurchaseUnlocked() {
  return player.secondAmount.gt(0);
}

function canBuyDimension(tier) {
  if (tier === 9) {
    return !player.secondAmount.equals(0);
  }

  if (!player.break && player.money.gt(Number.MAX_VALUE)) return false;
  if (tier > player.resets + 4) return false;
  if (tier > 1 && NormalDimension(tier - 1).amount.eq(0) && player.eternities < 30) return false;
  return tier < 7 || !Challenge(10).isRunning;
}

function getBuyTenMultiplier() {
  let dimMult = 2;

  if (Challenge(7).isRunning) dimMult = Math.pow(10 / 0.30, Math.random()) * 0.30;

  dimMult+= Effects.sum(Achievement(141).secondaryEffect);
  dimMult *= Effects.product(
    InfinityUpgrade.buy10Mult,
    Achievement(58)
  );
  dimMult += Effects.sum(EternityChallenge(3).reward);

  dimMult *= Math.max(1, getAdjustedGlyphEffect("powerbuy10"))

  dimMult = Decimal.pow(dimMult, getAdjustedGlyphEffect("effarigforgotten"))

  dimMult = dimMult.powEffectsOf(InfinityUpgrade.buy10Mult.chargedEffect)

  return dimMult;
}


function clearDimensions(amount) {
  for (let i = 1; i <= amount; i++) {
    NormalDimension(i).amount = new Decimal(0);
  }
}


function getDimensionCostMultiplier(tier) {

  const multiplier2 = [new Decimal(1e3), new Decimal(5e3), new Decimal(1e4), new Decimal(1.2e4), new Decimal(1.8e4), new Decimal(2.6e4), new Decimal(3.2e4), new Decimal(4.2e4)];
  if (Challenge(6).isRunning) return multiplier2[tier - 1];
  else return player.costMultipliers[tier - 1];
}

function onBuyDimension(tier) {
  if (!player.break) {
    switch (tier) {
      case 1:
        giveAchievement("You gotta start somewhere");
        break;
      case 2:
        giveAchievement("100 antimatter is a lot");
        break;
      case 3:
        giveAchievement("Half life 3 confirmed");
        break;
      case 4:
        giveAchievement("L4D: Left 4 Dimensions");
        break;
      case 5:
        giveAchievement("5 Dimension Antimatter Punch");
        break;
      case 6:
        giveAchievement("We couldn't afford 9");
        break;
      case 7:
        giveAchievement("Not a luck related achievement");
        break;
      case 8:
        giveAchievement("90 degrees to infinity");
        break;
    }
  }

  if (player.eightAmount.round().eq(99)) {
    giveAchievement("The 9th Dimension is a lie");
  }

  player.postC4Tier = tier;
  postc8Mult = new Decimal(1);
  if (tier !== 8) player.dimlife = false;
  if (tier !== 1) player.dead = false


}

function getCostIncreaseThreshold() {
  return new Decimal(Number.MAX_VALUE);
}

function buyOneDimension(tier) {
  const dimension = NormalDimension(tier);
  const cost = dimension.cost;
  auto = false;

  if (!Challenge(6).isRunning) {
    if (!canBuyDimension(tier)) {
      return false;
    }
  } else {
    if (tier >= 3) {
      if (NormalDimension(tier - 2).amount.lt(cost)) return false
    }
    else if (!canBuyDimension(tier)) {
      return false;
    } else if (tier < 3 && !canAfford(cost)) {
      return false;
    }
  }


  if (!Challenge(6).isRunning) {
    if (!canAfford(cost)) {
      return false;
    }
  }


  if (tier < 3 || !Challenge(6).isRunning) {
    player.money = player.money.minus(cost);
  } else {
    NormalDimension(tier - 2).amount = NormalDimension(tier - 2).amount.minus(cost)
  }

  dimension.amount = dimension.amount.plus(1);
  dimension.bought++;

  if (dimension.boughtBefore10 === 0) {
    dimension.pow = dimension.pow.times(getBuyTenMultiplier());
    if (!Challenge(9).isRunning && !InfinityChallenge(5).isRunning) dimension.cost = dimension.cost.times(getDimensionCostMultiplier(tier));
    else if (InfinityChallenge(5).isRunning) multiplyPC5Costs(dimension.cost, tier);
    else multiplySameCosts(cost);
    if (dimension.cost.gte(getCostIncreaseThreshold())) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(Player.dimensionMultDecrease);
    floatText(tier, "x" + shortenMoney(getBuyTenMultiplier()))
  }

  if (Challenge(2).isRunning) player.chall2Pow = 0;
  if (Challenge(4).isRunning) clearDimensions(tier - 1);

  onBuyDimension(tier);


  return true;
}

function buyManyDimension(tier) {
  const dimension = NormalDimension(tier);
  const cost = dimension.cost.times(dimension.remainingUntil10);

  auto = false;

  if ((Challenge(11).isRunning || player.currentChallenge === "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
  if (!Challenge(6).isRunning) {
    if (!canBuyDimension(tier)) {
      return false;
    }
  } else {
    if (tier >= 3) {
      if (!canBuyDimension(tier)) return false;
      if (NormalDimension(tier - 2).amount.lt(cost)) return false
    }
    else if (!canBuyDimension(tier)) {
      return false;
    } else if (tier < 3 && !canAfford(cost)) {
      return false;
    }
  }


  if (!Challenge(6).isRunning) {
    if (!canAfford(cost)) {
      return false;
    }
  }

  if (tier < 3 || !Challenge(6).isRunning) {
    player.money = player.money.minus(cost);
  } else {
    NormalDimension(tier - 2).amount = NormalDimension(tier - 2).amount.minus(cost)
  }

  dimension.amount = dimension.amount.plus(dimension.remainingUntil10);
  dimension.bought += dimension.remainingUntil10;
  dimension.pow = dimension.pow.times(getBuyTenMultiplier());
  if (!Challenge(9).isRunning && !InfinityChallenge(5).isRunning) dimension.cost = dimension.cost.times((getDimensionCostMultiplier(tier)));
  else if (InfinityChallenge(5).isRunning) multiplyPC5Costs(dimension.cost, tier);
  else multiplySameCosts(dimension.cost);
  if (dimension.cost.gte(getCostIncreaseThreshold())) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(Player.dimensionMultDecrease);
  if (Challenge(2).isRunning) player.chall2Pow = 0;
  if (Challenge(4).isRunning) clearDimensions(tier - 1);
  floatText(tier, "x" + shortenMoney(getBuyTenMultiplier()));
  onBuyDimension(tier);

  return true;
}


const initCost = [null, new Decimal(10), new Decimal(1e2), new Decimal(1e4), new Decimal(1e6), new Decimal(1e9), new Decimal(1e13), new Decimal(1e18), new Decimal(1e24)];
const costMults = [null, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)];

function buyManyDimensionAutobuyer(tier, bulk) {
  if (!canBuyDimension(tier)) return false;
  let money = new Decimal(player.money);
  if (money.eq(0)) return false;
  const dimension = NormalDimension(tier);
  const boughtBefore10 = dimension.boughtBefore10;
  const remainingUntil10 = 10 - boughtBefore10;
  const costMultiplier = player.costMultipliers[tier - 1];
  const buyTenMultiplier = getBuyTenMultiplier();
  const dimensionCostMultiplier = getDimensionCostMultiplier(tier);
  const dimensionMultDecrease = Player.dimensionMultDecrease;
  const costUntil10 = dimension.cost.times(remainingUntil10);

  if (tier >= 3 && Challenge(6).isRunning) {
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

  if ((!BreakInfinityUpgrade.dimCostMult.isMaxed || InfinityChallenge(5).isRunning || Challenge(9).isRunning)) {
    while (player.money.gte(dimension.cost.times(10)) && x > 0) {
      player.money = player.money.minus(dimension.cost.times(10));
      if (InfinityChallenge(5).isRunning) multiplyPC5Costs(dimension.cost, tier);
      else if (Challenge(9).isRunning) multiplySameCosts(dimension.cost);
      else dimension.cost = dimension.cost.times(dimensionCostMultiplier);
      dimension.amount = Decimal.round(dimension.amount.plus(10));
      dimension.bought += 10;
      dimension.pow = dimension.pow.times(buyTenMultiplier);
      if (dimension.cost.gte(getCostIncreaseThreshold())) costMultiplier.fromDecimal(costMultiplier.times(dimensionMultDecrease));
      if (Challenge(4).isRunning) clearDimensions(tier - 1);
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
        else if (Challenge(9).isRunning) multiplySameCosts(cost);
        else cost = cost.times(dimensionCostMultiplier);
        amount = amount.plus(10).round();
        bought += 10;
        pow.fromDecimal(pow.times(buyTenMultiplier));
        if (cost.gte(getCostIncreaseThreshold())) costMultiplier.fromDecimal(costMultiplier.times(dimensionMultDecrease));
        if (Challenge(4).isRunning) clearDimensions(tier - 1);
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

      do
      {
          postInfBuy--;
          newCost = postInfInitCost.times(Decimal.pow(costMults[tier], postInfBuy)).times(Decimal.pow(dimensionMultDecrease, postInfBuy * (postInfBuy + 1) / 2));
      }
      while (newCost.gt(money) && postInfBuy >= 0);

      if (postInfBuyOriginal < postInfBuy)
      {
        console.log("Had to decrease postInfBuy. Tier = " + tier + ", a = " + a + ", b = " + b + ", c = " + c + ", discriminant = " + discriminant + ", buying = " + buying + ", amount = " + amount + ", preInfBuy = " + preInfBuy + ", postInfBuy = " + postInfBuy + ", postInfBuyOriginal = " + postInfBuyOriginal + ", postInfInitCost = ", + postInfInitCost.toString() + " , bought = " + bought + ", newCost = " + newCost.toString() + ", money = " + money.toString() + ".");
      }

      costMultiplier.fromDecimal(costMults[tier].times(Decimal.pow(dimensionMultDecrease, postInfBuy + 1)));
      money = money.minus(newCost).max(0);
      cost = newCost.times(costMultiplier);
      costMultiplier.fromDecimal(costMultiplier.times(dimensionMultDecrease));
    }
    flushValues();
  }
  if ((Challenge(11).isRunning || player.currentChallenge === "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
  if (Challenge(2).isRunning) player.chall2Pow = 0;
  if (player.currentChallenge === "postc1") clearDimensions(tier - 1);
  onBuyDimension(tier);
}


function canAfford(cost) {
  return (player.break || cost.lt(new Decimal("1.79e308"))) && cost.lte(player.money);
}

function buyOneDimensionBtnClick(tier) {
  resetMatterOnBuy(tier);
  if (tier === 1) {
    if (buyOneDimension(1)) {
      // This achievement is granted only if the buy one button is pressed.
      if (player.firstAmount.gte(1e150)) {
        giveAchievement("There's no point in doing that");
      }
    }
    if (player.firstAmount.lt(1)) {
      player.money = new Decimal("0");
      player.firstAmount = player.firstAmount.plus(1);
      player.firstBought += 1;
      giveAchievement("You gotta start somewhere");
    }
    return;
  }
  buyOneDimension(tier);
}

function buyManyDimensionsBtnClick(tier) {
  resetMatterOnBuy(tier);
  buyManyDimension(tier);
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
  if (Challenge(12).isRunning) {
    if (tier === 2) amount = amount.pow(1.5);
    if (tier === 4) amount = amount.pow(1.3);
  }
  let production = amount.times(multiplier).dividedBy(Tickspeed.current.dividedBy(1000));
  if (Challenge(2).isRunning) {
    production = production.times(player.chall2Pow);
  }
  const postBreak = (player.break && player.currentChallenge === "") || player.currentChallenge.includes("post");
  if (!postBreak && production.gte(Number.MAX_VALUE)) {
    production = production.min("1e315");
  }
  if (tier === 1 && production.gt(0)) {
    const log10 = production.log10();
    production = Decimal.pow10(Math.sign(log10) * Math.pow(Math.abs(log10), getAdjustedGlyphEffect("effarigantimatter")));
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
      (tier > 6 && Challenge(12).isRunning)) {
      return new Decimal(0);
    }

    let toGain;
    if (tier === 7 && EternityChallenge(7).isRunning) {
      toGain = InfinityDimension(1).productionPerSecond.times(10);
    }
    else if (Challenge(12).isRunning) {
      toGain = getDimensionProductionPerSecond(tier + 2);
    }
    else {
      toGain = getDimensionProductionPerSecond(tier + 1);
    }
    return toGain.times(10).dividedBy(this.amount.max(1)).times(getGameSpeedupFactor());
  }

  /**
   * @returns {boolean}
   */
  get isAffordable() {
    if (this._tier >= 3 && Challenge(6).isRunning) {
      return NormalDimension(this._tier - 2).amount.gte(this.cost);
    } else {
      return canAfford(this.cost);
    }
  }

  /**
   * @returns {boolean}
   */
  get isAffordableUntil10() {
    if (this._tier >= 3 && Challenge(6).isRunning) {
      return NormalDimension(this._tier - 2).amount.gte(this.costUntil10);
    } else {
      return canAfford(this.costUntil10);
    }
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
