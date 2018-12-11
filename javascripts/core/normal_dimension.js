function getDimensionFinalMultiplier(tier) {
  //if (player.currentEternityChall == "eterc3" && tier > 4) return new Decimal(0)
  const name = TIER_NAMES[tier];
  const dim = NormalDimension(tier);

  let multiplier = new Decimal(player[name + 'Pow']);

  if (player.currentEternityChall === "eterc11") return player.infinityPower.pow(7 + getAdjustedGlyphEffect("infinityrate")).max(1).times(DimBoost.power.pow(player.resets - tier + 1).max(1));
  if (player.currentChallenge === "challenge7") {
    if (tier === 4) multiplier = multiplier.pow(1.4);
    if (tier === 2) multiplier = multiplier.pow(1.7)
  }

  if (isAchEnabled("r11")) multiplier = multiplier.times(player.achPow);
  multiplier = multiplier.times(kongDimMult);
  multiplier = multiplier.times(kongAllDimMult);
  let glyphConversionRate = 7 + getAdjustedGlyphEffect("infinityrate");
  let glyphMultMultiplier = new Decimal(1).max(getAdjustedGlyphEffect("powermult"));
  let glyphPowMultiplier = new Decimal(1).max(getAdjustedGlyphEffect("powerpow"));
  let glyphDilationPowMultiplier = new Decimal(1).max(getAdjustedGlyphEffect("dilationpow"));

  if (player.currentEternityChall === "eterc9") multiplier = multiplier;
  else multiplier = multiplier.times(player.infinityPower.pow(glyphConversionRate).max(1));

  let infinityUpgrades = [
    BreakInfinityUpgrade.totalAMMult,
    BreakInfinityUpgrade.currentAMMult,
    BreakInfinityUpgrade.achievementMult,
    BreakInfinityUpgrade.slowestChallengeMult
  ];
  for (let upgrade of infinityUpgrades) {
    upgrade.apply(value => multiplier = multiplier.times(value));
  }

  let infinitiedMult = new Decimal(1);
  dim.infinityUpgrade.apply(value => infinitiedMult = infinitiedMult.times(value));
  BreakInfinityUpgrade.infinitiedMult.apply(value => infinitiedMult = infinitiedMult.times(value));
  if (player.timestudy.studies.includes(31)) {
    infinitiedMult = infinitiedMult.pow(4);
  }
  multiplier = multiplier.times(infinitiedMult);
  if (tier === 1) {
    InfinityUpgrade.unspentIPMult.apply(value => multiplier = multiplier.times(value));
    if (isAchEnabled("r28")) multiplier = multiplier.times(1.1);
    if (isAchEnabled("r31")) multiplier = multiplier.times(1.05);
    if (isAchEnabled("r71")) multiplier = multiplier.times(3);
    if (isAchEnabled("r68")) multiplier = multiplier.times(1.5);
  }

  multiplier = multiplier.times(timeMult());
  if (tier === 8 && isAchEnabled("r23")) multiplier = multiplier.times(1.1);
  else if (isAchEnabled("r34")) multiplier = multiplier.times(1.02);
  if (tier <= 4 && isAchEnabled("r43")) multiplier = multiplier.times(1.25);
  if (isAchEnabled("r48")) multiplier = multiplier.times(1.1);
  if (isAchEnabled("r72")) multiplier = multiplier.times(1.1); // tbd
  if (isAchEnabled("r74") && player.currentChallenge !== "") multiplier = multiplier.times(1.4);
  if (isAchEnabled("r77")) multiplier = multiplier.times(1 + tier / 100);

  const thisInfinityTime = player.thisInfinityTime;
  if (isAchEnabled("r56") && thisInfinityTime < 180000) multiplier = multiplier.times(360000 / (thisInfinityTime + 180000));
  if (isAchEnabled("r78") && thisInfinityTime < 300) multiplier = multiplier.times(330 / (thisInfinityTime + 30));
  if (isAchEnabled("r65") && player.currentChallenge !== "" && thisInfinityTime < 180000) multiplier = multiplier.times(Math.max(240000 / (thisInfinityTime + 60000), 1));
  if (isAchEnabled("r91") && thisInfinityTime < 5000) multiplier = multiplier.times(Math.max(301 - thisInfinityTime / 100 * 6, 1));
  if (isAchEnabled("r92") && thisInfinityTime < 60000) multiplier = multiplier.times(Math.max(101 - thisInfinityTime / 100 / 6, 1));
  if (isAchEnabled("r84")) multiplier = multiplier.times(player.money.pow(0.00004).plus(1));
  else if (isAchEnabled("r73")) multiplier = multiplier.times(player.money.pow(0.00002).plus(1));


  let timeStudies = player.timestudy.studies;
  if (timeStudies.includes(71) && tier !== 8) multiplier = multiplier.times(Sacrifice.totalBoost.pow(0.25).min("1e210000"));
  if (timeStudies.includes(91)) multiplier = multiplier.times(Decimal.pow(10, Math.min(player.thisEternity / 100, 18000) / 60));
  if (timeStudies.includes(101)) multiplier = multiplier.times(Decimal.max(player.replicanti.amount, 1));
  if (timeStudies.includes(161)) multiplier = multiplier.times(new Decimal("1e616"));
  if (timeStudies.includes(234) && tier === 1) multiplier = multiplier.times(Sacrifice.totalBoost);

  multiplier = multiplier.times(player.postC3Reward);
  if (player.challenges.includes("postc8") && tier < 8 && tier > 1) multiplier = multiplier.times(mult18);

  if (player.currentChallenge === "postc6") multiplier = multiplier.dividedBy(player.matter.max(1));
  if (player.currentChallenge === "postc8") multiplier = multiplier.times(postc8Mult);

  if (player.currentChallenge === "postc4" && player.postC4Tier !== tier) multiplier = multiplier.pow(0.25);
  if (player.challenges.includes("postc4")) multiplier = multiplier.pow(1.05);
  if (player.currentEternityChall === "eterc10") multiplier = multiplier.times(ec10bonus);
  if (timeStudies.includes(193)) multiplier = multiplier.times(Decimal.pow(1.03, player.eternities).min("1e13000"));
  if (tier === 8 && timeStudies.includes(214)) multiplier = multiplier.times((Sacrifice.totalBoost.pow(8)).min("1e46000").times(Sacrifice.totalBoost.pow(1.1).min(new Decimal("1e125000"))));
  if (multiplier.lt(1)) multiplier = new Decimal(1);

  multiplier = multiplier.times(glyphMultMultiplier).pow(glyphPowMultiplier);

  if (player.dilation.active) {
    multiplier = dilatedValueOf(multiplier.pow(glyphDilationPowMultiplier));
  }

  if (player.dilation.upgrades.includes(6)) multiplier = multiplier.times(player.dilation.dilatedTime.pow(308).max(1));


  return multiplier;
}

