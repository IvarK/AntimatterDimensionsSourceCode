Vue.component('celestials-tab', {
  data: function() {
    return {
      tabs: [
        {
          name: "Effarig",
          id: "Effarig",
          component: "effarig-tab"
        },
        {
          name: "Teresa",
          id: "Teresa",
          component: "teresa-tab",
          condition: function() { return Effarig.has(EFFARIG_UNLOCKS.TERESA) }.bind(this)
        },
        {
          name: "V",
          id: "V",
          component: "v-tab"
        },
        {
          name: "The Enslaved Ones",
          id: "Enslaved",
          component: "enslaved-tab"
        },
        {
          name: "Ra",
          id: "Ra",
          component: "ra-tab"
        },
        {
          name: "Lai'tela",
          id: "Lai'tela",
          component: "laitela-tab"
        },
        {
          name: "The Pelle",
          id: "pelle",
          component: "pelle-tab"
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
      
    }
  },
  template:
    `<game-tab-with-subtabs
      v-model="$viewModel.tabs.celestials.subtab"
      :tabs="tabs"
      class="c-dim-tab"
    />`
});