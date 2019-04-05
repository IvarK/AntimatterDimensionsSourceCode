Vue.component('achievements-tab', {
  data: function() {
    return {
      tabs: [
        {
          name: "Achievements",
          id: "Achievements",
          component: "normal-achievements-tab"
        },
        /*{
          name: "Reality Achievements",
          id: "Reality Achievements",
          component: "reality-achievements-tab"
        },*/
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