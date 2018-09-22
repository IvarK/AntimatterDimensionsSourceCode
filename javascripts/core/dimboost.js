function getDimensionBoostPower() {
  if (player.currentChallenge == "challenge11" || player.currentChallenge == "postc1") return Decimal.fromNumber(1);

  var ret = 2
  if (player.infinityUpgrades.includes("resetMult")) ret = 2.5
  if (player.challenges.includes("postc7")) ret = 4
  if (player.currentChallenge == "postc7" || player.timestudy.studies.includes(81)) ret = 10

  if (isAchEnabled("r101")) ret *= 1.01
  if (isAchEnabled("r142")) ret *= 1.5
  for (i in player.reality.glyphs.active) {
    var glyph = player.reality.glyphs.active[i]
    if (glyph.type == "power" && glyph.effects.dimboost !== undefined) ret *= glyph.effects.dimboost
  }
  if (player.timestudy.studies.includes(83)) ret = Decimal.pow(1.0004, player.totalTickGained).min("1e30").times(ret);
  if (player.timestudy.studies.includes(231)) ret = Decimal.pow(player.resets, 0.3).max(1).times(ret)
  
  return Decimal.fromValue(ret)
}

function applyDimensionBoost() {
    var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];
    const power = getDimensionBoostPower();
    for (var i = 1; i <= 8; i++) {
        player[tiers[i] + "Pow"] = power.pow(player.resets + 1 - i).max(1)
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
        if (player.infinityUpgrades.includes("skipResetGalaxy")) {
            player.resets = 4;
            if (player.galaxies === 0) player.galaxies = 1
        }
        else if (player.infinityUpgrades.includes("skipReset3")) player.resets = 3;
        else if (player.infinityUpgrades.includes("skipReset2")) player.resets = 2;
        else if (player.infinityUpgrades.includes("skipReset1")) player.resets = 1;
    }
}

function hidePreMilestone30Elements() {
    if (player.eternities < 30) {
        document.getElementById("secondRow").style.display = "none";
        document.getElementById("thirdRow").style.display = "none";
        document.getElementById("tickSpeed").style.visibility = "hidden";
        document.getElementById("tickSpeedMax").style.visibility = "hidden";
        document.getElementById("tickLabel").style.visibility = "hidden";
        document.getElementById("tickSpeedAmount").style.visibility = "hidden";
        document.getElementById("fourthRow").style.display = "none";
        document.getElementById("fifthRow").style.display = "none";
        document.getElementById("sixthRow").style.display = "none";
        document.getElementById("seventhRow").style.display = "none";
        document.getElementById("eightRow").style.display = "none";
    }
}

function getShiftRequirement(bulk) {
    let maxShiftTier = player.currentChallenge === "challenge4" ? 6 : 8;
    let targetResets = player.resets + bulk;
    let tier = Math.min(targetResets + 4, maxShiftTier);
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

    if (player.infinityUpgrades.includes("resetBoost")) amount -= 9;
    if (player.challenges.includes("postc5")) amount -= 1;

    return { tier: tier, amount: amount };
}

function softResetBtnClick() {
  var name = TIER_NAMES[getShiftRequirement(0).tier]
  if ((!player.break && player.money.gt(Number.MAX_VALUE)) || player[name + "Amount"] < getShiftRequirement(0).amount) return;
  auto = false;
  if (player.infinityUpgrades.includes("bulkBoost")) maxBuyDimBoosts(true);
  else softReset(1)
  
  for (var tier = 1; tier<9; tier++) {
    var name = TIER_NAMES[tier];
    var mult = getDimensionBoostPower().pow(player.resets + 1 - tier)
    if (mult > 1) floatText(name + "D", "x" + shortenDimensions(mult))
  }
};

document.getElementById("softReset").onclick = softResetBtnClick;