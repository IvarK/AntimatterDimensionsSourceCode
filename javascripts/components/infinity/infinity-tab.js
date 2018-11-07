Vue.component('infinity-tab', {
  data: function() {
    return {
      tabs: [
        {
          name: "Upgrades",
          id: "Upgrades",
          component: "infinity-upgrades-tab"
        },
        {
          name: "Autobuyers",
          id: "Autobuyers",
          component: "autobuyers-tab"
        },
        {
          name: "Break Infinity",
          id: "Break Infinity",
          component: "break-infinity-tab"
        },
        {
          name: "Replicanti",
          id: "Replicanti",
          component: "replicanti-tab"
        }
      ]
    };
  },
  template:
    `<game-tab-with-subtabs
      v-model="$viewModel.tabs.infinity.subtab"
      :tabs="tabs"
      class="c-dim-tab"
    />`
});