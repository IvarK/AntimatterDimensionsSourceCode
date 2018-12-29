Vue.component('celestials-tab', {
  data: function() {
    return {
      teresaUnlocked: false,
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
          condition: function() { return this.teresaUnlocked }.bind(this)
        },
        {
          name: "V",
          id: "V",
          component: "v-tab",
          condition: function() { return false }
        },
        {
          name: "The Enslaved Ones",
          id: "Enslaved",
          component: "enslaved-tab",
          condition: function() { return false }
        },
        {
          name: "Ra",
          id: "Ra",
          component: "ra-tab",
          condition: function() { return false }
        },
        {
          name: "Lai'tela",
          id: "Lai'tela",
          component: "laitela-tab",
          condition: function() { return false }
        },
        {
          name: "The Pelle",
          id: "pelle",
          component: "pelle-tab",
          condition: function() { return false }
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
      this.teresaUnlocked = Effarig.has(EFFARIG_UNLOCKS.TERESA.id)
    }
  },
  template:
    `<game-tab-with-subtabs
      v-model="$viewModel.tabs.celestials.subtab"
      :tabs="tabs"
      class="c-dim-tab"
    />`
});