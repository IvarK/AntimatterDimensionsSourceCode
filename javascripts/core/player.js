var Marathon = 0;
var Marathon2 = 0;
var auto = false;
var autoS = true;
var shiftDown = false;
var controlDown = false;
var controlShiftDown = false;
var justImported = false;
var saved = 0;
var failureCount = 0;
var implosionCheck = 0;
var statsTimer = 0;
const defaultMaxTime = 60000 * 60 * 24 * 31;

var player = {
  money: new Decimal(10),
  tickSpeedCost: new Decimal(1000),
  tickspeed: new Decimal(1000),
  firstCost: new Decimal(10),
  secondCost: new Decimal(100),
  thirdCost: new Decimal(10000),
  fourthCost: new Decimal(1000000),
  fifthCost: new Decimal(1e9),
  sixthCost: new Decimal(1e13),
  seventhCost: new Decimal(1e18),
  eightCost: new Decimal(1e24),
  firstAmount: new Decimal(0),
  secondAmount: new Decimal(0),
  thirdAmount: new Decimal(0),
  fourthAmount: new Decimal(0),
  firstBought: 0,
  secondBought: 0,
  thirdBought: 0,
  fourthBought: 0,
  fifthAmount: new Decimal(0),
  sixthAmount: new Decimal(0),
  seventhAmount: new Decimal(0),
  eightAmount: new Decimal(0),
  fifthBought: 0,
  sixthBought: 0,
  seventhBought: 0,
  eightBought: 0,
  firstPow: new Decimal(1),
  secondPow: new Decimal(1),
  thirdPow: new Decimal(1),
  fourthPow: new Decimal(1),
  fifthPow: new Decimal(1),
  sixthPow: new Decimal(1),
  seventhPow: new Decimal(1),
  eightPow: new Decimal(1),
  sacrificed: new Decimal(0),
  achievements: new Set(),
  secretAchievements: new Set(),
  infinityUpgrades: [],
  infinityRebuyables: [0, 0],
  challenges: [],
  currentChallenge: "",
  infinityPoints: new Decimal(0),
  infinitied: new Decimal(0),
  infinitiedBank: new Decimal(0),
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
  costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
  tickspeedMultiplier: new Decimal(10),
  chall2Pow: 1,
  chall3Pow: new Decimal(0.01),
  matter: new Decimal(0),
  chall11Pow: new Decimal(1),
  partInfinityPoint: 0,
  partInfinitied: 0,
  break: false,
  secretUnlocks: {
    painTimer: 0,
    why: 0,
    fixed: "notyetfixed",
    dragging: 0,
    themes: [],
    secretTS: 0,    // incremented every time secret time study toggles
  },
  challengeTimes: [defaultMaxTime, defaultMaxTime, defaultMaxTime, defaultMaxTime, defaultMaxTime, defaultMaxTime, defaultMaxTime, defaultMaxTime, defaultMaxTime, defaultMaxTime, defaultMaxTime],
  infchallengeTimes: [defaultMaxTime, defaultMaxTime, defaultMaxTime, defaultMaxTime, defaultMaxTime, defaultMaxTime, defaultMaxTime, defaultMaxTime],
  lastTenRuns: Array.from({length:10}, () => [defaultMaxTime, new Decimal(1), defaultMaxTime]),
  lastTenEternities: Array.from({length:10}, () => [defaultMaxTime, new Decimal(1), defaultMaxTime]),
  lastTenRealities: Array.from({length:10}, () => [defaultMaxTime, new Decimal(1), 0, defaultMaxTime]),
  infMult: new Decimal(1),
  infMultCost: new Decimal(10),
  overXGalaxies: 10,
  version: 10,
  infDimensionsUnlocked: [false, false, false, false, false, false, false, false],
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
  eternityUpgrades: [],
  epmult: new Decimal(1),
  epmultCost: new Decimal(500),
  infinityDimension1: {
    cost: new Decimal(1e8),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension2: {
    cost: new Decimal(1e9),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension3: {
    cost: new Decimal(1e10),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension4: {
    cost: new Decimal(1e20),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension5: {
    cost: new Decimal(1e140),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension6: {
    cost: new Decimal(1e200),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension7: {
    cost: new Decimal(1e250),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension8: {
    cost: new Decimal(1e280),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infDimBuyers: [false, false, false, false, false, false, false, false],
  timeShards: new Decimal(0),
  tickThreshold: new Decimal(1),
  totalTickGained: 0,
  timeDimension1: {
    cost: new Decimal(1),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension2: {
    cost: new Decimal(5),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension3: {
    cost: new Decimal(100),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension4: {
    cost: new Decimal(1000),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension5: {
    cost: new Decimal("1e2350"),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension6: {
    cost: new Decimal("1e2650"),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension7: {
    cost: new Decimal("1e3000"),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension8: {
    cost: new Decimal("1e3350"),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  offlineProd: 0,
  offlineProdCost: 1e7,
  challengeTarget: new Decimal(0),
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
    shopMinimized: false
  },
  eternityChalls: {},
  eternityChallGoal: new Decimal(Number.MAX_VALUE),
  currentEternityChall: "",
  eternityChallUnlocked: 0,
  etercreq: 0,
  autoIP: new Decimal(0),
  autoTime: 1e300,
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
  dimlife: true,
  dead: true,
  dilation: {
    studies: [],
    active: false,
    tachyonParticles: new Decimal(0),
    dilatedTime: new Decimal(0),
    totalTachyonParticles: new Decimal(0),
    nextThreshold: new Decimal(1000),
    freeGalaxies: 0,
    upgrades: [],
    rebuyables: {
      1: 0,
      2: 0,
      3: 0,
    }
  },
  why: 0,
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
      slots: 3,
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
    upg: [],
    upgReqs: [null, true, true, true, true, true,
              false, false, false, false, false, 
              false, false, false, false, false, 
              false, false, false, false, false, 
              false, false, false, false, false, 
              false, false, false, false, false],
    upgReqChecks: [false],
    automatorOn: false,
    automatorCurrentRow: 0,
    automatorRows: 0,
    automatorCommands: [],
    perks: [],
    respec: false,
    tdbuyers: [false, false, false, false, false, false, false, false],
    epmultbuyer: false,
    pp: 0,
    autoEC: true,
    lastAutoEC: 0,
    partEternitied: 0
  },
  blackHole: [{
    id: 0,
    intervalUpgrades: 0,
    powerUpgrades: 0,
    durationUpgrades: 0,
    phase: 0,
    active: false,
    unlocked: false,
    activations: 0
  },
  {
    id: 1,
    intervalUpgrades: 0,
    powerUpgrades: 0,
    durationUpgrades: 0,
    phase: 0,
    active: false,
    unlocked: false,
    activations: 0
  },
  {
    id: 2,
    intervalUpgrades: 0,
    powerUpgrades: 0,
    durationUpgrades: 0,
    phase: 0,
    active: false,
    unlocked: false,
    activations: 0
  }],
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
      quoteIdx: 0,
      stored: 0,
      unlocks: [],
      run: false,
      quoteIdx: 0,
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
      level: 1,
      exp: 0,
      unlocks: [],
      run: false,
      charged: [],
      quoteIdx: 0,
      maxEpGained: new Decimal(0),
      activeMode: false, // false if idle, true if active
    }
  },
  autoEcIsOn: true,
  options: {
    newsHidden: false,
    notation: "Mixed scientific",
    noSacrificeConfirmation: false,
    retryChallenge: false,
    showAllChallenges: false,
    bulkOn: true,
    cloud: true,
    hotkeys: true,
    theme: undefined,
    secretThemeKey: "",
    commas: true,
    updateRate: 50,
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
      reality: true
    },
    confirmations: {
      challenges: true,
      eternity: true,
      dilation: true,
      reality: true
    }
  }
};


const Player = {

  get totalInfinitied() {
    return player.infinitied.plus(player.infinitiedBank).clampMin(0);
  },

  get isInMatterChallenge() {
    return Challenge(11).isRunning || InfinityChallenge(6).isRunning;
  },

  get effectiveMatterAmount() {
    if (Challenge(11).isRunning) {
      return player.matter;
    }
    if (InfinityChallenge(6).isRunning) {
      return Decimal.pow(player.matter, 20);
    }
    return new Decimal(0);
  },

  get antimatterPerSecond() {
    const basePerSecond = getDimensionProductionPerSecond(1);
    if (Challenge(3).isRunning) {
      return basePerSecond.times(player.chall3Pow);
    }
    if (Challenge(12).isRunning) {
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
    return GameCache.dimensionMultDecrease.value;
  },

  get hasFreeInventorySpace() {
    return Glyphs.freeInventorySpace > 0;
  },
};

function guardFromNaNValues(obj) {
  function isObject (obj) {
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
