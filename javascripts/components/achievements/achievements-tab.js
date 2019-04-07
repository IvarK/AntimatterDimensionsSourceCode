Vue.component("achievements-tab", {
  data() {
    return {
      tabs: [
        {
          name: "Achievements",
          id: "Achievements",
          component: "normal-achievements-tab"
        },
        {
          name: "Secret Achievements",
          id: "Secret Achievements",
          component: "secret-achievements-tab"
        }
      ]
    };
  },
  template:
    `<game-tab-with-subtabs
      :tabs="tabs"
      v-model="$viewModel.tabs.achievements.subtab"
    />`
});