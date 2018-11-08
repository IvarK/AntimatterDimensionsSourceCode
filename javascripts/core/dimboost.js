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
    if (player.currentChallenge === "challenge11" || player.currentChallenge === "postc1") {
      return Decimal.fromNumber(1);
    }

    let power = 2;
    InfinityUpgrade.dimboostMult.applyEffect(value => power = value);
    if (player.challenges.includes("postc7")) power = 4;
    if (player.currentChallenge === "postc7" || player.timestudy.studies.includes(81)) power = 10;

    if (isAchEnabled("r101")) power *= 1.01;
    if (isAchEnabled("r142")) power *= 1.5;
    power *= Math.max(1, getAdjustedGlyphEffect("powerdimboost"));
    if (player.timestudy.studies.includes(83)) power = Decimal.pow(1.0004, player.totalTickGained).min("1e30").times(power);
    if (player.timestudy.studies.includes(231)) power = Decimal.pow(player.resets, 0.3).max(1).times(power);

    return Decimal.fromValue(power);
  }

  static get maxShiftTier() {
    return player.currentChallenge === "challenge4" ? 6 : 8;
  }

  static get isShift() {
    // Player starts with 4 unlocked dimensions,
    // hence there are just 4 (or 2, if in Auto DimBoosts challenge) shifts
    return player.resets + 4 < this.maxShiftTier;
  }

  static get requirement() {
    return this.bulkRequirement(0);
  }

  static bulkRequirement(bulk) {
    let targetResets = player.resets + bulk;
    let tier = Math.min(targetResets + 4, this.maxShiftTier);
    let amount = 20;
    let mult = 15;
    if (player.timestudy.studies.includes(211)) mult -= 5;
    if (player.timestudy.studies.includes(222)) mult -= 2;

    if (tier === 6 && player.currentChallenge === "challenge4") {
      amount += Math.ceil((targetResets - 2) * 20);
    }
    else if (tier === 8) {
      amount += Math.ceil((targetResets - 4) * mult);
    }
    if (player.currentEternityChall === "eterc5") {
      amount += Math.pow(targetResets, 3) + targetResets;
    }

    InfinityUpgrade.resetBoost.applyEffect(value => amount -= value);
    if (player.challenges.includes("postc5")) amount -= 1;

    return new DimBoostRequirement(tier, amount);
  }
}

function applyDimensionBoost() {
    const power = DimBoost.power;
    for (let tier = 1; tier <= 8; tier++) {
        NormalDimension(tier).pow = power.pow(player.resets + 1 - tier).max(1);
    }
}

function softReset(bulk) {
    //if (bulk < 1) bulk = 1 (fixing issue 184)
    if (!player.break && player.money.gt(Number.MAX_VALUE)) return;
    player.resets += bulk;
    if (bulk >= 750) giveAchievement("Costco sells dimboosts now");

    /**
     * All reset stuff are in these functions now. (Hope this works)
     */
    player.sacrificed = new Decimal(0);
    resetChallengeStuff();
    resetDimensions();
    applyDimensionBoost();
    applyChallengeModifiers();
    skipResetsIfPossible();
    hidePreMilestone30Elements();
    resetTickspeed();
    updateTickSpeed();
    let currentMoney = player.money;
    resetMoney();
    if (isAchEnabled("r111")) {
        player.money = player.money.max(currentMoney);
    }
    if (player.resets >= 10) {
        giveAchievement("Boosting to the max");
    }
}

function applyChallengeModifiers() {
    if (player.currentChallenge === "challenge10" || player.currentChallenge === "postc1") {
        player.thirdCost = new Decimal(100);
        player.fourthCost = new Decimal(500);
        player.fifthCost = new Decimal(2500);
        player.sixthCost = new Decimal(2e4);
        player.seventhCost = new Decimal(2e5);
        player.eightCost = new Decimal(4e6);
    }
    if (player.currentChallenge === "postc1")
        player.costMultipliers = [new Decimal(1e3),new Decimal(5e3),new Decimal(1e4),new Decimal(1.2e4),new Decimal(1.8e4),new Decimal(2.6e4),new Decimal(3.2e4),new Decimal(4.2e4)];
    if (player.currentChallenge === "postc2") {
        player.eightAmount = new Decimal(1);
        player.eightBought = 1;
        player.resets = 4;
    }
}

function skipResetsIfPossible() {
    if (player.resets < 4 && player.currentChallenge === "") {
        if (InfinityUpgrade.skipResetGalaxy.isBought) {
            player.resets = 4;
            if (player.galaxies === 0) player.galaxies = 1
        }
        else if (InfinityUpgrade.skipReset3.isBought) player.resets = 3;
        else if (InfinityUpgrade.skipReset2.isBought) player.resets = 2;
        else if (InfinityUpgrade.skipReset1.isBought) player.resets = 1;
    }
}

function hidePreMilestone30Elements() {
    if (player.eternities < 30) {
        document.getElementById("tickSpeed").style.visibility = "hidden";
        document.getElementById("tickSpeedMax").style.visibility = "hidden";
        document.getElementById("tickLabel").style.visibility = "hidden";
        document.getElementById("tickSpeedAmount").style.visibility = "hidden";
    }
}

function softResetBtnClick() {
  if ((!player.break && player.money.gt(Number.MAX_VALUE)) || !DimBoost.requirement.isSatisfied) return;
  auto = false;
  if (player.infinityUpgrades.includes("bulkBoost")) maxBuyDimBoosts(true);
  else softReset(1)
  
  for (let tier = 1; tier<9; tier++) {
    const mult = DimBoost.power.pow(player.resets + 1 - tier);
    if (mult > 1) floatText(tier, "x" + shortenDimensions(mult));
  }
}