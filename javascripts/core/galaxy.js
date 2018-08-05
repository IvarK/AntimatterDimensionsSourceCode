function getGalaxyCostScalingStart() {
  var n = 100 + ECTimesCompleted("eterc5")*5
  if (player.timestudy.studies.includes(223)) n += 7
  if (player.timestudy.studies.includes(224)) n += Math.floor(player.resets/2000)
  return n
}

function getGalaxyRequirement() {
  let amount = 80 + ((player.galaxies) * 60);
  if (player.timestudy.studies.includes(42)) amount = 80 + ((player.galaxies) * 52)
  if (player.currentChallenge == "challenge4") amount = 99 + ((player.galaxies) * 90)

  let galaxyCostScalingStart = getGalaxyCostScalingStart()
  if (player.currentEternityChall == "eterc5") {
      amount += Math.pow(player.galaxies, 2) + player.galaxies
  }
  else if ((player.galaxies) >= galaxyCostScalingStart) {
      amount += Math.pow((player.galaxies)-(galaxyCostScalingStart-1),2)+(player.galaxies)-(galaxyCostScalingStart-1)
  }
  if (player.galaxies >= 800) {
      amount = Math.floor(amount * Math.pow(1.002, (player.galaxies-799)))
  }

  if (player.infinityUpgrades.includes("resetBoost")) amount -= 9;
  if (player.challenges.includes("postc5")) amount -= 1;

  return amount;
}

document.getElementById("secondSoftReset").onclick = function() {
  if (player.currentEternityChall == "eterc6") return
  var bool = player.currentChallenge != "challenge11" && player.currentChallenge != "postc1" && player.currentChallenge != "postc7" && (player.break || player.money.lte(Number.MAX_VALUE))
  if (player.currentChallenge == "challenge4" ? player.sixthAmount >= getGalaxyRequirement() && bool : player.eightAmount >= getGalaxyRequirement() && bool) {
      if (player.eternities >= 7 && !shiftDown) maxBuyGalaxies(true);
      else galaxyReset();
  }
}

