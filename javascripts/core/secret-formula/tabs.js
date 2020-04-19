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
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          PlayerProgress.challengeCompleted()
      },
      {
        key: "prestige runs",
        name: "Past Prestige Runs",
        symbol: "<i class='fas fa-list-ol'></i>",
        component: "past-runs-tab",
        condition: () => PlayerProgress.infinityUnlocked()
      },
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
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          player.antimatter.e >= 2000 ||
          player.postChallUnlocked > 0
      },
      {
        key: "eternity",
        name: "Eternity Challenges",
        symbol: "Δ",
        component: "eternity-challenges-tab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          player.challenge.eternity.unlocked !== 0 ||
          EternityChallenges.all.some(ec => ec.completions > 0)
      }
    ],
  },
  {
    key: "infinity",
    name: "Infinity",
    UIClass: "o-tab-btn--infinity",
    before: "infinity-points-header",
    subtabs: [
      {
        key: "upgrades",
        name: "Infinity Upgrades",
        symbol: "<i class='fas fa-arrow-up'></i>",
        component: "infinity-upgrades-tab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          PlayerProgress.infinityUnlocked()
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
        symbol: "<i class='fab fa-skyatlas'></i>",
        component: "break-infinity-tab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          PlayerProgress.infinityUnlocked()
      },
      {
        key: "replicanti",
        name: "Replicanti",
        symbol: "Ξ",
        component: "replicanti-tab",
        condition: () =>
          PlayerProgress.realityUnlocked() ||
          PlayerProgress.eternityUnlocked() ||
          PlayerProgress.infinityUnlocked()
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
    subtabs: [
      {
        key: "studies",
        name: "Time Studies",
        symbol: "<i class='fas fa-book'></i>",
        component: "time-studies-tab"
      },
      {
        key: "upgrades",
        name: "Eternity Upgrades",
        symbol: "<i class='fas fa-arrow-up'></i>",
        component: "eternity-upgrades-tab"
      },
      {
        key: "milestones",
        name: "Eternity Milestones",
        symbol: "<i class='fas fa-trophy'></i>",
        component: "eternity-milestones-tab"
      },
      {
        key: "dilation",
        name: "Time Dilation",
        symbol: "Ψ",
        component: "time-dilation-tab",
        condition: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked()
      }
    ],
  },
  {
    key: "reality",
    name: "Reality",
    before: "reality-machines-header",
    UIClass: "o-tab-btn--reality",
    condition: () => PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought,
    subtabs: [
      {
        key: "glyphs",
        name: "Glyphs",
        symbol: "<i class='fas fa-clone'></i>",
        component: "glyphs-tab"
      },
      {
        key: "upgrades",
        name: "Reality Upgrades",
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
        name: "Black Hole",
        symbol: "<i class='fas fa-circle'></i>",
        component: "black-hole-tab",
      },
      {
        key: "alchemy",
        name: "Glyph Alchemy",
        symbol: "<i class='fas fa-vial'></i>",
        component: "alchemy-tab",
        condition: () => Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY)
      },
    ],
  },
  {
    key: "celestials",
    name: "Celestials",
    UIClass: "o-tab-btn--celestial",
    condition: () => RealityUpgrades.allBought,
    subtabs: [
      {
        key: "celestial-navigation",
        name: "Celestial Navigation",
        symbol: "N",
        component: "celestial-navigation"
      },
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
        condition: () => Achievement(151).isUnlocked
      },
      {
        key: "ra",
        name: "Ra",
        symbol: "☼",
        component: "ra-tab",
        condition: () => V.has(V_UNLOCKS.RA_UNLOCK)
      },
      {
        key: "laitela",
        name: "Lai'tela",
        symbol: "ᛝ",
        component: "laitela-tab",
        condition: () => Ra.has(RA_UNLOCKS.RA_LAITELA_UNLOCK)
      },
      {
        key: "pelle",
        name: "The Pelle",
        symbol: "Ϛ",
        component: "pelle-tab",
        condition: () => false
      }
    ]
  },
  {
    key: "shop",
    name: "Shop",
    newUIClass: "shop",
    condition: () => kong.enabled || player.IAP.totalSTD > 0,
    subtabs: [
      {
        key: "shop",
        name: "Shop",
        symbol: "$",
        component: "shop-tab"
      }
    ]
  }
];
