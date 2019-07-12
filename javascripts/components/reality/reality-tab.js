"use strict";

Vue.component("reality-tab", {
  data() {
    return {
      realityMachines: new Decimal(0),
      tabs: [
        {
          name: "Glyphs",
          id: "Glyphs",
          component: "glyphs-tab"
        },
        {
          name: "Reality upgrades",
          id: "Reality upgrades",
          component: "reality-upgrades-tab"
        },
        {
          name: "Perks",
          id: "Perks",
          component: "perks-tab"
        },
        {
          name: "Automator",
          id: "Automator",
          component: "automator-tab"
        },
        {
          name: "Black hole",
          id: "Black hole",
          component: "black-hole-tab"
        }
      ]
    };
  },
  computed: {
    rmNoun() {
      return this.realityMachines.equals(1) ? "Reality Machine" : "Reality Machines";
    }
  },
  methods: {
    update() {
      this.realityMachines.copyFrom(player.reality.realityMachines);
    }
  },
  template:
    `<game-tab-with-subtabs
        v-model="$viewModel.tabs.reality.subtab"
        :tabs="tabs"
    >
      <div slot="before-subtabs">
        <div class="l-rm-amount__desc c-rm-amount__desc">
          You have <span id="rm-amount" class="c-rm-amount">{{ shortenDimensions(realityMachines) }}</span> {{ rmNoun }}.
        </div>
      </div>
    </game-tab-with-subtabs>`
});