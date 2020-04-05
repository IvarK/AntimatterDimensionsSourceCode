"use strict";

function canBuyTickSpeed() {
  return NormalDimension(3).isAvailableForPurchase && !EternityChallenge(9).isRunning;
}

function getTickSpeedMultiplier() {
  if (InfinityChallenge(3).isRunning || Laitela.isRunning) return new Decimal(1);
  if (Ra.isRunning) return new Decimal(0.89);
  // Note that this already includes the "50% more" active path effect
  let replicantiGalaxies = Replicanti.galaxies.bought;
  replicantiGalaxies *= (1 + Effects.sum(
    TimeStudy(132),
    TimeStudy(133)
  ));
  // "extra" galaxies unaffected by the passive/idle boosts come from studies 225/226 and Effarig Infinity
  replicantiGalaxies += Replicanti.galaxies.extra;
  const nonActivePathReplicantiGalaxies = Math.min(Replicanti.galaxies.bought,
    ReplicantiUpgrade.galaxies.value);
  // Effects.sum is intentional here - if EC8 is not completed,
  // this value should not be contributed to total replicanti galaxies
  replicantiGalaxies += nonActivePathReplicantiGalaxies * Effects.sum(EternityChallenge(8).reward);
  let freeGalaxies = player.dilation.freeGalaxies;
  freeGalaxies *= 1 + Math.max(0, player.replicanti.amount.log10() / 1e6) * AlchemyResource.alternation.effectValue;
  let galaxies = player.galaxies + replicantiGalaxies + freeGalaxies;
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
  galaxies *= getAdjustedGlyphEffect("cursedgalaxies");
  galaxies *= getAdjustedGlyphEffect("realitygalaxies");
  const perGalaxy = new Decimal(0.965);
  return perGalaxy.pow(galaxies - 2).times(baseMultiplier);
}

function buyTickSpeed() {
  if (!canBuyTickSpeed()) {
      return false;
  }

  if (!canAfford(Tickspeed.cost)) {
      return false;
  }

  if (NormalChallenge(9).isRunning || InfinityChallenge(5).isRunning) {
    Tickspeed.multiplySameCosts();
  }
  player.antimatter = player.antimatter.minus(Tickspeed.cost);
  player.totalTickBought++;
  player.thisInfinityLastBuyTime = player.thisInfinityTime;
  player.secretUnlocks.why++;
  if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
  GameUI.update();
  return true;
}

function buyMaxTickSpeed() {
  if (!canBuyTickSpeed()) return;
  const costBumps = player.chall9TickspeedCostBumps;
  const inCostScalingChallenge = NormalChallenge(9).isRunning || InfinityChallenge(5).isRunning;
  const tickspeedMultDecreaseMaxed = BreakInfinityUpgrade.tickspeedCostMult.isMaxed;
  const costScale = Tickspeed.costScale;

  if (
    costScale.calculateCost(player.totalTickBought + costBumps).lt(Decimal.NUMBER_MAX_VALUE) ||
    inCostScalingChallenge ||
    !tickspeedMultDecreaseMaxed
    ) {

    let shouldContinue = true;
    while (player.antimatter.gt(costScale.calculateCost(player.totalTickBought + costBumps)) && shouldContinue) {
      if (inCostScalingChallenge) {
        Tickspeed.multiplySameCosts();
      }
      player.antimatter = player.antimatter.minus(costScale.calculateCost(player.totalTickBought + costBumps));
      player.totalTickBought++;
      player.thisInfinityLastBuyTime = player.thisInfinityTime;
      if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
      if (costScale.calculateCost(player.totalTickBought + costBumps).gte(Decimal.NUMBER_MAX_VALUE) &&
        !inCostScalingChallenge &&
        tickspeedMultDecreaseMaxed) {
        shouldContinue = false;
      }
    }
  }
  if (costScale.calculateCost(player.totalTickBought + costBumps).gte(Decimal.NUMBER_MAX_VALUE)) {
    const purchases = costScale.getMaxBought(player.totalTickBought + costBumps, player.antimatter);
    if (purchases === null) {
      return;
    }
    player.totalTickBought += purchases.quantity;
    player.antimatter = player.antimatter.minus(Decimal.pow10(purchases.logPrice)).max(0);
  }
}

function resetTickspeed() {
    player.totalTickBought = 0;
    player.chall9TickspeedCostBumps = 0;
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
    return player.dilation.active ? dilatedValueOf(tickspeed) : tickspeed;
  },

  get cost() {
    return this.costScale.calculateCost(player.totalTickBought + player.chall9TickspeedCostBumps);
  },

  get costScale() {
    return new ExponentialCostScaling({
      baseCost: 1000,
      baseIncrease: 10,
      costScale: Player.tickSpeedMultDecrease,
      scalingCostThreshold: Number.MAX_VALUE
    });
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
  },

  multiplySameCosts() {
    for (const dimension of NormalDimensions.all) {
      if (dimension.cost.e === this.cost.e) dimension.costBumps++;
    }
  }

};


const FreeTickspeed = {
  BASE_SOFTCAP: 300000,
  GROWTH_RATE: 6e-6,
  GROWTH_EXP: 2,
  multToNext: 1.33,

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
    const tickmult = (1 + (Effects.min(1.33, TimeStudy(171)) - 1) *
      AnnihilationUpgrade.freeTickDecrease.effect) *
      Math.max(getAdjustedGlyphEffect("cursedtickspeed"), 1);
    const logTickmult = Math.log(tickmult);
    const logShards = shards.ln();
    const uncapped = logShards / logTickmult;
    if (uncapped <= FreeTickspeed.softcap) {
      this.multToNext = tickmult;
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
    this.multToNext = Decimal.exp((boughtToCost(purchases + 1) - boughtToCost(purchases)) * logTickmult);
    return {
      newAmount: purchases + FreeTickspeed.softcap,
      nextShards: next,
    };
  }

};
