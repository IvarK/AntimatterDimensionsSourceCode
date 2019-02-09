GameDatabase.Celestials = {}; // This could probably go somewhere else but its temporary here
GameDatabase.Celestials.V = {
  mainUnlock: {
    realities: 10000,
    eternities: 1e60,
    infinities: 1e150,
    dilatedTime: 1e250,
    replicanti: new Decimal("1e250000")
  },
  runUnlocks: [
    {
      id: 0,
      name: "Running Man",
      description: "Complete all challenges within {value} seconds from starting reality (real time).",
      values: [18, 15, 12, 10, 7, 5],
      condition: x => EternityChallenge.completedTiers() == 60 && Time.thisRealityRealTime.totalSeconds < x
    },
    {
      id: 1,
      name: "AntiStellar",
      description: "Have {value} total galaxies from all types.",
      values: [2500, 2750, 3000, 3250, 3500, 3750],
      condition: (x) => Replicanti.galaxies.total + player.galaxies + player.dilation.freeGalaxies > x,
      format: (x) => x
    },
    {
      id: 2,
      name: "Se7en deadly matters",
      description: "Get {value} IP at Eternity Challenge 7.",
      values: [new Decimal("1e250000"), new Decimal("1e270000"), new Decimal("1e290000"), new Decimal("1e310000"), new Decimal("1e330000"), new Decimal("1e350000")],
      condition: x => EternityChallenge(7).isRunning && player.infinityPoints.gte(x)
    },
    {
      id: 3,
      name: "Young Boy",
      description: "Get {value} Antimatter at Eternity Challenge 12.",
      values: ["1e275000000", "1e300000000", "1e325000000", "1e350000000", "1e375000000", "1e400000000"].map(v => new Decimal(v)),
      condition: x => EternityChallenge(12).isRunning && player.money.gte(x)
    },
    {
      id: 4,
      name: "Eternal Sunshine",
      description: "Get {value} EP.",
      values: ["1e2000", "1e2400", "1e2800", "1e3200", "1e3600", "1e4000"].map(v => new Decimal(v)),
      condition: (x) => player.eternityPoints.gte(x)
    },
    {
      id: 5,
      name: "Matterception",
      description: "Get {value} Dimensional Boosts while dilating time, inside EC5.",
      values: [35, 38, 41, 44, 47, 50],
      condition: (x) => player.dilation.active && player.currentEternityChall == "eterc5" && player.resets >= x
    }
  ]
};

/**
 * runUnlocks:
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
    let completions = player.celestials.v.runUnlocks[this.id];
    return completions === undefined ? 0 : completions;
  }

  get conditionValue() {
    return this.config.values[this.completions]
  }

  get formattedDescription() {
    let val = this.conditionValue
    if (val == undefined) val = this.config.values[this.completions - 1]

    const formatted = (this.config.format) ? this.config.format(val) : shorten(val)

    return this.config.description.replace('{value}', formatted)
  }

  set completions(value) {
    player.celestials.v.runUnlocks[this.id] = value;
  }
  
  tryComplete() {
    if (this.config.condition(this.conditionValue) && this.completions !== 6) {
      this.completions++;
      GameUI.notify.success(`You have unlocked V achievement '${this.config.name}' tier ${this.completions}`);
      V.updateTotalRunUnlocks()
    }
  }
}

/**
 * @type {VRunUnlockState[]}
 */
VRunUnlockState.all = mapGameData(
  GameDatabase.Celestials.V.runUnlocks,
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
      const db = GameDatabase.Celestials.V.mainUnlock;
      if (player.realities < db.realities) return false;
      if (player.eternities < db.eternities) return false;
      if (player.infinitied + player.infinitiedBank < db.infinities) return false;
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
    effect: () => Math.pow(player.achPow.toNumber(), getAdjustedGlyphEffect("effarigachievement")),
    format: (x) => formatX(x),
    requirement: () => V.totalRunUnlocks >= 10
    },
    {
    id: 2,
    reward: "Achievement count affects wormhole power, Unlock Ra, Celestial of the Forgotten.",
    description: "Have 23 V-achievements",
    requirement: () => V.totalRunUnlocks >= 23,
    effect: () => Math.pow(1.1, Math.pow(GameCache.achievementCount.value, getAdjustedGlyphEffect("effarigachievement"))),
    format: (x) => formatX(x)
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

    if (V_UNLOCKS.MAIN_UNLOCK.requirement() && !V.has(V_UNLOCKS.MAIN_UNLOCK)) {
      player.celestials.v.unlocks.push(V_UNLOCKS.MAIN_UNLOCK.id);
      GameUI.notify.success(V_UNLOCKS.MAIN_UNLOCK.description);
    }

    for (let i = 0; i<V_UNLOCKS.RUN_UNLOCK_THRESHOLDS.length; i++) {
      const unl = V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[i];
      if (unl.requirement() && !this.has(unl)) {
        player.celestials.v.unlocks.push(unl.id);
        GameUI.notify.success(unl.description);
      }
    }

    if (this.isRunning) {
      for (let unlock of VRunUnlockState.all) {
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
    return player.celestials.v.additionalStudies < this.totalAdditionalStudies
  },
  updateTotalRunUnlocks() {
    let total = 0
    for (let i = 0; i < 6; i++) {
      const run = player.celestials.v.runUnlocks[i]
      if (run !== undefined) total += run
    }
    this.totalRunUnlocks = total
  },
  get isRunning() {
    return player.celestials.v.run;
  },
  get totalAdditionalStudies() {
    if (this.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[2])) return Math.floor(this.totalRunUnlocks / 3)
    else return Math.floor(this.totalRunUnlocks / 6)
  }
};
