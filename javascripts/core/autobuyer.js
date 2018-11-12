const Autobuyer = function Autobuyer(target) {
    this.target = target;
    this.cost = 1;
    this.interval = 5000;
    this.priority = 1;
    this.ticks = 0;
    this.isOn = false;
    this.tier = 1;
    this.bulk = 1;
};

Autobuyer.tickTimer = 0;
Autobuyer.intervalTimer = 0;
Autobuyer.lastDimBoost = 0;
Autobuyer.lastGalaxy = 0;

const AutobuyerMode = {
  BUY_SINGLE: 1,
  BUY_10: 10,
  BUY_MAX: 100,
};

class AutobuyerInfo {
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
}

class DimensionAutobuyerInfo extends AutobuyerInfo {
  constructor(tier) {
    super(() => player.autobuyers[tier - 1]);
    this._tier = tier;
  }

  /**
   * @returns {boolean}
   */
  get hasMaxedBulk() {
    return this.bulk >= 1e100;
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
    if (!canBuyDimension(tier)) return;
    if (this.mode === AutobuyerMode.BUY_SINGLE) {
      buyOneDimension(tier);
    }
    else {
      const bulk = player.options.bulkOn ? this.bulk : 1;
      buyManyDimensionAutobuyer(tier, bulk);
    }
    this.resetTicks();
  }

  buy() {
    buyAutobuyer(this._tier - 1);
  }
}

Autobuyer.dim = tier => new DimensionAutobuyerInfo(tier);

class TickspeedAutobuyerInfo extends AutobuyerInfo {
  constructor() {
    super(() => player.autobuyers[8]);
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
    if (!isTickspeedPurchaseUnlocked()) return;
    if (this.mode === AutobuyerMode.BUY_SINGLE) {
      buyTickSpeed();
    }
    else {
      buyMaxTickSpeed();
    }
    this.resetTicks();
  }

  buy() {
    buyAutobuyer(8);
  }
}

Autobuyer.tickspeed = new TickspeedAutobuyerInfo();

Autobuyer.priorityQueue = function() {
  const autobuyers = Array.range(1, 8).map(tier => Autobuyer.dim(tier));
  autobuyers.push(Autobuyer.tickspeed);
  return autobuyers
    .filter(autobuyer => autobuyer.isUnlocked)
    .sort((a, b) => a.priority - b.priority);
};

