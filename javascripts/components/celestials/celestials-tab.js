Vue.component('celestials-tab', {
  data: function() {
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
          condition: function() { return this.effarigUnlocked }.bind(this)
        },
        {
          name: "The Enslaved Ones",
          id: "Enslaved",
          component: "enslaved-tab",
          condition: function() { return this.enslavedUnlocked }.bind(this)
        },
        {
          name: "V",
          id: "V",
          component: "v-tab",
          condition: function() { return this.vUnlocked }.bind(this)
        },
        {
          name: "Ra",
          id: "Ra",
          component: "ra-tab",
          condition: function() { return this.raUnlocked }.bind(this)
        },
        {
          name: "Lai'tela",
          id: "Lai'tela",
          component: "laitela-tab",
          condition: function() { return this.laitelaUnlocked }.bind(this)
        },
        {
          name: "The Pelle",
          id: "pelle",
          component: "pelle-tab",
          condition: function() { return this.pelleUnlocked }.bind(this)
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
      this.effarigUnlocked = Teresa.has(TERESA_UNLOCKS.EFFARIG)
      this.enslavedUnlocked = Effarig.has(EFFARIG_UNLOCKS.ETERNITY_COMPLETE)
      this.vUnlocked = Enslaved.has(ENSLAVED_UNLOCKS.RM_MULT)
      this.raUnlocked = false
      this.laitelaUnlocked = false
      this.pelleUnlocked = false
    }
  },
  template:
    `<game-tab-with-subtabs
      v-model="$viewModel.tabs.celestials.subtab"
      :tabs="tabs"
      class="c-dim-tab"
    />`
});