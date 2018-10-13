function getDimensionFinalMultiplier(tier) {
  //if (player.currentEternityChall == "eterc3" && tier > 4) return new Decimal(0)
  const name = TIER_NAMES[tier];

  let multiplier = new Decimal(player[name + 'Pow']);

  if (player.currentEternityChall === "eterc11") return player.infinityPower.pow(7 + getAdjustedGlyphEffect("infinityrate")).max(1).times(getDimensionBoostPower().pow(player.resets - tier + 1).max(1));
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

  let infinityUpgrades = player.infinityUpgrades;
  if (infinityUpgrades.includes("totalMult")) multiplier = multiplier.times(totalMult);
  if (infinityUpgrades.includes("currentMult")) multiplier = multiplier.times(currentMult);
  if (infinityUpgrades.includes("infinitiedMult")) multiplier = multiplier.times(infinitiedMult);
  if (infinityUpgrades.includes("achievementMult")) multiplier = multiplier.times(achievementMult);
  if (infinityUpgrades.includes("challengeMult")) multiplier = multiplier.times(challengeMult);

  if (hasInfinityMult(tier)) multiplier = multiplier.times(dimMults());
  if (tier === 1) {
    if (infinityUpgrades.includes("unspentBonus")) multiplier = multiplier.times(unspentBonus);
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
  if (timeStudies.includes(71) && tier !== 8) multiplier = multiplier.times(calcTotalSacrificeBoost().pow(0.25).min("1e210000"));
  if (timeStudies.includes(91)) multiplier = multiplier.times(Decimal.pow(10, Math.min(player.thisEternity / 100, 18000) / 60));
  if (timeStudies.includes(101)) multiplier = multiplier.times(Decimal.max(player.replicanti.amount, 1));
  if (timeStudies.includes(161)) multiplier = multiplier.times(new Decimal("1e616"));
  if (timeStudies.includes(234) && tier === 1) multiplier = multiplier.times(calcTotalSacrificeBoost());

  multiplier = multiplier.times(player.postC3Reward);
  if (player.challenges.includes("postc8") && tier < 8 && tier > 1) multiplier = multiplier.times(mult18);

  if (player.currentChallenge === "postc6") multiplier = multiplier.dividedBy(player.matter.max(1));
  if (player.currentChallenge === "postc8") multiplier = multiplier.times(postc8Mult);

  if (player.currentChallenge === "postc4" && player.postC4Tier !== tier) multiplier = multiplier.pow(0.25);
  if (player.challenges.includes("postc4")) multiplier = multiplier.pow(1.05);
  if (player.currentEternityChall === "eterc10") multiplier = multiplier.times(ec10bonus);
  if (timeStudies.includes(193)) multiplier = multiplier.times(Decimal.pow(1.03, player.eternities).min("1e13000"));
  if (tier === 8 && timeStudies.includes(214)) multiplier = multiplier.times((calcTotalSacrificeBoost().pow(8)).min("1e46000").times(calcTotalSacrificeBoost().pow(1.1).min(new Decimal("1e125000"))));
  if (multiplier.lt(1)) multiplier = new Decimal(1);

  multiplier = multiplier.times(glyphMultMultiplier).pow(glyphPowMultiplier);

  if (player.dilation.active) {
    multiplier = Decimal.pow(10, Math.pow(multiplier.log10(), 0.75));
    if (player.dilation.upgrades.includes(9)) {
      multiplier = Decimal.pow(10, Math.pow(multiplier.log10(), 1.05));
    }
    multiplier = multiplier.pow(glyphDilationPowMultiplier);
  }

  if (player.dilation.upgrades.includes(6)) multiplier = multiplier.times(player.dilation.dilatedTime.pow(308).max(1));


  return multiplier;
}


function getMoneyPerSecond() {
  return getDimensionFinalMultiplier(1) * Math.floor(player.firstAmount) / player.tickspeed;
}

function getDimensionDescription(tier) {
  const name = TIER_NAMES[tier];

  let description = shortenDimensions(player[name + 'Amount']) + ' (' + dimBought(tier) + ')';
  if (tier === 8) description = Math.round(player[name + 'Amount']) + ' (' + dimBought(tier) + ')';

  if (tier < 8) {
    description += '  (+' + shorten(getDimensionRateOfChange(tier)) + '%/s)';
  }

  return description;
}

function getDimensionRateOfChange(tier) {
  if (tier === 8 || (player.currentEternityChall === "eterc3" && tier > 3)) {
    return 0;
  }

  let toGain = getDimensionProductionPerSecond(tier + 1);
  if (tier === 7 && player.currentEternityChall === "eterc7") toGain = DimensionProduction(1).times(10);

  const name = TIER_NAMES[tier];
  if (player.currentChallenge === "challenge7") {
    if (tier === 7) return 0;
    else toGain = getDimensionProductionPerSecond(tier + 2);
  }
  const current = player[name + 'Amount'].max(1);
  const change = toGain.times(10).dividedBy(current);

  return change;
}

function hasInfinityMult(tier) {
  switch (tier) {
    case 1:
    case 8:
      return player.infinityUpgrades.includes("18Mult");
    case 2:
    case 7:
      return player.infinityUpgrades.includes("27Mult");
    case 3:
    case 6:
      return player.infinityUpgrades.includes("36Mult");
    case 4:
    case 5:
      return player.infinityUpgrades.includes("45Mult");
  }
}


function multiplySameCosts(cost) {
  const tiers = [null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight"];
  const tierCosts = [null, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)];

  for (let i = 1; i <= 8; ++i) {
    if (player[tiers[i] + "Cost"].e === cost.e) player[tiers[i] + "Cost"] = player[tiers[i] + "Cost"].times(tierCosts[i])

  }
  if (player.tickSpeedCost.e === cost.e) player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier)
}


