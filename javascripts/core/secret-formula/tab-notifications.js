"use strict";

GameDatabase.tabNotifications = {
  firstInfinity: {
    id: 0,
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "upgrades"
      },
      {
        parent: "challenges",
        tab: "normal"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() &&
      !PlayerProgress.infinityUnlocked(),
    events: [GAME_EVENT.BIG_CRUNCH_BEFORE]
  },
  breakInfinity: {
    id: 1,
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "break"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && Autobuyer.bigCrunch.hasMaxedInterval
  },
  IDUnlock: {
    id: 2,
    tabsToHighLight: [
      {
        parent: "dimensions",
        tab: "infinity"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && !InfinityDimension(2).isUnlocked
  },
  ICUnlock: {
    id: 3,
    tabsToHighLight: [
      {
        parent: "challenges",
        tab: "infinity"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked()
  },
  replicanti: {
    id: 4,
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "replicanti"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && Currency.infinityPoints.gte(1e140),
    events: [GAME_EVENT.BIG_CRUNCH_AFTER]
  },
  firstEternity: {
    id: 5,
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "studies"
      },
      {
        parent: "eternity",
        tab: "milestones"
      },
      {
        parent: "eternity",
        tab: "upgrades"
      },
      {
        parent: "dimensions",
        tab: "time"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked(),
    events: [GAME_EVENT.ETERNITY_RESET_BEFORE]
  },
  dilationAfterUnlock: {
    id: 6,
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "dilation"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked()
  },
  realityUnlock: {
    id: 7,
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "studies"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() && TimeStudy.reality.canBeBought,
    events: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION]
  },
  blackHoleUnlock: {
    id: 8,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "hole"
      }
    ],
    condition: () => !BlackHoles.areUnlocked && Currency.realityMachines.gte(100),
    events: [GAME_EVENT.REALITY_RESET_AFTER]
  },
  automatorUnlock: {
    id: 9,
    tabsToHighLight: [
      {
        parent: "automation",
        tab: "automator"
      }
    ],
    condition: () => Currency.realities.eq(5),
    events: [GAME_EVENT.REALITY_RESET_AFTER]
  },
  teresaUnlock: {
    id: 10,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "celestial-navigation"
      },
      {
        parent: "celestials",
        tab: "teresa"
      }
    ],
    condition: () => player.celestials.teresa.pouredAmount !== 0 && Teresa.isUnlocked,
    events: [GAME_EVENT.REALITY_UPGRADE_BOUGHT]
  },
  alchemyUnlock: {
    id: 11,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "glyphs"
      },
      {
        parent: "reality",
        tab: "alchemy"
      }
    ],
    condition: () => player.celestials.ra.pets.effarig.level >= 2,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
};
