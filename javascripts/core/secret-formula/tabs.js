"use strict";

GameDatabase.tabs = [
  {
    key: "dimensions",
    name: "Dimensions",
    id: 0,
    hidable: true,
    subtabs: [
      {
        key: "antimatter",
        name: "Dimensions",
        symbol: "Ω",
        component: "antimatter-dim-tab",
        newUIComponent: "new-dimensions-tab",
        id: 0,
        hidable: true,
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
          InfinityDimension(1).isUnlocked,
        id: 1,
        hidable: true,
      },
      {
        key: "time",
        name: "Time Dimensions",
        symbol: "Δ",
        component: "time-dim-tab",
        newUIComponent: "new-time-dimensions-tab",
        condition: () => PlayerProgress.eternityUnlocked(),
        id: 2,
        hidable: true,
      },
    ]
  },
  {
    key: "options",
    name: "Options",
    id: 1,
    hidable: false,
    subtabs: [
      {
        key: "saving",
        name: "Saving",
        symbol: "<i class='fas fa-save'></i>",
        component: "options-saving-tab",
        id: 0,
        hidable: false,
      },
      {
        key: "visual",
        name: "Visual",
        symbol: "<i class='fas fa-palette'></i>",
        component: "options-visual-tab",
        id: 1,
        hidable: false,
      },
      {
        key: "gameplay",
        name: "Gameplay",
        symbol: "<i class='fas fa-wrench'></i>",
        component: "options-gameplay-tab",
        id: 2,
        hidable: false,
      }
    ]
  },
  {
    key: "statistics",
    name: "Statistics",
    id: 2,
    hidable: true,
    subtabs: [
      {
        key: "statistics",
        name: "Statistics",
        symbol: "<i class='fas fa-clipboard-list'></i>",
        component: "statistics-tab",
        id: 0,
        hidable: true,
      },
      {
        key: "challenges",
        name: "Challenge records",
        symbol: "<i class='fas fa-stopwatch'></i>",
        component: "challenge-records-tab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          PlayerProgress.challengeCompleted(),
        id: 1,
        hidable: true,
      },
      {
        key: "prestige runs",
        name: "Past Prestige Runs",
        symbol: "<i class='fas fa-list-ol'></i>",
        component: "past-runs-tab",
        condition: () => PlayerProgress.infinityUnlocked(),
        id: 2,
        hidable: true,
      },
    ]
  },
  {
    key: "achievements",
    name: "Achievements",
    id: 3,
    hidable: true,
    subtabs: [
      {
        key: "normal",
        name: "Achievements",
        symbol: "<i class='fas fa-star'></i>",
        component: "normal-achievements-tab",
        id: 0,
        hidable: true,
      },
      {
        key: "secret",
        name: "Secret Achievements",
        symbol: "<i class='fas fa-question'></i>",
        component: "secret-achievements-tab",
        id: 1,
        hidable: true,
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
    id: 4,
    hidable: true,
    subtabs: [
      {
        key: "normal",
        name: "Challenges",
        symbol: "Ω",
        component: "normal-challenges-tab",
        id: 0,
        hidable: true
      },
      {
        key: "infinity",
        name: "Infinity Challenges",
        symbol: "∞",
        component: "infinity-challenges-tab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          Currency.antimatter.exponent >= 2000 ||
          player.postChallUnlocked > 0,
        id: 1,
        hidable: true
      },
      {
        key: "eternity",
        name: "Eternity Challenges",
        symbol: "Δ",
        component: "eternity-challenges-tab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          player.challenge.eternity.unlocked !== 0 ||
          EternityChallenges.all.some(ec => ec.completions > 0),
        id: 2,
        hidable: true
      }
    ],
  },
  {
    key: "infinity",
    name: "Infinity",
    UIClass: "o-tab-btn--infinity",
    before: "infinity-points-header",
    id: 5,
    hidable: true,
    subtabs: [
      {
        key: "autobuyers",
        name: "Autobuyers",
        symbol: "<i class='fas fa-cog'></i>",
        component: "autobuyers-tab",
        id: 0,
        hidable: true,
      },
      {
        key: "upgrades",
        name: "Infinity Upgrades",
        symbol: "<i class='fas fa-arrow-up'></i>",
        component: "infinity-upgrades-tab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          PlayerProgress.infinityUnlocked(),
        id: 1,
        hidable: true,
      },
      {
        key: "break",
        name: "Break Infinity",
        symbol: "<i class='fab fa-skyatlas'></i>",
        component: "break-infinity-tab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          PlayerProgress.infinityUnlocked(),
        id: 2,
        hidable: true,
      },
      {
        key: "replicanti",
        name: "Replicanti",
        symbol: "Ξ",
        component: "replicanti-tab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          PlayerProgress.infinityUnlocked(),
        id: 3,
        hidable: true,
      }
    ],
  },
  {
    key: "eternity",
    name: "Eternity",
    UIClass: "o-tab-btn--eternity",
    condition: () =>
      PlayerProgress.realityUnlocked() ||
      PlayerProgress.eternityUnlocked(),
    before: "eternity-points-header",
    id: 6,
    hidable: true,
    subtabs: [
      {
        key: "studies",
        name: "Time Studies",
        symbol: "<i class='fas fa-book'></i>",
        component: "time-studies-tab",
        id: 0,
        hidable: true,
      },
      {
        key: "upgrades",
        name: "Eternity Upgrades",
        symbol: "<i class='fas fa-arrow-up'></i>",
        component: "eternity-upgrades-tab",
        id: 1,
        hidable: true,
      },
      {
        key: "milestones",
        name: "Eternity Milestones",
        symbol: "<i class='fas fa-trophy'></i>",
        component: "eternity-milestones-tab",
        id: 2,
        hidable: true,
      },
      {
        key: "dilation",
        name: "Time Dilation",
        symbol: "Ψ",
        component: "time-dilation-tab",
        condition: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
        id: 3,
        hidable: true,
      }
    ],
  },
  {
    key: "reality",
    name: "Reality",
    before: "reality-machines-header",
    UIClass: "o-tab-btn--reality",
    condition: () => PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought,
    id: 7,
    hidable: true,
    subtabs: [
      {
        key: "glyphs",
        name: "Glyphs",
        symbol: "<i class='fas fa-clone'></i>",
        component: "glyphs-tab",
        id: 0,
        hidable: true,
      },
      {
        key: "upgrades",
        name: "Reality Upgrades",
        symbol: "<i class='fas fa-arrow-up'></i>",
        component: "reality-upgrades-tab",
        id: 1,
        hidable: true,
      },
      {
        key: "imag_upgrades",
        name: "Imaginary Upgrades",
        symbol: "<i class='fas fa-level-up-alt'></i>",
        component: "imaginary-upgrades-tab",
        condition: () => MachineHandler.isIMUnlocked,
        id: 2,
        hidable: true,
      },
      {
        key: "perks",
        name: "Perks",
        symbol: "<i class='fas fa-project-diagram'></i>",
        component: "perks-tab",
        id: 3,
        hidable: true,
      },
      {
        key: "automator",
        name: "Automator",
        symbol: "<i class='fas fa-cog'></i>",
        component: "automator-tab",
        id: 4,
        hidable: true,
      },
      {
        key: "hole",
        name: "Black Hole",
        symbol: "<i class='fas fa-circle'></i>",
        component: "black-hole-tab",
        id: 5,
        hidable: true,
      },
      {
        key: "alchemy",
        name: "Glyph Alchemy",
        symbol: "<i class='fas fa-vial'></i>",
        component: "alchemy-tab",
        condition: () => Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY),
        id: 6,
        hidable: true,
      },
    ],
  },
  {
    key: "celestials",
    name: "Celestials",
    UIClass: "o-tab-btn--celestial",
    condition: () => RealityUpgrades.allBought,
    id: 8,
    hidable: true,
    subtabs: [
      {
        key: "celestial-navigation",
        name: "Celestial Navigation",
        symbol: "<i class='fas fa-map-marked-alt'></i>",
        component: "celestial-navigation",
        id: 0,
        hidable: true,
      },
      {
        key: "teresa",
        name: "Teresa",
        symbol: "Ϟ",
        component: "teresa-tab",
        id: 1,
        hidable: true,
      },
      {
        key: "effarig",
        name: "Effarig",
        symbol: "Ϙ",
        component: "effarig-tab",
        condition: () => Teresa.has(TERESA_UNLOCKS.EFFARIG),
        id: 2,
        hidable: true,
      },
      {
        key: "enslaved",
        name: "The Enslaved Ones",
        symbol: "<i class='fas fa-link'></i>",
        component: "enslaved-tab",
        condition: () => EffarigUnlock.eternity.isUnlocked,
        id: 3,
        hidable: true,
      },
      {
        key: "v",
        name: "V",
        symbol: "⌬",
        component: "v-tab",
        condition: () => Achievement(151).isUnlocked,
        id: 4,
        hidable: true,
      },
      {
        key: "ra",
        name: "Ra",
        symbol: "<i class='fas fa-sun'></i>",
        component: "ra-tab",
        condition: () => V.has(V_UNLOCKS.RA_UNLOCK),
        id: 5,
        hidable: true,
      },
      {
        key: "laitela",
        name: "Lai'tela",
        symbol: "ᛝ",
        component: "laitela-tab",
        condition: () => Laitela.isUnlocked,
        id: 6,
        hidable: true,
      },
      {
        key: "pelle",
        name: "The Pelle",
        symbol: "Ϛ",
        component: "pelle-tab",
        condition: () => player.celestials.laitela.singularities > 1e25,
        id: 7,
        hidable: true,
      }
    ]
  },
  {
    key: "shop",
    name: "Shop",
    newUIClass: "shop",
    condition: () => kong.enabled || player.IAP.totalSTD > 0,
    id: 9,
    hidable: true,
    subtabs: [
      {
        key: "shop",
        name: "Shop",
        symbol: "$",
        component: "shop-tab",
        id: 0,
        hidable: true
      }
    ]
  }
];
