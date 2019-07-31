"use strict";

function canBuyTickSpeed() {
  return NormalDimension(3).isAvailable && !EternityChallenge(9).isRunning;
}

function getTickSpeedMultiplier() {
  if (InfinityChallenge(3).isRunning || Laitela.isRunning) return new Decimal(1);
  if (Ra.isRunning) return new Decimal(0.89);
  let replicantiGalaxies = player.replicanti.galaxies;
  replicantiGalaxies *= (1 + Effects.sum(
    TimeStudy(132),
    TimeStudy(133)
  ));
  replicantiGalaxies += Effects.sum(
    TimeStudy(225),
    TimeStudy(226)
  );
  replicantiGalaxies += Effarig.bonusRG;
  const nonActivePathReplicantiGalaxies = Math.min(player.replicanti.galaxies, player.replicanti.gal);
  // Effects.sum is intentional here - if EC8 is not completed,
  // this value should not be contributed to total replicanti galaxies
  replicantiGalaxies += nonActivePathReplicantiGalaxies * Effects.sum(EternityChallenge(8).reward);
  let galaxies = player.galaxies + player.dilation.freeGalaxies + replicantiGalaxies;
  if (galaxies < 3) {
      let baseMultiplier = 0.9;
      if (player.galaxies === 0) baseMultiplier = 0.89;
      if (player.galaxies === 1) baseMultiplier = 0.895;
      if (NormalChallenge(5).isRunning) baseMultiplier = 0.93;
      const perGalaxy = 0.02 * Effects.product(
        InfinityUpgrade.galaxyBoost,
        InfinityUpgrade.galaxyBoost.chargedEffect,
        BreakInfinityUpgrade.galaxyBoost,
        TimeStudy(212),
        Achievement(86),
        InfinityChallenge(5).reward
      );
      return new Decimal(Math.max(0.01, baseMultiplier - (galaxies * perGalaxy)));
  }
  let baseMultiplier = 0.8;
  if (NormalChallenge(5).isRunning) baseMultiplier = 0.83;
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
  const perGalaxy = new Decimal(0.965);
  return perGalaxy.pow(galaxies - 2).times(baseMultiplier);
}

function buyTickSpeed() {
  if (!canBuyTickSpeed()) {
      return false;
  }

  if (!canAfford(player.tickSpeedCost)) {
      return false;
  }

  player.antimatter = player.antimatter.minus(player.tickSpeedCost);
  if (NormalChallenge(9).isRunning || InfinityChallenge(5).isRunning) {
    multiplySameCosts(player.tickSpeedCost);
  } else {
    player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier);
  }
  if (player.tickSpeedCost.gte(Decimal.MAX_NUMBER)) {
    player.tickspeedMultiplier = player.tickspeedMultiplier.times(Player.tickSpeedMultDecrease);
  }
  if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
  player.totalTickBought++;
  player.thisInfinityLastBuyTime = player.thisInfinityTime;
  player.secretUnlocks.why++;
  GameUI.update();
  return true;
}

function buyMaxTickSpeed() {
  if (!canBuyTickSpeed()) return;
  let antimatter = new Decimal(player.antimatter);
  if (antimatter.eq(0)) return;
  let tickSpeedCost = new Decimal(player.tickSpeedCost);
  const tickSpeedMultDecrease = Player.tickSpeedMultDecrease;
  let tickspeedMultiplier = new Decimal(player.tickspeedMultiplier);
  let totalTickBought = player.totalTickBought;
  function flushValues() {
    player.antimatter.fromDecimal(antimatter);
    player.tickSpeedCost.fromDecimal(tickSpeedCost);
    player.tickspeedMultiplier.fromDecimal(tickspeedMultiplier);
    player.totalTickBought = totalTickBought;
  }
  function increaseTickSpeedCost(n) {
    const multDec = new Decimal(tickSpeedMultDecrease);
    tickspeedMultiplier = tickspeedMultiplier.times(multDec.pow(n));
  }
  const inCostScalingChallenge = NormalChallenge(9).isRunning || InfinityChallenge(5).isRunning;
  const tickspeedMultDecreaseMaxed = BreakInfinityUpgrade.tickspeedCostMult.isMaxed;

  if (tickSpeedCost.lt(Decimal.MAX_NUMBER) || inCostScalingChallenge || !tickspeedMultDecreaseMaxed) {
    let shouldContinue = true;
    while (antimatter.gt(tickSpeedCost) && shouldContinue) {
      antimatter = antimatter.minus(tickSpeedCost);
      if (inCostScalingChallenge) {
        multiplySameCosts(tickSpeedCost);
      }
      if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
      tickSpeedCost = tickSpeedCost.times(tickspeedMultiplier);
      if (tickSpeedCost.gte(Decimal.MAX_NUMBER)) {
        tickspeedMultiplier = tickspeedMultiplier.times(tickSpeedMultDecrease);
      }
      totalTickBought++;
      player.thisInfinityLastBuyTime = player.thisInfinityTime;
      if (tickSpeedCost.gte(Decimal.MAX_NUMBER) && !inCostScalingChallenge && tickspeedMultDecreaseMaxed) {
        shouldContinue = false;
      }
    }
  }
  if (tickSpeedCost.gte(Decimal.MAX_NUMBER)) {
    const costScale = new ExponentialCostScaling({
      baseCost: 1000,
      baseIncrease: 10,
      costScale: Player.tickSpeedMultDecrease,
      scalingCostThreshold: Number.MAX_VALUE
    });
    const purchases = costScale.getMaxBought(totalTickBought, antimatter);
    if (purchases === null) {
      flushValues();
      return;
    }
    totalTickBought += purchases.quantity;
    const nextCost = costScale.calculateCost(totalTickBought);
    increaseTickSpeedCost(purchases.quantity - 1);
    antimatter = antimatter.minus(Decimal.pow10(purchases.logPrice)).max(0);
    tickSpeedCost = nextCost;
    tickspeedMultiplier = tickspeedMultiplier.times(tickSpeedMultDecrease);
  }

  flushValues();
}

