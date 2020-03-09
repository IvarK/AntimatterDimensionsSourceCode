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

  get isReduced() {
    if (player.celestials.v.ppSpent === 0) return false;
    return this.config.nextReduction || (V.has(V_UNLOCKS.SHARD_REDUCTION) && this.reduction > 0);
  }

  get reductionInfo() {
    const value = this.conditionBaseValue;
    if (new Decimal(this.reduction).eq(this.config.maxShardReduction(value))) return "(capped)";
    if (this.config.nextReduction === undefined) return "";
    return `(next at ${format(this.config.nextReduction(Math.floor(this.reduction) + 1), 2, 0)} PP spent)`;
  }

  get reduction() {
    const value = this.conditionBaseValue;
    return Math.clamp(this.config.shardReduction(value), 0, this.config.maxShardReduction(value));
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
        GameUI.notify.success(`You have unlocked V-achievement '${this.config.name}' tier ${this.completions}`);
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
      if (Object.values(player.reality.glyphs.sac).sum() < db.totalGlyphSacrifice) return false;
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
    reward: () => `You can spend perk points to reduce V-achievement requirements for later tiers.`,
    description: "Have 2 V-achievements",
    effect: () => player.celestials.v.ppSpent,
    format: () => `${formatPercents(V.tierReduction)} Tier Reduction`,
    requirement: () => V.spaceTheorems >= 2
  },
  ND_POW: {
    id: 2,
    reward: "Normal dimension power based on Space Theorems.",
    description: "Have 5 V-achievements",
    effect: () => 1 + Math.sqrt(V.spaceTheorems) / 100,
    format: x => formatPow(x, 3, 3),
    requirement: () => V.spaceTheorems >= 5
  },
  FAST_AUTO_EC: {
    id: 3,
    reward: "Achievement multiplier affects auto EC completion time.",
    description: "Have 10 V-achievements",
    effect: () => Achievements.power,
    // Base rate is 60 ECs at 30 minutes each
    format: x => TimeSpan.fromSeconds(60 * 30 * 60 / x).toStringShort(false),
    requirement: () => V.spaceTheorems >= 10
  },
  AUTO_AUTOCLEAN: {
    id: 4,
    reward: "Glyph Auto-clean triggers automatically after every automatic reality.",
    description: "Have 16 V-achievements",
    requirement: () => V.spaceTheorems >= 16
  },
  ACHIEVEMENT_BH: {
    id: 5,
    reward: "Achievement count affects black hole power.",
    description: "Have 30 V-achievements",
    effect: () => Achievements.power,
    format: x => formatX(x, 2, 0),
    requirement: () => V.spaceTheorems >= 30
  },
  RA_UNLOCK: {
    id: 6,
    reward: "Reduce the Space Theorem cost of studies by 2. Unlock Ra, Celestial of the Forgotten.",
    description: "Have 36 V-achievements",
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
  },
  has(info) {
    // eslint-disable-next-line no-bitwise
    return Boolean(player.celestials.v.unlockBits & (1 << info.id));
  },
  startRun() {
    player.options.retryCelestial = false;
    player.celestials.v.run = startRealityOver() || player.celestials.v.run;
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
      quoteIdx: 0,
      run: false,
      runUnlocks: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      triadStudies: [],
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
  get tierReduction() {
    if (!V.isFlipped) return player.celestials.v.ppSpent / 200000;
    return Math.log10(Math.clampMin(player.celestials.v.ppSpent / 20000, 1)) / 10;
  }
};
