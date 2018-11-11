/*class Autobuyer {
  constructor(target) {
    this.target = target;
    this.cost = 1
    this.interval = 5000;
    this.priority = 1;
    this.ticks = 0;
    this.isOn = false;
    this.tier = 1;
    this.bulk = 1;
  }

}*/


var Autobuyer = function Autobuyer(target) {
    this.target = target
    this.cost = 1
    this.interval = 5000;
    this.priority = 1;
    this.ticks = 0;
    this.isOn = false;
    this.tier = 1;
    this.bulk = 1;
}

Autobuyer.tickTimer = 0;
Autobuyer.intervalTimer = 0;
Autobuyer.lastDimBoost = 0;
Autobuyer.lastGalaxy = 0;

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
   * @returns {boolean}
   */
  get isActive() {
    return this.isUnlocked && this.autobuyer.isOn;
  }

  toggle() {
    this.isOn = !this.isOn;
  }
}

Autobuyer.dim = dimIdx => new AutobuyerInfo(() => player.autobuyers[dimIdx - 1]);
Autobuyer.tickspeed = new AutobuyerInfo(() => player.autobuyers[8]);
Autobuyer.dimboost = new AutobuyerInfo(() => player.autobuyers[9]);
Autobuyer.galaxy = new AutobuyerInfo(() => player.autobuyers[10]);
Autobuyer.sacrifice = new AutobuyerInfo(() => player.autoSacrifice);

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
    if (!this.isUnlocked) return;
    if (this.ticks * 100 < this.interval) {
      this.ticks++;
      return;
    }
    if (!this.isOn) return;
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
    this.ticks = 1;
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