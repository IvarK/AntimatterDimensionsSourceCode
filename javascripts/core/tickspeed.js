function canBuyTickSpeed() {
  if (player.currentEternityChall == "eterc9") return false
  return canBuyDimension(3);
}

function getTickSpeedMultiplier() {
  if (player.currentChallenge == "postc3") return 1;
  let galaxies = player.galaxies+player.replicanti.galaxies+player.dilation.freeGalaxies
  if (player.timestudy.studies.includes(133)) galaxies += player.replicanti.galaxies/2
  if (player.timestudy.studies.includes(132)) galaxies += player.replicanti.galaxies*0.4
  if (player.timestudy.studies.includes(225)) galaxies += Math.floor(player.replicanti.amount.e / 1000)
  if (player.timestudy.studies.includes(226)) galaxies += Math.floor(player.replicanti.gal / 15)
  let replicantiGalaxies = Math.min(player.replicanti.galaxies, player.replicanti.gal);
  EternityChallenge(8).applyReward(value => galaxies += replicantiGalaxies * value);
  if (galaxies < 3) {
      let baseMultiplier = 0.9;
      if (player.galaxies == 0) baseMultiplier = 0.89
      if (player.currentChallenge == "challenge6" || player.currentChallenge == "postc1") baseMultiplier = 0.93;
      let perGalaxy = 0.02;
      if (player.infinityUpgrades.includes("galaxyBoost")) perGalaxy *= 2;
      if (player.infinityUpgrades.includes("postGalaxy")) perGalaxy *= 1.5;
      if (player.challenges.includes("postc5")) perGalaxy *= 1.1;
      if (isAchEnabled("r86")) perGalaxy *= 1.01;
      if (player.timestudy.studies.includes(212)) perGalaxy *= Math.min(Math.pow(player.timeShards.max(2).log2(), 0.005), 1.1)

      return new Decimal(Math.max(0.01, baseMultiplier-(galaxies*perGalaxy)));
  } else {
      let baseMultiplier = 0.8
      if (player.currentChallenge == "challenge6" || player.currentChallenge == "postc1") baseMultiplier = 0.83
      let perGalaxy = new Decimal(0.965)
      if (player.infinityUpgrades.includes("galaxyBoost")) galaxies *= 2;
      if (player.infinityUpgrades.includes("postGalaxy")) galaxies *= 1.5;
      if (player.challenges.includes("postc5")) galaxies *= 1.1;
      if (isAchEnabled("r86")) galaxies *= 1.01
      if (player.timestudy.studies.includes(212)) galaxies *= Math.min(Math.pow(player.timeShards.max(2).log2(), 0.005), 1.1)
      if (player.timestudy.studies.includes(232)) galaxies *= Math.pow(1+player.galaxies/1000, 0.2)

      return perGalaxy.pow(galaxies-2).times(baseMultiplier);
  }
}

function buyTickSpeed() {
  if (!canBuyTickSpeed()) {
      return false;
  }

  if (!canAfford(player.tickSpeedCost)) {
      return false;
  }

  player.money = player.money.minus(player.tickSpeedCost);
  if (player.currentChallenge != "challenge5" && player.currentChallenge != "postc5") player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier);
  else multiplySameCosts(player.tickSpeedCost)
  if (player.tickSpeedCost.gte(Number.MAX_VALUE)) player.tickspeedMultiplier = player.tickspeedMultiplier.times(player.tickSpeedMultDecrease);
  if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0
  player.tickspeed = player.tickspeed.times(getTickSpeedMultiplier());
  if (player.challenges.includes("postc3") || player.currentChallenge == "postc3") player.postC3Reward = player.postC3Reward.times(1.05+(player.galaxies*0.005))
  postc8Mult = new Decimal(1)
  player.secretUnlocks.why++
  return true;
}

document.getElementById("tickSpeed").onclick = function () {
  buyTickSpeed();

  updateTickSpeed();
};

