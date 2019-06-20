"use strict";

const Autobuyer = function Autobuyer(interval) {
    this.target = 1;
    this.cost = 1;
    this.interval = interval;
    this.priority = 1;
    this.ticks = 0;
    this.isOn = false;
    this.bulk = 1;
};

Autobuyer.tickTimer = 0;
Autobuyer.intervalTimer = 0;
Autobuyer.lastDimBoost = 0;
Autobuyer.lastGalaxy = 0;

class AutobuyerState {
  constructor(getAutobuyer) {
    this._getAutobuyer = getAutobuyer;
  }

  /**
   * @returns {Autobuyer|undefined}
   */
  get autobuyer() {
    // What
    const autobuyer = this._getAutobuyer();
    return autobuyer % 1 !== 0 ? autobuyer : undefined;
  }

  /**
   * @returns {boolean}
   */
  get isUnlocked() {
    return this.autobuyer !== undefined;
  }

  tryUnlock() {
    if (!this.isUnlocked && this.challenge.isCompleted) {
      this.initialize();
    }
  }

  /**
   * @returns {NormalChallengeState|InfinityChallengeState}
   */
  get challenge() {
    throw "This method should be overridden in inheriting class";
  }

  initialize() {
    throw "This method should be overridden in inheriting class";
  }

  /**
   * @returns {boolean}
   */
  get isOn() {
    return this.autobuyer.isOn;
  }

  /**
   * @param {boolean} value
   */
  set isOn(value) {
    this.autobuyer.isOn = value;
  }

  /**
   * @returns {number}
   */
  get cost() {
    return this.autobuyer.cost;
  }

  /**
   * @param {number} value
   */
  set cost(value) {
    this.autobuyer.cost = value;
  }

  /**
   * @returns {number}
   */
  get ticks() {
    return this.autobuyer.ticks;
  }

  /**
   * @param {number} value
   */
  set ticks(value) {
    this.autobuyer.ticks = value;
  }

  /**
   * @returns {boolean}
   */
  canTick() {
    if (!this.isUnlocked) return false;
    if (this.ticks * 100 < this.interval) {
      this.ticks++;
      return false;
    }
    return this.isOn;
  }

  resetTicks() {
    this.ticks = 1;
  }

  /**
   * @returns {number}
   */
  get priority() {
    return this.autobuyer.priority;
  }

  /**
   * @param {number} value
   */
  set priority(value) {
    this.autobuyer.priority = value;
  }

  /**
   * @returns {number}
   */
  get interval() {
    return this.autobuyer.interval;
  }

  /**
   * @param {number} value
   */
  set interval(value) {
    this.autobuyer.interval = value;
  }

  /**
   * @returns {boolean}
   */
  get hasMaxedInterval() {
    return this.isUnlocked && this.interval <= 100;
  }

  /**
   * @returns {number}
   */
  get bulk() {
    return this.autobuyer.bulk;
  }

  /**
   * @param {number} value
   */
  set bulk(value) {
    this.autobuyer.bulk = value;
  }

  /**
   * @returns {boolean}
   */
  get isActive() {
    return this.isUnlocked && this.autobuyer.isOn;
  }

  toggle() {
    this.isOn = !this.isOn;
  }

  upgradeInterval() {
    if (this.hasMaxedInterval) return;
    if (player.infinityPoints.lt(this.cost)) return;
    player.infinityPoints = player.infinityPoints.minus(this.cost);
    this.interval = Math.max(this.interval * 0.6, 100);
    if (this.interval > 120) {
      // if your last purchase wont be very strong, dont double the cost
      this.cost *= 2;
    }
    Autobuyer.checkIntervalAchievements();
    GameUI.update();
  }
}

class DimensionAutobuyerState extends AutobuyerState {
  constructor(tier) {
    super(() => player.autobuyers[tier - 1]);
    this._tier = tier;
  }

  initialize() {
    const baseIntervals = [
      null,
      1500,
      2000,
      2500,
      3000,
      4000,
      5000,
      6000,
      7500,
    ];
    player.autobuyers[this._tier - 1] = new Autobuyer(baseIntervals[this._tier]);
  }