class DimboostAutobuyerInfo extends AutobuyerInfo {
  constructor() {
    super(() => player.autobuyers[9]);
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
  get isBulkBuyUnlocked() {
    return BreakInfinityUpgrade.bulkDimBoost.isBought || this.isBuyMaxUnlocked;
  }

  /**
   * @returns {boolean}
   */
  get isBuyMaxUnlocked() {
    return player.eternities >= 10;
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
    if (!this.canTick()) return;
    if (!this.dimBoolean()) return;
    if (this.isBuyMaxUnlocked) {
      if (Autobuyer.intervalTimer - Autobuyer.lastDimBoost >= this.buyMaxInterval) {
        Autobuyer.lastDimBoost = Autobuyer.intervalTimer;
        maxBuyDimBoosts();
      }
      return;
    }
    else if (player.resets >= 4) {
      softReset(this.bulk);
    }
    else {
      softReset(1);
    }
    this.resetTicks();
  }

  dimBoolean() {
    const requirement = DimBoost.requirement;
    if (requirement.isSatisfied) return true;
    if (player.eternities < 10 && !DimBoost.bulkRequirement(this.buyMaxInterval - 1).isSatisfied) return false;
    if (player.overXGalaxies <= player.galaxies) return true;
    if ((player.currentChallenge === "challenge4" || player.currentChallenge === "postc1") && this.limit < requirement.amount && requirement.tier === 6) return false;
    return this.limit > requirement.amount && requirement.tier === 8;
  }

  buy() {
    buyAutobuyer(9);
  }
}

Autobuyer.dimboost = new DimboostAutobuyerInfo();

class GalaxyAutobuyerInfo extends AutobuyerInfo {
  constructor() {
    super(() => player.autobuyers[10]);
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
    return player.eternities > 8;
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
    if (player.eternities >= 9 && this.buyMaxInterval > 0) {
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
    autoS = false;
    galaxyResetBtnClick();
  }

  buy() {
    buyAutobuyer(10);
  }
}

Autobuyer.galaxy = new GalaxyAutobuyerInfo();

class SacrificeAutobuyerInfo extends AutobuyerInfo {
  constructor() {
    super(() => player.autoSacrifice);
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

Autobuyer.sacrifice = new SacrificeAutobuyerInfo();

const AutoCrunchMode = {
  AMOUNT: "amount",
  TIME: "time",
  RELATIVE: "relative"
};

class InfinityAutobuyerInfo extends AutobuyerInfo {
  constructor() {
    super(() => player.autobuyers[11]);
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
    return player.eternities > 4;
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
    if (this.mode === AutoCrunchMode.AMOUNT && this.limit !== undefined) {
      this.limit = this.limit.times(mult);
    }
  }

  toggleMode() {
    this.mode = Object.values(AutoCrunchMode).next(this.mode);
  }

  tick() {
    if (!this.canTick()) return;
    if (!player.money.gte(Number.MAX_VALUE)) return;
    let proc = !player.break || player.currentChallenge !== "";
    if (!proc) {
      switch (this.mode) {
        case AutoCrunchMode.AMOUNT:
          proc = gainedInfinityPoints().gte(this.limit);
          break;
        case AutoCrunchMode.TIME:
          proc = Decimal.gt(Time.thisInfinity.totalSeconds, this.limit.times(getGameSpeedupFactor(false)));
          break;
        case AutoCrunchMode.RELATIVE:
          proc = gainedInfinityPoints().gte(player.lastTenRuns[0][1].times(this.limit));
          break;
      }
    }
    if (proc) {
      autoS = false;
      bigCrunchReset();
    }
    this.resetTicks();
  }

  buy() {
    buyAutobuyer(11);
  }
}

Autobuyer.infinity = new InfinityAutobuyerInfo();

const AutoEternityMode = {
  AMOUNT: "amount",
  TIME: "time",
  RELATIVE: "relative"
};

Autobuyer.eternity = {
  /**
   * @returns {boolean}
   */
  get isUnlocked() {
    return player.eternities >= 100;
  },
  /**
   * @returns {boolean}
   */
  get hasAdditionalModes() {
    return player.reality.upg.includes(13);
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
    if (this.mode === AutoEternityMode.AMOUNT) {
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
    this.mode = Object.values(AutoEternityMode).next(this.mode);
  },
  tick() {
    if (!this.isActive) return;
    let proc = false;
    switch (this.mode) {
      case AutoEternityMode.AMOUNT:
        proc = player.currentEternityChall !== "" || gainedEternityPoints().gte(this.limit);
        break;
      case AutoEternityMode.TIME:
        proc = Decimal.gt(Time.thisEternity.totalSeconds, this.limit.times(getGameSpeedupFactor(false)));
        break;
      case AutoEternityMode.RELATIVE:
        proc = gainedEternityPoints().gte(player.lastTenEternities[0][1].times(this.limit));
        break;
    }
    if (proc) eternity(false, true);
  }
};

const AutoRealityMode = {
  RM: "rm",
  GLYPH: "glyph",
  EITHER: "either",
  BOTH: "both"
};

Autobuyer.reality = {
  /**
   * @returns {boolean}
   */
  get isUnlocked() {
    return player.reality.upg.includes(25);
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
    this.mode = Object.values(AutoRealityMode).next(this.mode);
  },
  tick() {
    if (!this.isActive) return;
    let proc = false;
    const rmProc = gainedRealityMachines().gte(this.rm);
    const glyphProc = gainedGlyphLevel() >= this.glyph;
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
    if (proc) reality(false, false, true);
  }
};

Autobuyer.tick = function() {
  Autobuyer.eternity.tick();
  Autobuyer.reality.tick();
  Autobuyer.infinity.tick();
  Autobuyer.galaxy.tick();
  Autobuyer.dimboost.tick();
  Autobuyer.sacrifice.tick();
  for (let autobuyer of Autobuyer.priorityQueue()) {
    autobuyer.tick();
  }
};

function buyAutobuyer(id) {
  const autobuyer = player.autobuyers[id];
  if (player.infinityPoints.lt(autobuyer.cost)) return false;
  if (autobuyer.bulk >= 1e100) return false;
  player.infinityPoints = player.infinityPoints.minus(autobuyer.cost);
  if (autobuyer.interval <= 100) {
    autobuyer.bulk = Math.min(autobuyer.bulk * 2, 1e100);
    autobuyer.cost = Math.ceil(2.4*autobuyer.cost);
    var b1 = true;
    for (let i=0;i<8;i++) {
      if (player.autobuyers[i].bulk < 512) b1 = false;
    }
    if (b1) giveAchievement("Bulked up");
  } else {
    autobuyer.interval = Math.max(autobuyer.interval*0.6, 100);
    if (autobuyer.interval > 120) autobuyer.cost *= 2; //if your last purchase wont be very strong, dont double the cost
  }
  ui.dispatch(GameEvent.AUTOBUYER_BOUGHT);
  updateAutobuyers();
}

function toggleAutoBuyers() {
  const isOn = Autobuyer.dim(1).isOn;
  const autobuyers = Array.range(1, 8).map(tier => Autobuyer.dim(tier));
  autobuyers.push(Autobuyer.tickspeed);
  autobuyers.push(Autobuyer.dimboost);
  autobuyers.push(Autobuyer.galaxy);
  autobuyers.push(Autobuyer.infinity);
  autobuyers.push(Autobuyer.sacrifice);
  autobuyers.push(Autobuyer.eternity);
  autobuyers.push(Autobuyer.reality);
  for (let autobuyer of autobuyers) {
    autobuyer.isOn = !isOn;
  }
}

function toggleBulk() {
  player.options.bulkOn = !player.options.bulkOn;
}