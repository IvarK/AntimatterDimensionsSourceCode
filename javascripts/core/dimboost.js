function getDimensionBoostPower() {
  if (player.currentChallenge == "challenge11" || player.currentChallenge == "postc1") return Decimal.fromNumber(1);

  var ret = 2
  if (player.infinityUpgrades.includes("resetMult")) ret = 2.5
  if (player.challenges.includes("postc7")) ret = 4
  if (player.currentChallenge == "postc7" || player.timestudy.studies.includes(81)) ret = 10

  if (isAchEnabled("r101")) ret = ret*1.01
  for (i in player.reality.glyphs.active) {
    var glyph = player.reality.glyphs.active[i]
    if (glyph.type == "power" && glyph.effects.dimboost !== undefined) ret *= glyph.effects.dimboost
  }
  if (player.timestudy.studies.includes(83)) ret = Decimal.pow(1.0004, player.totalTickGained).min("1e30").times(ret);
  if (player.timestudy.studies.includes(231)) ret = Decimal.pow(player.resets, 0.3).times(ret)
  
  return Decimal.fromValue(ret)
}

function applyDimensionBoost() {
    var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];
    for (var i = 1; i <= 8; i++) {
        player[tiers[i] + "Pow"] = getDimensionBoostPower().pow(player.resets + 1 - i).max(1)
    }
}

function softReset(bulk) {
  //if (bulk < 1) bulk = 1 (fixing issue 184)
  if (!player.break && player.money.gt(Number.MAX_VALUE)) return;
  player.resets+=bulk;
  if (bulk >= 750) giveAchievement("Costco sells dimboosts now");

  /**
   * All reset stuff are in these functions now. (Hope this works)
   */
  resetDimensions()
  resetTickspeed()
  applyDimensionBoost()
  resetChallengeStuff()
  player.money = isAchEnabled("r111") ? player.money : new Decimal(10)
  player.sacrificed = new Decimal(0)

  if (player.currentChallenge == "challenge10" || player.currentChallenge == "postc1") {
      player.thirdCost = new Decimal(100)
      player.fourthCost = new Decimal(500)
      player.fifthCost = new Decimal(2500)
      player.sixthCost = new Decimal(2e4)
      player.seventhCost = new Decimal(2e5)
      player.eightCost = new Decimal(4e6)
  }
  if (player.currentChallenge == "postc1") player.costMultipliers = [new Decimal(1e3),new Decimal(5e3),new Decimal(1e4),new Decimal(1.2e4),new Decimal(1.8e4),new Decimal(2.6e4),new Decimal(3.2e4),new Decimal(4.2e4)];
  if (player.resets == 1 && player.currentChallenge == "") {
      if (player.infinityUpgrades.includes("skipReset2")) player.resets++;
      if (player.infinityUpgrades.includes("skipReset3")) player.resets++;
      if (player.infinityUpgrades.includes("skipResetGalaxy")) {
          player.resets++;
          if (player.galaxies == 0) player.galaxies = 1
      }
  }
if (player.currentChallenge == "postc2") {
      player.eightAmount = new Decimal(1);
      player.eightBought = 1;
  }


  if (isAchEnabled("r36")) player.tickspeed = player.tickspeed.times(0.98);
  if (isAchEnabled("r45")) player.tickspeed = player.tickspeed.times(0.98);
  if (isAchEnabled("r66")) player.tickspeed = player.tickspeed.times(0.98);
  if (isAchEnabled("r83")) player.tickspeed = player.tickspeed.times(Decimal.pow(0.95,player.galaxies));


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

  updateTickSpeed()

  startMoneyCheck()
  if (player.resets >= 10) {
      giveAchievement("Boosting to the max");
  }
}


function getShiftRequirement(bulk) {
  let amount = 20;
  if (player.currentChallenge == "challenge4") {
      tier = Math.min(player.resets + bulk + 4, 6)
      if (tier == 6) amount += (player.resets+bulk - 2) * 20;
  } else {
      tier = Math.min(player.resets + bulk + 4, 8)
  }

  let mult = 15
  if (player.timestudy.studies.includes(211)) mult -= 5
  if (player.timestudy.studies.includes(222)) mult -= 2

  if (tier == 8) amount += Math.ceil((player.resets+bulk - 4) * mult);
  if (player.currentEternityChall == "eterc5") {
      amount += Math.pow(player.resets+bulk, 3) + player.resets+bulk
  }

  if (player.infinityUpgrades.includes("resetBoost")) amount -= 9;
  if (player.challenges.includes("postc5")) amount -= 1

  return { tier: tier, amount: amount };
}

document.getElementById("softReset").onclick = function () {
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

function setInitialDimensionPower () {
    player.firstPow = getDimensionBoostPower().pow(player.resets)
    player.secondPow = getDimensionBoostPower().pow(player.resets - 1).max(1)
    player.thirdPow = getDimensionBoostPower().pow(player.resets - 2).max(1)
    player.fourthPow = getDimensionBoostPower().pow(player.resets - 3).max(1)
    player.fifthPow = getDimensionBoostPower().pow(player.resets - 4).max(1)
    player.sixthPow = getDimensionBoostPower().pow(player.resets - 5).max(1)
    player.seventhPow = getDimensionBoostPower().pow(player.resets - 6).max(1)
    player.eightPow = getDimensionBoostPower().pow(player.resets - 7).max(1)
  }