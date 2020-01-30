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
    return V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[0]) && player.celestials.effarig.relicShards >= 1e20 &&
      Decimal.gt(this.reduction, 1);
  }

  get reduction() {
    const value = this.conditionBaseValue;

    // It's safe to assume that subtraction is only used on numbers and division on Decimals
    if (typeof value === "number") return Math.max(0, this.config.shardReduction(value));
    return Decimal.max(1, this.config.shardReduction(value));
  }

  get conditionValue() {
    let value = this.conditionBaseValue;
    if (!this.isReduced) return value;
    
    // Type checking not needed, see above comment in reduction()
    if (this.config.mode === V_REDUCTION_MODE.SUBTRACTION) value -= this.reduction;
    if (this.config.mode === V_REDUCTION_MODE.DIVISION) value = value.dividedBy(this.reduction);

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
    const value = this.config.currentValue(this.conditionValue);
    // If we haven't set a record, we haven't completed any new tiers, either
    if (value <= playerData.runRecords[this.id]) return;
    playerData.runRecords[this.id] = value;
    playerData.runGlyphs[this.id] = Glyphs.active
      .filter(g => g !== null)
      .map(g => ({
        type: g.type,
        level: g.level,
        strength: g.strength,
        effects: g.effects,
      }));

    while (this.completions < 6 && this.config.condition(this.conditionValue)) {
      this.completions++;
      GameUI.notify.success(`You have unlocked V achievement '${this.config.name}' tier ${this.completions}`);
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
  MAIN_UNLOCK: {
    id: 0,
    description: "Fully unlocks V, The Celestial Of Achievements",
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
  RUN_UNLOCK_THRESHOLDS: [
    {
      id: 1,
      reward: "Relic shards reduce V-achievement requirements. Starting at 1e20 Relic Shards.",
      description: "Have 2 V-achievements",
      requirement: () => V.spaceTheorems >= 2
    },
    {
      id: 2,
      reward: "Normal dimension power based on Space Theorems.",
      description: "Have 5 V-achievements",
      effect: () => 1 + Math.sqrt(V.spaceTheorems) / 100,
      format: x => formatPow(x, 3, 3),
      requirement: () => V.spaceTheorems >= 5
    },
    {
      id: 3,
      reward: "Achievement multiplier affects auto EC completion time. Unlock Triad studies.",
      description: "Have 10 V-achievements",
      effect: () => Achievements.power,
      format: x => formatX(x, 2, 2),
      requirement: () => V.spaceTheorems >= 10
    },
    {
      id: 4,
      reward: "Achievement count affects black hole power.",
      description: "Have 30 V-achievements",
      effect: () => Achievements.power,
      format: x => formatX(x, 2, 0),
      requirement: () => V.spaceTheorems >= 30
    },
    {
      id: 5,
      reward: "Reduce the Space Theorem cost of studies by 2. Unlock Ra, Celestial of the Forgotten.",
      description: "Have 36 V-achievements",
      requirement: () => V.spaceTheorems >= 36
    }
  ]
};

const V = {
  spaceTheorems: 0,
  checkForUnlocks() {

    if (!V.has(V_UNLOCKS.MAIN_UNLOCK) && V_UNLOCKS.MAIN_UNLOCK.requirement()) {
      // eslint-disable-next-line no-bitwise
      player.celestials.v.unlockBits |= (1 << V_UNLOCKS.MAIN_UNLOCK.id);
      GameUI.notify.success(V_UNLOCKS.MAIN_UNLOCK.description);
    }

    for (let i = 0; i < V_UNLOCKS.RUN_UNLOCK_THRESHOLDS.length; i++) {
      const unl = V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[i];
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
    player.celestials.v.run = startRealityOver() || player.celestials.v.run;
    player.celestials.v.cursedThisRun = Glyphs.active.filter(x => x && x.type === "cursed").length;
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
      runRecords: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      cursedThisRun: 0
    };
  },
  get availableST() {
    return V.spaceTheorems - player.celestials.v.STSpent;
  },
  get isRunning() {
    return player.celestials.v.run;
  },
  get achievementsPerAdditionalStudy() {
    return this.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[4]) ? 3 : 6;
  },
  get totalAdditionalStudies() {
    return Math.floor(this.spaceTheorems / this.achievementsPerAdditionalStudy);
  },
  get isFlipped() {
    return this.spaceTheorems >= 36;
  }
};