  get challenge() {
    return NormalChallenge(this._tier);
  }

  /**
   * @returns {boolean}
   */
  get hasMaxedBulk() {
    return this.isUnlocked && this.bulk >= 1e100;
  }

  /**
   * @returns {AutobuyerMode}
   */
  get mode() {
    return this.autobuyer.target;
  }

  /**
   * @param {AutobuyerMode} value
   */
  set mode(value) {
    this.autobuyer.target = value;
  }

  toggleMode() {
    this.mode = this.mode === AutobuyerMode.BUY_SINGLE ? AutobuyerMode.BUY_10 : AutobuyerMode.BUY_SINGLE;
  }

  tick() {
    if (!this.canTick()) return;
    const tier = this._tier;
    if (!NormalDimension(tier).isAvailable) return;
    if (this.mode === AutobuyerMode.BUY_SINGLE) {
      buyOneDimension(tier);
    }
    else {
      const bulk = player.options.bulkOn ? this.bulk : 1;
      buyManyDimensionAutobuyer(tier, bulk);
    }
    this.resetTicks();
  }

  upgradeBulk() {
    if (this.hasMaxedBulk) return;
    if (player.infinityPoints.lt(this.cost)) return;
    player.infinityPoints = player.infinityPoints.minus(this.cost);
    this.bulk = Math.min(this.bulk * 2, 1e100);
    this.cost = Math.ceil(2.4 * this.cost);
    Autobuyer.checkBulkAchievements();
    GameUI.update();
  }
}

Autobuyer.dim = tier => new DimensionAutobuyerState(tier);

Autobuyer.allDims = Array.dimensionTiers.map(Autobuyer.dim);

class TickspeedAutobuyerState extends AutobuyerState {
  constructor() {
    super(() => player.autobuyers[8]);
  }

  initialize() {
    player.autobuyers[8] = new Autobuyer(5000);
  }

  get challenge() {
    return NormalChallenge(9);
  }

  /**
   * @returns {AutobuyerMode}
   */
  get mode() {
    return this.autobuyer.target;
  }

  /**
   * @param {AutobuyerMode} value
   */
  set mode(value) {
    this.autobuyer.target = value;
  }

  toggleMode() {
    this.mode = this.mode === AutobuyerMode.BUY_SINGLE ? AutobuyerMode.BUY_MAX : AutobuyerMode.BUY_SINGLE;
  }

  tick() {
    if (!this.canTick()) return;
    if (this.mode === AutobuyerMode.BUY_SINGLE) {
      buyTickSpeed();
    }
    else {
      buyMaxTickSpeed();
    }
    this.resetTicks();
  }
}

Autobuyer.tickspeed = new TickspeedAutobuyerState();

Autobuyer.priorityQueue = function() {
  const autobuyers = Array.range(1, 8).map(tier => Autobuyer.dim(tier));
  autobuyers.push(Autobuyer.tickspeed);
  return autobuyers
    .filter(autobuyer => autobuyer.isUnlocked)
    .sort((a, b) => a.priority - b.priority);
};

class DimboostAutobuyerState extends AutobuyerState {
  constructor() {
    super(() => player.autobuyers[9]);
  }

  initialize() {
    player.autobuyers[9] = new Autobuyer(8000);
  }

  get challenge() {
    return NormalChallenge(10);
  }

  /**
   * @returns {number}
   */
  get maxDimBoosts() {
    return this.priority;
  }

  /**
   * @param {number} value
   */
  set maxDimBoosts(value) {
    this.priority = value;
  }

  /**
   * @returns {boolean}
   */
  get isBulkBuyUnlocked() {
    return BreakInfinityUpgrade.bulkDimBoost.isBought || this.isBuyMaxUnlocked;
  }

  /**
   * @returns {boolean}
   */
  get isBuyMaxUnlocked() {
    return EternityMilestone.autobuyMaxDimboosts.isReached;
  }

  /**
   * @returns {number}
   */
  get galaxies() {
    return player.overXGalaxies;
  }

