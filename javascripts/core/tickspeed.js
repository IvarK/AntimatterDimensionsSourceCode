function canBuyTickSpeed() {
  return canBuyDimension(3) && !EternityChallenge(9).isRunning;
}

function getTickSpeedMultiplier() {
  if (InfinityChallenge(3).isRunning) return new Decimal(1);
  if (Ra.isRunning) return new Decimal(0.89)
  let replicantiGalaxies = player.replicanti.galaxies;
  replicantiGalaxies *= (1 + Effects.sum(
    TimeStudy(132),
    TimeStudy(133)
  ));
  replicantiGalaxies += Effects.sum(
    TimeStudy(225),
    TimeStudy(226)
  );
  let nonActivePathReplicantiGalaxies = Math.min(player.replicanti.galaxies, player.replicanti.gal);
  // Effects.sum is intentional here - if EC8 is not completed,
  // this value should not be contributed to total replicanti galaxies
  replicantiGalaxies += nonActivePathReplicantiGalaxies * Effects.sum(EternityChallenge(8).reward);
  let galaxies = player.galaxies + player.dilation.freeGalaxies + replicantiGalaxies;
  if (galaxies < 3) {
      let baseMultiplier = 0.9;
      if (player.galaxies == 0) baseMultiplier = 0.89
      if (player.galaxies == 1) baseMultiplier = 0.895
      if (Challenge(5).isRunning) baseMultiplier = 0.93;
      let perGalaxy = 0.02 * Effects.product(
        InfinityUpgrade.galaxyBoost,
        InfinityUpgrade.galaxyBoost.chargedEffect,
        BreakInfinityUpgrade.galaxyBoost,
        TimeStudy(212),
        Achievement(86),
        InfinityChallenge(5).reward
      );
      return new Decimal(Math.max(0.01, baseMultiplier - (galaxies * perGalaxy)));
  } else {
      let baseMultiplier = 0.8
      if (Challenge(5).isRunning) baseMultiplier = 0.83
      galaxies -= 2;
      galaxies *= Effects.product(
        InfinityUpgrade.galaxyBoost,
        InfinityUpgrade.galaxyBoost.chargedEffect,
        BreakInfinityUpgrade.galaxyBoost,
        TimeStudy(212),
        TimeStudy(232),
        Achievement(86),
        InfinityChallenge(5).reward
      );
      galaxies -= 2;
      console.log(galaxies);
      let perGalaxy = new Decimal(0.965)
      return perGalaxy.pow(galaxies).times(baseMultiplier);
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
  if (!Challenge(9).isRunning && !InfinityChallenge(5).isRunning) player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier);
  else multiplySameCosts(player.tickSpeedCost)
  if (player.tickSpeedCost.gte(Number.MAX_VALUE)) player.tickspeedMultiplier = player.tickspeedMultiplier.times(Player.tickSpeedMultDecrease);
  if (Challenge(2).isRunning) player.chall2Pow = 0
  player.tickspeed = player.tickspeed.times(getTickSpeedMultiplier());
  if (InfinityChallenge(3).isCompleted || InfinityChallenge(3).isRunning) player.postC3Reward = player.postC3Reward.times(1.05+(player.galaxies*0.005))
  postc8Mult = new Decimal(1)
  player.secretUnlocks.why++
  GameUI.update();
  return true;
}

function buyMaxTickSpeed() {
  if (!canBuyTickSpeed()) return false;
  let money = new Decimal(player.money);
  if (money.eq(0)) return false;
  const mult = getTickSpeedMultiplier();
  let tickSpeedCost = new Decimal(player.tickSpeedCost);
  let tickSpeedMultDecrease = Player.tickSpeedMultDecrease;
  let tickspeedMultiplier = new Decimal(player.tickspeedMultiplier);
  let tickspeed = new Decimal(player.tickspeed);
  let postC3Reward = new Decimal(player.postC3Reward);
  function flushValues() {
    player.money.fromDecimal(money);
    player.tickSpeedCost.fromDecimal(tickSpeedCost);
    player.tickspeedMultiplier.fromDecimal(tickspeedMultiplier);
    player.tickspeed.fromDecimal(tickspeed);
    player.postC3Reward.fromDecimal(postC3Reward);
  }

  const underIC3Effect = InfinityChallenge(3).isCompleted || InfinityChallenge(3).isRunning;
  if (Challenge(2).isRunning) {
    player.chall2Pow = 0;
  }
  if (Challenge(9).isRunning || InfinityChallenge(5).isRunning || tickSpeedCost.lt(Number.MAX_VALUE) || !BreakInfinityUpgrade.tickspeedCostMult.isMaxed) {
    while (money.gt(tickSpeedCost) && (tickSpeedCost.lt(Number.MAX_VALUE) || !BreakInfinityUpgrade.tickspeedCostMult.isMaxed || InfinityChallenge(5).isRunning)) {
      money = money.minus(tickSpeedCost);
      if (Challenge(9).isRunning || InfinityChallenge(5).isRunning) {
        multiplySameCosts(tickSpeedCost);
      }
      tickSpeedCost = tickSpeedCost.times(tickspeedMultiplier);
      if (tickSpeedCost.gte(Number.MAX_VALUE)) {
        tickspeedMultiplier = tickspeedMultiplier.times(tickSpeedMultDecrease);
      }
      tickspeed = tickspeed.times(mult);
      if (underIC3Effect) {
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
    if (underIC3Effect) {
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
}

function resetTickspeed() {
    player.tickSpeedCost = new Decimal(1000);
    player.tickspeedMultiplier = new Decimal(10);
    let tickspeed = new Decimal(1000)
      .timesEffectsOf(
        Achievement(36),
        Achievement(45),
        Achievement(66),
        Achievement(83)
      );
    tickspeed = tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), player.totalTickGained));
    player.tickspeed = tickspeed;
}

const Tickspeed = {

  get isUnlocked() {
    return player.secondAmount.gt(0) || player.eternities >= 30;
  },

  get multiplier() {
    return getTickSpeedMultiplier();
  },

  get current() {
    const tickspeed = Effarig.isRunning ? Effarig.tickspeed : player.tickspeed;
    return player.dilation.active ? dilatedValueOf(tickspeed) : tickspeed;
  }
};