Vue.component("eternity-tab", {
  data: function() {
    return {
      isDilationUnlocked: false,
      tabs: [
        {
          name: "Time studies",
          id: "Time studies",
          component: "time-studies-tab"
        },
        {
          name: "Eternity upgrades",
          id: "Eternity upgrades",
          component: "eternity-upgrades-tab"
        },
        {
          name: "Eternity milestones",
          id: "Eternity milestones",
          component: "eternity-milestones-tab"
        },
        {
          name: "Time dilation",
          id: "Time dilation",
          component: "time-dilation-tab",
          condition: function() { return this.isDilationUnlocked; }.bind(this)
        }
      ]
    };
  },
  methods: {
    update() {
      this.isDilationUnlocked = TimeStudy.dilation.isBought;
    }
  },
  template:
    `<game-tab-with-subtabs
        v-model="$viewModel.tabs.eternity.subtab"
        :tabs="tabs"
    />`
});