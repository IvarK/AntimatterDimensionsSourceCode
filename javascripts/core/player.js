"use strict";

const defaultMaxTime = 60000 * 60 * 24 * 31;

// This is actually reassigned when importing saves
// eslint-disable-next-line prefer-const
let player = {
  antimatter: new Decimal(10),
  totalAntimatter: new Decimal(0),
  thisInfinityMaxAM: new Decimal(0),
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
  achievementBits: Array.repeat(0, 15),
  secretAchievementBits: Array.repeat(0, 4),
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
      mode: AUTOBUYER_MODE.BUY_10,
      priority: 1,
      isActive: false,
      lastTick: 0
    })),
    tickspeed: {
      isUnlocked: false,
      cost: 1,
      interval: 2500,
      mode: AUTOBUYER_MODE.BUY_SINGLE,
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
      multiplier: new Decimal(5),
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
    ttTimer: 0,
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
  achPow: new Decimal(1),
  news: new Set(),
  // TODO: Not used, remove
  interval: null,
  lastUpdate: new Date().getTime(),
  chall2Pow: 1,
  chall3Pow: new Decimal(0.01),
  matter: new Decimal(1),
  chall9TickspeedCostBumps: 0,
  chall8TotalSacrifice: new Decimal(1),
  ic2Count: 0,
  partInfinityPoint: 0,
  partInfinitied: 0,
  break: false,
  secretUnlocks: {
    why: 0,
    dragging: 0,
    themes: new Set(),
    // Incremented every time secret time study toggles
    secretTS: 0,
    uselessNewsClicks: 0,
    cancerAchievements: false,
    paperclips: 0,
    newsQueuePosition: 1000
  },
  shownRuns: {
    Reality: true,
    Eternity: true,
    Infinity: true
  },
  lastTenRuns: Array.range(0, 10).map(() => [defaultMaxTime, new Decimal(1), defaultMaxTime, new Decimal(1)]),
  lastTenEternities: Array.range(0, 10).map(() => [defaultMaxTime, new Decimal(1), defaultMaxTime]),
  lastTenRealities: Array.range(0, 10).map(() => [defaultMaxTime, new Decimal(1), defaultMaxTime, 0]),
  bestIPminThisInfinity: new Decimal(0),
  bestIPminThisEternity: new Decimal(0),
  bestEPminThisEternity: new Decimal(0),
  bestEPminThisReality: new Decimal(0),
  bestInfinitiesPerMs: new Decimal(0),
  bestEternitiesPerMs: new Decimal(0),
  bestRMmin: new Decimal(0),
  bestRMminSet: [],
  bestGlyphLevel: 0,
  bestGlyphLevelSet: [],
  bestEP: new Decimal(0),
  bestEPSet: [],
  bestReality: 999999999999,
  bestRealityRealTime: 999999999999,
  bestSpeedSet: [],
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
    auto: [false, false, false],
    timer: 0,
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
  onlyEighthDimensions: true,
  onlyFirstDimensions: true,
  noEighthDimensions: false,
  noFirstDimensions: false,
  noTheoremPurchases: true,
  noInfinitiesThisReality: true,
  noEternitiesThisReality: true,
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
  reality: {
    realityMachines: new Decimal(0),
    glyphs: {
      active: [],
      inventory: [],
      last: "",
      sac: {
        power: 0,
        infinity: 0,
        time: 0,
        replication: 0,
        dilation: 0,
        effarig: 0,
        reality: 0,
        cursed: 0
      },
      undo: [],
    },
    seed: Math.floor(Date.now() * Math.random() + 1),
    rebuyables: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    rebuyablesAuto: [false, false, false, false, false],
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
    autoAutoClean: false,
    pp: 0,
    autoEC: true,
    lastAutoEC: 0,
    partEternitied: new Decimal(0),
    autoAchieve: true,
    gainedAutoAchievements: true,
    automator: {
      state: {
        mode: AUTOMATOR_MODE.STOP,
        topLevelScript: 0,
        editorScript: 0,
        repeat: false,
        stack: [],
      },
      scripts: {
      },
      lastID: 0,
      execTimer: 0,
      type: AUTOMATOR_TYPE.TEXT
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
    activations: 0,
    autoPower: false,
  })),
  blackHolePause: false,
  blackHolePauseTime: 0,
  blackHoleNegative: 1,
  minNegativeBlackHoleThisReality: 0,
  ttbuyer: false,
  celestials: {
    teresa: {
      rmStore: 0,
      quotes: [],
      unlockBits: 0,
      run: false,
      bestRunAM: new Decimal(1),
      bestAMSet: [],
      perkShop: Array.repeat(0, 5)
    },
    effarig: {
      relicShards: 0,
      unlocksBits: 0,
      run: false,
      quotes: [],
      glyphWeights: {
        ep: 25,
        repl: 25,
        dt: 25,
        eternities: 25
      },
      glyphScoreSettings: {
        mode: AUTO_GLYPH_SCORE.LOWEST_SACRIFICE,
        simpleEffectCount: 0,
        types: GlyphTypes.list.mapToObject(t => t.id, t => ({
          rarityThreshold: 0,
          scoreThreshold: 0,
          effectCount: 0,
          effectChoices: t.effects.mapToObject(e => e.id, () => false),
          effectScores: t.effects.mapToObject(e => e.id, () => 0),
        })),
      },
      glyphTrashMode: AUTO_GLYPH_REJECT.SACRIFICE,
    },
    enslaved: {
      isStoring: false,
      stored: 0,
      isStoringReal: false,
      storedReal: 0,
      autoStoreReal: false,
      isAutoReleasing: false,
      storedFraction: 1,
      quotes: [],
      unlocks: [],
      run: false,
      completed: false,
      maxQuotes: 6,
      tesseracts: 0,
      totalDimCapIncrease: 0,
      feltEternity: false,
    },
    v: {
      unlockBits: 0,
      quoteIdx: 0,
      run: false,
      runUnlocks: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      triadStudies: [],
      ppSpent: 0,
      STSpent: 0,
      runGlyphs: [[], [], [], [], [], [], [], [], []],
      // The -10 is for glyph count, as glyph count for V is stored internally as a negative number
      runRecords: [-10, 0, 0, 0, 0, 0, 0, 0, 0],
      maxGlyphsThisRun: 0
    },
    ra: {
      pets: {
        teresa: {
          level: 1,
          memoryChunks: 0,
          exp: 0
        },
        effarig: {
          level: 1,
          memoryChunks: 0,
          exp: 0
        },
        enslaved: {
          level: 1,
          memoryChunks: 0,
          exp: 0
        },
        v: {
          level: 1,
          memoryChunks: 0,
          exp: 0
        }
      },
      alchemy: Array.repeat(0, 21)
        .map(() => ({
          amount: 0,
          reaction: false
        })),
      unlocksBits: 0,
      run: false,
      charged: new Set(),
      quoteIdx: 0,
      disCharge: false,
      peakGamespeed: 1,
      petWithRecollection: ""
    },
    laitela: {
      matter: new Decimal(0),
      maxMatter: new Decimal(0),
      run: false,
      unlockBits: 0,
      dimensions: Array.range(0, 4).map(() =>
      ({
        amount: new Decimal(0),
        intervalUpgrades: 0,
        powerDMUpgrades: 0,
        powerDEUpgrades: 0,
        timeSinceLastUpdate: 0
      })),
      entropy: 0,
      thisCompletion: 3600,
      fastestCompletion: 3600,
      difficultyTier: 0,
      annihilated: false,
      upgrades: {},
      darkEnergyMult: 0,
      darkEnergy: 0
    }
  },
  options: {
    news: true,
    notation: "Mixed scientific",
    retryChallenge: false,
    retryCelestial: false,
    showAllChallenges: false,
    bulkOn: true,
    autobuyersOn: true,
    cloud: true,
    hotkeys: true,
    theme: "Normal",
    commas: true,
    updateRate: 33,
    newUI: true,
    offlineProgress: true,
    showGlyphEffectDots: true,
    respecIntoProtected: false,
    showHintText: {
      achievements: false,
      challenges: false,
      studies: false,
      realityUpgrades: false,
      perks: false,
      alchemy: false,
    },
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
      reality: true,
      glyphReplace: true,
      glyphSacrifice: true,
      glyphTrash: true,
      glyphUndo: true,
    }
  },
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
    const basePerSecond = NormalDimension(1).productionPerRealSecond
      .plus(NormalChallenge(12).isRunning ? NormalDimension(2).productionPerRealSecond : 0);
    return basePerSecond;
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
    return GameCache.dimensionMultDecrease.value;
  },

  get infinityGoal() {
    const challenge = NormalChallenge.current || InfinityChallenge.current;
    return challenge === undefined ? Decimal.NUMBER_MAX_VALUE : challenge.goal;
  },

  get eternityGoal() {
    return EternityChallenge.isRunning
      ? EternityChallenge.current.currentGoal
      : Decimal.NUMBER_MAX_VALUE;
  },

  get startingAM() {
    return Effects.max(
      10,
      Perk.startAM1,
      Perk.startAM2,
      Achievement(21),
      Achievement(37),
      Achievement(54),
      Achievement(55),
      Achievement(78).effects.antimatter
    ).toDecimal();
  },

  get startingIP() {
    return Effects.max(
      0,
      Perk.startIP1,
      Perk.startIP2,
      Achievement(104)
    ).toDecimal();
  },

  get startingEP() {
    return Effects.max(
      0,
      Perk.startEP1,
      Perk.startEP2,
      Perk.startEP3
    ).toDecimal();
  },
};

function guardFromNaNValues(obj) {
  function isObject(ob) {
    return ob !== null && typeof ob === "object" && !(ob instanceof Decimal);
  }

  for (const key in obj) {
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
