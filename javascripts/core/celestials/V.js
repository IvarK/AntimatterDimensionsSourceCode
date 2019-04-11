/**
 * RunUnlocks:
 * id: unique id
 * name: the achievement name
 * description: Description what you need to do, for values add {value}
 * values: different values to display and check against the game
 * condition: function that returns false or true, takes the current value as an argument, if true completes an achievement
 * format: optional function that formats the value, defaults to shorten()
 */

class VRunUnlockState extends GameMechanicState {
  constructor(config) {
    super(config);
  }

  get completions() {
    const completions = player.celestials.v.runUnlocks[this.id];
    return completions === undefined ? 0 : completions;
  }

  get conditionValue() {
    const value = this.config.values[this.completions];
    return value !== undefined ? value : this.config.values[this.completions - 1];
  }

  get formattedDescription() {
    const val = this.conditionValue;
    const formatted = this.config.format ? this.config.format(val) : shorten(val);
    return this.config.description.replace('{value}', formatted);
  }

  set completions(value) {
    player.celestials.v.runUnlocks[this.id] = value;
  }
  
  tryComplete() {
    if (this.completions === 6 || !this.config.condition(this.conditionValue)) return;
    this.completions++;
    GameUI.notify.success(`You have unlocked V achievement '${this.config.name}' tier ${this.completions}`);
    V.updateTotalRunUnlocks();
  }
}

/**
 * @type {VRunUnlockState[]}
 */
VRunUnlockState.all = mapGameData(
  GameDatabase.celestials.v.runUnlocks,
  config => new VRunUnlockState(config)
);

/**
 * @param {number} id
 * @return {VRunUnlockState}
 */
function VRunUnlock(id) {
  return VRunUnlockState.all[id];
}


const V_UNLOCKS = {
  MAIN_UNLOCK: {
    id: 0,
    description: "Fully unlocks V, The Celestial Of Achievements",
    requirement: () => {
      const db = GameDatabase.celestials.v.mainUnlock;
      if (player.realities < db.realities) return false;
      if (player.eternities < db.eternities) return false;
      if (player.infinitied.plus(player.infinitiedBank).lt(db.infinities)) return false;
      if (player.dilation.dilatedTime.lt(db.dilatedTime)) return false;
      if (player.replicanti.amount.lt(db.replicanti)) return false;
  
      return true;
    }
  },
  RUN_UNLOCK_THRESHOLDS: [
    {
    id: 1,
    reward: "Achievement multiplier affects auto EC completion time.",
    description: "Have 10 V-achievements",
    effect: () => Player.achievementPower.toNumber(),
    format: x => formatX(x),
    requirement: () => V.totalRunUnlocks >= 10
    },
    {
    id: 2,
    reward: "Achievement count affects black hole power, Unlock Ra, Celestial of the Forgotten.",
    description: "Have 23 V-achievements",
    effect: () => Math.pow(1.1, Math.pow(player.achievements.size, getAdjustedGlyphEffect("effarigachievement"))),
    format: x => formatX(x),
    requirement: () => V.totalRunUnlocks >= 23
    },
    {
    id: 3,
    reward: "Double the amount of locked studies you can buy.",
    description: "Have 36 V-achievements",
    requirement: () => V.totalRunUnlocks >= 36
    }
  ]
};

const V = {
  totalRunUnlocks: 0,
  checkForUnlocks() {

    if (!V.has(V_UNLOCKS.MAIN_UNLOCK) && V_UNLOCKS.MAIN_UNLOCK.requirement()) {
      player.celestials.v.unlocks.push(V_UNLOCKS.MAIN_UNLOCK.id);
      GameUI.notify.success(V_UNLOCKS.MAIN_UNLOCK.description);
    }

    for (let i = 0; i < V_UNLOCKS.RUN_UNLOCK_THRESHOLDS.length; i++) {
      const unl = V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[i];
      if (unl.requirement() && !this.has(unl)) {
        player.celestials.v.unlocks.push(unl.id);
        GameUI.notify.success(unl.description);
      }
    }

    if (this.isRunning) {
      for (const unlock of VRunUnlockState.all) {
        unlock.tryComplete();
      }
    }
  },
  has(info) {
    return player.celestials.v.unlocks.includes(info.id);
  },
  startRun() {
    player.celestials.v.run = startRealityOver();
  },
  canBuyLockedPath() {
    return player.celestials.v.additionalStudies < this.totalAdditionalStudies;
  },
  updateTotalRunUnlocks() {
    this.totalRunUnlocks = player.celestials.v.runUnlocks.sum();
  },
  get isRunning() {
    return player.celestials.v.run;
  },
  get totalAdditionalStudies() {
    if (this.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[2])) return Math.floor(this.totalRunUnlocks / 3);
    return Math.floor(this.totalRunUnlocks / 6);
  }
};