  /**
   * @param {number} value
   */
  set galaxies(value) {
    player.overXGalaxies = value;
  }

  /**
   * @returns {number}
   */
  get buyMaxInterval() {
    return this.bulk;
  }

  /**
   * @param {number} value
   */
  set buyMaxInterval(value) {
    this.bulk = value;
  }

  tick() {
    if (Ra.isRunning) return;
    if (!this.canTick()) return;
    if (this.isBuyMaxUnlocked) {
      if (Autobuyer.intervalTimer - Autobuyer.lastDimBoost >= this.buyMaxInterval) {
        Autobuyer.lastDimBoost = Autobuyer.intervalTimer;
        maxBuyDimBoosts();
      }
      return;
    }
    if (this.maxDimBoosts <= player.resets && this.galaxies > player.galaxies) {
      return;
    }
    if (this.isBulkBuyUnlocked && !DimBoost.isShift) {
      var bulk = Math.max(this.bulk, 1);
      if (!DimBoost.bulkRequirement(bulk).isSatisfied) return;
      softReset(bulk);
    }
    else {
      if (!DimBoost.requirement.isSatisfied) return;
      softReset(1);
    }
    this.resetTicks();
  }
}

Autobuyer.dimboost = new DimboostAutobuyerState();

class GalaxyAutobuyerState extends AutobuyerState {
  constructor() {
    super(() => player.autobuyers[10]);
  }

  initialize() {
    player.autobuyers[10] = new Autobuyer(150000);
  }

  get challenge() {
    return NormalChallenge(11);
  }

  /**
   * @returns {number}
   */
  get limit() {
    return this.priority;
  }

  /**
   * @param {number} value
   */
  set limit(value) {
    this.priority = value;
  }

  /**
   * @returns {boolean}
   */
  get isBuyMaxUnlocked() {
    return EternityMilestone.autobuyMaxGalaxies.isReached;
  }

  /**
   * @returns {number}
   */
  get buyMaxInterval() {
    return this.bulk;
  }

  /**
   * @param {number} value
   */
  set buyMaxInterval(value) {
    this.bulk = value;
  }

  tick() {
    if (!this.canTick()) return;
    if (!Galaxy.requirement.isSatisfied) return;
    if (this.limit <= player.galaxies) return;
    if (this.isBuyMaxUnlocked && this.buyMaxInterval > 0) {
      this.buyMax();
    }
    else {
      this.buySingle();
      this.resetTicks();
    }
  }

  buyMax() {
    if (Autobuyer.intervalTimer - Autobuyer.lastGalaxy >= this.buyMaxInterval) {
      Autobuyer.lastGalaxy = Autobuyer.intervalTimer;
      maxBuyGalaxies();
    }
  }

  buySingle() {
    galaxyResetBtnClick();
  }
}

Autobuyer.galaxy = new GalaxyAutobuyerState();

class SacrificeAutobuyerState extends AutobuyerState {
  constructor() {
    super(() => player.autoSacrifice);
  }

  initialize() {
    player.autoSacrifice = new Autobuyer(100);
    this.limit = new Decimal(5);
  }

  get challenge() {
    return InfinityChallenge(2);
  }

  /**
   * @returns {Decimal}
   */
  get limit() {
    return this.autobuyer.priority;
  }

  /**
   * @param {Decimal} value
   */
  set limit(value) {
    this.autobuyer.priority = value;
  }

  tick() {
    if (!this.canTick()) return;
    if (!Sacrifice.nextBoost.gte(this.limit)) return;
    sacrificeReset(true);
    this.resetTicks();
  }
}

Autobuyer.sacrifice = new SacrificeAutobuyerState();

class InfinityAutobuyerState extends AutobuyerState {
  constructor() {
    super(() => player.autobuyers[11]);
  }

  initialize() {
    player.autobuyers[11] = new Autobuyer(300000);
    this.limit = new Decimal(1);
  }

  get challenge() {
    return NormalChallenge(12);
  }

  /**
   * @returns {AutoCrunchMode}
   */
  get mode() {
    return player.autoCrunchMode;
  }

