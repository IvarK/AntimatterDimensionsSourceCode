"use strict";

// Slowdown parameters for replicanti growth, interval will increase by scaleFactor for every scaleLog10
// OoM past the cap (default is 308.25 (log10 of 1.8e308), 1.2, Number.MAX_VALUE)
const ReplicantiGrowth = {
  get scaleLog10() {
    return Math.log10(Number.MAX_VALUE);
  },
  get scaleFactor() {
    return AlchemyResource.cardinality.effectValue;
  }
};

function addReplicantiGalaxies(newGalaxies) {
  if (newGalaxies > 0) {
    player.replicanti.galaxies += newGalaxies;
    player.achievementChecks.noReplicantiGalaxies = false;
  }
}

function replicantiGalaxy() {
  if (!Replicanti.galaxies.canBuyMore) return;
  player.replicanti.timer = 0;
  let galaxyGain = 1;
  if (Achievement(126).isUnlocked) {
    // Attempt to buy bulk if RG divides by e308 instead of resetting
    const maxGain = Replicanti.galaxies.max - player.replicanti.galaxies;
    const logReplicanti = player.replicanti.amount.log10();
    galaxyGain = Math.min(maxGain, Math.floor(logReplicanti / LOG10_MAX_VALUE));
    // In the unlikely case of different rounding error between canBuyMore and the above
    if (galaxyGain < 1) return;
    player.replicanti.amount = Decimal.pow10(logReplicanti - LOG10_MAX_VALUE * galaxyGain);
  } else {
    player.replicanti.amount = new Decimal(1);
  }
  addReplicantiGalaxies(galaxyGain);
}

// Produces replicanti quickly below e308, will auto-bulk-RG if production is fast enough
// Returns the remaining unused gain factor
function fastReplicantiBelow308(log10GainFactor, isAutobuyerActive) {
  // More than e308 galaxies per tick causes the game to die, and I don't think it's worth the performance hit of
  // Decimalifying the entire calculation.  And yes, this can and does actually happen super-lategame.
  const uncappedAmount = Decimal.pow(10, log10GainFactor.plus(player.replicanti.amount.log10()));
  // Checking for uncapped equaling zero is because Decimal.pow returns zero for overflow for some reason
  if (log10GainFactor.gt(Number.MAX_VALUE) || uncappedAmount.eq(0)) {
    if (isAutobuyerActive) {
      addReplicantiGalaxies(Replicanti.galaxies.max - player.replicanti.galaxies);
    }
    player.replicanti.amount = replicantiCap();
    // Basically we've used nothing.
    return log10GainFactor;
  }

  if (!isAutobuyerActive) {
    const remainingGain = log10GainFactor.minus(
      replicantiCap().log10() - player.replicanti.amount.log10()).clampMin(0);
    player.replicanti.amount = Decimal.min(uncappedAmount, replicantiCap());
    return remainingGain;
  }

  const gainNeededPerRG = Decimal.NUMBER_MAX_VALUE.log10();
  const replicantiExponent = log10GainFactor.toNumber() + player.replicanti.amount.log10();
  const toBuy = Math.floor(Math.min(replicantiExponent / gainNeededPerRG,
    Replicanti.galaxies.max - player.replicanti.galaxies));
  const maxUsedGain = gainNeededPerRG * toBuy + replicantiCap().log10() - player.replicanti.amount.log10();
  const remainingGain = log10GainFactor.minus(maxUsedGain).clampMin(0);
  player.replicanti.amount = Decimal.pow10(replicantiExponent - gainNeededPerRG * toBuy)
    .clampMax(replicantiCap());
  addReplicantiGalaxies(toBuy);
  return remainingGain;
}

// When the amount is exactly the cap, there are two cases: the player can go
// over cap (in which case interval should be as if over cap) or the player
// has just crunched and is still at cap due to "Is this safe?" reward
// (in which case interval should be as if not over cap). This is why we have
// the overCapOverride parameter, to tell us which case we are in.
function getReplicantiInterval(overCapOverride, intervalIn) {
  let interval = intervalIn || player.replicanti.interval;
  const amount = player.replicanti.amount;
  const overCap = overCapOverride === undefined ? amount.gt(replicantiCap()) : overCapOverride;
  const preCelestialEffects = Effects.product(
    TimeStudy(62),
    TimeStudy(213),
    RealityUpgrade(2),
    RealityUpgrade(6),
    RealityUpgrade(23)
  );
  interval = Decimal.divide(interval, preCelestialEffects);
  if (TimeStudy(132).isBought && Perk.studyPassive.isBought) {
    interval = interval.divide(3);
  }
  if ((TimeStudy(133).isBought && !Achievement(138).isUnlocked) || overCap) {
    interval = interval.times(10);
  }
  if (overCap) {
    const increases = (amount.log10() - replicantiCap().log10()) / ReplicantiGrowth.scaleLog10;
    interval = interval.times(Decimal.pow(ReplicantiGrowth.scaleFactor, increases));
  } else if (Achievement(134).isUnlocked) {
    interval = interval.divide(2);
  }
  interval = interval.divide(getAdjustedGlyphEffect("replicationspeed"));
  if (GlyphAlteration.isAdded("replication")) interval = interval.divide(
    Math.clampMin(Decimal.log10(player.replicanti.amount) * getSecondaryGlyphEffect("replicationdtgain"), 1));
  interval = interval.divide(RA_UNLOCKS.TT_BOOST.effect.replicanti());
  interval = interval.dividedByEffectOf(AlchemyResource.replication);
  if (V.isRunning) {
    // This is a boost if interval < 1, but that only happens in EC12
    // and handling it would make the replicanti code a lot more complicated.
    interval = interval.pow(2);
  }
  return interval;
}

