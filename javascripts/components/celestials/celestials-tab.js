"use strict";

Vue.component("celestials-tab", {
  data() {
    return {
      effarigUnlocked: false,
      enslavedUnlocked: false,
      vUnlocked: false,
      raUnlocked: false,
      laitelaUnlocked: false,
      pelleUnlocked: false,
      tabs: [
        {
          name: "Teresa",
          id: "Teresa",
          component: "teresa-tab"
        },
        {
          name: "Effarig",
          id: "Effarig",
          component: "effarig-tab",
          condition: function() { return this.effarigUnlocked; }.bind(this)
        },
        {
          name: "The Enslaved Ones",
          id: "Enslaved",
          component: "enslaved-tab",
          condition: function() { return this.enslavedUnlocked; }.bind(this)
        },
        {
          name: "V",
          id: "V",
          component: "v-tab",
          condition: function() { return this.vUnlocked; }.bind(this)
        },
        {
          name: "Ra",
          id: "Ra",
          component: "ra-tab",
          condition: function() { return this.raUnlocked; }.bind(this)
        },
        {
          name: "Glyph Alchemy",
          id: "Alchemy",
          component: "alchemy-tab",
          condition: function() { return Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY); }.bind(this)
        },
        {
          name: "Lai'tela",
          id: "Lai'tela",
          component: "laitela-tab",
          condition: function() { return this.laitelaUnlocked; }.bind(this)
        },
        {
          name: "The Pelle",
          id: "pelle",
          component: "pelle-tab",
          condition: function() { return this.pelleUnlocked; }.bind(this)
        },
        // Leave these for future references
        /*{
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
        }*/
      ]
    };
  },
  methods: {
    update() {
      this.effarigUnlocked = Teresa.has(TERESA_UNLOCKS.EFFARIG);
      this.enslavedUnlocked = EffarigUnlock.eternity.isUnlocked;
      this.vUnlocked = Achievement(151).isEnabled;
      this.raUnlocked = V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1]);
      this.laitelaUnlocked = Ra.has(RA_LAITELA_UNLOCK);
      this.pelleUnlocked = Laitela.has(LAITELA_UNLOCKS.PELLE);
    }
  },
  template:
    `<game-tab-with-subtabs
      v-model="$viewModel.tabs.celestials.subtab"
      :tabs="tabs"
      class="c-dim-tab"
    />`
});