function galaxyReset() {

  if (autoS) auto = false;
  autoS = true;
  if (player.sacrificed == 0) giveAchievement("I don't believe in Gods");
  player = {
      money: isAchEnabled("r111") ? player.money : new Decimal(10),
      tickSpeedCost: new Decimal(1000),
      tickspeed: new Decimal(1000),
      firstCost: new Decimal(10),
      secondCost: new Decimal(100),
      thirdCost: new Decimal(10000),
      fourthCost: new Decimal(1000000),
      fifthCost: new Decimal(1e9),
      sixthCost: new Decimal(1e13),
      seventhCost: new Decimal(1e18),
      eightCost: new Decimal(1e24),
      firstAmount: new Decimal(0),
      secondAmount: new Decimal(0),
      thirdAmount: new Decimal(0),
      fourthAmount: new Decimal(0),
      firstBought: 0,
      secondBought: 0,
      thirdBought: 0,
      fourthBought: 0,
      fifthAmount: new Decimal(0),
      sixthAmount: new Decimal(0),
      seventhAmount: new Decimal(0),
      eightAmount: new Decimal(0),
      fifthBought: 0,
      sixthBought: 0,
      seventhBought: 0,
      eightBought: 0,
      firstPow: new Decimal(1),
      secondPow: new Decimal(1),
      thirdPow: new Decimal(1),
      fourthPow: new Decimal(1),
      fifthPow: new Decimal(1),
      sixthPow: new Decimal(1),
      seventhPow: new Decimal(1),
      eightPow: new Decimal(1),
      sacrificed: new Decimal(0),
      achievements: player.achievements,
      challenges: player.challenges,
      currentChallenge: player.currentChallenge,
      infinityUpgrades: player.infinityUpgrades,
      infinityPoints: player.infinityPoints,
      infinitied: player.infinitied,
      infinitiedBank: player.infinitiedBank,
      totalTimePlayed: player.totalTimePlayed,
      realTimePlayed: player.realTimePlayed,
      bestInfinityTime: player.bestInfinityTime,
      thisInfinityTime: player.thisInfinityTime,
      resets: 0,
      galaxies: player.galaxies + 1,
      totalmoney: player.totalmoney,
      tickDecrease: player.tickDecrease - 0.03,
      interval: null,
      lastUpdate: player.lastUpdate,
      achPow: player.achPow,
      newsArray: player.newsArray,
      autobuyers: player.autobuyers,
      costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
      tickspeedMultiplier: new Decimal(10),
      chall2Pow: player.chall2Pow,
      chall3Pow: new Decimal(0.01),
      matter: new Decimal(0),
      chall11Pow: new Decimal(1),
      partInfinityPoint: player.partInfinityPoint,
      partInfinitied: player.partInfinitied,
      break: player.break,
      challengeTimes: player.challengeTimes,
      infchallengeTimes: player.infchallengeTimes,
      lastTenRuns: player.lastTenRuns,
      lastTenEternities: player.lastTenEternities,
      lastTenRealities: player.lastTenRealities,
      infMult: player.infMult,
      infMultCost: player.infMultCost,
      tickSpeedMultDecrease: player.tickSpeedMultDecrease,
      tickSpeedMultDecreaseCost: player.tickSpeedMultDecreaseCost,
      dimensionMultDecrease: player.dimensionMultDecrease,
      dimensionMultDecreaseCost: player.dimensionMultDecreaseCost,
      version: player.version,
      overXGalaxies: player.overXGalaxies,
      spreadingCancer: player.spreadingCancer,
      infDimensionsUnlocked: player.infDimensionsUnlocked,
      infinityPower: player.infinityPower,
      postChallUnlocked: player.postChallUnlocked,
      postC4Tier: 1,
      postC3Reward: new Decimal(1),
      infinityDimension1: player.infinityDimension1,
      infinityDimension2: player.infinityDimension2,
      infinityDimension3: player.infinityDimension3,
      infinityDimension4: player.infinityDimension4,
      infinityDimension5: player.infinityDimension5,
      infinityDimension6: player.infinityDimension6,
      infinityDimension7: player.infinityDimension7,
      infinityDimension8: player.infinityDimension8,
      infDimBuyers: player.infDimBuyers,
      timeShards: player.timeShards,
      tickThreshold: player.tickThreshold,
      timeDimension1: player.timeDimension1,
      timeDimension2: player.timeDimension2,
      timeDimension3: player.timeDimension3,
      timeDimension4: player.timeDimension4,
      timeDimension5: player.timeDimension5,
      timeDimension6: player.timeDimension6,
      timeDimension7: player.timeDimension7,
      timeDimension8: player.timeDimension8,
      eternityPoints: player.eternityPoints,
      eternities: player.eternities,
      thisEternity: player.thisEternity,
      bestEternity: player.bestEternity,
      eternityUpgrades: player.eternityUpgrades,
      epmult: player.epmult,
      epmultCost: player.epmultCost,
      totalTickGained: player.totalTickGained,
      offlineProd: player.offlineProd,
      offlineProdCost: player.offlineProdCost,
      challengeTarget: player.challengeTarget,
      autoSacrifice: player.autoSacrifice,
      replicanti: player.replicanti,
      timestudy: player.timestudy,
      eternityChalls: player.eternityChalls,
      eternityChallGoal: player.eternityChallGoal,
      currentEternityChall: player.currentEternityChall,
      eternityChallUnlocked: player.eternityChallUnlocked,
      etercreq: player.etercreq,
      autoIP: player.autoIP,
      autoTime: player.autoTime,
      infMultBuyer: player.infMultBuyer,
      autoCrunchMode: player.autoCrunchMode,
      respec: player.respec,
      eternityBuyer: player.eternityBuyer,
      eterc8ids: player.eterc8ids,
      eterc8repl: player.eterc8repl,
      dimlife: player.dimlife,
      dead: player.dead,
      dilation: player.dilation,
      secretUnlocks: player.secretUnlocks,
      realities: player.realities,
      thisReality: player.thisReality,
      bestReality: player.bestReality,
      reality: player.reality,
      wormhole: player.wormhole,
      options: player.options
  };

  if (player.currentChallenge == "challenge10" || player.currentChallenge == "postc1") {
      player.thirdCost = new Decimal(100)
      player.fourthCost = new Decimal(500)
      player.fifthCost = new Decimal(2500)
      player.sixthCost = new Decimal(2e4)
      player.seventhCost = new Decimal(2e5)
      player.eightCost = new Decimal(4e6)
  }

  if (player.resets == 0 && player.currentChallenge == "") {
      if (player.infinityUpgrades.includes("skipReset1")) player.resets++;
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
      player.resets = 4;
  }

  setInitialDimensionPower();


  if (player.options.notation == "Cancer") player.spreadingCancer+=1;
  if (player.spreadingCancer >= 10) giveAchievement("Spreading Cancer")
  if (player.spreadingCancer >= 100000) giveAchievement("Cancer = Spread")
  if (isAchEnabled("r36")) player.tickspeed = player.tickspeed.times(0.98);
  if (isAchEnabled("r45")) player.tickspeed = player.tickspeed.times(0.98);
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

  if (player.galaxies >= 50) giveAchievement("YOU CAN GET 50 GALAXIES!??")
  if (player.galaxies >= 2) giveAchievement("Double Galaxy");
  if (player.galaxies >= 1) giveAchievement("You got past The Big Wall");
  if (player.challenges.includes("challenge1")) player.money = new Decimal(100).max(player.money)
  if (isAchEnabled("r21")) player.money = new Decimal(100).max(player.money);
  if (isAchEnabled("r37")) player.money = new Decimal(1000).max(player.money);
  if (isAchEnabled("r54")) player.money = new Decimal(2e5).max(player.money);
  if (isAchEnabled("r55")) player.money = new Decimal(1e10).max(player.money);
  if (isAchEnabled("r78")) player.money = new Decimal(1e25).max(player.money);
  player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), player.totalTickGained))
  if (isAchEnabled("r66")) player.tickspeed = player.tickspeed.times(0.98);
  if (player.galaxies >= 630 && player.replicanti.galaxies == 0) giveAchievement("Unique snowflakes")
  updateTickSpeed();
};