function replicantiCap() {
  return EffarigUnlock.infinity.isUnlocked
    ? Currency.infinities.value
      .pow(TimeStudy(31).isBought ? 120 : 30)
      .clampMin(1)
      .times(Decimal.NUMBER_MAX_VALUE)
    : Decimal.NUMBER_MAX_VALUE;
}

function replicantiLoop(diff) {
  if (!player.replicanti.unl) return;
  PerformanceStats.start("Replicanti");
  EventHub.dispatch(GAME_EVENT.REPLICANTI_TICK_BEFORE);
  // This gets the pre-cap interval (above the cap we recalculate the interval).
  const interval = getReplicantiInterval(false);
  const isUncapped = TimeStudy(192).isBought;
  const areRGsBeingBought = Replicanti.galaxies.areBeingBought;
  if (diff > 500 || interval.lessThan(diff) || isUncapped) {
    // Gain code for sufficiently fast or large amounts of replicanti (growth per tick == chance * amount)
    let postScale = Math.log10(ReplicantiGrowth.scaleFactor) / ReplicantiGrowth.scaleLog10;
     if (V.isRunning) {
      postScale *= 2;
    }

    // Note that remainingGain is in log10 terms.
    let remainingGain = Decimal.divide(diff * Math.log(player.replicanti.chance + 1), interval).times(LOG10_E);
    // It is intended to be possible for both of the below conditionals to trigger.
    if (!isUncapped || player.replicanti.amount.lte(replicantiCap())) {
      // Some of the gain is "used up" below e308, but if replicanti are uncapped
      // then some may be "left over" for increasing replicanti beyond their cap.
      remainingGain = fastReplicantiBelow308(remainingGain, areRGsBeingBought);
    }
    if (isUncapped && player.replicanti.amount.gte(replicantiCap()) && remainingGain.gt(0)) {
      // Recalculate the interval (it may have increased due to additional replicanti, or,
      // far less importantly, decreased due to Reality Upgrade 6 and additional RG).
      const intervalRatio = getReplicantiInterval(true).div(interval);
      remainingGain = remainingGain.div(intervalRatio);
      player.replicanti.amount =
        Decimal.exp(remainingGain.div(LOG10_E).times(postScale).plus(1).ln() / postScale +
        player.replicanti.amount.clampMin(1).ln());
    }
    player.replicanti.timer = 0;
  } else if (interval.lte(player.replicanti.timer)) {
    const reproduced = binomialDistribution(player.replicanti.amount, player.replicanti.chance);
    player.replicanti.amount = player.replicanti.amount.plus(reproduced);
    if (!isUncapped) player.replicanti.amount = Decimal.min(replicantiCap(), player.replicanti.amount);
    player.replicanti.timer += diff - interval.toNumber();
  } else {
    player.replicanti.timer += diff;
  }

  if (areRGsBeingBought && player.replicanti.amount.gte(Decimal.NUMBER_MAX_VALUE)) {
    replicantiGalaxy();
  }
  EventHub.dispatch(GAME_EVENT.REPLICANTI_TICK_AFTER);
  PerformanceStats.end();
}

function replicantiMult() {
  return Decimal.pow(Decimal.log2(player.replicanti.amount.clampMin(1)), 2)
    .plusEffectOf(TimeStudy(21))
    .timesEffectOf(TimeStudy(102))
    .clampMin(1)
    .pow(getAdjustedGlyphEffect("replicationpow"));
}

/** @abstract */
class ReplicantiUpgradeState {
  /** @abstract */
  get id() { throw new NotImplementedError(); }
  /** @abstract */
  get value() { throw new NotImplementedError(); }

  /** @abstract */
  set value(value) { throw new NotImplementedError(); }

  /** @abstract */
  get nextValue() { throw new NotImplementedError(); }

