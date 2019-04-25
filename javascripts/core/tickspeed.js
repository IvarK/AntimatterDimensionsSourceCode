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
  replicantiGalaxies += Effarig.bonusRG
  let nonActivePathReplicantiGalaxies = Math.min(player.replicanti.galaxies, player.replicanti.gal);
  // Effects.sum is intentional here - if EC8 is not completed,
  // this value should not be contributed to total replicanti galaxies
  replicantiGalaxies += nonActivePathReplicantiGalaxies * Effects.sum(EternityChallenge(8).reward);
  let galaxies = player.galaxies + player.dilation.freeGalaxies + replicantiGalaxies;
  if (galaxies < 3) {
      let baseMultiplier = 0.9;
      if (player.galaxies == 0) baseMultiplier = 0.89
      if (player.galaxies == 1) baseMultiplier = 0.895
      if (NormalChallenge(5).isRunning) baseMultiplier = 0.93;
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
      if (NormalChallenge(5).isRunning) baseMultiplier = 0.83
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
      let perGalaxy = new Decimal(0.965)
      return perGalaxy.pow(galaxies - 2).times(baseMultiplier);
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
  if (!NormalChallenge(9).isRunning && !InfinityChallenge(5).isRunning) player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier);
  else multiplySameCosts(player.tickSpeedCost)
  if (player.tickSpeedCost.gte(Decimal.MAX_NUMBER)) player.tickspeedMultiplier = player.tickspeedMultiplier.times(Player.tickSpeedMultDecrease);
  if (NormalChallenge(2).isRunning) player.chall2Pow = 0
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
  if (NormalChallenge(2).isRunning) {
    player.chall2Pow = 0;
  }
  if (NormalChallenge(9).isRunning || InfinityChallenge(5).isRunning || tickSpeedCost.lt(Decimal.MAX_NUMBER) || !BreakInfinityUpgrade.tickspeedCostMult.isMaxed) {
    while (money.gt(tickSpeedCost) && (tickSpeedCost.lt(Decimal.MAX_NUMBER) || !BreakInfinityUpgrade.tickspeedCostMult.isMaxed || InfinityChallenge(5).isRunning)) {
      money = money.minus(tickSpeedCost);
      if (NormalChallenge(9).isRunning || InfinityChallenge(5).isRunning) {
        multiplySameCosts(tickSpeedCost);
      }
      tickSpeedCost = tickSpeedCost.times(tickspeedMultiplier);
      if (tickSpeedCost.gte(Decimal.MAX_NUMBER)) {
        tickspeedMultiplier = tickspeedMultiplier.times(tickSpeedMultDecrease);
      }
      tickspeed = tickspeed.times(mult);
      if (underIC3Effect) {
        postC3Reward = postC3Reward.times(1.05 + (player.galaxies * 0.005));
      }
      postc8Mult = new Decimal(1);
    }
  }
  if (tickSpeedCost.gte(Decimal.MAX_NUMBER)) {
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

const FreeTickspeed2 = {
  SOFTCAP: 300000,
  GROWTH_RATE: 2e-5,
  get amount() {
    return player.totalTickGained;
  },
  fromShards(shards) {
    if (!shards.gt(0)) return {
      newAmount: 0,
      nextShards: new Decimal(1),
    };
    const multFromGlyph = getAdjustedGlyphEffect("timefreeTickMult");
    const tickmult = 1 + (Effects.min(1.33, TimeStudy(171)) - 1) * multFromGlyph;
    const logTickmult = Math.log(tickmult);
    const logShards = shards.ln();
    const uncapped = logShards / logTickmult;
    if (uncapped <= FreeTickspeed.SOFTCAP) {
      return {
        newAmount: Math.ceil(uncapped),
        nextShards: Decimal.pow(tickmult, Math.ceil(uncapped))
      };
    }
    // Threshold gets +1 after softcap, can be reduced to +0.8 with glyphs. The 0.8:1 ratio is the same as the
    // 1:1.25 ratio (which is how glyphs affect pre-softcap purchases with TS171); this makes the rato the glyph
    // reports continue to be accurate.
    const fixedIncrease = 1 / TS171_MULTIPLIER;
    const softcapFactor = fixedIncrease + (1 - fixedIncrease) * multFromGlyph;
    // Log of (cost - cost up to SOFTCAP)
    const priceToCap = FreeTickspeed.SOFTCAP * logTickmult;
    const tmpC = logShards - priceToCap;
    const kGrowth = FreeTickspeed.GROWTH_RATE * softcapFactor
    const scaling = new LinearMultiplierScaling(tickmult, kGrowth);
    const purchases = Math.floor(scaling.purchasesForLogTotalMultiplier(tmpC));
    const next = scaling.logTotalMultiplierAfterPurchases(purchases + 1);
    return {
      newAmount: purchases + FreeTickspeed.SOFTCAP,
      nextShards: Decimal.exp(priceToCap + next),
    }
  }
}


const FreeTickspeed = {
  SOFTCAP: 300000,
  GROWTH_RATE: 6e-3,
  GROWTH_EXP: 1.5,

  get amount() {
    return player.totalTickGained;
  },
  fromShards(shards) {
    if (!shards.gt(0)) return {
      newAmount: 0,
      nextShards: new Decimal(1),
    };
    const multFromGlyph = getAdjustedGlyphEffect("timefreeTickMult");
    const tickmult = 1 + (Effects.min(1.33, TimeStudy(171)) - 1) * multFromGlyph;
    const logTickmult = Math.log(tickmult);
    const logShards = shards.ln();
    const uncapped = logShards / logTickmult;
    if (uncapped <= FreeTickspeed2.SOFTCAP) {
      return {
        newAmount: Math.ceil(uncapped),
        nextShards: Decimal.pow(tickmult, Math.ceil(uncapped))
      };
    }
    // Threshold gets +1 after softcap, can be reduced to +0.8 with glyphs. The 0.8:1 ratio is the same as the
    // 1:1.25 ratio (which is how glyphs affect pre-softcap purchases with TS171); this makes the rato the glyph
    // reports continue to be accurate.
    const fixedIncrease = 1 / TS171_MULTIPLIER;
    const softcapFactor = fixedIncrease + (1 - fixedIncrease) * multFromGlyph;
    // Log of (cost - cost up to SOFTCAP)
    const priceToCap = FreeTickspeed.SOFTCAP * logTickmult;
    const tmpC = (logShards - priceToCap) / logTickmult;
    const a = FreeTickspeed.GROWTH_RATE / FreeTickspeed.GROWTH_EXP / logTickmult;
    const b = FreeTickspeed.GROWTH_EXP;
    const apx = c => Math.pow(c / a + Math.pow(a * b, -b / (b - 1)), 1 / b) - Math.pow(a * b, -1 / (b - 1));
    const newfun = (x0, c) => ((b - 1) * a * Math.pow(Math.max(x0,0), b) + c) / (b * a * Math.pow(Math.max(x0,0), b - 1) + 1)
    const ap1 = apx(tmpC)
    const ap2 = newfun(ap1, tmpC)
    const ap3 = newfun(ap2, tmpC)
    const ap4 = newfun(ap3, tmpC)
    //console.log(`${ap1} ${ap2} ${ap3} ${ap4}`)
    //console.log(a * Math.pow(ap4, b) + ap4 - tmpC)
    const purchases = Math.floor(ap4);
    const next = 1;//scaling.logTotalMultiplierAfterPurchases(purchases + 1);
    return {
      newAmount: purchases + FreeTickspeed.SOFTCAP,
      nextShards: Decimal.exp(priceToCap + next),
    }
  }
}
