Vue.component('achievements-tab', {
  props: {
    view: Object
  },
  data: function() {
    return {
      tabs: [
        {
          name: "Achievements",
          id: "Achievements",
          component: "normal-achievements"
        },
        {
          name: "Secret Achievements",
          id: "Secret Achievements",
          component: "secret-achievements"
        }
      ]
    };
  },
  template:
    `<game-tab-with-subtabs
      :tabs="tabs"
      v-model="view.tabs.achievements.subtab"
    />`
});