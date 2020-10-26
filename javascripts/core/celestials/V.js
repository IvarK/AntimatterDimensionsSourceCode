"use strict";

/**
 * Information about how to format runUnlocks:
 * id: unique id
 * name: the achievement name
 * description: Description what you need to do, for values add {value}
 * values: different values to display and check against the game
 * condition: function that takes the current value as an argument, if true completes an achievement
 * format: optional function that formats the value, defaults to format()
 */

class VRunUnlockState extends GameMechanicState {
  get completions() {
    const completions = player.celestials.v.runUnlocks[this.id];
    return completions === undefined ? 0 : completions;
  }

  get conditionBaseValue() {
    const value = this.config.values[this.completions];
    return value === undefined ? this.config.values[this.completions - 1] : value;
  }

  get canBeReduced() {
    return this.completions < this.config.values.length &&
      new Decimal(this.reduction).neq(this.config.maxShardReduction(this.conditionBaseValue));
  }

  get isReduced() {
    if (player.celestials.v.goalReductionSteps[this.id] === 0) return false;
    return (V.has(V_UNLOCKS.SHARD_REDUCTION) && this.reduction > 0);
  }

  get reductionCost() {
    const stepCount = this.config.reductionStepSize ? this.config.reductionStepSize : 1;
    if (this.config.isHard) {
      // The numbers come from inside of nextHardReductionCost, this is an effective bulk-buy factor
      const modifiedStepCount = (Math.pow(1.15, stepCount) - 1) / 0.15;
      return modifiedStepCount * V.nextHardReductionCost(player.celestials.v.goalReductionSteps[this.id]);
    }
    return stepCount * V.nextNormalReductionCost();
  }

  get tiersReduced() {
    return player.celestials.v.goalReductionSteps[this.id] / 100;
  }

  get reduction() {
    const value = this.conditionBaseValue;
    return Math.clamp(this.config.shardReduction(this.tiersReduced), 0, this.config.maxShardReduction(value));
  }

  get conditionValue() {
    let value = this.conditionBaseValue;
    if (!this.isReduced) return value;
    value -= this.reduction;
    return value;
  }

  get formattedDescription() {
    return this.config.description(this.conditionValue);
  }

  set completions(value) {
    player.celestials.v.runUnlocks[this.id] = value;
  }

  tryComplete() {
    const playerData = player.celestials.v;
    const value = this.config.currentValue();
    if (this.config.condition() && Decimal.gte(value, playerData.runRecords[this.id])) {
      playerData.runRecords[this.id] = value;
      playerData.runGlyphs[this.id] = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    }

    while (this.completions < this.config.values.length &&
      Decimal.gte(playerData.runRecords[this.id], this.conditionValue)) {
        if (!V.isFlipped && this.config.isHard) continue;
        this.completions++;
        GameUI.notify.success(`You have unlocked V-Achievement '${this.config.name}' tier ${this.completions}`);
        V.updateTotalRunUnlocks();
    }
  }
}

/**
 * @param {number} id
 * @return {VRunUnlockState}
 */
const VRunUnlock = VRunUnlockState.createAccessor(GameDatabase.celestials.v.runUnlocks);

const VRunUnlocks = {
  /**
   * @type {VRunUnlockState[]}
   */
  all: VRunUnlock.index.compact(),
};