function buyMaxTickSpeed() {
  if (!canBuyTickSpeed()) return false;
  let money = new Decimal(player.money);
  if (money.eq(0)) return false;
  const mult = getTickSpeedMultiplier();
  let tickSpeedCost = new Decimal(player.tickSpeedCost);
  let tickSpeedMultDecrease = player.tickSpeedMultDecrease;
  let tickspeedMultiplier = new Decimal(player.tickspeedMultiplier);
  let tickspeed = new Decimal(player.tickspeed);
  let postC3Reward = new Decimal(player.postC3Reward);
  function flushValues() {
    player.money.fromDecimal(money);
    player.tickSpeedCost.fromDecimal(tickSpeedCost);
    player.tickSpeedMultDecrease = tickSpeedMultDecrease;
    player.tickspeedMultiplier.fromDecimal(tickspeedMultiplier);
    player.tickspeed.fromDecimal(tickspeed);
    player.postC3Reward.fromDecimal(postC3Reward);
  }

  const currentChallenge = player.currentChallenge;
  const underPostC3Effect = player.challenges.includes("postc3") || currentChallenge === "postc3";
  if (currentChallenge === "challenge2" || currentChallenge === "postc1") {
    player.chall2Pow = 0;
  }
  if (currentChallenge === "challenge5" || currentChallenge === "postc5" || tickSpeedCost.lt(Number.MAX_VALUE) || tickSpeedMultDecrease > 2) {
    while (money.gt(tickSpeedCost) && (tickSpeedCost.lt(Number.MAX_VALUE) || tickSpeedMultDecrease > 2 || currentChallenge === "postc5")) {
      money = money.minus(tickSpeedCost);
      if (currentChallenge === "challenge5" || currentChallenge === "postc5") {
        multiplySameCosts(tickSpeedCost);
      }
      tickSpeedCost = tickSpeedCost.times(tickspeedMultiplier);
      if (tickSpeedCost.gte(Number.MAX_VALUE)) {
        tickspeedMultiplier = tickspeedMultiplier.times(tickSpeedMultDecrease);
      }
      tickspeed = tickspeed.times(mult);
      if (underPostC3Effect) {
        postC3Reward = postC3Reward.times(1.05 + (player.galaxies * 0.005));
      }
      postc8Mult = new Decimal(1);
    }
  }
  if (tickSpeedCost.gte(Number.MAX_VALUE)) {
    const a = Math.log10(Math.sqrt(tickSpeedMultDecrease));
    const b = tickspeedMultiplier.dividedBy(Math.sqrt(tickSpeedMultDecrease)).log10();
    const c = tickSpeedCost.dividedBy(money).log10();
    const discriminant = Math.pow(b, 2) - (c * a * 4);
    if (discriminant < 0) {
      flushValues();
      return false;
    }
    const buying = Math.floor((Math.sqrt(Math.pow(b, 2) - (c * a * 4)) - b) / (2 * a)) + 1;
    if (buying <= 0) {
      flushValues();
      return false;
    }
    tickspeed = tickspeed.times(Decimal.pow(mult, buying));
    if (underPostC3Effect) {
      postC3Reward = postC3Reward.times(Decimal.pow(1.05 + (player.galaxies * 0.005), buying))
    }
    increaseTickSpeedCost(buying - 1);
    money = money.minus(tickSpeedCost).max(0);
    tickSpeedCost = tickSpeedCost.times(tickspeedMultiplier);
    tickspeedMultiplier = tickspeedMultiplier.times(tickSpeedMultDecrease);

    function increaseTickSpeedCost(n) {
      // Unoptimized version
      // for (var i = 0; i < n; i++) {
      //    cost *= mult;
      //    mult *= multDec;
      // }
      const multDec = new Decimal(tickSpeedMultDecrease);
      tickSpeedCost = tickSpeedCost.times(tickspeedMultiplier.pow(n)).times(multDec.pow(n * (n - 1) / 2));
      tickspeedMultiplier = tickspeedMultiplier.times(multDec.pow(n));
    }
  }

  flushValues();
  updateTickSpeed()
}


function updateTickSpeed() {
	let exp = player.tickspeed.e;
	let tickSpeedText;
	if (exp > 1)
		tickSpeedText = 'Tickspeed: ' + player.tickspeed.toFixed(0);
	else 
		tickSpeedText = 'Tickspeed: ' + player.tickspeed.times(new Decimal(100).dividedBy(Decimal.pow(10, exp))).toFixed(0) + ' / ' + shorten(new Decimal(100).dividedBy(Decimal.pow(10, exp)));
  
	// Accelerated game speed suffix
	let gameSpeedMult = getGameSpeedupFactor();
  let gammaText = "";
  let tickspeedTooltip = "";
	if (gameSpeedMult != 1) {
    if (gameSpeedMult < 1) {
      gammaText = "(γ = " + gameSpeedMult.toFixed(3) + ")";
      tickspeedTooltip = "The game is running " + (1/gameSpeedMult).toFixed(0) + "x slower.";
    }
    else {
      let formattedSpeed = "";
      if (gameSpeedMult < 10000)
        formattedSpeed = gameSpeedMult.toFixed(3)
      else
        formattedSpeed = shortenDimensions(gameSpeedMult)
      gammaText = "(γ = " + formattedSpeed + ")";
      tickspeedTooltip = "The game is running " + formattedSpeed + "x faster.";
    }
  }
  
  document.getElementById("tickSpeedAmount").textContent = tickSpeedText + "   " + gammaText;
  if (tickspeedTooltip === "")
    document.getElementById("tickSpeedAmount").removeAttribute('ach-tooltip');
  else
    document.getElementById("tickSpeedAmount").setAttribute('ach-tooltip', tickspeedTooltip);
}

function resetTickspeed() {
    player.tickSpeedCost = new Decimal(1000);
    player.tickspeedMultiplier = new Decimal(10);
    let tickspeed = new Decimal(1000);
    if (isAchEnabled("r36")) tickspeed = tickspeed.times(0.98);
    if (isAchEnabled("r45")) tickspeed = tickspeed.times(0.98);
    if (isAchEnabled("r66")) tickspeed = tickspeed.times(0.98);
    if (isAchEnabled("r83")) tickspeed = tickspeed.times(Decimal.pow(0.95, player.galaxies));
    tickspeed = tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), player.totalTickGained));
    player.tickspeed = tickspeed;
}