  /**
   * @param {AutoCrunchMode} value
   */
  set mode(value) {
    player.autoCrunchMode = value;
  }

  /**
   * @returns {boolean}
   */
  get hasAdditionalModes() {
    return EternityMilestone.bigCrunchModes.isReached;
  }

  /**
   * @returns {Decimal}
   */
  get limit() {
    return this.autobuyer.priority;
  }

  /**
   * @param {Decimal} value
   */
  set limit(value) {
    this.autobuyer.priority = value;
  }

  bumpLimit(mult) {
    if (this.isUnlocked && this.mode === AutoCrunchMode.AMOUNT) {
      this.limit = this.limit.times(mult);
    }
  }

  toggleMode() {
    this.mode = Object.values(AutoCrunchMode).nextSibling(this.mode);
  }

  tick() {
    if (!this.canTick()) return;
    if (!player.money.gte(Decimal.MAX_NUMBER)) return;
    let proc = !player.break || NormalChallenge.isRunning || InfinityChallenge.isRunning;
    if (!proc) {
      switch (this.mode) {
        case AutoCrunchMode.AMOUNT:
          proc = gainedInfinityPoints().gte(this.limit);
          break;
        case AutoCrunchMode.TIME:
          proc = Decimal.gt(Time.thisInfinityRealTime.totalSeconds, this.limit);
          break;
        case AutoCrunchMode.RELATIVE:
          proc = gainedInfinityPoints().gte(player.lastTenRuns[0][1].times(this.limit));
          break;
      }
    }
    if (proc) {
      bigCrunchResetRequest();
    }
    this.resetTicks();
  }
}

Autobuyer.infinity = new InfinityAutobuyerState();

/**
 * @type {AutobuyerState[]}
 */
Autobuyer.unlockables = Autobuyer.allDims
  .concat([
    Autobuyer.tickspeed,
    Autobuyer.dimboost,
    Autobuyer.galaxy,
    Autobuyer.sacrifice,
    Autobuyer.infinity
  ]);

Autobuyer.tryUnlockAny = function() {
  for (const autobuyer of this.unlockables) {
    autobuyer.tryUnlock();
  }
};

Autobuyer.resetUnlockables = function() {
  player.autobuyers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  Autobuyer.tryUnlockAny();
};

Autobuyer.eternity = {
  /**
   * @returns {boolean}
   */
  get isUnlocked() {
    return EternityMilestone.autobuyerEternity.isReached;
  },
  /**
   * @returns {boolean}
   */
  get hasAdditionalModes() {
    return RealityUpgrade(13).isBought;
  },
  /**
   * @returns {boolean}
   */
  get isOn() {
    return player.eternityBuyer.isOn;
  },
  /**
   * @param {boolean} value
   */
  set isOn(value) {
    player.eternityBuyer.isOn = value;
  },
  toggle() {
    this.isOn = !this.isOn;
  },
  /**
   * @returns {boolean}
   */
  get isActive() {
    return this.isUnlocked && this.isOn;
  },
  /**
   * @returns {Decimal}
   */
  get limit() {
    return player.eternityBuyer.limit;
  },
  /**
   * @param {Decimal} value
   */
  set limit(value) {
    player.eternityBuyer.limit = value;
  },
  bumpLimit(mult) {
    if (this.isUnlocked && this.mode === AutoEternityMode.AMOUNT) {
      this.limit = this.limit.times(mult);
    }
  },
  /**
   * @returns {AutoEternityMode}
   */
  get mode() {
    return player.autoEternityMode;
  },
  /**
   * @param {AutoEternityMode} value
   */
  set mode(value) {
    player.autoEternityMode = value;
  },
  toggleMode() {
    this.mode = Object.values(AutoEternityMode).nextSibling(this.mode);
  },
  tick() {
    if (!this.isActive) return;
    let proc = false;
    switch (this.mode) {
      case AutoEternityMode.AMOUNT:
        proc = EternityChallenge.isRunning || gainedEternityPoints().gte(this.limit);
        break;
      case AutoEternityMode.TIME:
        proc = Decimal.gt(Time.thisEternityRealTime.totalSeconds, this.limit)
        break;
      case AutoEternityMode.RELATIVE:
        proc = gainedEternityPoints().gte(player.lastTenEternities[0][1].times(this.limit));
        break;
    }
    if (proc) eternity(false, true);
  }
};