const V_UNLOCKS = {
  V_ACHIEVEMENT_UNLOCK: {
    id: 0,
    reward: "Fully unlocks V, The Celestial Of Achievements",
    description: "Meet all the above requirements simultaneously",
    requirement: () => {
      const db = GameDatabase.celestials.v.mainUnlock;
      if (player.realities < db.realities) return false;
      if (player.eternities.lt(db.eternities)) return false;
      if (player.infinitied.plus(player.infinitiedBank).lt(db.infinities)) return false;
      if (player.dilation.dilatedTime.lt(db.dilatedTime)) return false;
      if (player.replicanti.amount.lt(db.replicanti)) return false;
      if (player.reality.realityMachines.lt(db.rm)) return false;
      return true;
    }
  },
  SHARD_REDUCTION: {
    id: 1,
    reward: () => `You can spend Perk Points to reduce V-Achievement requirements for later tiers.`,
    get description() { return `Have ${formatInt(2)} V-Achievements`; },
    requirement: () => V.spaceTheorems >= 2
  },
  ND_POW: {
    id: 2,
    reward: "Antimatter Dimension power based on Space Theorems.",
    get description() { return `Have ${formatInt(5)} V-Achievements`; },
    effect: () => 1 + Math.sqrt(V.spaceTheorems) / 100,
    format: x => formatPow(x, 3, 3),
    requirement: () => V.spaceTheorems >= 5
  },
  FAST_AUTO_EC: {
    id: 3,
    reward: "Achievement multiplier affects Auto-EC completion time.",
    get description() { return `Have ${formatInt(10)} V-Achievements`; },
    effect: () => Achievements.power,
    // Base rate is 60 ECs at 20 minutes each
    format: x => `${TimeSpan.fromMinutes(60 * 20 / x).toStringShort(false)} for full completion`,
    requirement: () => V.spaceTheorems >= 10
  },
  AUTO_AUTOCLEAN: {
    id: 4,
    reward: "Unlock the ability to Auto Purge on Reality.",
    get description() { return `Have ${formatInt(16)} V-Achievements`; },
    requirement: () => V.spaceTheorems >= 16
  },
  ACHIEVEMENT_BH: {
    id: 5,
    reward: "Achievement multiplier affects Black Hole power.",
    get description() { return `Have ${formatInt(30)} V-Achievements`; },
    effect: () => Achievements.power,
    format: x => formatX(x, 2, 0),
    requirement: () => V.spaceTheorems >= 30
  },
  RA_UNLOCK: {
    id: 6,
    reward: "Reduce the Space Theorem cost of Time Studies by 2. Unlock Ra, Celestial of the Forgotten.",
    get description() { return `Have ${formatInt(36)} V-Achievements`; },
    requirement: () => V.spaceTheorems >= 36
  }
};

const V = {
  spaceTheorems: 0,
  checkForUnlocks() {

    if (!V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK) && V_UNLOCKS.V_ACHIEVEMENT_UNLOCK.requirement()) {
      // eslint-disable-next-line no-bitwise
      player.celestials.v.unlockBits |= (1 << V_UNLOCKS.V_ACHIEVEMENT_UNLOCK.id);
      GameUI.notify.success("You have unlocked V, The Celestial Of Achievements!");
    }

    for (const key of Object.keys(V_UNLOCKS)) {
      const unl = V_UNLOCKS[key];
      if (unl.requirement() && !this.has(unl)) {
        // eslint-disable-next-line no-bitwise
        player.celestials.v.unlockBits |= (1 << unl.id);
        GameUI.notify.success(unl.description);
      }
    }

    if (this.isRunning) {
      for (const unlock of VRunUnlocks.all) {
        unlock.tryComplete();
      }
    }

    if (V.has(V_UNLOCKS.RA_UNLOCK) && !Ra.has(RA_UNLOCKS.AUTO_TP)) {
      Ra.checkForUnlocks();
    }
  },
  has(info) {
    // eslint-disable-next-line no-bitwise
    return Boolean(player.celestials.v.unlockBits & (1 << info.id));
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.v.run = true;
    player.minNegativeBlackHoleThisReality = player.blackHoleNegative;
    if (!BlackHoles.areNegative) {
      player.minNegativeBlackHoleThisReality = 1;
    }
    Glyphs.updateGlyphCountForV(true);
  },
  updateTotalRunUnlocks() {
    let sum = 0;
    for (let i = 0; i < player.celestials.v.runUnlocks.length; i++) {
      if (i < 6) sum += player.celestials.v.runUnlocks[i];
      else sum += player.celestials.v.runUnlocks[i] * 2;
    }
    this.spaceTheorems = sum;
  },
  reset() {
    player.celestials.v = {
      unlockBits: 0,
      run: false,
      runUnlocks: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      triadStudies: [],
      goalReductionSteps: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      STSpent: 0,
      runGlyphs: [[], [], [], [], [], [], [], [], []],
      runRecords: [-10, 0, 0, 0, 0, 0, 0, 0, 0],
      maxGlyphsThisRun: 0
    };
    this.spaceTheorems = 0;
  },
  get availableST() {
    return V.spaceTheorems - player.celestials.v.STSpent;
  },
  get isRunning() {
    return player.celestials.v.run;
  },
  get isFlipped() {
    return Ra.has(RA_UNLOCKS.HARD_V);
  },
  get isFullyCompleted() {
    return this.spaceTheorems >= 66;
  },
  nextNormalReductionCost() {
    return 1000;
  },
  nextHardReductionCost(currReductionSteps) {
    return 1000 * Math.pow(1.15, currReductionSteps);
  },
};
