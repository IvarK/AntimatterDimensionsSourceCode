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
    `<subtabbed-container
      :tabs="tabs"
      v-model="view.tabs.achievements.subtab"
    />`
});