  /** @abstract */
  get cost() { throw new NotImplementedError(); }
  /** @abstract */
  set cost(value) { throw new Error("Use baseCost to set cost"); }

  /** @abstract */
  get costIncrease() { throw new NotImplementedError(); }

  get baseCost() { return this.cost; }
  /** @abstract */
  set baseCost(value) { throw new NotImplementedError(); }

  get cap() { return undefined; }
  get isCapped() { return false; }

  /** @abstract */
  get autobuyerMilestone() { throw new NotImplementedError(); }

  get canBeBought() {
    return !this.isCapped && Currency.infinityPoints.gte(this.cost) && player.eterc8repl !== 0;
  }

  purchase() {
    if (!this.canBeBought) return;
    Currency.infinityPoints.subtract(this.cost);
    this.baseCost = Decimal.times(this.baseCost, this.costIncrease);
    this.value = this.nextValue;
    if (EternityChallenge(8).isRunning) player.eterc8repl--;
    GameUI.update();
  }

  autobuyerTick() {
    while (this.canBeBought) {
      this.purchase();
    }
  }
}

const ReplicantiUpgrade = {
  chance: new class ReplicantiChanceUpgrade extends ReplicantiUpgradeState {
    get id() { return 1; }

    get value() { return player.replicanti.chance; }
    set value(value) { player.replicanti.chance = value; }

    get nextValue() {
      return this.nearestPercent(this.value + 0.01);
    }

    get cost() { return player.replicanti.chanceCost; }

    get baseCost() { return this.cost; }
    set baseCost(value) { player.replicanti.chanceCost = value; }

    get costIncrease() { return 1e15; }

    get cap() {
      // Chance never goes over 100%.
      return 1;
    }

    get isCapped() {
      return this.nearestPercent(this.value) >= this.cap;
    }

    get autobuyerMilestone() {
      return EternityMilestone.autobuyerReplicantiChance;
    }

    autobuyerTick() {
      // Fixed price increase of 1e15; so total cost for N upgrades is:
      // cost + cost * 1e15 + cost * 1e30 + ... + cost * 1e15^(N-1) == cost * (1e15^N - 1) / (1e15 - 1)
      // N = log(IP * (1e15 - 1) / cost + 1) / log(1e15)
      let N = Currency.infinityPoints.value.times(this.costIncrease - 1)
              .dividedBy(this.cost).plus(1).log(this.costIncrease);
      N = Math.round((Math.min(this.value + 0.01 * Math.floor(N), this.cap) - this.value) * 100);
      if (N <= 0) return;
      const totalCost = this.cost.times(Decimal.pow(this.costIncrease, N).minus(1).dividedBy(this.costIncrease - 1));
      Currency.infinityPoints.subtract(totalCost);
      this.baseCost = this.baseCost.times(Decimal.pow(this.costIncrease, N));
      this.value = this.nearestPercent(this.value + 0.01 * N);
    }

    // Rounding errors suck
    nearestPercent(x) {
      return Math.round(100 * x) / 100;
    }
  }(),
  interval: new class ReplicantiIntervalUpgrade extends ReplicantiUpgradeState {
    get id() { return 2; }

    get value() { return player.replicanti.interval; }
    set value(value) { player.replicanti.interval = value; }

    get nextValue() {
      return Math.max(this.value * 0.9, this.cap);
    }

    get cost() { return player.replicanti.intervalCost; }

    get baseCost() { return this.cost; }
    set baseCost(value) { player.replicanti.intervalCost = value; }

    get costIncrease() { return 1e10; }

    get cap() {
      return Effects.min(50, TimeStudy(22));
    }

    get isCapped() {
      return this.value <= this.cap;
    }

    get autobuyerMilestone() {
      return EternityMilestone.autobuyerReplicantiInterval;
    }

    applyModifiers(value) {
      return getReplicantiInterval(undefined, value);
    }
  }(),
  galaxies: new class ReplicantiGalaxiesUpgrade extends ReplicantiUpgradeState {
    get id() { return 3; }

    get value() { return player.replicanti.boughtGalaxyCap; }
    set value(value) { player.replicanti.boughtGalaxyCap = value; }

    get nextValue() {
      return this.value + 1;
    }

    get cost() { return this.baseCost.dividedByEffectOf(TimeStudy(233)); }

    get baseCost() { return player.replicanti.galCost; }
    set baseCost(value) { player.replicanti.galCost = value; }

    get distantRGStart() {
      return 100 + Effects.sum(GlyphSacrifice.replication);
    }

    get remoteRGStart() {
      return 1000 + Effects.sum(GlyphSacrifice.replication);
    }

    get costIncrease() {
      const galaxies = this.value;
      let increase = EternityChallenge(6).isRunning
        ? Decimal.pow(1e2, galaxies).times(1e2)
        : Decimal.pow(1e5, galaxies).times(1e25);
      if (galaxies >= this.distantRGStart) {
        increase = increase.times(Decimal.pow(1e50, galaxies - this.distantRGStart + 5));
      }
      if (galaxies >= this.remoteRGStart) {
        increase = increase.times(Decimal.pow(1e5, Math.pow(galaxies - this.remoteRGStart + 1, 2)));
      }
      return increase;
    }

    get autobuyerMilestone() {
      return EternityMilestone.autobuyerReplicantiMaxGalaxies;
    }

    get extra() {
      return Effects.max(0, TimeStudy(131));
    }

    autobuyerTick() {
      // This isn't a hot enough autobuyer to worry about doing an actual inverse.
      const bulk = bulkBuyBinarySearch(Currency.infinityPoints.value, {
        costFunction: x => this.baseCostAfterCount(x).dividedByEffectOf(TimeStudy(233)),
        firstCost: this.cost,
        comulative: true,
      }, this.value);
      if (!bulk) return;
      this.value += bulk.quantity;
      this.baseCost = this.baseCostAfterCount(this.value);
    }

    baseCostAfterCount(count) {
      const logBase = 170;
      const logBaseIncrease = EternityChallenge(6).isRunning ? 2 : 25;
      const logCostScaling = EternityChallenge(6).isRunning ? 2 : 5;
      const distantReplicatedGalaxyStart = 100 + Effects.sum(GlyphSacrifice.replication);
      const remoteReplicatedGalaxyStart = 1000 + Effects.sum(GlyphSacrifice.replication);
      let logCost = logBase + count * logBaseIncrease + (count * (count - 1) / 2) * logCostScaling;
      if (count > distantReplicatedGalaxyStart) {
        const logDistantScaling = 50;
        // When distant scaling kicks in, the price increase jumps by a few extra steps.
        // So, the difference between successive scales goes 5, 5, 5, 255, 55, 55, ...
        const extraIncrements = 5;
        const numDistant = count - distantReplicatedGalaxyStart;
        logCost += logDistantScaling * numDistant * (numDistant + 2 * extraIncrements - 1) / 2;
      }
      if (count > remoteReplicatedGalaxyStart) {
        const logRemoteScaling = 5;
        const numRemote = count - remoteReplicatedGalaxyStart;
        // The formula x * (x + 1) * (2 * x + 1) / 6 is the sum of the first n squares.
        logCost += logRemoteScaling * numRemote * (numRemote + 1) * (2 * numRemote + 1) / 6;
      }
      return Decimal.pow10(logCost);
    }
  }(),
};