function multiplySameCosts(cost) {
  const tierCosts = [null, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)];

  for (let i = 1; i <= 8; ++i) {
    if (player[TIER_NAMES[i] + "Cost"].e === cost.e) player[TIER_NAMES[i] + "Cost"] = player[TIER_NAMES[i] + "Cost"].times(tierCosts[i])

  }
  if (player.tickSpeedCost.e === cost.e) player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier)
}


function multiplyPC5Costs(cost, tier) {
  if (tier < 5) {
    for (let i = 1; i < 9; i++) {
      if (player[TIER_NAMES[i] + "Cost"].e <= cost.e) {
        player[TIER_NAMES[i] + "Cost"] = player[TIER_NAMES[i] + "Cost"].times(player.costMultipliers[i - 1]);
        if (player[TIER_NAMES[i] + "Cost"].gte(Number.MAX_VALUE)) player.costMultipliers[i - 1] = player.costMultipliers[i - 1].times(10)
      }
    }
  } else {
    for (let i = 1; i < 9; i++) {
      if (player[TIER_NAMES[i] + "Cost"].e >= cost.e) {
        player[TIER_NAMES[i] + "Cost"] = player[TIER_NAMES[i] + "Cost"].times(player.costMultipliers[i - 1]);
        if (player[TIER_NAMES[i] + "Cost"].gte(Number.MAX_VALUE)) player.costMultipliers[i - 1] = player.costMultipliers[i - 1].times(10)
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
  return !((player.currentChallenge === "challenge4" || player.currentChallenge === "postc1") && tier >= 7);
}

function getDimensionPowerMultiplier(tier) {
  let dimMult = 2;


  if (player.currentChallenge === "challenge9" || player.currentChallenge === "postc1") dimMult = Math.pow(10 / 0.30, Math.random()) * 0.30;

  if (isAchEnabled("r141")) dimMult += 0.1;

  InfinityUpgrade.buy10Mult.apply(value => dimMult *= value);
  if (isAchEnabled("r58")) dimMult *= 1.01;
  EternityChallenge(3).applyReward(value => dimMult += value);

  dimMult *= Math.max(1, getAdjustedGlyphEffect("powerbuy10"))

  return dimMult;
}


function clearDimensions(amount) {
  for (let i = 1; i <= amount; i++) {
    NormalDimension(i).amount = new Decimal(0);
  }
}


function getDimensionCostMultiplier(tier) {

  const multiplier2 = [new Decimal(1e3), new Decimal(5e3), new Decimal(1e4), new Decimal(1.2e4), new Decimal(1.8e4), new Decimal(2.6e4), new Decimal(3.2e4), new Decimal(4.2e4)];
  if (player.currentChallenge === "challenge10") return multiplier2[tier - 1];
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

function dimBought(tier) {
  return player[TIER_NAMES[tier] + "Bought"] % 10;
}

function buyOneDimension(tier) {
  const name = TIER_NAMES[tier];
  const cost = player[name + 'Cost'];
  auto = false;

  if (player.currentChallenge !== "challenge10" && player.currentChallenge !== "postc1") {
    if (!canBuyDimension(tier)) {
      return false;
    }
  } else {
    if (tier >= 3) {
      if (player[TIER_NAMES[tier - 2] + 'Amount'].lt(cost)) return false
    }
    else if (!canBuyDimension(tier)) {
      return false;
    } else if (tier < 3 && !canAfford(cost)) {
      return false;
    }
  }


  if (player.currentChallenge !== "challenge10" && player.currentChallenge !== "postc1") {
    if (!canAfford(cost)) {
      return false;
    }
  }


  if ((player.currentChallenge !== "challenge10" && player.currentChallenge !== "postc1") || tier < 3) {
    player.money = player.money.minus(cost);
  } else {
    player[TIER_NAMES[tier - 2] + 'Amount'] = player[TIER_NAMES[tier - 2] + 'Amount'].minus(cost)
  }

  player[name + 'Amount'] = player[name + 'Amount'].plus(1);
  player[name + 'Bought']++;

  if (dimBought(tier) === 0) {
    player[name + 'Pow'] = player[name + 'Pow'].times(getDimensionPowerMultiplier(tier));
    if (player.currentChallenge !== "challenge5" && player.currentChallenge !== "postc5") player[name + 'Cost'] = player[name + 'Cost'].times(getDimensionCostMultiplier(tier));
    else if (player.currentChallenge === "postc5") multiplyPC5Costs(player[name + 'Cost'], tier);
    else multiplySameCosts(cost);
    if (player[name + 'Cost'].gte(Number.MAX_VALUE)) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(player.dimensionMultDecrease);
    floatText(tier, "x" + shortenMoney(getDimensionPowerMultiplier(tier)))
  }

  if (player.currentChallenge === "challenge2" || player.currentChallenge === "postc1") player.chall2Pow = 0;
  if (player.currentChallenge === "challenge8" || player.currentChallenge === "postc1") clearDimensions(tier - 1);

  onBuyDimension(tier);


  return true;
}

function buyManyDimension(tier) {
  const name = TIER_NAMES[tier];
  const cost = player[name + 'Cost'].times(10 - dimBought(tier));

  auto = false;

  if ((player.currentChallenge === "challenge12" || player.currentChallenge === "postc1" || player.currentChallenge === "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
  if (player.currentChallenge !== "challenge10" && player.currentChallenge !== "postc1") {
    if (!canBuyDimension(tier)) {
      return false;
    }
  } else {
    if (tier >= 3) {
      if (!canBuyDimension(tier)) return false;
      if (player[TIER_NAMES[tier - 2] + 'Amount'].lt(cost)) return false
    }
    else if (!canBuyDimension(tier)) {
      return false;
    } else if (tier < 3 && !canAfford(cost)) {
      return false;
    }
  }


  if (player.currentChallenge !== "challenge10" && player.currentChallenge !== "postc1") {
    if (!canAfford(cost)) {
      return false;
    }
  }

  if ((player.currentChallenge !== "challenge10" && player.currentChallenge !== "postc1") || tier < 3) {
    player.money = player.money.minus(cost);
  } else {
    player[TIER_NAMES[tier - 2] + 'Amount'] = player[TIER_NAMES[tier - 2] + 'Amount'].minus(cost)
  }

  player[name + 'Amount'] = player[name + 'Amount'].plus(10 - dimBought(tier));
  player[name + 'Bought'] = player[name + 'Bought'] + (10 - dimBought(tier));
  player[name + 'Pow'] = player[name + 'Pow'].times(getDimensionPowerMultiplier(tier));
  if (player.currentChallenge !== "challenge5" && player.currentChallenge !== "postc5") player[name + 'Cost'] = player[name + 'Cost'].times((getDimensionCostMultiplier(tier)));
  else if (player.currentChallenge === "postc5") multiplyPC5Costs(player[name + 'Cost'], tier);
  else multiplySameCosts(player[name + 'Cost']);
  if (player[name + 'Cost'].gte(Number.MAX_VALUE)) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(player.dimensionMultDecrease);
  if (player.currentChallenge === "challenge2" || player.currentChallenge === "postc1") player.chall2Pow = 0;
  if (player.currentChallenge === "challenge8" || player.currentChallenge === "postc1") clearDimensions(tier - 1);
  floatText(tier, "x" + shortenMoney(getDimensionPowerMultiplier(tier)));
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
  const dimensionPowerMultiplier = getDimensionPowerMultiplier(tier);
  const dimensionCostMultiplier = getDimensionCostMultiplier(tier);
  const dimensionMultDecrease = player.dimensionMultDecrease;
  const costUntil10 = dimension.cost.times(remainingUntil10);

  if (tier >= 3 && (player.currentChallenge === "challenge10" || player.currentChallenge === "postc1")) {
    let lowerDimension = NormalDimension(tier - 2);
    if (lowerDimension.amount.lt(costUntil10)) return false;
    if (costUntil10.lt(lowerDimension.amount) && boughtBefore10 !== 0) {
      lowerDimension.amount = lowerDimension.amount.minus(costUntil10);
      dimension.amount = Decimal.round(dimension.amount.plus(remainingUntil10));
      dimension.bought += remainingUntil10;
      dimension.pow = dimension.pow.times(dimensionPowerMultiplier);
      dimension.cost = dimension.cost.times(dimensionCostMultiplier)
    }
    let x = bulk;
    while (lowerDimension.amount.gt(dimension.cost.times(10)) && x > 0) {
      lowerDimension.amount = lowerDimension.amount.minus(dimension.cost.times(10));
      dimension.cost = dimension.cost.times(dimensionCostMultiplier);
      dimension.amount = Decimal.round(dimension.amount.plus(10));
      dimension.bought += 10;
      dimension.pow = dimension.pow.times(dimensionPowerMultiplier);
      if (dimension.cost.gte(Number.MAX_VALUE)) costMultiplier.fromDecimal(costMultiplier.times(dimensionMultDecrease));
      x--;
    }
    onBuyDimension(tier);
    return true;
  }
  if (costUntil10.lt(player.money) && boughtBefore10 !== 0) {
    player.money = player.money.minus(costUntil10);
    dimension.amount = Decimal.round(dimension.amount.plus(remainingUntil10));
    dimension.bought += remainingUntil10;
    dimension.pow = dimension.pow.times(dimensionPowerMultiplier);
    dimension.cost = dimension.cost.times(dimensionCostMultiplier)
  }
  if (player.money.lt(dimension.cost.times(10))) return false;
  let x = bulk;

  if ((dimensionMultDecrease > 3 || player.currentChallenge === "postc5" || player.currentChallenge === "challenge5")) {
    while (player.money.gte(dimension.cost.times(10)) && x > 0) {
      player.money = player.money.minus(dimension.cost.times(10));
      if (player.currentChallenge === "postc5") multiplyPC5Costs(dimension.cost, tier);
      else if (player.currentChallenge === "challenge5") multiplySameCosts(dimension.cost);
      else dimension.cost = dimension.cost.times(dimensionCostMultiplier);
      dimension.amount = Decimal.round(dimension.amount.plus(10));
      dimension.bought += 10;
      dimension.pow = dimension.pow.times(dimensionPowerMultiplier);
      if (dimension.cost.gte(Number.MAX_VALUE)) costMultiplier.fromDecimal(costMultiplier.times(dimensionMultDecrease));
      if (player.currentChallenge === "challenge8") clearDimensions(tier - 1);
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
    if (dimension.cost.lt(Number.MAX_VALUE)) {
      let failsafe = 0;
      while (money.gte(cost.times(10)) && x > 0 && cost.lte(Number.MAX_VALUE) && failsafe < 150) {
        money = money.minus(cost.times(10));
        if (player.currentChallenge === "postc5") multiplyPC5Costs(cost, tier);
        else if (player.currentChallenge === "challenge5") multiplySameCosts(cost);
        else cost = cost.times(dimensionCostMultiplier);
        amount = amount.plus(10).round();
        bought += 10;
        pow.fromDecimal(pow.times(dimensionPowerMultiplier));
        if (cost.gte(Number.MAX_VALUE)) costMultiplier.fromDecimal(costMultiplier.times(dimensionMultDecrease));
        if (player.currentChallenge === "challenge8") clearDimensions(tier - 1);
        x--;
        failsafe++;
      }
    }
    if (cost.gte(Number.MAX_VALUE)) {
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
      let preInfBuy = Math.floor(1 + (308 - initCost[tier].log10()) / costMults[tier].log10());
      let postInfBuy = bought / 10 + buying - preInfBuy - 1;
      let postInfInitCost = initCost[tier].times(Decimal.pow(costMults[tier], preInfBuy));
      bought += 10 * buying;
      pow = pow.times(Decimal.pow(dimensionPowerMultiplier, buying));

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
  if ((player.currentChallenge === "challenge12" || player.currentChallenge === "postc1" || player.currentChallenge === "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
  if (player.currentChallenge === "challenge2" || player.currentChallenge === "postc1") player.chall2Pow = 0;
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
      if (player.firstAmount >= 1e150) {
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
  function isInMatterChallenge() {
    return player.currentChallenge === "challenge12" ||
      player.currentChallenge === "postc1" ||
      player.currentChallenge === "postc6";
  }
  if (tier < 5 && isInMatterChallenge() && player.matter.equals(0)) {
    player.matter = new Decimal(1);
  }
}

function timeMult() {
  let mult = new Decimal(1);
  InfinityUpgrade.totalTimeMult.apply(value => mult = mult.times(value));
  InfinityUpgrade.thisInfinityTimeMult.apply(value => mult = mult.times(value));
  if (isAchEnabled("r76")) mult = mult.times(Math.pow(player.totalTimePlayed / (60000 * 60 * 48), 0.05));
  return mult;
}

function getDimensionProductionPerSecond(tier) {
  const multiplier = getDimensionFinalMultiplier(tier);
  const dimension = NormalDimension(tier);
  let amount = dimension.amount.floor();
  if (player.currentChallenge === "challenge7") {
    if (tier === 2) amount = amount.pow(1.5);
    if (tier === 4) amount = amount.pow(1.3);
  }
  const tickspeed = player.dilation.active ? dilatedTickspeed() : player.tickspeed;
  let production = amount.times(multiplier).dividedBy(tickspeed.dividedBy(1000));
  if (player.currentChallenge === "challenge2" || player.currentChallenge === "postc1") {
    production = production.times(player.chall2Pow);
  }
  const postBreak = (player.break && player.currentChallenge === "") || player.currentChallenge.includes("post");
  if (!postBreak && production.gte(Number.MAX_VALUE)) {
    production = production.min("1e315");
  }
  return production;
}

class NormalDimensionInfo {
  constructor(tier) {
    const tierProps = NormalDimensionInfo.tierProps;
    let props = tierProps[tier];
    if (props === undefined) {
      const name = TIER_NAMES[tier];
      props = {
        cost: name + "Cost",
        amount: name + "Amount",
        bought: name + "Bought",
        pow: name + "Pow",
      };
      tierProps[tier] = props;
    }
    this._tier = tier;
    this._props = props;
    this._player = player;
  }


  /**
   * @returns {Decimal}
   */
  get cost() {
    return this._player[this._props.cost];
  }


  /**
   * @param {Decimal} value
   */
  set cost(value) {
    this._player[this._props.cost] = value;
  }

  /**
   * @returns {Decimal}
   */
  get amount() {
    return this._player[this._props.amount];
  }

  /**
   * @param {Decimal} value
   */
  set amount(value) {
    this._player[this._props.amount] = value;
  }

  /**
   * @returns {number}
   */
  get bought() {
    return this._player[this._props.bought];
  }

  /**
   * @param {number} value
   */
  set bought(value) {
    this._player[this._props.bought] = value;
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
    return this._player[this._props.pow];
  }

  /**
   * @param {Decimal} value
   */
  set pow(value) {
    this._player[this._props.pow] = value;
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
      (tier > 4 && player.currentEternityChall === "eterc3") ||
      (tier > 6 && player.currentChallenge === "challenge7")) {
      return new Decimal(0);
    }

    let toGain;
    if (tier === 7 && player.currentEternityChall === "eterc7") {
      toGain = InfinityDimension(1).productionPerSecond.times(10);
    }
    else if (player.currentChallenge === "challenge7") {
      toGain = getDimensionProductionPerSecond(tier + 2);
    }
    else {
      toGain = getDimensionProductionPerSecond(tier + 1);
    }
    return toGain.times(10).dividedBy(this.amount.max(1));
  }

  /**
   * @returns {boolean}
   */
  get isAffordable() {
    if (this._isAffectedByChallenge10) {
      return NormalDimension(this._tier - 2).amount.gte(this.cost);
    } else {
      return canAfford(this.cost);
    }
  }

  /**
   * @returns {boolean}
   */
  get isAffordableUntil10() {
    if (this._isAffectedByChallenge10) {
      return NormalDimension(this._tier - 2).amount.gte(this.costUntil10);
    } else {
      return canAfford(this.costUntil10);
    }
  }

  get _isAffectedByChallenge10() {
    return this._tier >= 3 && (player.currentChallenge === "challenge10" || player.currentChallenge === "postc1");
  }
}

NormalDimensionInfo.tierProps = [];

function NormalDimension(tier) {
  return new NormalDimensionInfo(tier);
}
