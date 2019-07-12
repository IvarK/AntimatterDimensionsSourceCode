"use strict";

const MAIN_TAB_BUTTONS = [
  {
    id: "dimensions",
    label: "Dimensions",
    class: "",
    component: "new-dimensions-tab",
    condition: () => true,
    subtabs: [
      {
        label: "Ω",
        component: player.options.newUI ? "new-dimensions-tab" : "normal-dim-tab",
        condition: () => true
      },
      {
        label: "∞",
        component: "infinity-dim-tab",
        condition: () => player.eternities > 0 || InfinityDimension(1).isUnlocked,
      },
      {
        label: "Δ",
        component: "time-dim-tab",
        condition: () => player.eternities > 0
      }
    ]
  },
  {
    id: "challenges",
    label: "Challenges",
    class: "",
    component: "normal-challenges-tab",
    condition: () => player.infinitied.gt(0),
    subtabs: [
      {
        label: "Ω",
        component: "normal-challenges-tab",
        condition: () => player.infinitied.gt(0)
      },
      {
        label: "∞",
        component: "infinity-challenges-tab",
        condition: () => (player.challenge.eternity.unlocked !== 0 ||
        Object.keys(player.eternityChalls).length > 0) ||
        player.antimatter.gte(new Decimal("1e2000")) ||
        player.postChallUnlocked > 0,
      },
      {
        label: "Δ",
        component: "eternity-challenges-tab",
        condition: () => player.challenge.eternity.unlocked !== 0 ||
        Object.keys(player.eternityChalls).length > 0
      }
    ]
  },
  {
    id: "infinity",
    label: "Infinity",
    class: "infinity",
    component: "infinity-upgrades-tab",
    condition: () => player.infinitied.gt(0),
    subtabs: [
      {
        label: "U",
        component: "infinity-upgrades-tab",
        condition: () => player.infinitied.gt(0)
      },
      {
        label: "A",
        component: "autobuyers-tab",
        condition: () => player.infinitied.gt(0)
      },
      {
        label: "B",
        component: "break-infinity-tab",
        condition: () => player.infinitied.gt(0)
      },
      {
        label: "Ξ",
        component: "replicanti-tab",
        condition: () => player.infinitied.gt(0)
      }
    ]
  },
  {
    id: "eternity",
    label: "Eternity",
    class: "eternity",
    component: "eternity-upgrades-tab",
    condition: () => player.eternities > 0,
    subtabs: [
      {
        label: "TS",
        component: "time-studies-tab",
        condition: () => player.eternities > 0
      },
      {
        label: "U",
        component: "eternity-upgrades-tab",
        condition: () => player.eternities > 0
      },
      {
        label: "M",
        component: "eternity-milestones-tab",
        condition: () => player.eternities > 0
      },
      {
        label: "TD",
        component: "time-dilation-tab",
        condition: () => TimeStudy.dilation.isBought
      }
    ]
  },
  {
    id: "reality",
    label: "Reality",
    class: "reality",
    component: "reality-upgrades-tab",
    condition: () => player.realities > 0,
    subtabs: [
      {
        label: "G",
        component: "glyphs-tab",
        condition: () => true
      },
      {
        label: "U",
        component: "reality-upgrades-tab",
        condition: () => true
      },
      {
        label: "P",
        component: "perks-tab",
        condition: () => true
      },
      {
        label: "A",
        component: "automator-tab",
        condition: () => true
      },
      {
        label: "BH",
        component: "black-hole-tab",
        condition: () => true
      }
    ]
  },
  {
    id: "celestials",
    label: "Celestials",
    class: "celestials",
    component: "teresa-tab",
    // Because RealityUpgrades is defined later
    condition: () => RealityUpgrades && RealityUpgrades.allBought,
    subtabs: [
      {
        label: "T",
        component: "teresa-tab",
        condition: () => true
      },
      {
        label: "E",
        component: "effarig-tab",
        condition: () => Teresa.has(TERESA_UNLOCKS.EFFARIG)
      },
      {
        label: "EO",
        component: "enslaved-tab",
        condition: () => EffarigUnlock.eternity.isUnlocked
      },
      {
        label: "V",
        component: "v-tab",
        condition: () => Achievement(151).isEnabled
      },
      {
        label: "R",
        component: "ra-tab",
        condition: () => V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1])
      },
      {
        label: "L",
        component: "laitela-tab",
        condition: () => Ra.has(RA_LAITELA_UNLOCK)
      },
      {
        label: "P",
        component: "pelle-tab",
        condition: () => Laitela.has(LAITELA_UNLOCKS.PELLE)
      }
    ]
  },
  {
    id: "achievements",
    label: "Achievements",
    class: "",
    component: "normal-achievements-tab",
    condition: () => Achievements.effectiveCount > 0,
    subtabs: [
      {
        label: "A",
        component: "normal-achievements-tab",
        condition: () => true
      },
      {
        label: "SA",
        component: "secret-achievements-tab",
        condition: () => true
      }
    ]
  },
  {
    id: "statistics",
    label: "Statistics",
    class: "",
    component: "statistics-tab",
    condition: () => Achievements.effectiveCount > 1,
    subtabs: [
      {
        label: "S",
        component: "statistics-tab",
        condition: () => true
      },
      {
        label: "C",
        component: "challenge-records-tab",
        condition: () => player.infinitied.gt(0)
      },
      {
        label: "∞",
        component: "past-infinities-tab",
        condition: () => player.infinitied.gt(0),
      },
      {
        label: "Δ",
        component: "past-eternities-tab",
        condition: () => player.eternities > 0
      },
      {
        label: "R",
        component: "past-realities-tab",
        condition: () => player.realities > 0
      }
    ]
  },
  {
    id: "options",
    label: "Options",
    class: "",
    component: "options-tab",
    condition: () => true,
  },
  {
    id: "shop",
    label: "Shop",
    class: "shop",
    component: "achievements-tab",
    condition: () => true,
  }
];

Vue.component("sidebar", {
  data() {
    return {
      ipVisible: false,
      epVisible: false,
      rmVisible: false
    };
  },
  methods: {
    update() {
      this.ipVisible = player.infinitied.gt(0);
      this.epVisible = player.eternities > 0;
      this.rmVisible = player.realities > 0;
    }
  },
  computed: {
    tabs() {
      return MAIN_TAB_BUTTONS;
    }
  },
  template:
  `<div class="sidebar">
    <sidebar-am></sidebar-am>
    <sidebar-ip :cond="ipVisible"></sidebar-ip>
    <sidebar-ep :cond="epVisible"></sidebar-ep>
    <sidebar-rm :cond="rmVisible"></sidebar-rm>
    <tab-button
      v-for="tab in tabs"
      :key="tab.id"
      :tab="tab"></tab-button>
  </div>`
});