const Replicanti = {
  get areUnlocked() {
    return player.replicanti.unl;
  },
  reset(force = false) {
    player.replicanti.unl = force ? false : EternityMilestone.unlockReplicanti.isReached;
    player.replicanti.amount = player.replicanti.unl ? new Decimal(1) : new Decimal(0);
    player.replicanti.timer = 0;
    player.replicanti.chance = 0.01;
    player.replicanti.chanceCost = new Decimal(1e150);
    player.replicanti.interval = 1000;
    player.replicanti.intervalCost = new Decimal(1e140);
    player.replicanti.boughtGalaxyCap = 0;
    player.replicanti.galaxies = 0;
    player.replicanti.galCost = new Decimal(1e170);
  },
  unlock(freeUnlock = false) {
    if (player.replicanti.unl) return;
    if (freeUnlock || Currency.infinityPoints.exponent >= 1e140) {
      if (!freeUnlock) Currency.infinityPoints.subtract(1e140);
      player.replicanti.unl = true;
      player.replicanti.timer = 0;
      player.replicanti.amount = new Decimal(1);
    }
  },
  get amount() {
    return player.replicanti.amount;
  },
  get chance() {
    return ReplicantiUpgrade.chance.value;
  },
  galaxies: {
    isPlayerHoldingR: false,
    get bought() {
      return player.replicanti.galaxies;
    },
    get extra() {
      return Math.floor((Effects.sum(
        TimeStudy(225),
        TimeStudy(226)
      ) + Effarig.bonusRG) * TriadStudy(3).effectOrDefault(1));
    },
    get total() {
      return this.bought + this.extra;
    },
    get max() {
      return ReplicantiUpgrade.galaxies.value + ReplicantiUpgrade.galaxies.extra;
    },
    get canBuyMore() {
      if (!Replicanti.amount.gte(Decimal.NUMBER_MAX_VALUE)) return false;
      return this.bought < this.max;
    },
    get areBeingBought() {
      const buyer = Autobuyer.replicantiGalaxy;
      return (buyer.isActive && buyer.isEnabled) || this.isPlayerHoldingR;
    },
  },
};
