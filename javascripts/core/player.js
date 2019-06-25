"use strict";

var shiftDown = false;
const defaultMaxTime = 60000 * 60 * 24 * 31;

let player = {
  money: new Decimal(10),
  tickSpeedCost: new Decimal(1000),
  tickspeed: new Decimal(1000),
  dimensions: {
    normal: Array.range(0, 8).map(tier => ({
      bought: 0,
      amount: new Decimal(0),
      power: new Decimal(1),
      cost: new Decimal([10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24][tier]),
      costMultiplier: new Decimal([1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15][tier])
    })),
    infinity: Array.range(0, 8).map(tier => ({
      isUnlocked: false,
      bought: 0,
      amount: new Decimal(0),
      power: new Decimal(1),
      cost: new Decimal([1e8, 1e9, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280][tier]),
      baseAmount: 0
    })),
    time: Array.range(0, 8).map(tier => ({
      cost: new Decimal([1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"][tier]),
      amount: new Decimal(0),
      power: new Decimal(1),
      bought: 0
    }))
  },
  sacrificed: new Decimal(0),
  achievements: new Set(),
  secretAchievements: new Set(),
  infinityUpgrades: new Set(),
  infinityRebuyables: [0, 0],
  challenge: {
    normal: {
      current: 0,
      bestTimes: Array.repeat(defaultMaxTime, 11),
      completedBits: 0,
    },
    infinity: {
      current: 0,
      bestTimes: Array.repeat(defaultMaxTime, 8),
      completedBits: 0,
    },
    eternity: {
      current: 0,
      unlocked: 0,
    }
  },
  infinityPoints: new Decimal(0),
  infinitied: new Decimal(0),
  infinitiedBank: new Decimal(0),
  gameCreatedTime: Date.now(),
  totalTimePlayed: 0,
  realTimePlayed: 0,
  bestInfinityTime: 999999999999,
  thisInfinityTime: 0,
  thisInfinityRealTime: 0,
  resets: 0,
  galaxies: 0,
  tickDecrease: 0.9,
  totalmoney: new Decimal(0),
  achPow: new Decimal(1),
  newsArray: [],
  // TODO: Not used, remove
  interval: null,
  lastUpdate: new Date().getTime(),
  autobuyers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  tickspeedMultiplier: new Decimal(10),
  chall2Pow: 1,
  chall3Pow: new Decimal(0.01),
  matter: new Decimal(0),
  chall11Pow: new Decimal(1),
  partInfinityPoint: 0,
  partInfinitied: 0,
  break: false,
  secretUnlocks: {
    why: 0,
    fixed: "notyetfixed",
    dragging: 0,
    themes: new Set(),
    secretTS: 0, // incremented every time secret time study toggles
  },
  lastTenRuns: Array.range(0, 10).map(() => [defaultMaxTime, new Decimal(1), defaultMaxTime]),
  lastTenEternities: Array.range(0, 10).map(() => [defaultMaxTime, new Decimal(1), defaultMaxTime]),
  lastTenRealities: Array.range(0, 10).map(() => [defaultMaxTime, new Decimal(1), defaultMaxTime, 0]),
  infMult: new Decimal(1),
  infMultCost: new Decimal(10),
  overXGalaxies: 10,
  version: 13,
  infinityPower: new Decimal(1),
  spreadingCancer: 0,
  postChallUnlocked: 0,
  postC4Tier: 0,
  postC3Reward: new Decimal(1),
  eternityPoints: new Decimal(0),
  eternities: 0,
  thisEternity: 0,
  thisEternityRealTime: 0,
  bestEternity: 999999999999,
  eternityUpgrades: new Set(),
  epmultUpgrades: 0,
  infDimBuyers: [false, false, false, false, false, false, false, false],
  timeShards: new Decimal(0),
  tickThreshold: new Decimal(1),
  totalTickGained: 0,
  offlineProd: 0,
  offlineProdCost: 1e7,
  autoSacrifice: 1,
  replicanti: {
    amount: new Decimal(0),
    unl: false,
    chance: 0.01,
    chanceCost: new Decimal(1e150),
    interval: 1000,
    intervalCost: new Decimal(1e140),
    gal: 0,
    galaxies: 0,
    galCost: new Decimal(1e170),
    auto: [false, false, false]
  },
  timestudy: {
    theorem: new Decimal(0),
    amcost: new Decimal("1e20000"),
    ipcost: new Decimal(1),
    epcost: new Decimal(1),
    studies: [],
    shopMinimized: false,
    presets: new Array(6).fill({
      name: "",
      studies: "",
    }),
  },
  eternityChalls: {},
  etercreq: 0,
  infMultBuyer: false,
  autoCrunchMode: AutoCrunchMode.AMOUNT,
  autoEternityMode: AutoEternityMode.AMOUNT,
  autoRealityMode: AutoRealityMode.RM,
  respec: false,
  eternityBuyer: {
    limit: new Decimal(0),
    isOn: false
  },
  eterc8ids: 50,
  eterc8repl: 40,
  noSacrifices: true,
  onlyEighthDimensons: true,
  onlyFirstDimensions: true,
  noEighthDimensions: true,
  noTheoremPurchases: true,
  dilation: {
    studies: [],
    active: false,
    tachyonParticles: new Decimal(0),
    dilatedTime: new Decimal(0),
    nextThreshold: new Decimal(1000),
    freeGalaxies: 0,
    upgrades: new Set(),
    rebuyables: {
      1: 0,
      2: 0,
      3: 0,
    },
    auto: [false, false, false]
  },
  realities: 0,
  thisReality: 0,
  thisRealityRealTime: 0,
  bestReality: 999999999999,
  realityBuyer: {
    rm: new Decimal(0),
    glyph: 0,
    isOn: false
  },
  reality: {
    realityMachines: new Decimal(0),
    glyphs: {
      active: [],
      inventory: [],
      inventorySize: 100,
      last: "",
      sac: {
        power: 0,
        infinity: 0,
        time: 0,
        replication: 0,
        dilation: 0,
        effarig: 0
      },
    },
    seed: Math.floor(Date.now() * Math.random() + 1),
    rebuyables: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    upgradeBits: 0,
    upgReqs: [null, true, true, true, true, true,
      false, false, false, false, false,
      false, false, false, false, false,
      false, false, false, false, false,
      false, false, false, false, false,
      false, false, false, false, false
    ],
    upgReqChecks: [false],
    automatorOn: false,
    automatorCurrentRow: 0,
    automatorRows: 0,
    automatorCommands: new Set(),
    perks: new Set(),
    respec: false,
    tdbuyers: [false, false, false, false, false, false, false, false],
    epmultbuyer: false,
    pp: 0,
    autoEC: true,
    lastAutoEC: 0,
    partEternitied: 0
  },
  blackHole: Array.range(0, 2).map(id => ({
    id,
    intervalUpgrades: 0,
    powerUpgrades: 0,
    durationUpgrades: 0,
    phase: 0,
    active: false,
    unlocked: false,
    activations: 0
  })),
  blackHolePause: false,
  ttbuyer: false,
  celestials: {
    teresa: {
      rmStore: 0,
      quoteIdx: 0,
      unlocks: [],
      run: false,
      bestRunAM: new Decimal(0),
      glyphLevelMult: 1,
      rmMult: 1,
      dtBulk: 1
    },
    effarig: {
      relicShards: 0,
      unlocks: [],
      run: false,
      quoteIdx: 0,
      glyphWeights: {
        ep: 25,
        repl: 25,
        dt: 25,
        eternities: 25
      },
      autoGlyphSac: {
        mode: AutoGlyphSacMode.NONE,
        types: GlyphTypes.list.mapToObject(t => t.id, t => ({
          rarityThreshold: 0,
          scoreThreshold: 0,
          effectScores: t.effects.mapToObject(e => e.id, () => 0),
        })),
      },
      autoGlyphPick: {
        mode: AutoGlyphPickMode.RANDOM,
      },
    },
    enslaved: {
      isStoring: false,
      stored: 0,
      isStoringReal: false,
      storedReal: 0,
      autoStoreReal: false,
      storedFraction: 1,
      quoteIdx: 0,
      unlocks: [],
      run: false,
      completed: false,
      maxQuotes: 6
    },
    v: {
      unlocks: [],
      quoteIdx: 0,
      run: false,
      runUnlocks: [0, 0, 0, 0, 0, 0],
      additionalStudies: 0
    },
    ra: {
      pets: {
        teresa: {
          level: 1,
          exp: 0,
          lastEPGained: new Decimal(0)
        },
        effarig: {
          level: 1,
          exp: 0,
          lastGlyphCount: 5
        },
        enslaved: {
          level: 1,
          exp: 0,
          lastTimeTaken: Number.MAX_VALUE
        },
        v: {
          level: 1,
          exp: 0,
          lastTTPurchased: 0
        }
      },
      unlocks: [],
      run: false,
      charged: new Set(),
      quoteIdx: 0,
      disCharge: false,
      peakGamespeed: 1,
    },
    laitela: {
      matter: new Decimal(0),
      run: false,
      unlocks: [],
      dimensions: Array.range(0, 4).map(() =>
        ({
          amount: new Decimal(0),
          chanceUpgrades: 0,
          intervalUpgrades: 0,
          powerUpgrades: 0,
          timeSinceLastUpdate: 0
        })),
      maxAmGained: new Decimal(0)
    }
  },
  autoEcIsOn: true,
  options: {
    newsHidden: false,
    notation: "Mixed scientific",
    retryChallenge: false,
    showAllChallenges: false,
    bulkOn: true,
    cloud: true,
    hotkeys: true,
    theme: "Normal",
    commas: true,
    updateRate: 50,
    newUI: true,
    chart: {
      updateRate: 1000,
      duration: 10,
      warning: 0,
      on: false,
      dips: true
    },
    animations: {
      floatingText: true,
      bigCrunch: true,
      eternity: true,
      tachyonParticles: true,
      reality: true,
      background: true
    },
    confirmations: {
      sacrifice: true,
      challenges: true,
      eternity: true,
      dilation: true,
      reality: true
    }
  }
};

const Player = {
  defaultStart: deepmerge.all([{}, player]),

  get totalInfinitied() {
    return player.infinitied.plus(player.infinitiedBank).clampMin(0);
  },

  get gainedEternities() {
    return RealityUpgrade(10).isBought ? player.eternities - 100 : player.eternities;
  },

  get isInMatterChallenge() {
    return NormalChallenge(11).isRunning || InfinityChallenge(6).isRunning;
  },

  get effectiveMatterAmount() {
    if (NormalChallenge(11).isRunning) {
      return player.matter;
    }
    if (InfinityChallenge(6).isRunning) {
      return Decimal.pow(player.matter, 20);
    }
    return new Decimal(0);
  },

  get antimatterPerSecond() {
    const basePerSecond = getDimensionProductionPerSecond(1);
    if (NormalChallenge(3).isRunning) {
      return basePerSecond.times(player.chall3Pow);
    }
    if (NormalChallenge(12).isRunning) {
      return basePerSecond.plus(getDimensionProductionPerSecond(2));
    }
    return basePerSecond.times(getGameSpeedupFactor());
  },

  get bestRunIPPM() {
    return GameCache.bestRunIPPM.value;
  },

  get averageEPPerRun() {
    return GameCache.averageEPPerRun.value;
  },

  get tickSpeedMultDecrease() {
    return GameCache.tickSpeedMultDecrease.value;
  },

  get dimensionMultDecrease() {
    const base = GameCache.dimensionMultDecrease.value - 1
    return 1 + base * Laitela.matterEffectToDimensionMultDecrease
  },

  get hasFreeInventorySpace() {
    return Glyphs.freeInventorySpace > 0;
  },

  get achievementPower() {
    return GameCache.achievementPower.value.pow(getAdjustedGlyphEffect("effarigachievement"));
  },

  get eternityGoal() {
    const ec = EternityChallenge.current;
    return ec === undefined ? Decimal.MAX_NUMBER : ec.currentGoal;
  }
};

function guardFromNaNValues(obj) {
  function isObject(obj) {
    return obj !== null && typeof obj === "object" && !(obj instanceof Decimal);
  }

  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    //TODO: rework autobuyer saving
    if (key === "autobuyers" || key === "autoSacrifice") continue;

    let value = obj[key];
    if (isObject(value)) {
      guardFromNaNValues(value);
      continue;
    }

    if (typeof value === "number") {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => value,
        set: function guardedSetter(newValue) {
          if (newValue === null || newValue === undefined) {
            throw crash("null/undefined player property assignment");
          }
          if (typeof newValue !== "number") {
            throw crash("Non-Number assignment to Number player property");
          }
          if (!isFinite(newValue)) {
            throw crash("NaN player property assignment");
          }
          value = newValue;
        }
      });
    }

    if (value instanceof Decimal) {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => value,
        set: function guardedSetter(newValue) {
          if (newValue === null || newValue === undefined) {
            throw crash("null/undefined player property assignment");
          }
          if (!(newValue instanceof Decimal)) {
            throw crash("Non-Decimal assignment to Decimal player property");
          }
          if (!isFinite(newValue.mantissa) || !isFinite(newValue.exponent)) {
            throw crash("NaN player property assignment");
          }
          value = newValue;
        }
      });
    }
  }
}