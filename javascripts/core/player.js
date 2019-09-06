"use strict";

var shiftDown = false;
const defaultMaxTime = 60000 * 60 * 24 * 31;

let player = {
  antimatter: new Decimal(10),
  dimensions: {
    normal: Array.range(0, 8).map(() => ({
      bought: 0,
      costBumps: 0,
      amount: new Decimal(0),
      power: new Decimal(1)
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
  buyUntil10: true,
  sacrificed: new Decimal(0),
  achievements: new Set(),
  secretAchievements: new Set(),
  infinityUpgrades: new Set(),
  usedMaxAll: false,
  bestIpPerMsWithoutMaxAll: new Decimal(0),
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
  infinity: {
    upgradeBits: 0
  },
  auto: {
    dimensions: Array.range(0, 8).map(tier => ({
      isUnlocked: false,
      cost: 1,
      interval: [1500, 2000, 2500, 3000, 4000, 5000, 6000, 7500][tier],
      bulk: 1,
      mode: AutobuyerMode.BUY_10,
      priority: 1,
      isActive: false,
      lastTick: 0
    })),
    tickspeed: {
      isUnlocked: false,
      cost: 1,
      interval: 2500,
      mode: AutobuyerMode.BUY_SINGLE,
      priority: 1,
      isActive: false,
      lastTick: 0
    },
    dimBoost: {
      cost: 1,
      interval: 8000,
      maxDimBoosts: 1,
      galaxies: 10,
      bulk: 1,
      buyMaxInterval: 0,
      isActive: false,
      lastTick: 0
    },
    galaxy: {
      cost: 1,
      interval: 75000,
      limitGalaxies: true,
      maxGalaxies: 1,
      buyMax: false,
      buyMaxInterval: 0,
      isActive: false,
      lastTick: 0
    },
    bigCrunch: {
      cost: 1,
      interval: 150000,
      mode: 0,
      amount: new Decimal(1),
      time: 1,
      xLast: new Decimal(1),
      isActive: false,
      lastTick: 0
    },
    sacrifice: {
      multiplier: 5,
      isActive: false
    },
    eternity: {
      mode: 0,
      amount: new Decimal(1),
      time: 1,
      xLast: new Decimal(1),
      isActive: false
    },
    reality: {
      mode: 0,
      rm: new Decimal(1),
      glyph: 0,
      isActive: false
    },
    timeDimTimer: 0,
    infDimTimer: 0,
    repUpgradeTimer: 0,
    dilUpgradeTimer: 0,
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
  thisInfinityLastBuyTime: 0,
  dimensionBoosts: 0,
  galaxies: 0,
  totalAntimatter: new Decimal(0),
  achPow: new Decimal(1),
  news: new Set(),
  // TODO: Not used, remove
  interval: null,
  lastUpdate: new Date().getTime(),
  chall2Pow: 1,
  chall3Pow: new Decimal(0.01),
  matter: new Decimal(1),
  chall9TickspeedCostBumps: 0,
  chall11Pow: new Decimal(1),
  partInfinityPoint: 0,
  partInfinitied: 0,
  break: false,
  secretUnlocks: {
    why: 0,
    fixed: "notyetfixed",
    dragging: 0,
    themes: new Set(),
    secretTS: 0,    // incremented every time secret time study toggles
  },
  lastTenRuns: Array.range(0, 10).map(() => [defaultMaxTime, new Decimal(1), defaultMaxTime, new Decimal(1)]),
  lastTenEternities: Array.range(0, 10).map(() => [defaultMaxTime, new Decimal(1), defaultMaxTime, 1]),
  lastTenRealities: Array.range(0, 10).map(() => [defaultMaxTime, new Decimal(1), defaultMaxTime, 0]),
  bestIPminThisInfinity: new Decimal(0),
  bestIPminThisEternity: new Decimal(0),
  bestEPminThisEternity: new Decimal(0),
  bestEPminThisReality: new Decimal(0),
  bestInfinitiesPerMs: new Decimal(0),
  bestEternitiesPerMs: new Decimal(0),
  bestRMmin: new Decimal(0),
  infMult: new Decimal(1),
  infMultCost: new Decimal(10),
  version: 13,
  infinityPower: new Decimal(1),
  spreadingCancer: 0,
  postChallUnlocked: 0,
  postC4Tier: 0,
  eternityPoints: new Decimal(0),
  eternities: new Decimal(0),
  thisEternity: 0,
  thisEternityRealTime: 0,
  bestEternity: 999999999999,
  eternityUpgrades: new Set(),
  epmultUpgrades: 0,
  infDimBuyers: [false, false, false, false, false, false, false, false],
  timeShards: new Decimal(0),
  tickThreshold: new Decimal(1),
  totalTickGained: 0,
  totalTickBought: 0,
  offlineProd: 0,
  offlineProdCost: 1e7,
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
  respec: false,
  eterc8ids: 50,
  eterc8repl: 40,
  noSacrifices: true,
  onlyEighthDimensons: true,
  onlyFirstDimensions: true,
  noEighthDimensions: false,
  noTheoremPurchases: true,
  dilation: {
    studies: [],
    active: false,
    tachyonParticles: new Decimal(0),
    dilatedTime: new Decimal(0),
    nextThreshold: new Decimal(1000),
    baseFreeGalaxies: 0,
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
  partSimulatedReality: 0,
  thisReality: 0,
  thisRealityRealTime: 0,
  bestReality: 999999999999,
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
        effarig: 0,
        reality: 0
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
              false, false, false, false, false],
    upgReqChecks: [false],
    perks: new Set(),
    respec: false,
    tdbuyers: [false, false, false, false, false, false, false, false],
    epmultbuyer: false,
    pp: 0,
    autoEC: true,
    lastAutoEC: 0,
    partEternitied: new Decimal(0),
    disableAutoAchieve: false,
    gainedAutoAchievements: true,
    automator: {
      state: {
        mode: AutomatorMode.STOP,
        topLevelScript: 0,
        editorScript: 0,
        repeat: false,
        stack: [],
      },
      scripts: {
      },
      lastID: 0,
      execTimer: 0,
      type: AutomatorType.TEXT
    },
    achTimer: 0,
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
      bestRunAM: new Decimal(1),
      perkShop: Array.repeat(0, 4)
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
      isAutoReleasing: false,
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
      alchemy: Array.repeat(0, 21)
        .map(() => ({
          amount: 0,
          reaction: false
        })),
      unlocks: [],
      run: false,
      charged: new Set(),
      quoteIdx: 0,
      disCharge: false,
      peakGamespeed: 1,
      compression: {
        active: false,
        entanglement: 0,
        upgradeBits: 0,
        respec: false
      },
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
      maxAmGained: new Decimal(1)
    }
  },
  autoEcIsOn: true,
  options: {
    news: true,
    notation: "Mixed scientific",
    retryChallenge: false,
    showAllChallenges: false,
    bulkOn: true,
    autobuyersOn: true,
    cloud: true,
    hotkeys: true,
    theme: "Normal",
    commas: true,
    updateRate: 33,
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
    return RealityUpgrade(10).isBought ? player.eternities.sub(100) : player.eternities;
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
    return basePerSecond.times(getGameSpeedupForDisplay());
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

  get infinityGoal() {
    const challenge = NormalChallenge.current || InfinityChallenge.current;
    return challenge === undefined ? Decimal.MAX_NUMBER : challenge.goal;
  },

  get eternityGoal() {
    return EternityChallenge.isRunning
      ? EternityChallenge.current.currentGoal
      : Decimal.MAX_NUMBER;
  }
};

function guardFromNaNValues(obj) {
  function isObject (obj) {
    return obj !== null && typeof obj === "object" && !(obj instanceof Decimal);
  }

  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    // TODO: rework autobuyer saving
    if (key === "automator") continue;

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
            throw new Error("null/undefined player property assignment");
          }
          if (typeof newValue !== "number") {
            throw new Error("Non-Number assignment to Number player property");
          }
          if (!isFinite(newValue)) {
            throw new Error("NaN player property assignment");
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
            throw new Error("null/undefined player property assignment");
          }
          if (!(newValue instanceof Decimal)) {
            throw new Error("Non-Decimal assignment to Decimal player property");
          }
          if (!isFinite(newValue.mantissa) || !isFinite(newValue.exponent)) {
            throw new Error("NaN player property assignment");
          }
          value = newValue;
        }
      });
    }
  }
}