function resetTickspeed() {
    player.tickSpeedCost = new Decimal(1000);
    player.tickspeedMultiplier = new Decimal(10);
    player.totalTickBought = 0;
}

const Tickspeed = {

  get isUnlocked() {
    return NormalDimension(2).amount.gt(0) || player.eternities.gte(30);
  },

  get multiplier() {
    return getTickSpeedMultiplier();
  },

  get current() {
    const tickspeed = Effarig.isRunning
      ? Effarig.tickspeed
      : this.baseValue;
    return (player.dilation.active || Ra.isCompressed) ? dilatedValueOf(tickspeed) : tickspeed;
  },

  get baseValue() {
    return new Decimal(1000)
      .timesEffectsOf(
        Achievement(36),
        Achievement(45),
        Achievement(66),
        Achievement(83)
      )
      .times(getTickSpeedMultiplier().pow(player.totalTickBought + player.totalTickGained));
  }
};


const FreeTickspeed = {
  BASE_SOFTCAP: 300000,
  GROWTH_RATE: 6e-6,
  GROWTH_EXP: 2,

  get amount() {
    return player.totalTickGained;
  },

  get softcap() {
    let softcap = FreeTickspeed.BASE_SOFTCAP;
    if (Enslaved.has(ENSLAVED_UNLOCKS.FREE_TICKSPEED_SOFTCAP)) {
      softcap += 100000;
    }
    return softcap;
  },

  fromShards(shards) {
    if (!shards.gt(0)) return {
      newAmount: 0,
      nextShards: new Decimal(1),
    };
    let freeTickspeedMultiplier = getAdjustedGlyphEffect("timefreeTickMult");
    if (Laitela.has(LAITELA_UNLOCKS.TD)) freeTickspeedMultiplier *= Laitela.freeTickspeedMultEffect;
    const tickmult = 1 + (Effects.min(1.33, TimeStudy(171)) - 1) * freeTickspeedMultiplier;
    const logTickmult = Math.log(tickmult);
    const logShards = shards.ln();
    const uncapped = logShards / logTickmult;
    if (uncapped <= FreeTickspeed.softcap) {
      return {
        newAmount: Math.ceil(uncapped),
        nextShards: Decimal.pow(tickmult, Math.ceil(uncapped))
      };
    }
    // Log of (cost - cost up to softcap)
    const priceToCap = FreeTickspeed.softcap * logTickmult;
    // In the following we're implicitly applying the function (ln(x) - priceToCap) / logTickmult to all costs,
    // so, for example, if the cost is 1 that means it's actually exp(priceToCap) * tickmult.
    const desiredCost = (logShards - priceToCap) / logTickmult;
    const costFormulaCoefficient = FreeTickspeed.GROWTH_RATE / FreeTickspeed.GROWTH_EXP / logTickmult;
    // In the following we're implicitly subtracting softcap from bought,
    // so, for example, if bought is 1 that means it's actually softcap + 1.
    // The first term (the big one) is the asymptotically more important term (since FreeTickspeed.GROWTH_EXP > 1),
    // but is small initially. The second term allows us to continue the pre-cap free tickspeed upgrade scaling
    // of tickmult per upgrade.
    const boughtToCost = bought => costFormulaCoefficient * Math.pow(
      Math.max(bought, 0), FreeTickspeed.GROWTH_EXP) + bought;
    const derivativeOfBoughtToCost = x => FreeTickspeed.GROWTH_EXP * costFormulaCoefficient * Math.pow(
      Math.max(x, 0), FreeTickspeed.GROWTH_EXP - 1) + 1;
    const newtonsMethod = bought => bought - (boughtToCost(bought) - desiredCost) / derivativeOfBoughtToCost(bought);
    let oldApproximation;
    let approximation = Math.min(
      desiredCost,
      Math.pow(desiredCost / costFormulaCoefficient, 1 / FreeTickspeed.GROWTH_EXP)
    );
    let counter = 0;
    // The bought formula is concave upwards. We start with an over-estimate; when using newton's method,
    // this means that successive iterations are also over-etimates. Thus, we can just check for continued
    // progress with the approximation < oldApproximation check. The counter is a fallback.
    do {
      oldApproximation = approximation;
      approximation = newtonsMethod(approximation);
    } while (approximation < oldApproximation && ++counter < 100);
    const purchases = Math.floor(approximation);
    // This undoes the function we're implicitly applying to costs (the "+ 1") is because we want
    // the cost of the next upgrade.
    const next = Decimal.exp(priceToCap + boughtToCost(purchases + 1) * logTickmult);
    return {
      newAmount: purchases + FreeTickspeed.softcap,
      nextShards: next,
    };
  }

};
