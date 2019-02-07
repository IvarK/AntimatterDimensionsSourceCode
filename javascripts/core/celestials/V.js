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
      name: "The True Sonic",
      description: "Complete all challenges within {value} seconds from starting reality (real time).",
      values: [15, 12, 10, 7, 5],
      condition: (x) => EternityChallenge.completedTiers() == 60 && player.thisRealityRealTime < x * 1000
    },
    {
      id: 1,
      name: "AntiGalactus",
      description: "Have {value} total galaxies from all types.",
      values: [2500, 2750, 3000, 3250, 3500],
      condition: (x) => Replicanti.galaxies.total + player.galaxies + player.dilation.freeGalaxies > x,
      format: (x) => x
    },
    {
      id: 2,
      name: "Name's Matter, Anti Matter",
      description: "Get {value} IP at Eternity Challenge 7.",
      values: [new Decimal("1e250000"), new Decimal("1e270000"), new Decimal("1e290000"), new Decimal("1e310000"), new Decimal("1e330000")],
      condition: (x) => player.currentEternityChall == "eterc7" && player.infinityPoints.gte(x)
    },
    {
      id: 3,
      name: "12 Matters",
      description: "Get {value} Antimatter at Eternity Challenge 12.",
      values: [new Decimal("1e275000000"), new Decimal("1e300000000"), new Decimal("1e325000000"), new Decimal("1e350000000"), new Decimal("1e375000000")],
      condition: (x) => player.currentEternityChall == "eterc12" && player.money.gte(x)
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
    if (val == 0) this.config.values[this.completions - 1]
    if (!this.config.format) val = shorten(val)
    else val = this.config.format(val)

    return this.config.description.replace('{value}', val)
  }

  set completions(value) {
    player.celestials.v.runUnlocks[this.id] = value;
  }
  
  tryComplete() {
    if (this.config.condition(this.config.values[this.completions])) {
      this.completions++;
      GameUI.notify.success(`You have unlocked V achievement '${this.config.name}' tier ${this.completions}`);
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
    requirement: () => V.mainUnlockBool()
  }
};

const V = {
  mainUnlockBool() {
    const db = GameDatabase.Celestials.V.mainUnlock;
    if (player.realities < db.realities) return false;
    if (player.eternities < db.eternities) return false;
    if (player.infinitied + player.infinitiedBank < db.infinities) return false;
    if (player.dilation.dilatedTime.lt(db.dilatedTime)) return false;
    if (player.replicanti.amount.lt(db.replicanti)) return false;

    return true;
  },
  checkForUnlocks() {
    for (i in V_UNLOCKS) {
      const unl = V_UNLOCKS[i];
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
  get isRunning() {
    return player.celestials.v.run;
  }
};