function multiplyPC5Costs(cost, tier) {
  const tiers = [null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight"];

  if (tier < 5) {
    for (let i = 1; i < 9; i++) {
      if (player[tiers[i] + "Cost"].e <= cost.e) {
        player[tiers[i] + "Cost"] = player[tiers[i] + "Cost"].times(player.costMultipliers[i - 1]);
        if (player[tiers[i] + "Cost"].gte(Number.MAX_VALUE)) player.costMultipliers[i - 1] = player.costMultipliers[i - 1].times(10)
      }
    }
  } else {
    for (let i = 1; i < 9; i++) {
      if (player[tiers[i] + "Cost"].e >= cost.e) {
        player[tiers[i] + "Cost"] = player[tiers[i] + "Cost"].times(player.costMultipliers[i - 1]);
        if (player[tiers[i] + "Cost"].gte(Number.MAX_VALUE)) player.costMultipliers[i - 1] = player.costMultipliers[i - 1].times(10)
      }
    }
  }
}


function canBuyDimension(tier) {
  if (tier === 9) {
    return !player.secondAmount.equals(0);
  }

  if (!player.break && player.money.gt(Number.MAX_VALUE)) return false;
  if (tier > player.resets + 4) return false;
  if (tier > 1 && new DimensionStats(tier - 1).amount === 0 && player.eternities < 30) return false;
  return !((player.currentChallenge === "challenge4" || player.currentChallenge === "postc1") && tier >= 7);
}

function getDimensionPowerMultiplier(tier) {
  let dimMult = 2;


  if (player.currentChallenge === "challenge9" || player.currentChallenge === "postc1") dimMult = Math.pow(10 / 0.30, Math.random()) * 0.30;

  if (isAchEnabled("r141")) dimMult += 0.1;

  if (player.infinityUpgrades.includes('dimMult')) dimMult *= 1.1;
  if (isAchEnabled("r58")) dimMult *= 1.01;
  dimMult += ECTimesCompleted("eterc3") * 0.8;

  dimMult *= Math.max(1, getAdjustedGlyphEffect("powerbuy10"))

  return dimMult;
}


function clearDimensions(amount) {
  for (let i = 1; i <= amount; i++) {
    new DimensionStats(i).amount = new Decimal(0);
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
    floatText(name + "D", "x" + shortenMoney(getDimensionPowerMultiplier(tier)))
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
  floatText(name + "D", "x" + shortenMoney(getDimensionPowerMultiplier(tier)));
  onBuyDimension(tier);

  return true;
}


const initCost = [null, new Decimal(10), new Decimal(1e2), new Decimal(1e4), new Decimal(1e6), new Decimal(1e9), new Decimal(1e13), new Decimal(1e18), new Decimal(1e24)];
const costMults = [null, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)];

function buyManyDimensionAutobuyer(tier, bulk) {
  if (!canBuyDimension(tier)) return false;
  let money = new Decimal(player.money);
  if (money.eq(0)) return false;
  const dimension = new DimensionStats(tier);
  const boughtBefore10 = dimension.boughtBefore10;
  const remainingUntil10 = 10 - boughtBefore10;
  const costMultiplier = player.costMultipliers[tier - 1];
  const dimensionPowerMultiplier = getDimensionPowerMultiplier(tier);
  const dimensionCostMultiplier = getDimensionCostMultiplier(tier);
  const dimensionMultDecrease = player.dimensionMultDecrease;
  const costUntil10 = dimension.cost.times(remainingUntil10);

  if (tier >= 3 && (player.currentChallenge === "challenge10" || player.currentChallenge === "postc1")) {
    let lowerDimension = new DimensionStats(tier - 2);
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

      let newCost = postInfInitCost.times(Decimal.pow(costMults[tier], postInfBuy)).times(Decimal.pow(dimensionMultDecrease, postInfBuy * (postInfBuy + 1) / 2));

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
  return ((cost.lt(new Decimal("1.79e308")) && !player.break) || player.break) && cost.lte(player.money);
}

document.getElementById("first").onclick = function() {
  if (buyOneDimension(1)) {
    // This achievement is granted only if the buy one button is pressed.
    if (player.firstAmount >= 1e150) {
      giveAchievement("There's no point in doing that");
    }
    if ((player.currentChallenge === "challenge12" || player.currentChallenge === "postc1") && player.matter.equals(0)) player.matter = new Decimal(1);
  }
  if (player.firstAmount.lt(1)) {
    player.money = new Decimal("0");
    player.firstAmount = player.firstAmount.plus(1);
    player.firstBought += 1;
    giveAchievement("You gotta start somewhere");
  }
};

document.getElementById("second").onclick = function() {
  buyOneDimension(2);
  if ((player.currentChallenge === "challenge12" || player.currentChallenge === "postc1" || player.currentChallenge === "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
};

document.getElementById("third").onclick = function() {
  buyOneDimension(3);
  if ((player.currentChallenge === "challenge12" || player.currentChallenge === "postc1" || player.currentChallenge === "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
};

document.getElementById("fourth").onclick = function() {
  buyOneDimension(4);
  if ((player.currentChallenge === "challenge12" || player.currentChallenge === "postc1" || player.currentChallenge === "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
};

document.getElementById("fifth").onclick = function() {
  buyOneDimension(5);
};

document.getElementById("sixth").onclick = function() {
  buyOneDimension(6);
};

document.getElementById("seventh").onclick = function() {
  buyOneDimension(7);
};

document.getElementById("eight").onclick = function() {
  buyOneDimension(8);
};

document.getElementById("firstMax").onclick = function() {
  buyManyDimension(1);
  if ((player.currentChallenge === "challenge12" || player.currentChallenge === "postc1") && player.matter.equals(0)) player.matter = new Decimal(1);
};

document.getElementById("secondMax").onclick = function() {
  buyManyDimension(2);
  if ((player.currentChallenge === "challenge12" || player.currentChallenge === "postc1") && player.matter.equals(0)) player.matter = new Decimal(1);
};

document.getElementById("thirdMax").onclick = function() {
  buyManyDimension(3);
};

document.getElementById("fourthMax").onclick = function() {
  buyManyDimension(4);
};

document.getElementById("fifthMax").onclick = function() {
  buyManyDimension(5);
};

document.getElementById("sixthMax").onclick = function() {
  buyManyDimension(6);
};

document.getElementById("seventhMax").onclick = function() {
  buyManyDimension(7);
};

document.getElementById("eightMax").onclick = function() {
  buyManyDimension(8);
};


function timeMult() {
  let mult = new Decimal(1);
  if (player.infinityUpgrades.includes("timeMult")) mult = mult.times(Math.pow(player.totalTimePlayed / 120000, 0.15));
  if (player.infinityUpgrades.includes("timeMult2")) mult = mult.times(Decimal.max(Math.pow(player.thisInfinityTime / 240000, 0.25), 1));
  if (isAchEnabled("r76")) mult = mult.times(Math.pow(player.totalTimePlayed / (60000 * 60 * 48), 0.05));
  return mult;
}

function dimMults() {
  if (player.timestudy.studies.includes(31)) return Decimal.pow(1 + (getInfinitied() * 0.2), 4);
  else return new Decimal(1 + (getInfinitied() * 0.2))
}

function getDimensionProductionPerSecond(tier) {
  let ret = Decimal.floor(player[TIER_NAMES[tier] + 'Amount']).times(getDimensionFinalMultiplier(tier)).times(1000).dividedBy(player.tickspeed);
  if (player.currentChallenge === "challenge7") {
    if (tier === 4) ret = player[TIER_NAMES[tier] + 'Amount'].floor().pow(1.3).times(getDimensionFinalMultiplier(tier)).dividedBy(player.tickspeed.dividedBy(1000));
    else if (tier === 2) ret = player[TIER_NAMES[tier] + 'Amount'].floor().pow(1.5).times(getDimensionFinalMultiplier(tier)).dividedBy(player.tickspeed.dividedBy(1000))
  }
  if (player.currentChallenge === "challenge2" || player.currentChallenge === "postc1") ret = ret.times(player.chall2Pow);
  if (player.dilation.active) {
    let tick = new Decimal(player.tickspeed);
    tick = Decimal.pow(10, Math.pow(Math.abs(tick.log10()), 0.75));
    if (player.dilation.upgrades.includes(9)) {
      tick = Decimal.pow(10, Math.pow(Math.abs(tick.log10()), 1.05))
    }
    tick = new Decimal(1).dividedBy(tick);
    ret = Decimal.floor(player[TIER_NAMES[tier] + 'Amount']).times(getDimensionFinalMultiplier(tier)).times(1000).dividedBy(tick)
  }
  if (((player.currentChallenge !== "" && !player.currentChallenge.includes("post")) || !player.break) && ret.gte(Number.MAX_VALUE)) ret = ret.min("1e315");
  return ret;
}