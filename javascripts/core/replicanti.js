var repMs = 0;

// Slowdown parameters for replicanti growth, interval will increase by SCALE_FACTOR for every SCALE_LOG10
// OoM past the cap(default is 308, 1.2, Number.MAX_VALUE)
const ReplicantiGrowth = {
  SCALE_LOG10: 308,
  SCALE_FACTOR: 1.2,
};

// Rounding errors suck
function nearestPercent(x) {
  return Math.round(100 * x) / 100;
}

function replicantiGalaxy() {
  if (!Replicanti.galaxies.canBuyMore) return;
  player.reality.upgReqChecks[0] = false;
  let galaxyGain = 1;
  if (Achievement(126).isEnabled) {
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
  player.replicanti.galaxies += galaxyGain;
  // Galaxy count will be increased inside galaxyReset
  player.galaxies -= 1;
  galaxyReset();
}

// Produces replicanti quickly below e308, will auto-bulk-RG if production is fast enough
function fastReplicantiBelow308(gainFactor, isAutobuyerActive) {
  if (!isAutobuyerActive) {
    player.replicanti.amount = Decimal.min(replicantiCap(), player.replicanti.amount.times(gainFactor));
    return;
  }
  const replicantiExponent = gainFactor.log10() + player.replicanti.amount.log10();
  const toBuy = Ra.isRunning
    ? 0
    : Math.floor(Math.min(replicantiExponent / 308, Replicanti.galaxies.max - player.replicanti.galaxies));
  player.replicanti.amount = Decimal.min(replicantiCap(), Decimal.pow10(replicantiExponent - 308 * toBuy));
  player.replicanti.galaxies += toBuy;
}

function replicantiGalaxyAutoToggle(forcestate) {
  player.replicanti.galaxybuyer = !player.replicanti.galaxybuyer || forcestate === true;
}

function getReplicantiInterval(noMod, intervalIn) {
  let interval = intervalIn || player.replicanti.interval;
  if (TimeStudy(133).isBought || (player.replicanti.amount.gt(replicantiCap()) || noMod)) interval *= 10;
  interval /= Effects.product(
    TimeStudy(62),
    TimeStudy(213),
    RealityUpgrade(2)
  );
  interval /= getAdjustedGlyphEffect("replicationspeed");
  if (player.replicanti.amount.lte(replicantiCap()) || noMod) {
    if (Achievement(134).isEnabled) interval /= 2;
  } else {
    const increases = (player.replicanti.amount.log10() - replicantiCap().log10()) / ReplicantiGrowth.SCALE_LOG10;
    interval = Math.max(interval, interval * Math.pow(ReplicantiGrowth.SCALE_FACTOR, increases));
  }
  interval /= Effects.product(
    RealityUpgrade(6),
    RealityUpgrade(23)
  );
  if (V.isRunning) {
    interval = interval > 1 ? Math.pow(interval, 2) : Math.sqrt(interval);
  }
  return interval;
}

function replicantiCap() {
  return EffarigUnlock.infinity.isUnlocked ?
    player.infinitied.plus(player.infinitiedBank).pow(TimeStudy(31).isBought ? 120 : 30).times(Number.MAX_VALUE) :
    new Decimal(Number.MAX_VALUE);
}

function replicantiLoop(diff) {
    if (diff > repMs) {
        diff -= repMs;
        repMs = 0;
    } else {
        repMs -= diff;
        return;
    }
    PerformanceStats.start("Replicanti");
    let interval = getReplicantiInterval();
    let isRGAutobuyerEnabled = player.replicanti.galaxybuyer && (!TimeStudy(131).isBought || Achievement(138).isEnabled)
    var logReplicanti = player.replicanti.amount.clampMin(1).ln();
    const isUncapped = TimeStudy(192).isBought;
    if (player.replicanti.unl && (diff > 500 || interval < 50 || isUncapped)) {
      // Gain code for sufficiently fast or large amounts of replicanti (growth per tick == chance * amount)
      const postScale = Math.log10(ReplicantiGrowth.SCALE_FACTOR) / ReplicantiGrowth.SCALE_LOG10;
      const logGainFactorPerTick = diff / 1000 * (Math.log(player.replicanti.chance + 1) * 1000 / interval);
      if (isUncapped) player.replicanti.amount = Decimal.pow(Math.E, logReplicanti + Math.log(logGainFactorPerTick * postScale + 1) / postScale)
      else fastReplicantiBelow308(Decimal.pow(Math.E, logGainFactorPerTick), isRGAutobuyerEnabled)
      replicantiTicks = 0
    } else {
        if (interval <= replicantiTicks && player.replicanti.unl) {
          // Gain code for slow replicanti (multiple game ticks per replicanti tick)
            if (player.replicanti.amount.lte(100)) {
              // When less than 100 replicanti, simulate each replicanti with an independent chance of replicating
                var temp = player.replicanti.amount
                for (var i=0; temp.gt(i); i++) {
                    if (player.replicanti.chance > Math.random()) player.replicanti.amount = player.replicanti.amount.plus(1)
                }
            } else {
              // When more than 100 replicanti, simulate 100 groups of replicanti that have independent chances of replicating
              var temp = Decimal.round(player.replicanti.amount.dividedBy(100))
              let replicatedGroups = 0
              for (var i=0; i<100; i++) {
                if (player.replicanti.chance > Math.random()) {
                  replicatedGroups++;
                }
              }
              player.replicanti.amount = player.replicanti.amount.times(1 + replicatedGroups / 100)
              if (!isUncapped) player.replicanti.amount = Decimal.min(replicantiCap(), player.replicanti.amount)
            }
            replicantiTicks -= interval
        }
    }
    if (player.replicanti.amount !== 0 && player.replicanti.unl) replicantiTicks += player.options.updateRate

    if (logReplicanti == Decimal.ln(Number.MAX_VALUE) && player.thisInfinityTime < 60000*30) giveAchievement("Is this safe?");
    if (player.replicanti.galaxies >= 10 && player.thisInfinityTime < 15000) giveAchievement("The swarm");

    if (isRGAutobuyerEnabled && player.replicanti.amount.gte(Number.MAX_VALUE)) {
      replicantiGalaxy();
    }
    PerformanceStats.end();
}

function replicantiMult() {
  return Decimal.pow(Decimal.log2(player.replicanti.amount), 2)
    .plusEffectOf(TimeStudy(21))
    .timesEffectOf(TimeStudy(102))
    .pow(getAdjustedGlyphEffect("replicationpow"));
}

function autoBuyReplicantiUpgrades() {
  if (EternityChallenge(8).isRunning) return;
  ReplicantiUpgrade.chance.autobuyerTick();
  ReplicantiUpgrade.interval.autobuyerTick();
  ReplicantiUpgrade.galaxies.autobuyerTick();
}

/** @abstract */
class ReplicantiUpgradeState {
  /** @abstract */
  get value() { throw NotImplementedCrash(); }

  /** @abstract */
  set value(value) { throw NotImplementedCrash(); }

  /** @abstract */
  get nextValue() { throw NotImplementedCrash(); }

  /** @abstract */
  get cost() { throw NotImplementedCrash(); }
  /** @abstract */
  set cost(value) { throw crash("Use baseCost to set cost"); }

  /** @abstract */
  get costIncrease() { throw NotImplementedCrash(); }

  get baseCost() { return this.cost; }
  /** @abstract */
  set baseCost(value) { throw NotImplementedCrash(); }

  get cap() { return undefined; }
  get isCapped() { return false; }

  /** @abstract */
  get autobuyerMilestone() { throw NotImplementedCrash(); }
  /** @abstract */
  get autobuyerId() { throw NotImplementedCrash(); }

  get isAutobuyerUnlocked() { return this.autobuyerMilestone.isReached; }

  get isAutobuyerOn() { return player.replicanti.auto[this.autobuyerId]; }
  set isAutobuyerOn(value) { player.replicanti.auto[this.autobuyerId] = value; }

  get canBeBought() {
    return !this.isCapped && player.infinityPoints.gte(this.cost) && player.eterc8repl !== 0;
  }

  purchase() {
    if (!this.canBeBought) return;
    player.infinityPoints = player.infinityPoints.minus(this.cost);
    this.baseCost = Decimal.times(this.baseCost, this.costIncrease);
    this.value = this.nextValue;
    if (EternityChallenge(8).isRunning) player.eterc8repl--;
    GameUI.update();
  }

  autobuyerTick() {
    if (!this.isAutobuyerUnlocked || !this.isAutobuyerOn) return;
    while (this.canBeBought) {
      this.purchase();
    }
  }
}

const ReplicantiUpgrade = {
  chance: new class ReplicantiChanceUpgrade extends ReplicantiUpgradeState {
    get value() { return player.replicanti.chance; }
    set value(value) { player.replicanti.chance = value; }

    get nextValue() {
      return nearestPercent(this.value + 0.01);
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
      return nearestPercent(this.value) >= this.cap;
    }

    get autobuyerMilestone() {
      return EternityMilestone.autobuyerReplicantiChance;
    }

    get autobuyerId() { return 0; }

    autobuyerTick() {
      if (!this.isAutobuyerUnlocked || !this.isAutobuyerOn) return;
      // Fixed price increase of 1e15; so total cost for N upgrades is:
      // cost + cost * 1e15 + cost * 1e30 + ... + cost * 1e15^(N-1) == cost * (1e15^N - 1) / (1e15 - 1)
      // N = log(IP * (1e15 - 1) / cost + 1) / log(1e15)
      let N = player.infinityPoints.times(this.costIncrease - 1).dividedBy(this.cost).plus(1).log(this.costIncrease);
      N = Math.round((Math.min(this.value + 0.01 * Math.floor(N), this.cap) - this.value) * 100);
      if (N <= 0) return;
      const totalCost = this.cost.times(Decimal.pow(this.costIncrease, N).minus(1).dividedBy(this.costIncrease - 1));
      player.infinityPoints = player.infinityPoints.minus(totalCost);
      this.baseCost = this.baseCost.times(Decimal.pow(this.costIncrease, N));
      this.value = nearestPercent(this.value + 0.01 * N);
    }
  }(),
  interval: new class ReplicantiIntervalUpgrade extends ReplicantiUpgradeState {
    get value() { return player.replicanti.interval; }
    set value(value) { player.replicanti.interval = value; }

    get nextValue() {
      return Math.max(this.value * 0.9, this.cap);
    }

    get cost() { return player.replicanti.intervalCost; }

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

    get autobuyerId() { return 1; }

    applyModifiers(value) {
      return getReplicantiInterval(false, value);
    }
  }(),
  galaxies: new class ReplicantiGalaxiesUpgrade extends ReplicantiUpgradeState {
    get value() { return player.replicanti.gal; }
    set value(value) { player.replicanti.gal = value; }

    get nextValue() {
      return this.value + 1;
    }

    get cost() { return this.baseCost.dividedByEffectOf(TimeStudy(233)); }

    get baseCost() { return player.replicanti.galCost; }
    set baseCost(value) { player.replicanti.galCost = value; }

    get costIncrease() {
      const galaxies = this.value;
      let increase = EternityChallenge(6).isRunning ?
        Decimal.pow(1e2, galaxies).times(1e2) :
        Decimal.pow(1e5, galaxies).times(1e25);
      const distantReplicatedGalaxyStart = 100 + Effects.sum(GlyphSacrifice.replication);
      if (galaxies >= distantReplicatedGalaxyStart) {
        increase = increase.times(Decimal.pow(1e50, galaxies - distantReplicatedGalaxyStart + 5));
      }
      return increase;
    }

    get autobuyerMilestone() {
      return EternityMilestone.autobuyerReplicantiMaxGalaxies;
    }

    get autobuyerId() { return 2; }

    get extra() {
      return Effects.max(0, TimeStudy(131));
    }

    autobuyerTick() {
      // This isn't a hot enough autobuyer to worry about doing an actual inverse.
      if (!this.isAutobuyerUnlocked || !this.isAutobuyerOn) return;
      const bulk = bulkBuyBinarySearch(player.infinityPoints, {
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
      let logCost = logBase + count * logBaseIncrease + (count * (count - 1) / 2) * logCostScaling;
      if (count > distantReplicatedGalaxyStart) {
        const logDistantScaling = 50;
        // When distant scaling kicks in, the price increase jumps by a few extra steps.
        // So, the difference between successive scales goes 5, 5, 5, 255, 55, 55, ...
        const extraIncrements = 5;
        const numDistant = count - distantReplicatedGalaxyStart;
        logCost += logDistantScaling * numDistant * (numDistant + 2 * extraIncrements - 1) / 2;
      }
      return Decimal.pow10(logCost);
    }
  }(),
};

const Replicanti = {
  get areUnlocked() {
    return player.replicanti.unl;
  },
  unlock() {
    if (!player.infinityPoints.gte(1e140) || player.replicanti.unl) return;
    player.replicanti.unl = true;
    player.replicanti.amount = new Decimal(1);
    player.infinityPoints = player.infinityPoints.minus(1e140);
  },
  get amount() {
    return player.replicanti.amount;
  },
  get chance() {
    return ReplicantiUpgrade.chance.value;
  },
  galaxies: {
    get bought() {
      return player.replicanti.galaxies;
    },
    get extra() {
      return Effects.sum(
        TimeStudy(225),
        TimeStudy(226)
      ) + Effarig.bonusRG;
    },
    get total() {
      return this.bought + this.extra;
    },
    get max() {
      return ReplicantiUpgrade.galaxies.value + ReplicantiUpgrade.galaxies.extra;
    },
    get canBuyMore() {
      if (Ra.isRunning) return false
      if (!Replicanti.amount.gte(Number.MAX_VALUE)) return false;
      return this.bought < this.max;
    },
    autobuyer: {
      get isUnlocked() {
        return player.replicanti.galaxybuyer !== undefined;
      },
      get isOn() {
        return player.replicanti.galaxybuyer;
      },
      set isOn(value) {
        player.replicanti.galaxybuyer = value;
      },
      toggle() {
        if (!this.isUnlocked) return;
        this.isOn = !this.isOn;
      },
      get isEnabled() {
        return !TimeStudy(131).isBought || Achievement(138).isEnabled;
      }
    }
  },
};
