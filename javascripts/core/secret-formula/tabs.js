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
        newUIComponent: "new-inf-dimensions-tab",
        condition: () => 
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          InfinityDimension(1).isUnlocked
      },
      {
        key: "time",
        name: "Time Dimensions",
        symbol: "Δ",
        component: "time-dim-tab",
        newUIComponent: "new-time-dimensions-tab",
        condition: () => PlayerProgress.eternityUnlocked()
      },
      {
        key: "production",
        name: "Production",
        symbol: "<i class='fas fa-chart-line'></i>",
        component: "dim-production-tab",
        condition: () => PlayerProgress.eternityUnlocked() || PlayerProgress.infinityUnlocked()
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
        symbol: "<i class='fas fa-wrench'></i>",
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
        symbol: "<i class='fas fa-clipboard-list'></i>",
        component: "statistics-tab"
      },
      {
        key: "challenges",
        name: "Challenge records",
        symbol: "<i class='fas fa-stopwatch'></i>",
        component: "challenge-records-tab",
        condition: () => PlayerProgress.infinityUnlocked()
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
        condition: () => PlayerProgress.realityUnlocked()
      }
    ]
  },
  {
    key: "achievements",
    name: "Achievements",
    subtabs: [
      {
        key: "normal",
        name: "Achievements",
        symbol: "<i class='fas fa-star'></i>",
        component: "normal-achievements-tab"
      },
      {
        key: "secret",
        name: "Secret Achievements",
        symbol: "<i class='fas fa-question'></i>",
        component: "secret-achievements-tab"
      }
    ]
  },
  {
    key: "challenges",
    name: "Challenges",
    condition: () =>
      PlayerProgress.realityUnlocked() ||
      PlayerProgress.eternityUnlocked() ||
      PlayerProgress.infinityUnlocked(),
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
          (player.reality.autoEC && player.realities > 0)
      }
    ],
  },
  {
    key: "infinity",
    name: "Infinity",
    oldUIClass: "infinitytabbtn",
    newUIClass: "infinity",
    condition: () =>
      PlayerProgress.realityUnlocked() ||
      PlayerProgress.eternityUnlocked() ||
      PlayerProgress.infinityUnlocked(),
    before: "infinity-points-header",
    subtabs: [
      {
        key: "upgrades",
        name: "Upgrades",
        symbol: "<i class='fas fa-arrow-up'></i>",
        component: "infinity-upgrades-tab"
      },
      {
        key: "autobuyers",
        name: "Autobuyers",
        symbol: "<i class='fas fa-cog'></i>",
        component: "autobuyers-tab"
      },
      {
        key: "break",
        name: "Break Infinity",
        symbol: "<i class='fas fa-infinity'></i>",
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
    condition: () =>
      PlayerProgress.realityUnlocked() ||
      PlayerProgress.eternityUnlocked(),
    subtabs: [
      {
        key: "studies",
        name: "Time studies",
        symbol: "<i class='fas fa-book'></i>",
        component: "time-studies-tab"
      },
      {
        key: "upgrades",
        name: "Eternity upgrades",
        symbol: "<i class='fas fa-arrow-up'></i>",
        component: "eternity-upgrades-tab"
      },
      {
        key: "milestones",
        name: "Eternity milestones",
        symbol: "<i class='fas fa-trophy'></i>",
        component: "eternity-milestones-tab"
      },
      {
        key: "dilation",
        name: "Time dilation",
        symbol: "Ψ",
        component: "time-dilation-tab",
        condition: () => TimeStudy.dilation.isBought
      },
      {
        key: "compression",
        name: "Time compression",
        symbol: "<i class='fas fa-compress-arrows-alt'></i>",
        component: "time-compression-tab",
        condition: () => Ra.pets.enslaved.level >= 25
      }
    ],
  },
  {
    key: "reality",
    name: "Reality",
    before: "reality-machines-header",
    oldUIClass: "realitytabbtn",
    newUIClass: "reality",
    condition: () => PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought,
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
        symbol: "<i class='fas fa-arrow-up'></i>",
        component: "reality-upgrades-tab"
      },
      {
        key: "perks",
        name: "Perks",
        symbol: "<i class='fas fa-project-diagram'></i>",
        component: "perks-tab",
      },
      {
        key: "automator",
        name: "Automator",
        symbol: "<i class='fas fa-cog'></i>",
        component: "automator-tab",
      },
      {
        key: "hole",
        name: "Black hole",
        symbol: "<i class='fas fa-circle'></i>",
        component: "black-hole-tab",
      },
      {
        key: "alchemy",
        name: "Glyph alchemy",
        symbol: "<i class='fas fa-vial'></i>",
        component: "alchemy-tab",
        condition: () => Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY)
      },
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
        symbol: "Ϟ",
        component: "teresa-tab"
      },
      {
        key: "effarig",
        name: "Effarig",
        symbol: "Ϙ",
        component: "effarig-tab",
        condition: () => Teresa.has(TERESA_UNLOCKS.EFFARIG)
      },
      {
        key: "enslaved",
        name: "The Enslaved Ones",
        symbol: "<i class='fas fa-link'></i>",
        component: "enslaved-tab",
        condition: () => EffarigUnlock.eternity.isUnlocked
      },
      {
        key: "v",
        name: "V",
        symbol: "⌬",
        component: "v-tab",
        condition: () => Achievement(151).isEnabled
      },
      {
        key: "ra",
        name: "Ra",
        symbol: "☼",
        component: "ra-tab",
        condition: () => V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1])
      },
      {
        key: "laitela",
        name: "Lai'tela",
        symbol: "<i class='fas fa-atom'></i>",
        component: "laitela-tab",
        condition: () => Ra.has(RA_LAITELA_UNLOCK)
      },
      {
        key: "pelle",
        name: "The Pelle",
        symbol: "Ϛ",
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
