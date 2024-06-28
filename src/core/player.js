import { AutomatorPanels } from "@/components/tabs/automator/AutomatorDocs";
import { GlyphInfo } from "@/components/modals/options/SelectGlyphInfoDropdown";

import { AUTOMATOR_MODE, AUTOMATOR_TYPE } from "./automator/automator-backend";
import { DC } from "./constants";
import { deepmergeAll } from "@/utility/deepmerge";
import { GlyphTypes } from "./glyph-effects";

// This is actually reassigned when importing saves
// eslint-disable-next-line prefer-const
window.player = {
  antimatter: DC.E1,
  dimensions: {
    antimatter: Array.range(0, 8).map(() => ({
      bought: 0,
      costBumps: 0,
      amount: DC.D0
    })),
    infinity: Array.range(0, 8).map(tier => ({
      isUnlocked: false,
      bought: 0,
      amount: DC.D0,
      cost: [DC.E8, DC.E9, DC.E10, DC.E20, DC.E140, DC.E200, DC.E250, DC.E280][tier],
      baseAmount: 0
    })),
    time: Array.range(0, 8).map(tier => ({
      cost: [DC.D1, DC.D5, DC.E2, DC.E3, DC.E2350, DC.E2650, DC.E3000, DC.E3350][tier],
      amount: DC.D0,
      bought: 0
    }))
  },
  buyUntil10: true,
  sacrificed: DC.D0,
  achievementBits: Array.repeat(0, 17),
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
      requirementBits: 0,
    }
  },
  infinity: {
    upgradeBits: 0
  },
  auto: {
    autobuyersOn: true,
    disableContinuum: false,
    reality: {
      mode: 0,
      rm: DC.D1,
      glyph: 0,
      time: 0,
      shard: 0,
      isActive: false
    },
    eternity: {
      mode: 0,
      amount: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
      isActive: false
    },
    bigCrunch: {
      cost: 1,
      interval: 150000,
      mode: 0,
      amount: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
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
      multiplier: DC.D2,
      isActive: true
    },
    antimatterDims: {
      all: Array.range(0, 8).map(tier => ({
        isUnlocked: false,
        cost: 1,
        interval: [500, 600, 700, 800, 900, 1000, 1100, 1200][tier],
        bulk: 1,
        mode: AUTOBUYER_MODE.BUY_10,
        isActive: true,
        lastTick: 0,
        isBought: false
      })),
      isActive: true,
    },
    infinityDims: {
      all: Array.range(0, 8).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    timeDims: {
      all: Array.range(0, 8).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    replicantiGalaxies: {
      isActive: false,
    },
    replicantiUpgrades: {
      all: Array.range(0, 3).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    timeTheorems: {
      isActive: false,
    },
    dilationUpgrades: {
      all: Array.range(0, 3).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    blackHolePower: {
      all: Array.range(0, 2).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    realityUpgrades: {
      all: Array.range(0, 5).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    imaginaryUpgrades: {
      all: Array.range(0, 10).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    darkMatterDims: {
      isActive: false,
      lastTick: 0,
    },
    ascension: {
      isActive: false,
      lastTick: 0,
    },
    annihilation: {
      isActive: false,
      multiplier: 1.05,
    },
    singularity: { isActive: false },
    ipMultBuyer: { isActive: false, },
    epMultBuyer: { isActive: false, },
  },
  infinityPoints: DC.D0,
  infinities: DC.D0,
  infinitiesBanked: DC.D0,
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
  backupTimer: 0,
  chall2Pow: 1,
  chall3Pow: DC.D0_01,
  matter: DC.D1,
  chall9TickspeedCostBumps: 0,
  chall8TotalSacrifice: DC.D1,
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
      maxID1: DC.D0,
      maxStudies: 0,
      maxGlyphs: 0,
      slowestBH: 1,
    },
    permanent: {
      emojiGalaxies: 0,
      singleTickspeed: 0,
      perkTreeDragging: 0
    }
  },
  records: {
    gameCreatedTime: Date.now(),
    totalTimePlayed: 0,
    timePlayedAtBHUnlock: Number.MAX_VALUE,
    realTimePlayed: 0,
    realTimeDoomed: 0,
    fullGameCompletions: 0,
    previousRunRealTime: 0,
    totalAntimatter: DC.E1,
    recentInfinities: Array.range(0, 10).map(() =>
      [Number.MAX_VALUE, Number.MAX_VALUE, DC.D1, DC.D1, ""]),
    recentEternities: Array.range(0, 10).map(() =>
      [Number.MAX_VALUE, Number.MAX_VALUE, DC.D1, DC.D1, "", DC.D0]),
    recentRealities: Array.range(0, 10).map(() =>
      [Number.MAX_VALUE, Number.MAX_VALUE, DC.D1, 1, "", 0, 0]),
    thisInfinity: {
      time: 0,
      realTime: 0,
      lastBuyTime: 0,
      maxAM: DC.D0,
      bestIPmin: DC.D0,
      bestIPminVal: DC.D0,
    },
    bestInfinity: {
      time: Number.MAX_VALUE,
      realTime: Number.MAX_VALUE,
      bestIPminEternity: DC.D0,
      bestIPminReality: DC.D0,
    },
    thisEternity: {
      time: 0,
      realTime: 0,
      maxAM: DC.D0,
      maxIP: DC.D0,
      bestIPMsWithoutMaxAll: DC.D0,
      bestEPmin: DC.D0,
      bestEPminVal: DC.D0,
      bestInfinitiesPerMs: DC.D0,
    },
    bestEternity: {
      time: Number.MAX_VALUE,
      realTime: Number.MAX_VALUE,
      bestEPminReality: DC.D0,
    },
    thisReality: {
      time: 0,
      realTime: 0,
      maxAM: DC.D0,
      maxIP: DC.D0,
      maxEP: DC.D0,
      bestEternitiesPerMs: DC.D0,
      maxReplicanti: DC.D0,
      maxDT: DC.D0,
      bestRSmin: 0,
      bestRSminVal: 0,
    },
    bestReality: {
      time: Number.MAX_VALUE,
      realTime: Number.MAX_VALUE,
      glyphStrength: 0,
      RM: DC.D0,
      RMSet: [],
      RMmin: DC.D0,
      RMminSet: [],
      glyphLevel: 0,
      glyphLevelSet: [],
      bestEP: DC.D0,
      bestEPSet: [],
      speedSet: [],
      iMCapSet: [],
      laitelaSet: [],
    },
  },
  speedrun: {
    isUnlocked: false,
    isActive: false,
    isSegmented: false,
    usedSTD: false,
    hasStarted: false,
    hideInfo: false,
    displayAllMilestones: false,
    startDate: 0,
    name: "",
    offlineTimeUsed: 0,
    // One spot for every entry in GameDatabase.speedrunMilestones (note: 1-indexed)
    records: Array.repeat(0, 26),
    achievementTimes: {},
    seedSelection: SPEEDRUN_SEED_STATE.FIXED,
    initialSeed: 0,
    previousRuns: {}
  },
  IPMultPurchases: 0,
  version: 25,
  infinityPower: DC.D1,
  postC4Tier: 0,
  eternityPoints: DC.D0,
  eternities: DC.D0,
  eternityUpgrades: new Set(),
  epmultUpgrades: 0,
  timeShards: DC.D0,
  totalTickGained: 0,
  totalTickBought: 0,
  replicanti: {
    unl: false,
    amount: DC.D0,
    chance: 0.01,
    chanceCost: DC.E150,
    interval: 1000,
    intervalCost: DC.E140,
    boughtGalaxyCap: 0,
    galaxies: 0,
    galCost: DC.E170,
  },
  timestudy: {
    theorem: DC.D0,
    maxTheorem: DC.D0,
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
  respec: false,
  eterc8ids: 50,
  eterc8repl: 40,
  dilation: {
    studies: [],
    active: false,
    tachyonParticles: DC.D0,
    dilatedTime: DC.D0,
    nextThreshold: DC.E3,
    baseTachyonGalaxies: 0,
    totalTachyonGalaxies: 0,
    upgrades: new Set(),
    rebuyables: {
      1: 0,
      2: 0,
      3: 0,
      11: 0,
      12: 0,
      13: 0,
    },
    lastEP: DC.DM1,
  },
  realities: 0,
  partSimulatedReality: 0,
  reality: {
    realityMachines: DC.D0,
    maxRM: DC.D0,
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
      sets: new Array(7).fill({
        name: "",
        glyphs: [],
      }),
      protectedRows: 2,
      filter: {
        select: AUTO_GLYPH_SCORE.LOWEST_SACRIFICE,
        trash: AUTO_GLYPH_REJECT.SACRIFICE,
        simple: 0,
        types: GlyphTypes.list
          .filter(t => ALCHEMY_BASIC_GLYPH_TYPES.includes(t.id))
          .mapToObject(t => t.id, t => ({
            rarity: 0,
            score: 0,
            effectCount: 0,
            specifiedMask: 0,
            effectScores: Array.repeat(0, t.effects.length),
          })),
      },
      createdRealityGlyph: false,
      cosmetics: {
        active: false,
        glowNotification: false,
        unlockedFromNG: [],
        symbolMap: {},
        colorMap: {},
      }
    },
    initialSeed: Math.floor(Date.now() * Math.random() + 1),
    // The seed value should get set from initialSeed upon unlocking reality, but we set it to 1 as a fallback in
    // case somehow it doesn't get set properly. Do not change this to 0, as a seed of 0 causes the game to hang
    seed: 1,
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
    reqLock: {
      reality: 0,
      imaginary: 0,
    },
    perks: new Set(),
    respec: false,
    showGlyphSacrifice: false,
    showSidebarPanel: GLYPH_SIDEBAR_MODE.INVENTORY_MANAGEMENT,
    autoSort: 0,
    autoCollapse: false,
    autoAutoClean: false,
    applyFilterToPurge: false,
    moveGlyphsOnProtection: false,
    perkPoints: 0,
    unlockedEC: 0,
    autoEC: true,
    lastAutoEC: 0,
    partEternitied: DC.D0,
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
      constants: {},
      constantSortOrder: [],
      execTimer: 0,
      type: AUTOMATOR_TYPE.TEXT,
      forceUnlock: false,
      currentInfoPane: AutomatorPanels.INTRO_PAGE,
    },
    achTimer: 0,
    hasCheckedFilter: false,
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
      quoteBits: 0,
      unlockBits: 0,
      run: false,
      bestRunAM: DC.D1,
      bestAMSet: [],
      perkShop: Array.repeat(0, 5),
      lastRepeatedMachines: DC.D0
    },
    effarig: {
      relicShards: 0,
      unlockBits: 0,
      run: false,
      quoteBits: 0,
      glyphWeights: {
        ep: 25,
        repl: 25,
        dt: 25,
        eternities: 25
      },
      autoAdjustGlyphWeights: false,
    },
    enslaved: {
      isStoring: false,
      stored: 0,
      isStoringReal: false,
      storedReal: 0,
      autoStoreReal: false,
      isAutoReleasing: false,
      quoteBits: 0,
      unlocks: [],
      run: false,
      completed: false,
      tesseracts: 0,
      hasSecretStudy: false,
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
      quoteBits: 0,
      runUnlocks: [0, 0, 0, 0, 0, 0, 0, 0, 0],
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
      quoteBits: 0,
      momentumTime: 0,
      unlockBits: 0,
      run: false,
      charged: new Set(),
      disCharge: false,
      peakGamespeed: 1,
      petWithRemembrance: ""
    },
    laitela: {
      darkMatter: DC.D0,
      maxDarkMatter: DC.D0,
      run: false,
      quoteBits: 0,
      dimensions: Array.range(0, 4).map(() =>
        ({
          amount: DC.D0,
          intervalUpgrades: 0,
          powerDMUpgrades: 0,
          powerDEUpgrades: 0,
          timeSinceLastUpdate: 0,
          ascensionCount: 0
        })),
      entropy: 0,
      thisCompletion: 3600,
      fastestCompletion: 3600,
      difficultyTier: 0,
      upgrades: {},
      darkMatterMult: 1,
      darkEnergy: 0,
      singularitySorting: {
        displayResource: 0,
        sortResource: 0,
        showCompleted: 0,
        sortOrder: 0,
      },
      singularities: 0,
      singularityCapIncreases: 0,
      lastCheckedMilestones: 0,
      milestoneGlow: true,
    },
    pelle: {
      doomed: false,
      upgrades: new Set(),
      remnants: 0,
      realityShards: DC.D0,
      records: {
        totalAntimatter: DC.D0,
        totalInfinityPoints: DC.D0,
        totalEternityPoints: DC.D0,
      },
      rebuyables: {
        antimatterDimensionMult: 0,
        timeSpeedMult: 0,
        glyphLevels: 0,
        infConversion: 0,
        galaxyPower: 0,
        galaxyGeneratorAdditive: 0,
        galaxyGeneratorMultiplicative: 0,
        galaxyGeneratorAntimatterMult: 0,
        galaxyGeneratorIPMult: 0,
        galaxyGeneratorEPMult: 0,
      },
      rifts: {
        vacuum: {
          fill: DC.D0,
          active: false,
          reducedTo: 1
        },
        decay: {
          fill: DC.D0,
          active: false,
          percentageSpent: 0,
          reducedTo: 1
        },
        chaos: {
          fill: 0,
          active: false,
          reducedTo: 1
        },
        recursion: {
          fill: DC.D0,
          active: false,
          reducedTo: 1
        },
        paradox: {
          fill: DC.D0,
          active: false,
          reducedTo: 1
        }
      },
      progressBits: 0,
      galaxyGenerator: {
        unlocked: false,
        spentGalaxies: 0,
        generatedGalaxies: 0,
        phase: 0,
        sacrificeActive: false
      },
      quoteBits: 0,
      collapsed: {
        upgrades: false,
        rifts: false,
        galaxies: false
      },
      showBought: false,
    }
  },
  isGameEnd: false,
  tabNotifications: new Set(),
  triggeredTabNotificationBits: 0,
  tutorialState: 0,
  tutorialActive: true,
  options: {
    news: {
      enabled: true,
      repeatBuffer: 40,
      AIChance: 0,
      speed: 1,
      includeAnimated: true,
    },
    notation: "Mixed scientific",
    notationDigits: {
      comma: 5,
      notation: 9
    },
    sidebarResourceID: 0,
    retryChallenge: false,
    retryCelestial: false,
    showAllChallenges: false,
    cloudEnabled: true,
    hideGoogleName: false,
    showCloudModal: true,
    forceCloudOverwrite: false,
    syncSaveIntervals: true,
    hotkeys: true,
    themeClassic: "Normal",
    themeModern: "Normal",
    updateRate: 33,
    newUI: true,
    offlineProgress: true,
    loadBackupWithoutOffline: false,
    automaticTabSwitching: true,
    respecIntoProtected: false,
    offlineTicks: 1e5,
    hibernationCatchup: true,
    statTabResources: 0,
    multiplierTab: {
      currTab: 0,
      showAltGroup: false,
      replacePowers: false,
    },
    autosaveInterval: 30000,
    showTimeSinceSave: true,
    saveFileName: "",
    exportedFileCount: 0,
    hideCompletedAchievementRows: false,
    glyphTextColors: true,
    headerTextColored: false,
    showNewGlyphIcon: true,
    showUnequippedGlyphIcon: true,
    highContrastRarity: false,
    swapGlyphColors: false,
    hideAlterationEffects: false,
    ignoreGlyphEffects: true,
    ignoreGlyphLevel: true,
    ignoreGlyphRarity: true,
    glyphBG: GLYPH_BG_SETTING.AUTO,
    glyphBorders: true,
    showHintText: {
      showPercentage: true,
      achievements: true,
      achievementUnlockStates: true,
      challenges: true,
      studies: true,
      glyphEffectDots: true,
      realityUpgrades: true,
      perks: true,
      alchemy: true,
      glyphInfoType: GlyphInfo.types.NONE,
      showGlyphInfoByDefault: false,
    },
    animations: {
      bigCrunch: true,
      eternity: true,
      dilation: true,
      tachyonParticles: true,
      reality: true,
      background: true,
      blobSnowflakes: 16,
      blobHole: false
    },
    confirmations: {
      armageddon: true,
      sacrifice: true,
      challenges: true,
      exitChallenge: true,
      eternity: true,
      dilation: true,
      resetReality: true,
      glyphReplace: true,
      glyphSacrifice: true,
      autoClean: true,
      sacrificeAll: true,
      glyphSelection: true,
      glyphUndo: true,
      deleteGlyphSetSave: true,
      glyphRefine: true,
      bigCrunch: true,
      replicantiGalaxy: true,
      antimatterGalaxy: true,
      dimensionBoost: true,
      switchAutomatorMode: true,
      respecIAP: true
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
      timeTheorems: true,
      achievementCount: true,
      realities: true,
      realityMachines: true,
      imaginaryMachines: true,
      relicShards: true,
      darkMatter: true,
      darkEnergy: true,
      singularities: true,
      celestialMemories: true,
      blackHole: true,
      realityShards: true
    },
    hiddenTabBits: 0,
    hiddenSubtabBits: Array.repeat(0, 11),
    lastOpenTab: 0,
    lastOpenSubtab: Array.repeat(0, 11),
    perkLayout: 0,
    perkPhysicsEnabled: true,
    automatorEvents: {
      newestFirst: false,
      timestampType: 0,
      maxEntries: 200,
      clearOnReality: true,
      clearOnRestart: true,
    },
    invertTTgenDisplay: false,
    autoRealityForFilter: false,
  },
  IAP: {
    enabled: false,
    checkoutSession: {
      id: false,
    }
  },
};

export const Player = {
  defaultStart: deepmergeAll([{}, player]),

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
    return AutomatorPoints.totalPoints >= AutomatorPoints.pointsForAutomator || player.reality.automator.forceUnlock;
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
          maxID1: DC.D0,
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

export function guardFromNaNValues(obj) {
  function isObject(ob) {
    return ob !== null && typeof ob === "object" && !(ob instanceof Decimal);
  }

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

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
