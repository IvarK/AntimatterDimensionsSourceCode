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
      name: "The true Sonic",
      description: "Complete all challenges within {value} seconds from starting reality (real time).",
      values: [25, 20, 15, 10],
      condition: (x) => EternityChallenge.completedTiers() == 60 && player.thisRealityRealTime < x * 1000
    }
  ]
};

class VRunUnlockState extends GameMechanicState {
  constructor(config) {
    super(config);
  }

  get completions() {
    let completions = player.celestials.v[this.id];
    return completions === undefined ? 0 : completions;
  }

  get conditionValue() {
    return this.config.values[this.completions]
  }

  get formattedDescription() {
    return this.config.description.replace('{value}', shorten(this.conditionValue))
  }

  set completions(value) {
    player.celestials.v[this.id] = value;
  }
  
  tryComplete() {
    if (this.config.condition(this.config.values[this.completions])) {
      this.completions++;
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
