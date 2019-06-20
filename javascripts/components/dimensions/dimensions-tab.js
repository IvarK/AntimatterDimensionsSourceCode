"use strict";

Vue.component("dimensions-tab", {
  data() {
    return {
      isIDTabUnlocked: false,
      isTDTabUnlocked: false,
      isProductionTabUnlocked: false,
      tabs: [
        {
          name: "Dimensions",
          id: "Dimensions",
          component: "normal-dim-tab"
        },
        {
          name: "Infinity Dimensions",
          id: "Infinity Dimensions",
          component: "infinity-dim-tab",
          condition: function() { return this.isIDTabUnlocked; }.bind(this)
        },
        {
          name: "Time Dimensions",
          id: "Time Dimensions",
          component: "time-dim-tab",
          condition: function() { return this.isTDTabUnlocked; }.bind(this)
        },
        {
          name: "Production",
          id: "Production",
          component: "dim-production-tab",
          condition: function() { return this.isProductionTabUnlocked; }.bind(this)
        }
      ]
    };
  },
  methods: {
    update() {
      this.isIDTabUnlocked = player.eternities > 0 || InfinityDimension(1).isUnlocked;
      this.isTDTabUnlocked = player.eternities > 0;
      this.isProductionTabUnlocked = player.eternities > 0 || player.infinities > 0;
    }
  },
  template:
    `<game-tab-with-subtabs
      v-model="$viewModel.tabs.dimensions.subtab"
      :tabs="tabs"
      class="c-dim-tab"
    />`
});
