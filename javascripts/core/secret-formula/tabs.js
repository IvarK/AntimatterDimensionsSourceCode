"use strict";

GameDatabase.tabs = [
  {
    key: "dimensions",
    name: "Dimensions",
    subtabs: [
      {
        key: "normal",
        name: "Dimensions",
        symbol: "Ω",
        component: "normal-dim-tab",
        newUIComponent: "new-dimensions-tab"
      },
      {
        key: "infinity",
        name: "Infinity Dimensions",
        symbol: "∞",
        component: "infinity-dim-tab",
        condition: () => player.eternities > 0 || InfinityDimension(1).isUnlocked
      },
      {
        key: "time",
        name: "Time Dimensions",
        symbol: "Δ",
        component: "time-dim-tab",
        condition: () => player.eternities > 0
      },
      {
        key: "production",
        name: "Production",
        symbol: "📈",
        component: "dim-production-tab",
        condition: () => player.eternities > 0 || player.infinitied.gt(0)
      }
    ]
  },
  {
    key: "options",
    name: "Options",
    subtabs: [
      {
        key: "options",
        name: "Options",
        symbol: "O",
        component: "options-tab"
      }
    ]
  },
  {
    key: "statistics",
    name: "Statistics",
    subtabs: [
      {
        key: "statistics",
        name: "Statistics",
        symbol: "S",
        component: "statistics-tab"
      },
      {
        key: "challenges",
        name: "Challenge records",
        symbol: "C",
        component: "challenge-records-tab",
        condition: () => player.challenge.normal.completedBits || player.challenge.infinity.completedBits
      },
      {
        key: "infinities",
        name: "Past Infinities",
        symbol: "∞",
        component: "past-infinities-tab",
        condition: () => PlayerProgress.infinityUnlocked()
      },
      {
        key: "eternities",
        name: "Past Eternities",
        symbol: "Δ",
        component: "past-eternities-tab",
        condition: () => PlayerProgress.eternityUnlocked()
      },
      {
        key: "realities",
        name: "Past Realities",
        symbol: "Ϟ",
        component: "past-realities-tab",
        condition: () => PlayerProgress.realityUnlocked
      }
    ]
  },
  {
    key: "achievements",
    name: "Achievements",
    condition: () => Achievements.effectiveCount > 0,
    subtabs: [
      {
        key: "normal",
        name: "Achievements",
        symbol: "A",
        component: "normal-achievements-tab"
      },
      {
        key: "secret",
        name: "Secret Achievements",
        symbol: "SA",
        component: "secret-achievements-tab"
      }
    ]
  },
  {
    key: "challenges",
    name: "Challenges",
    condition: () => player.eternities > 0 || player.infinitied.gt(0),
    subtabs: [
      {
        key: "normal",
        name: "Challenges",
        symbol: "Ω",
        component: "normal-challenges-tab"
      },
      {
        key: "infinity",
        name: "Infinity Challenges",
        symbol: "∞",
        component: "infinity-challenges-tab",
        condition: () =>
          Tab.challenges.eternity.isAvailable ||
          player.antimatter.e >= 2000 ||
          player.postChallUnlocked > 0
      },
      {
        key: "eternity",
        name: "Eternity Challenges",
        symbol: "Δ",
        component: "eternity-challenges-tab",
        condition: () =>
          player.challenge.eternity.unlocked !== 0 ||
          EternityChallenges.all.some(ec => ec.completions > 0) ||
          player.reality.autoEC
      }
    ],
  },
  {
    key: "infinity",
    name: "Infinity",
    oldUIClass: "infinitytabbtn",
    newUIClass: "infinity",
    condition: () => player.eternities > 0 || player.infinitied.gt(0),
    before: "infinity-points-header",
    subtabs: [
      {
        key: "upgrades",
        name: "Upgrades",
        symbol: "U",
        component: "infinity-upgrades-tab"
      },
      {
        key: "autobuyers",
        name: "Autobuyers",
        symbol: "A",
        component: "autobuyers-tab"
      },
      {
        key: "break",
        name: "Break Infinity",
        symbol: "B",
        component: "break-infinity-tab"
      },
      {
        key: "replicanti",
        name: "Replicanti",
        symbol: "Ξ",
        component: "replicanti-tab"
      }
    ],
  },
  {
    key: "eternity",
    name: "Eternity",
    oldUIClass: "eternitytabbtn",
    newUIClass: "eternity",
    condition: () => player.eternities > 0,
    subtabs: [
      {
        key: "studies",
        name: "Time studies",
        symbol: "TS",
        component: "time-studies-tab"
      },
      {
        key: "upgrades",
        name: "Eternity upgrades",
        symbol: "U",
        component: "eternity-upgrades-tab"
      },
      {
        key: "milestones",
        name: "Eternity milestones",
        symbol: "M",
        component: "eternity-milestones-tab"
      },
      {
        key: "dilation",
        name: "Time dilation",
        symbol: "TD",
        component: "time-dilation-tab",
        condition: () => TimeStudy.dilation.isBought
      }
    ],
  },
  {
    key: "reality",
    name: "Reality",
    before: "reality-machines-header",
    oldUIClass: "realitytabbtn",
    newUIClass: "reality",
    condition: () => player.realities > 0 || TimeStudy.reality.isBought,
    subtabs: [
      {
        key: "glyphs",
        name: "Glyphs",
        symbol: "G",
        component: "glyphs-tab"
      },
      {
        key: "upgrades",
        name: "Reality upgrades",
        symbol: "U",
        component: "reality-upgrades-tab"
      },
      {
        key: "perks",
        name: "Perks",
        symbol: "P",
        component: "perks-tab",
      },
      {
        key: "automator",
        name: "Automator",
        symbol: "A",
        component: "automator-tab",
      },
      {
        key: "hole",
        name: "Black hole",
        symbol: "BH",
        component: "black-hole-tab",
      }
    ],
  },
  {
    key: "celestials",
    name: "Celestials",
    oldUIClass: "celestialtabbtn",
    newUIClass: "celestials",
    condition: () => RealityUpgrades.allBought,
    subtabs: [
      {
        key: "teresa",
        name: "Teresa",
        symbol: "T",
        component: "teresa-tab"
      },
      {
        key: "effarig",
        name: "Effarig",
        symbol: "E",
        component: "effarig-tab",
        condition: () => Teresa.has(TERESA_UNLOCKS.EFFARIG)
      },
      {
        key: "enslaved",
        name: "The Enslaved Ones",
        symbol: "EO",
        component: "enslaved-tab",
        condition: () => EffarigUnlock.eternity.isUnlocked
      },
      {
        key: "v",
        name: "V",
        symbol: "V",
        component: "v-tab",
        condition: () => Achievement(151).isEnabled
      },
      {
        key: "ra",
        name: "Ra",
        symbol: "R",
        component: "ra-tab",
        condition: () => V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1])
      },
      {
        key: "alchemy",
        name: "Glyph Alchemy",
        symbol: "⛧",
        component: "alchemy-tab",
        condition: () => Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY)
      },
      {
        key: "laitela",
        name: "Lai'tela",
        symbol: "L",
        component: "laitela-tab",
        condition: () => Ra.has(RA_LAITELA_UNLOCK)
      },
      {
        key: "pelle",
        name: "The Pelle",
        symbol: "P",
        component: "pelle-tab",
        condition: () => Laitela.has(LAITELA_UNLOCKS.PELLE)
      }
    ]
  },
  {
    key: "shop",
    name: "Shop",
    newUIClass: "shop",
    subtabs: [
      {
        key: "shop",
        name: "Shop",
        symbol: "ASS",
        component: "achievements-tab"
      }
    ]
  }
];