Autobuyer.reality = {
  /**
   * @returns {boolean}
   */
  get isUnlocked() {
    return RealityUpgrade(25).isBought;
  },
  /**
   * @returns {boolean}
   */
  get isOn() {
    return player.realityBuyer.isOn;
  },
  /**
   * @param {boolean} value
   */
  set isOn(value) {
    player.realityBuyer.isOn = value;
  },
  toggle() {
    this.isOn = !this.isOn;
  },
  /**
   * @returns {boolean}
   */
  get isActive() {
    return this.isUnlocked && this.isOn;
  },
  /**
   * @returns {Decimal}
   */
  get rm() {
    return player.realityBuyer.rm;
  },
  /**
   * @param {Decimal} value
   */
  set rm(value) {
    player.realityBuyer.rm = value;
  },
  /**
   * @returns {number}
   */
  get glyph() {
    return player.realityBuyer.glyph;
  },
  /**
   * @param {number} value
   */
  set glyph(value) {
    player.realityBuyer.glyph = value;
  },
  /**
   * @returns {AutoRealityMode}
   */
  get mode() {
    return player.autoRealityMode;
  },
  /**
   * @param {AutoRealityMode} value
   */
  set mode(value) {
    player.autoRealityMode = value;
  },
  toggleMode() {
    this.mode = Object.values(AutoRealityMode).nextSibling(this.mode);
  },
  tick() {
    if (!this.isActive || GlyphSelection.active) return;
    let proc = false;
    const rmProc = gainedRealityMachines().gte(this.rm);
    const glyphProc = gainedGlyphLevel().actualLevel >= this.glyph;
    switch (this.mode) {
      case AutoRealityMode.RM:
        proc = rmProc;
        break;
      case AutoRealityMode.GLYPH:
        proc = glyphProc;
        break;
      case AutoRealityMode.EITHER:
        proc = rmProc || glyphProc;
        break;
      case AutoRealityMode.BOTH:
        proc = rmProc && glyphProc;
        break;
    }
    if (proc) autoReality();
  }
};

Autobuyer.tick = function() {
  PerformanceStats.start("Autobuyers");
  Autobuyer.eternity.tick();
  Autobuyer.reality.tick();
  Autobuyer.infinity.tick();
  Autobuyer.galaxy.tick();
  Autobuyer.dimboost.tick();
  Autobuyer.sacrifice.tick();
  for (let autobuyer of Autobuyer.priorityQueue()) {
    autobuyer.tick();
  }
  PerformanceStats.end();
};

Autobuyer.checkIntervalAchievements = function() {
  Achievement(52).tryUnlock();
  Achievement(53).tryUnlock();
};

Autobuyer.checkBulkAchievements = function() {
  Achievement(61).tryUnlock();
  SecretAchievement(38).tryUnlock();
};

Autobuyer.convertPropertiesToDecimal = function() {
  if (
    player.autobuyers[11] % 1 !== 0 &&
    player.autobuyers[11].priority !== undefined &&
    player.autobuyers[11].priority !== null &&
    player.autobuyers[11].priority !== "undefined"
  ) {
    player.autobuyers[11].priority = new Decimal(player.autobuyers[11].priority);
  }
}

function toggleAutobuyers() {
  const isOn = Autobuyer.dim(1).isOn;
  const autobuyers = Autobuyer.allDims
    .concat([
      Autobuyer.tickspeed,
      Autobuyer.dimboost,
      Autobuyer.galaxy,
      Autobuyer.sacrifice,
      Autobuyer.infinity,
      Autobuyer.eternity,
      Autobuyer.reality
    ])
    .filter(autobuyer => autobuyer.isUnlocked);
  for (let autobuyer of autobuyers) {
    autobuyer.isOn = !isOn;
  }
}
