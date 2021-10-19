"use strict";

// This is actually reassigned when importing saves
// eslint-disable-next-line prefer-const
let player = {
  antimatter: new Decimal(10),
  dimensions: {
    antimatter: Array.range(0, 8).map(() => ({
      bought: 0,
      costBumps: 0,
      amount: new Decimal(0)
    })),
    infinity: Array.range(0, 8).map(tier => ({
      isUnlocked: false,
      bought: 0,
      amount: new Decimal(0),
      cost: new Decimal([1e8, 1e9, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280][tier]),
      baseAmount: 0
    })),
    time: Array.range(0, 8).map(tier => ({
      cost: new Decimal([1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"][tier]),
      amount: new Decimal(0),
      bought: 0
    }))
  },
  buyUntil10: true,
  sacrificed: new Decimal(0),
  achievementBits: Array.repeat(0, 15),
  secretAchievementBits: Array.repeat(0, 4),
  infinityUpgrades: new Set(),
  infinityRebuyables: [0, 0, 0],
  challenge: {
    normal: {
      current: 0,
      bestTimes: Array.repeat(Number.MAX_VALUE, 11),
      completedBits: 0,
    },
    infinity: {
      current: 0,
      bestTimes: Array.repeat(Number.MAX_VALUE, 8),
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
    bulkOn: true,
    autobuyersOn: true,
    disableContinuum: false,
    reality: {
      mode: 0,
      rm: new Decimal(1),
      glyph: 0,
      isActive: false
    },
    eternity: {
      mode: 0,
      amount: new Decimal(1),
      increaseWithMult: true,
      time: 1,
      xHighest: new Decimal(1),
      isActive: false
    },
    bigCrunch: {
      cost: 1,
      interval: 150000,
      mode: 0,
      amount: new Decimal(1),
      increaseWithMult: true,
      time: 1,
      xHighest: new Decimal(1),
      isActive: true,
      lastTick: 0
    },
    galaxy: {
      cost: 1,
      interval: 20000,
      limitGalaxies: false,
      maxGalaxies: 1,
      buyMax: false,
      buyMaxInterval: 0,
      isActive: true,
      lastTick: 0
    },
    dimBoost: {
      cost: 1,
      interval: 4000,
      limitDimBoosts: false,
      maxDimBoosts: 1,
      limitUntilGalaxies: false,
      galaxies: 10,
      buyMaxInterval: 0,
      isActive: true,
      lastTick: 0
    },
    tickspeed: {
      isUnlocked: false,
      cost: 1,
      interval: 500,
      mode: AUTOBUYER_MODE.BUY_SINGLE,
      isActive: true,
      lastTick: 0,
      isBought: false
    },
    sacrifice: {
      multiplier: new Decimal(2),
      isActive: true
    },
    antimatterDims: Array.range(0, 8).map(tier => ({
      isUnlocked: false,
      cost: 1,
      interval: [500, 600, 700, 800, 900, 1000, 1100, 1200][tier],
      bulk: 1,
      mode: AUTOBUYER_MODE.BUY_10,
      isActive: true,
      lastTick: 0,
      isBought: false
    })),
    infinityDims: Array.range(0, 8).map(() => ({
      isActive: false,
      lastTick: 0,
    })),
    timeDims: Array.range(0, 8).map(() => ({
      isActive: false,
      lastTick: 0,
    })),
    replicantiGalaxies: {
      isActive: false,
    },
    replicantiUpgrades: Array.range(0, 3).map(() => ({
      isActive: false,
      lastTick: 0,
    })),
    timeTheorems: {
      isActive: false,
      lastTick: 0,
    },
    dilationUpgrades: Array.range(0, 3).map(() => ({
      isActive: false,
      lastTick: 0,
    })),
    blackHolePower: Array.range(0, 2).map(() => ({
      isActive: false,
    })),
    realityUpgrades: Array.range(0, 5).map(() => ({
      isActive: false,
    })),
    imaginaryUpgrades: Array.range(0, 10).map(() => ({
      isActive: false,
    })),
    ipMultBuyer: { isActive: false, },
    epMultBuyer: { isActive: false, },
  },
  infinityPoints: new Decimal(0),
  infinities: new Decimal(0),
  infinitiesBanked: new Decimal(0),
  dimensionBoosts: 0,
  galaxies: 0,
  news: {
    // This is properly handled in NewsHandler.addSeenNews which adds properties as needed
    seen: {},
    specialTickerData: {
      uselessNewsClicks: 0,
      paperclips: 0,
      newsQueuePosition: 1000,
      eiffelTowerChapter: 0
    },
    totalSeen: 0,
  },
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
    themes: new Set(),
    viewSecretTS: false,
    cancerAchievements: false,
  },
  shownRuns: {
    Reality: true,
    Eternity: true,
    Infinity: true
  },
  requirementChecks: {
    infinity: {
      maxAll: false,
      noSacrifice: true,
      noAD8: true,
    },
    eternity: {
      onlyAD1: true,
      onlyAD8: true,
      noAD1: true,
      noRG: true,
    },
    reality: {
      noAM: true,
      noTriads: true,
      noPurchasedTT: true,
      noInfinities: true,
      noEternities: true,
      noContinuum: true,
      maxID1: new Decimal(0),
      maxStudies: 0,
      maxGlyphs: 0,
      slowestBH: 1,
    },
    permanent: {
      cancerGalaxies: 0,
      singleTickspeed: 0,
      perkTreeDragging: 0
    }
  },
  records: {
    gameCreatedTime: Date.now(),
    totalTimePlayed: 0,
    realTimePlayed: 0,
    totalAntimatter: new Decimal(0),
    lastTenInfinities: Array.range(0, 10).map(() =>
      [Number.MAX_VALUE, new Decimal(1), new Decimal(1), Number.MAX_VALUE]),
    lastTenEternities: Array.range(0, 10).map(() =>
      [Number.MAX_VALUE, new Decimal(1), new Decimal(1), Number.MAX_VALUE]),
    lastTenRealities: Array.range(0, 10).map(() =>
      [Number.MAX_VALUE, new Decimal(1), 1, Number.MAX_VALUE, 0]),
    thisInfinity: {
      time: 0,
      realTime: 0,
      lastBuyTime: 0,
      maxAM: new Decimal(0),
      bestIPmin: new Decimal(0),
    },
    bestInfinity: {
      time: Number.MAX_VALUE,
      realTime: Number.MAX_VALUE,
      bestIPminEternity: new Decimal(0),
      bestIPminReality: new Decimal(0),
    },
    thisEternity: {
      time: 0,
      realTime: 0,
      maxAM: new Decimal(0),
      maxIP: new Decimal(0),
      bestIPMsWithoutMaxAll: new Decimal(0),
      bestEPmin: new Decimal(0),
      bestInfinitiesPerMs: new Decimal(0),
    },
    bestEternity: {
      time: Number.MAX_VALUE,
      realTime: Number.MAX_VALUE,
      bestEPminReality: new Decimal(0),
    },
    thisReality: {
      time: 0,
      realTime: 0,
      maxAM: new Decimal(0),
      maxIP: new Decimal(0),
      maxEP: new Decimal(0),
      bestEternitiesPerMs: new Decimal(0),
      maxReplicanti: new Decimal(0),
      maxDT: new Decimal(0),
    },
    bestReality: {
      time: Number.MAX_VALUE,
      realTime: Number.MAX_VALUE,
      glyphStrength: 0,
      RMmin: new Decimal(0),
      RMminSet: [],
      glyphLevel: 0,
      glyphLevelSet: [],
      bestEP: new Decimal(0),
      bestEPSet: [],
      speedSet: [],
      iMCapSet: [],
      laitelaSet: [],
    },
  },
  infMult: 0,
  version: 13,
  infinityPower: new Decimal(1),
  postChallUnlocked: 0,
  postC4Tier: 0,
  eternityPoints: new Decimal(0),
  eternities: new Decimal(0),
  eternityUpgrades: new Set(),
  epmultUpgrades: 0,
  timeShards: new Decimal(0),
  totalTickGained: 0,
  totalTickBought: 0,
  replicanti: {
    unl: false,
    amount: new Decimal(0),
    chance: 0.01,
    chanceCost: new Decimal(1e150),
    interval: 1000,
    intervalCost: new Decimal(1e140),
    boughtGalaxyCap: 0,
    galaxies: 0,
    galCost: new Decimal(1e170),
  },
  timestudy: {
    theorem: new Decimal(0),
    maxTheorem: new Decimal(0),
    amBought: 0,
    ipBought: 0,
    epBought: 0,
    studies: [],
    shopMinimized: false,
    preferredPaths: [[], 0],
    presets: new Array(6).fill({
      name: "",
      studies: "",
    }),
  },
  eternityChalls: {},
  etercreq: 0,
  respec: false,
  eterc8ids: 50,
  eterc8repl: 40,
  dilation: {
    studies: [],
    active: false,
    tachyonParticles: new Decimal(0),
    dilatedTime: new Decimal(0),
    nextThreshold: new Decimal(1000),
    baseTachyonGalaxies: 0,
    totalTachyonGalaxies: 0,
    upgrades: new Set(),
    rebuyables: {
      1: 0,
      2: 0,
      3: 0,
    },
    lastEP: new Decimal(-1),
  },
  realities: 0,
  partSimulatedReality: 0,
  reality: {
    realityMachines: new Decimal(0),
    imaginaryMachines: 0,
    iMCap: 0,
    glyphs: {
      active: [],
      inventory: [],
      sac: {
        power: 0,
        infinity: 0,
        time: 0,
        replication: 0,
        dilation: 0,
        effarig: 0,
        reality: 0
      },
      undo: [],
      sets: [[], [], [], [], []],
      protectedRows: 2,
    },
    seed: Math.floor(Date.now() * Math.random() + 1),
    secondGaussian: 1e6,
    musicSeed: Math.floor(Date.now() * Math.random() + 0xBCDDECCB),
    musicSecondGaussian: 1e6,
    rebuyables: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    upgradeBits: 0,
    upgReqs: 0,
    imaginaryUpgradeBits: 0,
    imaginaryUpgReqs: 0,
    imaginaryRebuyables: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    },
    perks: new Set(),
    respec: false,
    showGlyphSacrifice: false,
    showSidebarPanel: 0,
    autoSort: 0,
    autoCollapse: false,
    autoAutoClean: false,
    perkPoints: 0,
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
        repeat: true,
        forceRestart: true,
        followExecution: true,
        stack: [],
      },
      scripts: {
      },
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
  })),
  blackHolePause: false,
  blackHoleAutoPauseMode: 0,
  blackHolePauseTime: 0,
  blackHoleNegative: 1,
  celestials: {
    teresa: {
      pouredAmount: 0,
      quotes: [],
      unlockBits: 0,
      run: false,
      bestRunAM: new Decimal(1),
      bestAMSet: [],
      perkShop: Array.repeat(0, 5),
      lastRepeatedMachines: new Decimal(0)
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
      autoAdjustGlyphWeights: false,
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
      tesseracts: 0,
      feltEternity: false,
      progressBits: 0,
      hintBits: 0,
      hintUnlockProgress: 0,
      glyphHintsGiven: 0,
      zeroHintTime: 0
    },
    v: {
      unlockBits: 0,
      run: false,
      quotes: [],
      runUnlocks: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      triadStudies: [],
      goalReductionSteps: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      STSpent: 0,
      runGlyphs: [[], [], [], [], [], [], [], [], []],
      // The -10 is for glyph count, as glyph count for V is stored internally as a negative number
      runRecords: [-10, 0, 0, 0, 0, 0, 0, 0, 0],
      wantsFlipped: true,
    },
    ra: {
      pets: {
        teresa: {
          level: 1,
          memories: 0,
          memoryChunks: 0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        effarig: {
          level: 1,
          memories: 0,
          memoryChunks: 0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        enslaved: {
          level: 1,
          memories: 0,
          memoryChunks: 0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        v: {
          level: 1,
          memories: 0,
          memoryChunks: 0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        }
      },
      alchemy: Array.repeat(0, 21)
        .map(() => ({
          amount: 0,
          reaction: false
        })),
      highestRefinementValue: {
        power: 0,
        infinity: 0,
        time: 0,
        replication: 0,
        dilation: 0,
        effarig: 0
      },
      momentumTime: 0,
      unlocksBits: 0,
      run: false,
      charged: new Set(),
      disCharge: false,
      peakGamespeed: 1,
      petWithRecollection: ""
    },
    laitela: {
      darkMatter: new Decimal(0),
      maxDarkMatter: new Decimal(0),
      run: false,
      unlockBits: 0,
      dimensions: Array.range(0, 4).map(() =>
        ({
          amount: new Decimal(0),
          intervalUpgrades: 0,
          powerDMUpgrades: 0,
          powerDEUpgrades: 0,
          timeSinceLastUpdate: 0,
          ascensionCount: 0
        })),
      darkAutobuyerTimer: 0,
      entropy: 0,
      thisCompletion: 3600,
      fastestCompletion: 3600,
      difficultyTier: 0,
      upgrades: {},
      darkMatterMult: 1,
      darkEnergy: 0,
      singularities: 0,
      singularityCapIncreases: 0,
      autoAnnihilationSetting: 5,
      // These have inconsistent starting values because default-on isn't necessarily the best behavior for all
      automation: {
        dimensions: true,
        ascension: false,
        singularity: true,
        annihilation: false
      },
      lastCheckedMilestones: 0
    }
  },
  tabNotifications: new Set(),
  triggeredTabNotificationBits: 0,
  tutorialState: 0,
  tutorialActive: true,
  options: {
    news: {
      enabled: true,
      repeatBuffer: 40,
      AIChance: 0,
      speed: 1
    },
    notation: "Mixed scientific",
    retryChallenge: false,
    retryCelestial: false,
    showAllChallenges: false,
    cloudEnabled: true,
    hotkeys: true,
    theme: "Normal",
    commas: true,
    updateRate: 33,
    newUI: true,
    sidebarMinimized: false,
    offlineProgress: true,
    automaticTabSwitching: true,
    respecIntoProtected: false,
    offlineTicks: 1000,
    showLastTenResourceGain: true,
    autosaveInterval: 30000,
    showTimeSinceSave: true,
    exportedFileCount: 0,
    hideCompletedAchievementRows: false,
    glyphTextColors: true,
    headerTextColored: false,
    showNewGlyphIcon: true,
    ignoreGlyphEffects: false,
    ignoreGlyphLevel: false,
    ignoreGlyphRarity: false,
    showCondenseToMilestone: false,
    showHintText: {
      achievements: true,
      achievementUnlockStates: true,
      challenges: true,
      studies: true,
      glyphEffectDots: true,
      realityUpgrades: true,
      perks: true,
      alchemy: true,
    },
    chart: {
      updateRate: 1000,
      duration: 10,
      warning: 0,
      on: false,
      dips: true
    },
    animations: {
      bigCrunch: true,
      eternity: true,
      dilation: true,
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
      resetReality: true,
      glyphReplace: true,
      glyphSacrifice: true,
      glyphSelection: true,
      harshAutoClean: true,
      glyphUndo: true,
      resetCelestial: true,
      deleteGlyphSetSave: true,
      glyphRefine: true,
    },
    awayProgress: {
      antimatter: true,
      dimensionBoosts: true,
      antimatterGalaxies: true,
      infinities: true,
      infinityPoints: true,
      replicanti: true,
      replicantiGalaxies: true,
      eternities: true,
      eternityPoints: true,
      tachyonParticles: true,
      dilatedTime: true,
      tachyonGalaxies: true,
      realities: true,
      realityMachines: true,
      imaginaryMachines: true,
      relicShards: true,
      darkMatter: true,
      darkEnergy: true,
      singularities: true,
      celestialMemories: true,
      blackHole: true
    },
    hiddenTabBits: 0,
    hiddenSubtabBits: Array.repeat(0, 11),
    lastOpenTab: 0,
    lastOpenSubtab: Array.repeat(0, 11),
    fixedPerkStartingPos: false,
    perkPhysicsEnabled: true,
    automatorEvents: {
      newestFirst: false,
      timestampType: 0,
      maxEntries: 200,
      clearOnReality: true,
      clearOnRestart: true,
    }
  },
  IAP: {
    totalSTD: 0,
    spentSTD: 0,
    IPPurchases: 0,
    EPPurchases: 0,
    dimPurchases: 0,
    allDimPurchases: 0
  },
  // TODO: Remove everything with devMode in it, we (probably?) don't want this in release
  devMode: false,
};

const Player = {
  defaultStart: deepmerge.all([{}, player]),

  get isInMatterChallenge() {
    return NormalChallenge(11).isRunning || InfinityChallenge(6).isRunning;
  },

  get isInAntimatterChallenge() {
    return NormalChallenge.isRunning || InfinityChallenge.isRunning;
  },

  get antimatterChallenge() {
    return NormalChallenge.current || InfinityChallenge.current;
  },

  get isInAnyChallenge() {
    return this.isInAntimatterChallenge || EternityChallenge.isRunning;
  },

  get anyChallenge() {
    return this.antimatterChallenge || EternityChallenge.current;
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

  get canCrunch() {
    if (Enslaved.isRunning && Enslaved.BROKEN_CHALLENGES.includes(NormalChallenge.current?.id)) return false;
    const challenge = NormalChallenge.current || InfinityChallenge.current;
    const goal = challenge === undefined ? Decimal.NUMBER_MAX_VALUE : challenge.goal;
    return player.records.thisInfinity.maxAM.gte(goal);
  },

  get canEternity() {
    return player.records.thisEternity.maxIP.gte(Player.eternityGoal);
  },

  get bestRunIPPM() {
    return GameCache.bestRunIPPM.value;
  },

  get averageRealTimePerEternity() {
    return GameCache.averageRealTimePerEternity.value;
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

  get infinityLimit() {
    const challenge = NormalChallenge.current || InfinityChallenge.current;
    return challenge === undefined ? Decimal.MAX_VALUE : challenge.goal;
  },

  get eternityGoal() {
    return EternityChallenge.isRunning
      ? EternityChallenge.current.currentGoal
      : requiredIPForEP(1);
  },

  get automatorUnlocked() {
    return Currency.realities.gte(5);
  },

  resetRequirements(key) {
    const glyphCount = player.requirementChecks.reality.maxGlyphs;
    // This switch case intentionally falls through because every lower layer should be reset as well
    switch (key) {
      case "reality":
        player.requirementChecks.reality = {
          noAM: true,
          noTriads: true,
          noPurchasedTT: true,
          // Note that these two checks below are only used in row 2, which is in principle always before the "flow"
          // upgrades in row 3 which passively generate infinities/eternities. These upgrades won't cause a lockout
          // as these requirements are only invalidated on manual infinities or eternities.
          noInfinities: true,
          noEternities: true,
          noContinuum: player.auto.disableContinuum,
          maxID1: new Decimal(0),
          maxStudies: 0,
          // This only gets set to the correct value when Glyphs.updateMaxGlyphCount is called, which always happens
          // before this part of the code is reached in the Reality reset. Nevertheless, we want to keep its old value.
          maxGlyphs: glyphCount,
          slowestBH: BlackHoles.areNegative ? player.blackHoleNegative : 1,
        };
      // eslint-disable-next-line no-fallthrough
      case "eternity":
        player.requirementChecks.eternity = {
          onlyAD1: true,
          onlyAD8: true,
          noAD1: true,
          noRG: true,
        };
      // eslint-disable-next-line no-fallthrough
      case "infinity":
        player.requirementChecks.infinity = {
          maxAll: false,
          noSacrifice: true,
          noAD8: true,
        };
        break;
      default:
        throw Error("Unrecognized prestige layer for requirement reset");
    }
  }
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
