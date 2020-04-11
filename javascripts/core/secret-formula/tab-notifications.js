"use strict";

GameDatabase.tabNotifications = {
  firstInfinity: {
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
  ICUnlock: {
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
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "replicanti"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && player.infinityPoints.gte(1e140),
    events: [GAME_EVENT.BIG_CRUNCH_AFTER]
  },
  breakInfinity: {
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "break"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && Autobuyer.bigCrunch.hasMaxedInterval
  },
  firstEternity: {
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
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked(),
    events: [GAME_EVENT.ETERNITY_RESET_BEFORE]
  },
  dilationUnlock: {
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "studies"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() && 
      player.timestudy.theorem.plus(TimeTheorems.calculateTimeStudiesCost()).gte(13000) && 
      EternityChallenge(11).isFullyCompleted && EternityChallenge(12).isFullyCompleted &&
      !TimeStudy.dilation.isBought,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  dilationAfterUnlock: {
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "dilation"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked()
  },
  blackHoleUnlock: {
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "hole"
      }
    ],
    condition: () => player.reality.realityMachines.gte(100),
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  automatorUnlock: {
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "automator"
      }
    ],
    condition: () => player.realities >= 5,
    events: [GAME_EVENT.REALITY_RESET_AFTER]
  },
};