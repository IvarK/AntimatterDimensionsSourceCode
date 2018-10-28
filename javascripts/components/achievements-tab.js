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
    `<tab-container>
      <subtabbed-container
        class="tab-content"
        :tabs="tabs"
        v-model="view.tabs.achievements.subtab">
      </subtabbed-container>
    </tab-container>`
});