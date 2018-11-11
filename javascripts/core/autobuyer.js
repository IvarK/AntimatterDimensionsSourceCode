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

  get autobuyer() {
    return this._getAutobuyer();
  }

  /**
   * @returns {boolean}
   */
  get isUnlocked() {
    // What
    return this.autobuyer % 1 !== 0;
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
Autobuyer.infinity = new AutobuyerInfo(() => player.autobuyers[11]);
Autobuyer.sacrifice = new AutobuyerInfo(() => player.autoSacrifice);

const AutoCrunchMode = {
  AMOUNT: "amount",
  TIME: "time",
  RELATIVE: "relative"
};

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
        proc = Time.thisEternity.totalSeconds > this.limit * getGameSpeedupFactor(false);
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